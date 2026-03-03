import { ArrowLeft, Shield, FileText, Scale, AlertCircle, Mail, Clock, Globe, Lock, RefreshCw } from "lucide-react";
import { AppView } from "../types";
import { ReputeLogo } from "@/components/ui/repute-logo";
import { useTheme } from "@/context/ThemeContext";

interface Props {
  setView: (v: AppView) => void;
}

const Section = ({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) => {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }}>
          <Icon className="w-4 h-4 text-sky-400" />
        </div>
        <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{title}</h2>
      </div>
      <div className="text-sm leading-7 space-y-3 ml-12" style={{ color: "var(--text-secondary)" }}>
        {children}
      </div>
    </div>
  );
};

export function TermsOfService({ setView }: Props) {
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
            style={{ background: "rgba(139,92,246,0.10)", border: "1px solid rgba(139,92,246,0.18)", color: "#a78bfa" }}>
            <FileText className="w-3.5 h-3.5" />
            Legal Document
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ color: "var(--text-primary)" }}>
            Terms of Service
          </h1>
          <p className="text-base" style={{ color: "var(--text-secondary)" }}>
            Last updated: <strong>January 15, 2025</strong> · Effective: <strong>February 1, 2025</strong>
          </p>
          <div className="mt-6 mx-auto max-w-2xl p-4 rounded-2xl text-sm"
            style={{
              background: isDark ? "rgba(245,158,11,0.06)" : "rgba(245,158,11,0.08)",
              border: "1px solid rgba(245,158,11,0.18)",
              color: isDark ? "#fbbf24" : "#92400e",
            }}>
            <AlertCircle className="w-4 h-4 inline mr-2 mb-0.5" />
            Please read these terms carefully before using Repute. By creating an account, you agree to be bound by these Terms.
          </div>
        </div>

        {/* Divider */}
        <div className="h-px mb-14" style={{ background: "var(--border-subtle)" }} />

        {/* Sections */}
        <Section icon={Scale} title="1. Acceptance of Terms">
          <p>
            By accessing or using Repute's services, platform, website, APIs, or any related products (collectively, the "Service"),
            you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service.
          </p>
          <p>
            These Terms apply to all users, including businesses, their employees, and any third parties who interact with the Service.
            If you are using the Service on behalf of a company or other legal entity, you represent that you have the authority to bind
            that entity to these Terms.
          </p>
        </Section>

        <Section icon={Globe} title="2. Description of Service">
          <p>
            Repute is a B2B customer experience automation platform that enables businesses to:
          </p>
          <ul className="list-none space-y-2 mt-3">
            {[
              "Import customer contact lists via CSV, Google Sheets, or manual entry",
              "Send automated post-visit feedback requests via email or SMS",
              "Route satisfied customers to public review platforms (e.g., Google Maps)",
              "Capture and privately deliver negative feedback directly to businesses",
              "Manage, analyze, and respond to customer feedback from a central dashboard",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0 mt-2" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-3">
            We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time with reasonable notice.
          </p>
        </Section>

        <Section icon={Lock} title="3. Account Registration & Security">
          <p>
            To use Repute, you must register for an account. You agree to provide accurate, current, and complete information during
            registration and to update such information to keep it accurate.
          </p>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials. You are solely responsible for all
            activity that occurs under your account. You must immediately notify Repute of any unauthorized use of your account.
          </p>
          <p>
            Repute reserves the right to suspend or terminate accounts that violate these Terms, engage in fraudulent activity,
            or are inactive for more than 24 consecutive months.
          </p>
        </Section>

        <Section icon={Shield} title="4. Acceptable Use Policy">
          <p>You agree to use Repute only for lawful purposes and in accordance with these Terms. You agree NOT to:</p>
          <ul className="list-none space-y-2 mt-3">
            {[
              "Send unsolicited messages (spam) to individuals who have not consented to receive communications",
              "Upload contact lists obtained through unlawful means or without proper consent",
              "Use the Service to harass, intimidate, or threaten any person",
              "Impersonate any person or entity or misrepresent your affiliation with any person or entity",
              "Attempt to gain unauthorized access to any part of the Service",
              "Use the Service to generate fake or fraudulent reviews",
              "Violate any applicable anti-spam laws including CAN-SPAM, CASL, or GDPR requirements",
              "Reverse engineer, disassemble, or decompile any part of the Service",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 mt-2" />
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={Mail} title="5. Customer Data & Messaging Compliance">
          <p>
            You acknowledge that you are the "data controller" for all customer contact data you upload to Repute. You represent and
            warrant that:
          </p>
          <ul className="list-none space-y-2 mt-3">
            {[
              "You have obtained all necessary consents from your customers to contact them via email and/or SMS",
              "All customer data you upload complies with applicable data protection laws in your jurisdiction",
              "You will honor opt-out and unsubscribe requests promptly and completely",
              "You will not use Repute to contact individuals on national Do Not Call registries without proper consent",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0 mt-2" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-3">
            Repute acts as a "data processor" on your behalf. Our processing of your customer data is governed by our Privacy Policy
            and any applicable Data Processing Agreement.
          </p>
        </Section>

        <Section icon={RefreshCw} title="6. Subscription, Billing & Cancellation">
          <p>
            Repute offers subscription plans as described on our Pricing page. By subscribing, you authorize us to charge your
            payment method on a recurring basis (monthly or annually, as selected).
          </p>
          <p>
            <strong style={{ color: "var(--text-primary)" }}>Free Trial:</strong> New accounts may receive a 14-day free trial.
            No credit card is required for the trial period. At the end of the trial, continued use requires a paid subscription.
          </p>
          <p>
            <strong style={{ color: "var(--text-primary)" }}>Refunds:</strong> Subscription fees are non-refundable except where
            required by law. If you cancel your subscription, you will retain access until the end of your current billing period.
          </p>
          <p>
            <strong style={{ color: "var(--text-primary)" }}>Price Changes:</strong> We will provide at least 30 days' notice
            before any price increases take effect for existing subscribers.
          </p>
        </Section>

        <Section icon={AlertCircle} title="7. Limitation of Liability">
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, REPUTE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
            CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, GOODWILL, OR BUSINESS INTERRUPTION.
          </p>
          <p>
            OUR TOTAL LIABILITY TO YOU FOR ANY CLAIMS ARISING FROM OR RELATED TO THESE TERMS OR THE SERVICE SHALL NOT EXCEED THE
            GREATER OF (A) THE AMOUNT YOU PAID TO REPUTE IN THE THREE MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED DOLLARS ($100).
          </p>
        </Section>

        <Section icon={Clock} title="8. Changes to Terms">
          <p>
            We reserve the right to modify these Terms at any time. We will notify you of material changes via email or through a
            prominent notice on our Service at least 14 days before the change takes effect.
          </p>
          <p>
            Your continued use of the Service after the effective date of the revised Terms constitutes your acceptance of the changes.
            If you do not agree to the revised Terms, you must stop using the Service.
          </p>
        </Section>

        <Section icon={Mail} title="9. Contact Us">
          <p>If you have any questions about these Terms, please contact us:</p>
          <div className="mt-4 p-5 rounded-2xl"
            style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)", border: "1px solid var(--border-subtle)" }}>
            <p className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Repute Legal Team</p>
            <p>Email: <a href="mailto:legal@repute.app" className="text-sky-400 hover:underline">legal@repute.app</a></p>
            <p>Address: 123 Market Street, Suite 400, San Francisco, CA 94105</p>
            <p>Response time: Within 3 business days</p>
          </div>
        </Section>

        {/* Footer nav */}
        <div className="mt-16 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: "var(--border-subtle)" }}>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            © 2025 Repute, Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <button onClick={() => setView("privacy")} className="text-sky-400 hover:underline">Privacy Policy</button>
            <button onClick={() => setView("landing")} style={{ color: "var(--text-muted)" }} className="hover:underline">Back to Home</button>
          </div>
        </div>
      </div>
    </div>
  );
}
