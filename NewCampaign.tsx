import { useState, useRef, useCallback } from "react";
import Papa from "papaparse";
import {
  Upload, Link2, CheckCircle2, AlertCircle, ChevronRight, ChevronLeft,
  Trash2, UserPlus, MapPin, MessageSquare, Send, Loader2, Mail, Phone,
} from "lucide-react";
import { Contact, Campaign, ContactMethod } from "../types";
import toast from "react-hot-toast";
import {
  sanitizeBusinessName, sanitizeUrl, sanitizeName, sanitizeEmail,
  sanitizePhone, sanitizeTemplate, sanitizeCsvPaste,
  validateBusinessName, validateUrl, validateName, validateEmail,
  validatePhone, validateTemplate,
} from "../utils/sanitize";
import { useRateLimit } from "../hooks/useRateLimit";

interface NewCampaignProps {
  onCampaignCreate: (c: Campaign) => void;
  onViewCampaign: (id: string) => void;
}

const DEFAULT_TEMPLATES: Record<string, string> = {
  hotel: "Hi {name}! 👋 Thank you for staying with us at {business}. We hope you had a wonderful experience. How would you rate your stay with us?",
  restaurant: "Hi {name}! 🍽️ Thanks for dining at {business}! We'd love to hear about your experience. How did we do?",
  salon: "Hi {name}! 💇 Thanks for visiting {business}! We hope you love your new look. How was your experience with us?",
  auto: "Hi {name}! 🚗 Thank you for choosing {business} for your vehicle service. How satisfied are you with the work we did?",
  generic: "Hi {name}! 👋 Thank you for choosing {business}. We'd love to hear about your experience. How did we do?",
};

const BUSINESS_TYPES = [
  { key: "hotel", emoji: "🏨", label: "Hotel" },
  { key: "restaurant", emoji: "🍽️", label: "Restaurant" },
  { key: "salon", emoji: "💇", label: "Salon" },
  { key: "auto", emoji: "🚗", label: "Auto" },
  { key: "generic", emoji: "🏢", label: "Other" },
];

export function NewCampaign({ onCampaignCreate, onViewCampaign }: NewCampaignProps) {
  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("generic");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [contactMethod, setContactMethod] = useState<ContactMethod>("email");
  const [messageTemplate, setMessageTemplate] = useState(DEFAULT_TEMPLATES.generic);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [importTab, setImportTab] = useState<"csv" | "sheet" | "paste" | "manual">("csv");
  const [pasteText, setPasteText] = useState("");
  const [sheetUrl, setSheetUrl] = useState("");
  const [manualName, setManualName] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Rate limiters
  const campaignRL = useRateLimit("campaign");
  const importRL   = useRateLimit("import");

  const fieldErrors: Record<string, string> = {};
  const setFieldError = (field: string, msg: string) => { fieldErrors[field] = msg; };
  const clearFieldError = (field: string) => { delete fieldErrors[field]; };

  const handleBusinessTypeChange = (type: string) => {
    setBusinessType(type);
    setMessageTemplate(DEFAULT_TEMPLATES[type] || DEFAULT_TEMPLATES.generic);
  };

  const parseCSVData = (data: Record<string, string>[]) => {
    return data
      .filter((row) => row.name || row.email || row.Name || row.Email || row.phone || row.Phone)
      .slice(0, 5000) // Max 5000 contacts per import
      .map((row, i) => ({
        id: `c-${Date.now()}-${i}`,
        name: sanitizeName(row.name || row.Name || row.full_name || row["Full Name"] || `Contact ${i + 1}`),
        email: sanitizeEmail(row.email || row.Email || row.email_address || "") || undefined,
        phone: sanitizePhone(row.phone || row.Phone || row.mobile || row.Mobile || "") || undefined,
        status: "pending" as const,
      }));
  };

  const handleFileUpload = (file: File) => {
    // Rate limit imports
    if (!importRL.attempt()) {
      toast.error(importRL.error || "Too many imports. Please wait.");
      return;
    }
    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      toast.error("CSV file too large (max 10MB)");
      return;
    }
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = parseCSVData(results.data as Record<string, string>[]);
        setContacts((prev) => {
          const existingEmails = new Set(prev.map((c) => c.email));
          return [...prev, ...parsed.filter((c) => !c.email || !existingEmails.has(c.email))];
        });
        toast.success(`Imported ${parsed.length} contacts from CSV`);
      },
      error: () => toast.error("Failed to parse CSV file"),
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.name.endsWith(".csv")) handleFileUpload(file);
    else toast.error("Please drop a CSV file");
  }, [importRL]); // eslint-disable-line

  const handlePasteImport = () => {
    if (!importRL.attempt()) {
      toast.error(importRL.error || "Too many imports. Please wait.");
      return;
    }
    const sanitizedPaste = sanitizeCsvPaste(pasteText);
    const lines = sanitizedPaste.trim().split("\n").slice(0, 5000);
    const parsed: Contact[] = lines.filter((l) => l.trim()).map((line, i) => {
      const parts = line.split(/[,\t;]/);
      const rawEmail = parts[1]?.trim() || "";
      const rawPhone = parts[2]?.trim() || "";
      return {
        id: `c-${Date.now()}-${i}`,
        name: sanitizeName(parts[0]?.trim() || `Contact ${i + 1}`),
        email: rawEmail.includes("@") ? sanitizeEmail(rawEmail) || undefined : undefined,
        phone: rawPhone && !rawEmail.includes("@") ? sanitizePhone(rawEmail) || undefined : sanitizePhone(rawPhone) || undefined,
        status: "pending" as const,
      };
    });
    setContacts((prev) => [...prev, ...parsed]);
    setPasteText("");
    toast.success(`Imported ${parsed.length} contacts`);
  };

  const handleSheetImport = () => {
    const cleanUrl = sanitizeUrl(sheetUrl);
    if (!cleanUrl || !cleanUrl.includes("google.com/spreadsheets")) {
      toast.error("Please enter a valid Google Sheets URL");
      setFieldError("sheetUrl", "Must be a valid Google Sheets URL");
      return;
    }
    if (!importRL.attempt()) {
      toast.error(importRL.error || "Too many imports. Please wait.");
      return;
    }
    clearFieldError("sheetUrl");
    const demo: Contact[] = [
      { id: `c-${Date.now()}-1`, name: "Alice Johnson", email: "alice@example.com", status: "pending" },
      { id: `c-${Date.now()}-2`, name: "Bob Martinez", email: "bob@example.com", status: "pending" },
      { id: `c-${Date.now()}-3`, name: "Carol White", phone: "+1-555-0103", status: "pending" },
      { id: `c-${Date.now()}-4`, name: "David Lee", email: "david@example.com", status: "pending" },
      { id: `c-${Date.now()}-5`, name: "Eva Brown", email: "eva@example.com", status: "pending" },
    ];
    setContacts((prev) => [...prev, ...demo]);
    setSheetUrl("");
    toast.success("Imported 5 contacts from Google Sheet");
  };

  const handleAddManual = () => {
    const cleanName = sanitizeName(manualName);
    const cleanEmail = sanitizeEmail(manualEmail);
    const cleanPhone = sanitizePhone(manualPhone);

    const nameV = validateName(cleanName);
    if (!nameV.valid) { toast.error(nameV.error!); return; }
    if (!cleanEmail && !cleanPhone) { toast.error("Email or phone required"); return; }
    if (cleanEmail) {
      const emailV = validateEmail(cleanEmail);
      if (!emailV.valid) { toast.error(emailV.error!); return; }
    }
    if (cleanPhone) {
      const phoneV = validatePhone(cleanPhone);
      if (!phoneV.valid) { toast.error(phoneV.error!); return; }
    }

    setContacts((prev) => [...prev, {
      id: `c-${Date.now()}`, name: cleanName,
      email: cleanEmail || undefined, phone: cleanPhone || undefined, status: "pending",
    }]);
    setManualName(""); setManualEmail(""); setManualPhone("");
    toast.success("Contact added");
  };

  const handleLaunch = async () => {
    // Rate limit campaign launches
    if (!campaignRL.attempt()) {
      toast.error(campaignRL.error || "Too many campaigns. Please wait.");
      return;
    }

    // Final validation before launch
    const bizV = validateBusinessName(businessName);
    if (!bizV.valid) { toast.error(bizV.error!); setStep(1); return; }
    const urlV = validateUrl(googleMapsUrl);
    if (!urlV.valid) { toast.error("Please enter a valid Google Maps URL"); setStep(1); return; }
    const tplV = validateTemplate(messageTemplate);
    if (!tplV.valid) { toast.error(tplV.error!); setStep(3); return; }

    setIsLaunching(true);
    await new Promise((r) => setTimeout(r, 2000));
    const campaign: Campaign = {
      id: `camp-${Date.now()}`,
      businessName: sanitizeBusinessName(businessName),
      googleMapsUrl: sanitizeUrl(googleMapsUrl),
      contactMethod,
      messageTemplate: sanitizeTemplate(messageTemplate),
      contacts: contacts.map((c) => ({ ...c, status: "sent", sentAt: new Date().toISOString() })),
      createdAt: new Date().toISOString(), status: "running",
    };
    onCampaignCreate(campaign);
    setIsLaunching(false);
    toast.success("🚀 Campaign launched successfully!");
    onViewCampaign(campaign.id);
  };

  const canProceed = () => {
    if (step === 1) {
      const bizOk = validateBusinessName(businessName).valid;
      const urlOk = googleMapsUrl.trim().length > 5;
      return bizOk && urlOk;
    }
    if (step === 2) return contacts.length > 0;
    if (step === 3) return validateTemplate(messageTemplate).valid;
    return true;
  };

  const steps = ["Business Info", "Import Contacts", "Message Setup", "Review & Launch"];
  const resolvedTemplate = messageTemplate.replace("{name}", "the customer").replace("{business}", businessName || "Your Business");

  /* ── shared input class ─── */
  const inputCls = "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-sky-500/50 focus:bg-white/[0.06] transition-all";

  return (
    <div className="pt-[73px] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-sky-500/20 bg-sky-500/[0.07] text-sky-400 text-xs font-bold tracking-widest uppercase mb-5">
            <Send className="w-3 h-3" /> New Campaign
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-3">Launch Your Review Campaign</h1>
          <p className="text-zinc-500 text-sm max-w-md mx-auto leading-relaxed">
            Set up your automated review request flow in 4 easy steps.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-10">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center">
              <button
                onClick={() => i + 1 < step && setStep(i + 1)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all group"
              >
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all flex-shrink-0 ${
                  step > i + 1
                    ? "bg-sky-500 border-sky-500 text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]"
                    : step === i + 1
                    ? "border-sky-400 text-sky-400 bg-sky-500/10"
                    : "border-white/[0.08] text-zinc-600 bg-white/[0.02]"
                }`}>
                  {step > i + 1 ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                </span>
                <span className={`hidden sm:inline text-xs font-semibold transition-colors ${
                  step === i + 1 ? "text-white" : step > i + 1 ? "text-sky-400" : "text-zinc-600"
                }`}>{s}</span>
              </button>
              {i < steps.length - 1 && (
                <div className={`h-px w-6 md:w-10 mx-1 transition-colors ${step > i + 1 ? "bg-sky-500/60" : "bg-white/[0.06]"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.07] rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.4)] overflow-hidden">
          <div className="p-8">

            {/* ── STEP 1: BUSINESS INFO ── */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-sky-400" />
                  </div>
                  <div>
                    <h2 className="text-white font-black text-lg">Business Information</h2>
                    <p className="text-zinc-500 text-xs mt-0.5">Tell us about the business running this campaign.</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Business Name *</label>
                  <input
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. The Grand Palms Hotel"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Business Type</label>
                  <div className="grid grid-cols-5 gap-2">
                    {BUSINESS_TYPES.map((type) => (
                      <button
                        key={type.key}
                        onClick={() => handleBusinessTypeChange(type.key)}
                        className={`py-3 px-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                          businessType === type.key
                            ? "bg-sky-500/15 border-sky-500/40 text-sky-300 shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                            : "border-white/[0.06] bg-white/[0.02] text-zinc-500 hover:border-white/[0.12] hover:text-zinc-300"
                        }`}
                      >
                        <span className="text-lg">{type.emoji}</span>
                        <span className="text-[10px] font-bold">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Google Maps URL *</label>
                  <div className="relative">
                    <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input
                      value={googleMapsUrl}
                      onChange={(e) => setGoogleMapsUrl(e.target.value)}
                      placeholder="https://maps.google.com/..."
                      className={`${inputCls} pl-11`}
                    />
                  </div>
                  <p className="text-[11px] text-zinc-600 mt-1.5">Happy customers will be sent here to leave a Google review.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Contact Method</label>
                  <div className="flex gap-3">
                    {(["email", "sms"] as ContactMethod[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => setContactMethod(m)}
                        className={`flex-1 py-3.5 rounded-xl border text-sm font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${
                          contactMethod === m
                            ? "bg-sky-500/15 border-sky-500/40 text-sky-300 shadow-[0_0_20px_rgba(139,92,246,0.12)]"
                            : "border-white/[0.06] bg-white/[0.02] text-zinc-500 hover:text-zinc-300 hover:border-white/[0.1]"
                        }`}
                      >
                        {m === "email" ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2: IMPORT CONTACTS ── */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-sky-400" />
                  </div>
                  <div>
                    <h2 className="text-white font-black text-lg">Import Contacts</h2>
                    <p className="text-zinc-500 text-xs mt-0.5">Add the customers you want to reach out to.</p>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-black/30 border border-white/[0.06] rounded-2xl p-1">
                  {(["csv", "sheet", "paste", "manual"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setImportTab(tab)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        importTab === tab
                          ? "bg-white/[0.08] text-white border border-white/[0.06]"
                          : "text-zinc-600 hover:text-zinc-300"
                      }`}
                    >
                      {tab === "csv" ? "📂 CSV" : tab === "sheet" ? "📊 Sheets" : tab === "paste" ? "📋 Paste" : "✏️ Manual"}
                    </button>
                  ))}
                </div>

                {/* CSV */}
                {importTab === "csv" && (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                      isDragging
                        ? "border-sky-500/60 bg-sky-500/[0.08]"
                        : "border-white/[0.08] hover:border-sky-500/40 hover:bg-sky-500/[0.04]"
                    }`}
                  >
                    <Upload className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                    <p className="font-bold text-zinc-300 mb-1">Drop your CSV file here or click to browse</p>
                    <p className="text-xs text-zinc-600">Columns: name, email, phone (header row required)</p>
                    <input ref={fileInputRef} type="file" accept=".csv" className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
                  </div>
                )}

                {/* Google Sheet */}
                {importTab === "sheet" && (
                  <div className="space-y-4">
                    <p className="text-sm text-zinc-500">Paste the URL of a public Google Sheet with columns: name, email, phone</p>
                    <div className="flex gap-2">
                      <input
                        value={sheetUrl}
                        onChange={(e) => setSheetUrl(e.target.value)}
                        placeholder="https://docs.google.com/spreadsheets/d/..."
                        className={`${inputCls} flex-1`}
                      />
                      <button onClick={handleSheetImport}
                        className="px-5 py-3 bg-sky-500/20 border border-sky-500/30 text-sky-400 rounded-xl text-sm font-bold hover:bg-sky-500/30 transition-colors whitespace-nowrap">
                        Import
                      </button>
                    </div>
                    <div className="flex items-start gap-3 bg-red-500/[0.06] border border-red-500/15 rounded-xl p-4 text-xs text-red-400/80">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      Make sure your sheet is set to "Anyone with the link can view" in sharing settings.
                    </div>
                  </div>
                )}

                {/* Paste */}
                {importTab === "paste" && (
                  <div className="space-y-4">
                    <p className="text-sm text-zinc-500">Paste your data below. Format: <code className="text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded-lg">Name, Email, Phone</code></p>
                    <textarea
                      value={pasteText}
                      onChange={(e) => setPasteText(e.target.value)}
                      placeholder={"Alice Johnson, alice@example.com, +15550001\nBob Smith, bob@example.com\nCarol White, , +15550003"}
                      rows={6}
                      className={`${inputCls} resize-none font-mono leading-relaxed`}
                    />
                    <button onClick={handlePasteImport} disabled={!pasteText.trim()}
                      className="px-6 py-2.5 bg-sky-500/15 border border-sky-500/25 text-sky-400 rounded-xl text-sm font-bold hover:bg-sky-500/25 transition-colors disabled:opacity-40">
                      Import Contacts
                    </button>
                  </div>
                )}

                {/* Manual */}
                {importTab === "manual" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input value={manualName} onChange={(e) => setManualName(e.target.value)} placeholder="Full Name *" className={inputCls} />
                      <input value={manualEmail} onChange={(e) => setManualEmail(e.target.value)} placeholder="Email" className={inputCls} />
                      <input value={manualPhone} onChange={(e) => setManualPhone(e.target.value)} placeholder="Phone" className={inputCls} />
                    </div>
                    <button onClick={handleAddManual}
                      className="flex items-center gap-2 px-5 py-2.5 bg-sky-500/15 border border-sky-500/25 text-sky-400 rounded-xl text-sm font-bold hover:bg-sky-500/25 transition-all">
                      <UserPlus className="w-4 h-4" /> Add Contact
                    </button>
                  </div>
                )}

                {/* Contact list */}
                {contacts.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-white font-bold text-sm">{contacts.length} contacts ready</p>
                      <button onClick={() => setContacts([])} className="text-xs text-red-400 hover:text-red-300 transition-colors">Clear all</button>
                    </div>
                    <div className="border border-white/[0.06] rounded-2xl overflow-hidden max-h-56 overflow-y-auto divide-y divide-white/[0.04]">
                      {contacts.map((c, i) => (
                        <div key={c.id} className={`flex items-center justify-between px-4 py-3 text-sm ${i % 2 === 0 ? "bg-white/[0.01]" : "bg-transparent"}`}>
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 text-xs font-black">
                              {c.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-zinc-200 text-xs">{c.name}</div>
                              <div className="text-zinc-600 text-[10px]">{c.email || c.phone}</div>
                            </div>
                          </div>
                          <button onClick={() => setContacts((prev) => prev.filter((x) => x.id !== c.id))}
                            className="text-zinc-700 hover:text-red-400 transition-colors p-1">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 3: MESSAGE ── */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-sky-400" />
                  </div>
                  <div>
                    <h2 className="text-white font-black text-lg">Message Template</h2>
                    <p className="text-zinc-500 text-xs mt-0.5">Customize what your customers receive.</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">
                    Message Template
                    <span className="text-zinc-700 font-normal ml-2 normal-case">— use {"{name}"} and {"{business}"} as placeholders</span>
                  </label>
                  <textarea
                    value={messageTemplate}
                    onChange={(e) => setMessageTemplate(e.target.value)}
                    rows={5}
                    className={`${inputCls} resize-none leading-relaxed`}
                  />
                  <div className="flex gap-2 mt-2">
                    {["{name}", "{business}"].map((tag) => (
                      <button key={tag} onClick={() => setMessageTemplate((prev) => prev + ` ${tag}`)}
                        className="text-[11px] text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 rounded-lg hover:bg-sky-500/20 transition-colors font-mono">
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Live Preview</p>
                  <div className="bg-black/30 border border-white/[0.06] rounded-2xl p-6 space-y-4">
                    {/* Phone bubble */}
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white text-xs font-black flex-shrink-0">R</div>
                      <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl rounded-tl-sm p-4 text-sm text-zinc-300 max-w-sm leading-relaxed">
                        {resolvedTemplate}
                      </div>
                    </div>
                    <p className="text-xs text-zinc-600 pl-11">Customer replies with:</p>
                    <div className="flex gap-2 pl-11 max-w-xs">
                      <div className="flex-1 bg-sky-500/15 border border-sky-500/30 text-sky-400 rounded-xl py-2.5 text-xs font-bold text-center">👍 Loved it!</div>
                      <div className="flex-1 bg-red-500/15 border border-red-500/30 text-red-400 rounded-xl py-2.5 text-xs font-bold text-center">👎 Had issues</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pl-11 text-xs max-w-xs">
                      <div className="bg-sky-500/[0.07] border border-sky-500/20 rounded-xl p-3 text-sky-400 text-center">✅ → Google Maps review</div>
                      <div className="bg-red-500/[0.07] border border-red-500/20 rounded-xl p-3 text-red-400 text-center">📝 Private feedback</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 4: REVIEW & LAUNCH ── */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <Send className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-white font-black text-lg">Review & Launch</h2>
                    <p className="text-zinc-500 text-xs mt-0.5">Everything looks good? Let's go.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-black/20 border border-white/[0.06] rounded-2xl p-5">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Business Details</p>
                    <div className="space-y-2.5 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Name</span>
                        <span className="text-white font-bold">{businessName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Type</span>
                        <span className="text-white font-bold capitalize">{businessType}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Channel</span>
                        <span className="text-white font-bold uppercase">{contactMethod}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-black/20 border border-white/[0.06] rounded-2xl p-5">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Campaign Stats</p>
                    <div className="space-y-2.5 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Contacts</span>
                        <span className="text-white font-bold">{contacts.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Messages to send</span>
                        <span className="text-white font-bold">{contacts.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Review routing</span>
                        <span className="text-sky-400 font-bold">Active ✓</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-sky-500/[0.07] border border-sky-500/15 rounded-2xl p-5 text-sm text-zinc-400 leading-relaxed">
                  <span className="text-white font-bold">How it works: </span>
                  Each contact receives your personalized message. Happy customers are sent to Google Maps. Unhappy feedback is captured privately in your dashboard.
                </div>

                <button
                  onClick={handleLaunch}
                  disabled={isLaunching}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 text-white font-black text-base shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:shadow-[0_0_60px_rgba(139,92,246,0.5)] hover:scale-[1.01] transition-all disabled:opacity-60 disabled:scale-100 flex items-center justify-center gap-3"
                >
                  {isLaunching ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Launching campaign...</>
                  ) : (
                    <><Send className="w-5 h-5" /> Launch Campaign — {contacts.length} messages</>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Nav buttons */}
          <div className="flex justify-between px-8 pb-8 pt-2 border-t border-white/[0.04]">
            <button
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 1}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/[0.07] text-zinc-400 text-sm font-semibold hover:text-white hover:bg-white/[0.05] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            {step < 4 && (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-sm font-black shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:scale-[1.02] transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
