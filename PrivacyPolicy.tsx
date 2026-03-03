import { ArrowLeft, Eye, Database, Share2, Lock, UserCheck, Trash2, Mail, Globe, Shield } from "lucide-react";
import { AppView } from "../types";
import { ReputeLogo } from "@/components/ui/repute-logo";
import { useTheme } from "@/context/ThemeContext";

interface Props {
  setView: (v: AppView) => void;
}

const Section = ({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) => (
  <div className="mb-12">
    <div className="flex items-center gap-3 mb-5">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)" }}>
        <Icon className="w-4 h-4 text-sky-400" />
      </div>
      <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{title}</h2>
    </div>
    <div className="text-sm leading-7 space-y-3 ml-12" style={{ color: "var(--text-secondary)" }}>
      {children}
    </div>
  </div>
);

const TableRow = ({ left, right }: { left: string; right: string }) => (
  <tr className="border-b" style={{ borderColor: "var(--border-subtle)" }}>
    <td className="py-3 pr-6 text-sm font-medium" style={{ color: "var(--text-primary)" }}>{left}</td>
    <td className="py-3 text-sm" style={{ color: "var(--text-secondary)" }}>{right}</td>
  </tr>
);

export function PrivacyPolicy({ setView }: Props) {
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen" style={{ color: "var(--text-primary)" }}>
      {/* Header */}
      <div className="sticky top-0 z-40 border-b"
        style={{
          background: isDark ? "rgba(5,5,8,0.85)" : "rgba(244,244,248,0.85)",
          backdropFilter: "blur(20px)",
          borderColor: "var(--border-subtle)",
        }}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setView("landing")}
            className="flex items-center gap-2 text-sm font-medium transition-colors group"
            style={{ color: "var(--text-muted)" }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Repute
          </button>
          <ReputeLogo />
          <div className="w-24" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
            style={{ background: "rgba(99,102,241,0.10)", border: "1px solid rgba(99,102,241,0.18)", color: "#818cf8" }}>
            <Shield className="w-3.5 h-3.5" />
            Privacy Document
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ color: "var(--text-primary)" }}>
            Privacy Policy
          </h1>
          <p className="text-base" style={{ color: "var(--text-secondary)" }}>
            Last updated: <strong>January 15, 2025</strong> · Effective: <strong>February 1, 2025</strong>
          </p>
          <p className="mt-6 mx-auto max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            At Repute, your privacy matters deeply to us. This policy explains how we collect, use, and protect your
            information — and your customers' information — when you use our platform.
          </p>
        </div>

        {/* Quick summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
          {[
            { icon: Lock, title: "We don't sell data", desc: "We never sell your personal data or your customers' data to third parties.", color: "sky" },
            { icon: Eye, title: "Full transparency", desc: "We clearly explain exactly what data we collect and why we need it.", color: "sky" },
            { icon: UserCheck, title: "You're in control", desc: "Access, correct, or delete your data at any time from your settings.", color: "sky" },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="p-5 rounded-2xl"
              style={{
                background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
                border: "1px solid var(--border-subtle)"
              }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `rgba(${color === "sky" ? "16,185,129" : color === "sky" ? "99,102,241" : "139,92,246"},0.12)` }}>
                <Icon className={`w-4 h-4 text-${color}-400`} />
              </div>
              <p className="font-bold text-sm mb-1" style={{ color: "var(--text-primary)" }}>{title}</p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{desc}</p>
            </div>
          ))}
        </div>

        <div className="h-px mb-14" style={{ background: "var(--border-subtle)" }} />

        <Section icon={Database} title="1. Information We Collect">
          <p><strong style={{ color: "var(--text-primary)" }}>Account Information:</strong> When you create an account, we collect your name, email address, business name, and password (stored as a secure hash).</p>
          <p><strong style={{ color: "var(--text-primary)" }}>Business Profile Data:</strong> Google Maps URL, business type, timezone, and notification preferences you provide.</p>
          <p><strong style={{ color: "var(--text-primary)" }}>Customer Contact Data:</strong> Names, email addresses, and phone numbers of your customers that you upload to our platform. You retain full ownership of this data.</p>
          <p><strong style={{ color: "var(--text-primary)" }}>Usage Data:</strong> How you interact with our Service, including campaign creation, message sends, and dashboard activity — used to improve our product.</p>
          <p><strong style={{ color: "var(--text-primary)" }}>Technical Data:</strong> IP address, browser type, device identifiers, and cookies — used for security, fraud prevention, and analytics.</p>

          <div className="mt-5 rounded-2xl overflow-hidden border" style={{ borderColor: "var(--border-subtle)" }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)" }}>
                  <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Data Type</th>
                  <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Purpose</th>
                </tr>
              </thead>
              <tbody className="px-4">
                {[
                  ["Account credentials", "Authentication, account security"],
                  ["Business information", "Personalizing messages sent to your customers"],
                  ["Customer contact lists", "Sending feedback requests on your behalf"],
                  ["Feedback responses", "Displaying in your dashboard, routing to Google or back to you"],
                  ["Billing information", "Processing payments (handled by Stripe)"],
                  ["Usage analytics", "Product improvement, feature prioritization"],
                ].map(([left, right], i) => <TableRow key={i} left={left} right={right} />)}
              </tbody>
            </table>
          </div>
        </Section>

        <Section icon={Eye} title="2. How We Use Your Information">
          <p>We use the information we collect to:</p>
          <ul className="list-none space-y-2 mt-3">
            {[
              "Provide, operate, and maintain the Repute platform",
              "Send automated feedback request messages to your customers on your behalf",
              "Route positive feedback to your Google Maps page",
              "Deliver negative feedback privately to your dashboard",
              "Process payments and manage your subscription",
              "Send you product updates, security alerts, and transactional emails",
              "Provide customer support and respond to your inquiries",
              "Analyze usage patterns to improve our Service",
              "Detect and prevent fraudulent or abusive activity",
              "Comply with legal obligations",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0 mt-2" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4">
            <strong style={{ color: "var(--text-primary)" }}>Marketing emails:</strong> We may send you newsletters about Repute features and tips. You can unsubscribe at any time using the link in any email or from your Settings page.
          </p>
        </Section>

        <Section icon={Share2} title="3. How We Share Your Information">
          <p>
            <strong style={{ color: "var(--text-primary)" }}>We do not sell your personal data.</strong> Period.
            We share information only in the following limited circumstances:
          </p>
          <div className="space-y-4 mt-4">
            {[
              { title: "Service Providers", desc: "We work with trusted third-party vendors who help us operate the Service — including Stripe (payments), SendGrid (email delivery), Twilio (SMS), and analytics providers. These vendors only process data as instructed by us." },
              { title: "Legal Requirements", desc: "We may disclose information if required by law, court order, or government regulation, or if we believe disclosure is necessary to protect rights, property, or safety." },
              { title: "Business Transfers", desc: "In the event of a merger, acquisition, or sale of assets, your information may be transferred. We will notify you before your data becomes subject to a different privacy policy." },
              { title: "With Your Consent", desc: "We may share information with third parties when you explicitly consent to such sharing." },
            ].map(({ title, desc }) => (
              <div key={title} className="p-4 rounded-xl" style={{ background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.03)", border: "1px solid var(--border-subtle)" }}>
                <p className="font-bold text-sm mb-1.5" style={{ color: "var(--text-primary)" }}>{title}</p>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section icon={Globe} title="4. Cookies & Tracking">
          <p>We use cookies and similar tracking technologies to:</p>
          <ul className="list-none space-y-2 mt-3">
            {[
              "Keep you signed in to your account (essential cookies)",
              "Remember your preferences such as theme and language (functional cookies)",
              "Understand how you use our product and which features are popular (analytics cookies)",
              "Prevent fraudulent activity and ensure security (security cookies)",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0 mt-2" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-3">
            You can control cookies through your browser settings. Note that disabling essential cookies may affect Service functionality.
          </p>
        </Section>

        <Section icon={Lock} title="5. Data Security">
          <p>
            We implement industry-standard security measures to protect your data. Our security practices include:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {[
              "256-bit AES encryption at rest",
              "TLS 1.3 encryption in transit",
              "Bcrypt password hashing",
              "SOC 2 Type II compliant infrastructure",
              "Regular third-party security audits",
              "Role-based access controls",
              "Automated anomaly detection",
              "99.9% uptime SLA with redundancy",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-lg"
                style={{ background: isDark ? "rgba(16,185,129,0.06)" : "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.12)" }}>
                <Shield className="w-3 h-3 text-sky-400 flex-shrink-0" />
                <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{item}</span>
              </div>
            ))}
          </div>
          <p className="mt-4">
            Despite our best efforts, no method of transmission or storage is 100% secure. If you believe your account
            has been compromised, contact us immediately at <a href="mailto:security@repute.app" className="text-sky-400 hover:underline">security@repute.app</a>.
          </p>
        </Section>

        <Section icon={UserCheck} title="6. Your Rights & Choices">
          <p>Depending on your location, you may have the following rights regarding your personal data:</p>
          <div className="space-y-3 mt-4">
            {[
              { right: "Access", desc: "Request a copy of all personal data we hold about you." },
              { right: "Correction", desc: "Request correction of inaccurate or incomplete data." },
              { right: "Deletion", desc: "Request deletion of your data (\"right to be forgotten\")." },
              { right: "Portability", desc: "Receive your data in a structured, machine-readable format." },
              { right: "Objection", desc: "Object to processing of your data for certain purposes, including marketing." },
              { right: "Restriction", desc: "Request that we restrict processing of your data in certain circumstances." },
            ].map(({ right, desc }) => (
              <div key={right} className="flex gap-3">
                <span className="text-xs font-black px-2.5 py-1 rounded-lg flex-shrink-0 h-fit"
                  style={{ background: "rgba(99,102,241,0.12)", color: "#818cf8" }}>{right}</span>
                <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>{desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-4">
            To exercise any of these rights, email us at <a href="mailto:privacy@repute.app" className="text-sky-400 hover:underline">privacy@repute.app</a>.
            We will respond within 30 days. GDPR users have additional rights under EU law.
          </p>
        </Section>

        <Section icon={Trash2} title="7. Data Retention">
          <p>We retain your data for as long as your account is active or as needed to provide the Service.</p>
          <div className="mt-4 rounded-2xl overflow-hidden border" style={{ borderColor: "var(--border-subtle)" }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)" }}>
                  <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Data Category</th>
                  <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Retention Period</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Account data", "Duration of account + 30 days after deletion request"],
                  ["Customer contact lists", "Duration of campaign + 90 days (configurable)"],
                  ["Feedback responses", "3 years or until deletion request"],
                  ["Billing records", "7 years (legal requirement)"],
                  ["System logs", "90 days"],
                  ["Analytics data", "26 months (aggregated, anonymized)"],
                ].map(([left, right], i) => <TableRow key={i} left={left} right={right} />)}
              </tbody>
            </table>
          </div>
        </Section>

        <Section icon={Mail} title="8. Contact Our Privacy Team">
          <p>For any privacy-related questions, data requests, or concerns:</p>
          <div className="mt-4 p-5 rounded-2xl"
            style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)", border: "1px solid var(--border-subtle)" }}>
            <p className="font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Repute Privacy Team</p>
            <div className="space-y-1.5 text-sm">
              <p>Email: <a href="mailto:privacy@repute.app" className="text-sky-400 hover:underline">privacy@repute.app</a></p>
              <p>DPA requests: <a href="mailto:dpa@repute.app" className="text-sky-400 hover:underline">dpa@repute.app</a></p>
              <p>Address: 123 Market Street, Suite 400, San Francisco, CA 94105</p>
              <p>EU Representative: Repute EU Ltd., Dublin, Ireland</p>
              <p>Response time: Within 5 business days (30 days for formal requests)</p>
            </div>
          </div>
        </Section>

        {/* Footer nav */}
        <div className="mt-16 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: "var(--border-subtle)" }}>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            © 2025 Repute, Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <button onClick={() => setView("terms")} className="text-sky-400 hover:underline">Terms of Service</button>
            <button onClick={() => setView("landing")} style={{ color: "var(--text-muted)" }} className="hover:underline">Back to Home</button>
          </div>
        </div>
      </div>
    </div>
  );
}
