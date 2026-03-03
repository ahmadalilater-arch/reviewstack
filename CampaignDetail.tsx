import { useState, useEffect } from "react";
import { Campaign, Contact } from "../types";
import {
  ArrowLeft, ThumbsUp, ThumbsDown, MessageSquare, Star,
  ExternalLink, RefreshCw, Mail, Phone, Clock, CheckCircle2,
  AlertCircle, MapPin, Shield,
} from "lucide-react";

interface CampaignDetailProps {
  campaign: Campaign;
  onBack: () => void;
  onUpdateCampaign: (c: Campaign) => void;
}

const SAMPLE_POSITIVE = ["Great service!", "Everything was perfect.", "Will come back for sure.", "Amazing experience!", "Exceeded my expectations!"];
const SAMPLE_NEGATIVE = ["The room wasn't cleaned properly.", "Staff seemed inattentive.", "Had to wait too long.", "The facility could be cleaner.", "Price didn't match quality."];

export function CampaignDetail({ campaign, onBack, onUpdateCampaign }: CampaignDetailProps) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | Contact["status"]>("all");

  const contacts = campaign.contacts;
  const sent = contacts.filter((c) => c.status !== "pending").length;
  const positive = contacts.filter((c) => c.status === "positive");
  const negative = contacts.filter((c) => c.status === "negative");
  const pending = contacts.filter((c) => c.status === "sent" || c.status === "pending");
  const pct = sent > 0 ? Math.round((positive.length / sent) * 100) : 0;

  useEffect(() => {
    const unresponded = campaign.contacts.filter((c) => c.status === "sent");
    if (unresponded.length === 0) return;
    let delay = 1500;
    const timers: ReturnType<typeof setTimeout>[] = [];
    unresponded.forEach((contact, i) => {
      const t = setTimeout(() => {
        const isPositive = Math.random() > 0.3;
        onUpdateCampaign({
          ...campaign,
          contacts: campaign.contacts.map((c) =>
            c.id === contact.id
              ? { ...c, status: isPositive ? "positive" : "negative",
                  feedback: isPositive
                    ? SAMPLE_POSITIVE[Math.floor(Math.random() * SAMPLE_POSITIVE.length)]
                    : SAMPLE_NEGATIVE[Math.floor(Math.random() * SAMPLE_NEGATIVE.length)] }
              : c
          ),
        });
      }, delay + i * 1200);
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  const filteredContacts = filterStatus === "all" ? contacts : contacts.filter((c) => c.status === filterStatus);

  const statusConfig: Record<Contact["status"], { label: string; cls: string; bg: string; icon: React.ReactNode }> = {
    pending: { label: "Pending", cls: "text-zinc-500", bg: "bg-zinc-800 border-zinc-700/50", icon: <Clock className="w-3 h-3" /> },
    sent:    { label: "Sent",    cls: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20", icon: <Mail className="w-3 h-3" /> },
    positive:{ label: "Happy",   cls: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20", icon: <ThumbsUp className="w-3 h-3" /> },
    negative:{ label: "Unhappy", cls: "text-red-400", bg: "bg-red-500/10 border-red-500/20", icon: <ThumbsDown className="w-3 h-3" /> },
    unopened:{ label: "Unopened",cls: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20", icon: <AlertCircle className="w-3 h-3" /> },
  };

  return (
    <div className="pt-[73px] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8 flex-wrap">
          <button onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white font-semibold transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-black text-white tracking-tight truncate">{campaign.businessName}</h1>
            <p className="text-zinc-600 text-xs mt-0.5">Campaign launched {new Date(campaign.createdAt).toLocaleString()}</p>
          </div>
          <a href={campaign.googleMapsUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-zinc-300 text-sm font-semibold hover:bg-white/[0.08] hover:text-white transition-all">
            <MapPin className="w-4 h-4 text-red-400" /> Google Maps <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Contacts", value: contacts.length, icon: Shield, color: "sky" },
            { label: "Responded", value: sent, icon: Mail, color: "sky" },
            { label: "→ Google Maps", value: positive.length, icon: ThumbsUp, color: "sky" },
            { label: "Private Feedback", value: negative.length, icon: ThumbsDown, color: "red" },
          ].map((s) => {
            const colors: Record<string, { border: string; icon: string; num: string }> = {
              sky:  { border: "border-sky-500/20",  icon: "text-sky-400 bg-sky-500/10 border-sky-500/20",  num: "text-white" },
              red:  { border: "border-red-500/20",    icon: "text-red-400 bg-red-500/10 border-red-500/20",    num: "text-red-400" },
            };
            const c = colors[s.color];
            return (
              <div key={s.label} className={`bg-white/[0.03] backdrop-blur-md border ${c.border} rounded-2xl p-5 flex items-center gap-4`}>
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${c.icon}`}>
                  <s.icon className="w-4 h-4" />
                </div>
                <div>
                  <div className={`text-2xl font-black ${c.num}`}>{s.value}</div>
                  <div className="text-[10px] text-zinc-600 font-semibold mt-0.5">{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Satisfaction bar */}
        <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-red-400 fill-red-400" />
              <span className="font-bold text-white text-sm">Customer Satisfaction</span>
              <span className={`text-xl font-black ${pct >= 70 ? "text-sky-400" : pct >= 40 ? "text-red-400" : "text-red-400"}`}>
                {pct}%
              </span>
            </div>
            {sent < contacts.length && (
              <div className="flex items-center gap-1.5 text-xs text-sky-400 font-semibold">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Collecting responses...
              </div>
            )}
          </div>
          <div className="h-3 bg-black/40 rounded-full overflow-hidden flex border border-white/[0.04]">
            <div className="bg-sky-500 h-full transition-all duration-700 shadow-[0_0_10px_rgba(14,165,233,0.4)]"
              style={{ width: `${contacts.length > 0 ? (positive.length / contacts.length) * 100 : 0}%` }} />
            <div className="bg-red-500 h-full transition-all duration-700 shadow-[0_0_10px_rgba(239,68,68,0.4)]"
              style={{ width: `${contacts.length > 0 ? (negative.length / contacts.length) * 100 : 0}%` }} />
          </div>
          <div className="flex gap-5 mt-3">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-[0_0_6px_rgba(14,165,233,0.5)]" /><span className="text-zinc-500 text-[11px]">Happy ({positive.length})</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]" /><span className="text-zinc-500 text-[11px]">Unhappy ({negative.length})</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-zinc-700" /><span className="text-zinc-500 text-[11px]">Awaiting ({pending.length})</span></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact list */}
          <div className="lg:col-span-2">
            <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
                <h2 className="font-bold text-white text-sm">Contacts</h2>
                <div className="flex gap-1 p-1 bg-black/30 rounded-xl border border-white/[0.05]">
                  {(["all", "positive", "negative", "sent"] as const).map((f) => (
                    <button key={f} onClick={() => setFilterStatus(f)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize transition-all ${
                        filterStatus === f
                          ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                          : "text-zinc-600 hover:text-zinc-300"
                      }`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="divide-y divide-white/[0.04] max-h-[480px] overflow-y-auto">
                {filteredContacts.map((c) => {
                  const conf = statusConfig[c.status];
                  return (
                    <button key={c.id}
                      onClick={() => setSelectedContact(c.id === selectedContact?.id ? null : c)}
                      className={`w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.04] transition-colors text-left ${
                        selectedContact?.id === c.id ? "bg-sky-500/[0.06] border-l-2 border-l-sky-500" : ""
                      }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 ${
                          c.status === "positive" ? "bg-sky-500/20 text-sky-400" :
                          c.status === "negative" ? "bg-red-500/20 text-red-400" :
                          "bg-white/[0.06] text-zinc-400"
                        }`}>
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-zinc-200 text-sm">{c.name}</div>
                          <div className="flex items-center gap-1.5 text-[11px] text-zinc-600">
                            {c.email && <><Mail className="w-2.5 h-2.5" />{c.email}</>}
                            {c.phone && !c.email && <><Phone className="w-2.5 h-2.5" />{c.phone}</>}
                          </div>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${conf.bg} ${conf.cls}`}>
                        {conf.icon} {conf.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="space-y-4">
            {selectedContact && (
              <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${
                    selectedContact.status === "positive" ? "bg-sky-500/20 text-sky-400" :
                    selectedContact.status === "negative" ? "bg-red-500/20 text-red-400" :
                    "bg-white/[0.06] text-zinc-400"
                  }`}>
                    {selectedContact.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{selectedContact.name}</div>
                    <div className="text-zinc-600 text-xs">{selectedContact.email || selectedContact.phone}</div>
                  </div>
                </div>

                {selectedContact.status === "positive" && (
                  <div className="space-y-3">
                    <div className="bg-sky-500/[0.07] border border-sky-500/20 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-sky-400 font-bold text-sm mb-2">
                        <ThumbsUp className="w-4 h-4" /> Positive Response
                      </div>
                      {selectedContact.feedback && (
                        <p className="text-sm text-zinc-300 italic">"{selectedContact.feedback}"</p>
                      )}
                    </div>
                    <div className="bg-sky-500/[0.07] border border-sky-500/20 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-sky-400 font-bold text-sm mb-2">
                        <CheckCircle2 className="w-4 h-4" /> Redirected to Google Maps
                      </div>
                      <p className="text-xs text-zinc-600 mb-3">This customer was sent to your Google Maps page to leave a review.</p>
                      <a href={campaign.googleMapsUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-semibold transition-colors">
                        View Google Maps page <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}

                {selectedContact.status === "negative" && (
                  <div className="space-y-3">
                    <div className="bg-red-500/[0.07] border border-red-500/20 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-red-400 font-bold text-sm mb-2">
                        <ThumbsDown className="w-4 h-4" /> Private Feedback
                      </div>
                      {selectedContact.feedback && (
                        <p className="text-sm text-zinc-300 italic">"{selectedContact.feedback}"</p>
                      )}
                    </div>
                    <div className="bg-red-500/[0.07] border border-red-500/20 rounded-xl p-3 text-xs text-red-400/80 leading-relaxed">
                      ⚠️ This feedback was kept private. Reach out to resolve the issue before it becomes a public review.
                    </div>
                  </div>
                )}

                {(selectedContact.status === "sent" || selectedContact.status === "pending") && (
                  <div className="bg-sky-500/[0.07] border border-sky-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-sky-400 font-bold text-sm mb-1">
                      <Clock className="w-4 h-4" /> Awaiting Response
                    </div>
                    <p className="text-xs text-zinc-600">Message sent. Waiting for the customer to respond.</p>
                  </div>
                )}
              </div>
            )}

            {/* Negative feedback summary */}
            {negative.length > 0 && (
              <div className="bg-white/[0.03] backdrop-blur-md border border-red-500/20 rounded-2xl p-5">
                <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-red-400" />
                  Private Feedback ({negative.length})
                </h3>
                <div className="space-y-2 max-h-52 overflow-y-auto">
                  {negative.map((c) => (
                    <div key={c.id} className="bg-red-500/[0.06] border border-red-500/15 rounded-xl p-3">
                      <div className="font-bold text-red-300 text-xs mb-1">{c.name}</div>
                      {c.feedback && <p className="text-zinc-400 text-xs italic">"{c.feedback}"</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Google Maps card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-600/80 to-sky-700/80 border border-sky-500/30 p-5 shadow-[0_0_40px_rgba(14,165,233,0.2)] backdrop-blur-md">
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/[0.05] blur-2xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 font-bold text-white mb-2">
                  <Star className="w-4 h-4 text-red-300 fill-red-300" />
                  Google Maps Reviews
                </div>
                <p className="text-sm text-sky-200 mb-4">
                  {positive.length} happy customers directed to your Google Maps listing.
                </p>
                <a href={campaign.googleMapsUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-white text-sky-700 rounded-xl py-3 text-sm font-black hover:bg-sky-50 transition-colors shadow-lg">
                  View Google Maps Page <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
