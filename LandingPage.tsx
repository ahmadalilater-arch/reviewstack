import { useEffect, useRef, useState, useCallback, memo } from "react";
import {
  ArrowRight, CheckCircle2, Star, ThumbsUp, ThumbsDown,
  Shield, Zap, BarChart3, Upload, Send, Hotel,
  TrendingUp, Lock, BadgeCheck, ChevronDown, Sparkles,
  MessageSquareHeart, Mail, FileSpreadsheet, Globe,
  ClipboardList,
} from "lucide-react";
import { AppView } from "../types";
import { ReviewFlowHero } from "./ui/animated-web3-hero";

interface LandingPageProps {
  setView: (v: AppView) => void;
}

/* ── Newsletter block ──────────────────────────────────────── */
function NewsletterBlock({ setView }: { setView: (v: AppView) => void }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !agreed) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <div
      className="rounded-3xl border p-8 md:p-10"
      style={{ background: "var(--bg-surface-2)", borderColor: "var(--border-subtle)" }}
    >
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
        <div className="flex-1">
          <p className="font-bold text-xs uppercase tracking-widest mb-2 text-violet-400">Newsletter</p>
          <h3 className="text-xl font-black mb-2" style={{ color: "var(--text-primary)" }}>
            Stay ahead of the curve
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Monthly reputation management tips, Google algorithm updates, and Repute product news. No spam.
          </p>
        </div>
        <div className="flex-1 w-full">
          {submitted ? (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <p className="text-sm font-semibold text-emerald-400">You're subscribed! Welcome to the community.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@business.com"
                  className="flex-1 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-primary)",
                  }}
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 flex-shrink-0"
                  style={{ background: "linear-gradient(to right, #8b5cf6, #6366f1)" }}
                >
                  Subscribe
                </button>
              </div>
              <div className="flex items-start gap-2.5">
                <button
                  type="button"
                  onClick={() => setAgreed(!agreed)}
                  className={`mt-0.5 w-4 h-4 rounded border transition-all flex-shrink-0 relative ${agreed ? "bg-violet-500 border-violet-500" : "border-zinc-600"}`}
                >
                  {agreed && (
                    <svg className="w-2.5 h-2.5 text-white absolute inset-0 m-auto" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  I agree to the{" "}
                  <button type="button" onClick={() => setView("privacy")} className="text-violet-400 hover:underline underline-offset-2">
                    Privacy Policy
                  </button>
                  . Unsubscribe anytime.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Scroll reveal ─────────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right, .reveal-scale"
    );
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -20px 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ─── Counter ───────────────────────────────────────────── */
function useCounter(end: number, duration = 1800, active = false) {
  const [val, setVal] = useState(0);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(ease * end));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [end, duration, active]);
  return val;
}

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { setInView(true); obs.disconnect(); }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ─── Animated stat ─────────────────────────────────────── */
const AnimatedStat = memo(function AnimatedStat({
  end, suffix, label, active,
}: { end: number; suffix: string; label: string; active: boolean }) {
  const val = useCounter(end, 1800, active);
  return (
    <div className="text-center">
      <div
        className="text-4xl md:text-5xl font-black tracking-tight mb-2"
        style={{ color: "var(--text-primary)" }}
      >
        {val.toLocaleString()}{suffix}
      </div>
      <div
        className="text-xs uppercase tracking-widest font-semibold"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </div>
    </div>
  );
});

/* ─── Step panels — defined at MODULE level so memo works ── */

const ImportPanel = memo(function ImportPanel() {
  const methods = [
    { icon: <FileSpreadsheet className="w-4 h-4 text-emerald-400" />, label: "CSV / Excel", tag: "drag & drop" },
    { icon: <Globe className="w-4 h-4 text-sky-400" />, label: "Google Sheets", tag: "live sync" },
    { icon: <ClipboardList className="w-4 h-4 text-violet-400" />, label: "Paste Data", tag: "bulk" },
    { icon: <Mail className="w-4 h-4 text-rose-400" />, label: "Manual Entry", tag: "one by one" },
  ];

  return (
    <div className="space-y-4 step-panel-enter">
      <p
        className="text-xs font-bold uppercase tracking-widest mb-5"
        style={{ color: "var(--text-muted)" }}
      >
        Import Methods
      </p>
      <div className="grid grid-cols-2 gap-3">
        {methods.map((m, i) => (
          <div
            key={m.label}
            className="rounded-xl p-4 border flex flex-col gap-2"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-subtle)",
              animation: `stepFadeSlideIn 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 80}ms both`,
            }}
          >
            <div className="flex items-center gap-2">
              {m.icon}
              <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {m.label}
              </span>
            </div>
            <span
              className="text-[10px] uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              {m.tag}
            </span>
          </div>
        ))}
      </div>
      <div
        className="rounded-xl p-4 flex items-center gap-3 border border-emerald-500/25"
        style={{
          background: "rgba(16,185,129,0.07)",
          animation: "stepFadeSlideIn 0.5s cubic-bezier(0.16,1,0.3,1) 360ms both",
        }}
      >
        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <div>
          <p className="text-emerald-300 text-sm font-semibold">247 contacts imported</p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Duplicates removed · Ready to send
          </p>
        </div>
      </div>
    </div>
  );
});

const LiveSendPanel = memo(function LiveSendPanel() {
  const [logs, setLogs] = useState<{ name: string; status: string; channel: string }[]>([]);

  useEffect(() => {
    const entries = [
      { name: "Sarah M.", status: "Delivered", channel: "Email" },
      { name: "David R.", status: "Opened", channel: "SMS" },
      { name: "Elena K.", status: "Responded ✓", channel: "Email" },
      { name: "Tom H.", status: "Responded ✓", channel: "SMS" },
      { name: "Maria L.", status: "Delivered", channel: "Email" },
    ];
    let i = 0;
    // Clear any previous state when this mounts fresh
    setLogs([]);
    const iv = setInterval(() => {
      if (i < entries.length) {
        const entry = entries[i];
        setLogs((p) => [entry, ...p]);
        i++;
      } else {
        clearInterval(iv);
      }
    }, 800);
    return () => {
      clearInterval(iv);
    };
  }, []); // Empty deps — this runs once on mount and cleans up on unmount

  return (
    <div className="space-y-4 step-panel-enter">
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          Live Send Log
        </p>
        <span className="flex items-center gap-1.5 text-[10px] text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Sending…
        </span>
      </div>

      {/* Message preview */}
      <div
        className="rounded-xl p-4 border"
        style={{
          background: "var(--bg-surface-2)",
          borderColor: "var(--border-subtle)",
          animation: "stepFadeSlideIn 0.5s cubic-bezier(0.16,1,0.3,1) 0ms both",
        }}
      >
        <div
          className="text-xs mb-2 font-medium uppercase tracking-wider"
          style={{ color: "var(--text-muted)" }}
        >
          Message Preview
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          "Hi{" "}
          <span className="text-violet-400 font-semibold">{"{{first_name}}"}</span>! Thank
          you for visiting{" "}
          <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
            {"{{business}}"}
          </span>
          . How was your experience? 🙏"
        </p>
      </div>

      {/* Log rows */}
      <div className="space-y-2">
        {logs.length === 0 && (
          <p className="text-xs text-center py-4" style={{ color: "var(--text-muted)" }}>
            Warming up send sequence…
          </p>
        )}
        {logs.map((log, i) => (
          <div
            key={`${log.name}-${i}`}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-subtle)",
              animation: "stepFadeSlideIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
            }}
          >
            <Send className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                {log.name}
              </span>
              <span className="text-[10px] ml-2" style={{ color: "var(--text-muted)" }}>
                via {log.channel}
              </span>
            </div>
            <span
              className={`text-[10px] font-semibold ${
                log.status.includes("✓")
                  ? "text-violet-400"
                  : log.status === "Opened"
                  ? "text-sky-400"
                  : "text-emerald-400"
              }`}
            >
              {log.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

const HappyFlowPanel = memo(function HappyFlowPanel() {
  return (
    <div className="space-y-4 step-panel-enter">
      <p
        className="text-xs font-bold uppercase tracking-widest mb-5"
        style={{ color: "var(--text-muted)" }}
      >
        Happy Customer Flow
      </p>

      {/* Happy path */}
      <div
        className="p-5 rounded-2xl border border-emerald-500/20"
        style={{
          background: "rgba(16,185,129,0.07)",
          animation: "stepFadeSlideIn 0.5s cubic-bezier(0.16,1,0.3,1) 0ms both",
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <Star className="w-5 h-5 text-emerald-400 fill-emerald-400" />
          </div>
          <div>
            <div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
              4–5 Stars → Google Maps
            </div>
            <div className="text-xs text-emerald-400">Auto-redirected with one tap</div>
          </div>
          <ArrowRight className="w-4 h-4 text-emerald-400 ml-auto flex-shrink-0" />
        </div>
        <div
          className="p-3 rounded-xl border border-emerald-500/10"
          style={{ background: "var(--bg-surface)" }}
        >
          <div className="flex gap-0.5 mb-1.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star key={n} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            "Amazing experience! Staff was incredible. Highly recommend!"
          </p>
          <div className="mt-1.5 text-[10px]" style={{ color: "var(--text-muted)" }}>
            Sarah M. · posted just now
          </div>
        </div>
      </div>

      {/* Unhappy path */}
      <div
        className="p-5 rounded-2xl border border-red-500/20"
        style={{
          background: "rgba(239,68,68,0.07)",
          animation: "stepFadeSlideIn 0.5s cubic-bezier(0.16,1,0.3,1) 140ms both",
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
              1–3 Stars → Private Inbox
            </div>
            <div className="text-xs text-red-400">Never reaches Google</div>
          </div>
          <Lock className="w-4 h-4 text-red-400 ml-auto flex-shrink-0" />
        </div>
        <div
          className="p-3 rounded-xl border border-red-500/10"
          style={{ background: "var(--bg-surface)" }}
        >
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            "Check-in was slow, room wasn't ready on time."
          </p>
          <div className="mt-2 flex gap-2">
            <span
              className="text-[10px] px-2 py-1 rounded-lg"
              style={{ background: "var(--bg-surface-2)", color: "var(--text-muted)" }}
            >
              Reply Privately
            </span>
            <span
              className="text-[10px] px-2 py-1 rounded-lg"
              style={{ background: "var(--bg-surface-2)", color: "var(--text-muted)" }}
            >
              Mark Resolved
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div
        className="grid grid-cols-3 gap-2"
        style={{ animation: "stepFadeSlideIn 0.5s cubic-bezier(0.16,1,0.3,1) 280ms both" }}
      >
        {[
          { val: "78%", label: "To Google", col: "text-emerald-400" },
          { val: "22%", label: "Intercepted", col: "text-red-400" },
          { val: "4.8★", label: "New avg", col: "text-amber-400" },
        ].map((s) => (
          <div
            key={s.label}
            className="p-3 rounded-xl border text-center"
            style={{ background: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}
          >
            <div className={`text-lg font-black ${s.col}`}>{s.val}</div>
            <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
});

const PrivateInboxPanel = memo(function PrivateInboxPanel() {
  const feedbacks = [
    { name: "Alex P.", msg: "Room wasn't ready on time and the staff was dismissive.", resolved: false, initials: "A" },
    { name: "Linda M.", msg: "Food was cold and wait was over an hour. Disappointed.", resolved: true, initials: "L" },
  ];

  return (
    <div className="space-y-4 step-panel-enter">
      <p
        className="text-xs font-bold uppercase tracking-widest mb-5"
        style={{ color: "var(--text-muted)" }}
      >
        Private Feedback Inbox
      </p>
      {feedbacks.map((fb, i) => (
        <div
          key={fb.name}
          className="rounded-xl p-4 border"
          style={{
            background: fb.resolved ? "var(--bg-surface)" : "rgba(239,68,68,0.07)",
            borderColor: fb.resolved ? "var(--border-subtle)" : "rgba(239,68,68,0.25)",
            animation: `stepFadeSlideIn 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 120}ms both`,
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                {fb.initials}
              </div>
              <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {fb.name}
              </span>
            </div>
            {fb.resolved ? (
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
                Resolved
              </span>
            ) : (
              <span className="text-[10px] text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-full px-2 py-0.5">
                New
              </span>
            )}
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            "{fb.msg}"
          </p>
        </div>
      ))}
      <div
        className="rounded-xl p-4 flex items-center gap-3 border border-emerald-500/20"
        style={{
          background: "rgba(16,185,129,0.07)",
          animation: "stepFadeSlideIn 0.5s cubic-bezier(0.16,1,0.3,1) 260ms both",
        }}
      >
        <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <p className="text-sm font-semibold text-emerald-300">
          0 negative reviews reached Google this month
        </p>
      </div>
    </div>
  );
});

/* ─── Static data — defined at MODULE level (never recreated) */
const STEPS = [
  {
    num: "01",
    icon: Upload,
    title: "Import Contacts",
    body: "Upload CSV, paste emails, connect Google Sheets, or add manually. We deduplicate and validate instantly.",
    accentBg: "rgba(139,92,246,0.07)",
    accentBorder: "rgba(139,92,246,0.25)",
    numColor: "text-violet-400",
    iconActiveBg: "bg-violet-500",
    progressColor: "bg-violet-500",
    panelId: 0,
  },
  {
    num: "02",
    icon: Send,
    title: "Smart Outreach",
    body: "Branded messages go to every customer — by email or SMS. Personalised with their first name and your business name.",
    accentBg: "rgba(99,102,241,0.07)",
    accentBorder: "rgba(99,102,241,0.25)",
    numColor: "text-indigo-400",
    iconActiveBg: "bg-indigo-500",
    progressColor: "bg-indigo-500",
    panelId: 1,
  },
  {
    num: "03",
    icon: ThumbsUp,
    title: "Happy → Google Review",
    body: "Happy customers get a one-tap link to your Google Maps page. Frictionless, fast, effective.",
    accentBg: "rgba(16,185,129,0.07)",
    accentBorder: "rgba(16,185,129,0.25)",
    numColor: "text-emerald-400",
    iconActiveBg: "bg-emerald-500",
    progressColor: "bg-emerald-500",
    panelId: 2,
  },
  {
    num: "04",
    icon: ThumbsDown,
    title: "Unhappy → Private Inbox",
    body: "Negative feedback comes only to you. Resolve it before it goes public. Protect your reputation.",
    accentBg: "rgba(239,68,68,0.07)",
    accentBorder: "rgba(239,68,68,0.25)",
    numColor: "text-rose-400",
    iconActiveBg: "bg-rose-500",
    progressColor: "bg-rose-500",
    panelId: 3,
  },
];

const FEATURES = [
  { icon: Zap, color: "text-violet-400", bg: "bg-violet-500/10", title: "10-Minute Setup", body: "No code, no agency. Import contacts and launch your first campaign in minutes." },
  { icon: Shield, color: "text-emerald-400", bg: "bg-emerald-500/10", title: "Reputation Firewall", body: "Negative feedback is intercepted before it can reach Google. Goes only to your private dashboard." },
  { icon: BarChart3, color: "text-indigo-400", bg: "bg-indigo-500/10", title: "Real-Time Analytics", body: "Track open rates, sentiment, and Google conversions from one clean, focused dashboard." },
  { icon: Globe, color: "text-sky-400", bg: "bg-sky-500/10", title: "Email + SMS Outreach", body: "Reach customers on any channel. Let Repute pick the best channel per contact automatically." },
  { icon: Lock, color: "text-amber-400", bg: "bg-amber-500/10", title: "GDPR Compliant", body: "Built-in unsubscribe links, opt-out tracking, and full CAN-SPAM, CASL, and GDPR compliance." },
  { icon: TrendingUp, color: "text-rose-400", bg: "bg-rose-500/10", title: "+0.8★ Avg Increase", body: "Businesses using Repute see a measurable rating increase within their first 60 days." },
];

const TESTIMONIALS = [
  { quote: "We went from 3.8 to 4.7 stars in 6 weeks. Repute intercepted 14 potential 1-star reviews and turned them into resolved complaints.", name: "Marina Reyes", role: "Owner, The Grand Palms Hotel", initials: "MR", grad: "from-violet-500 to-indigo-600", badge: "+0.9★ in 6 weeks", badgeColor: "bg-amber-500/10 text-amber-400 border border-amber-500/20" },
  { quote: "Thirty unhappy customers after a rough night — all sent to our private inbox instead of Google. Absolute reputation saver.", name: "James Okafor", role: "GM, Bella Vista Restaurant", initials: "JO", grad: "from-emerald-500 to-teal-600", badge: "30 reviews saved", badgeColor: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" },
  { quote: "22 new 5-star reviews in the first week. We went from page 3 to the top 3 in local search. The ROI is ridiculous.", name: "Sofia Chen", role: "Director, Luxe Auto Detailing", initials: "SC", grad: "from-rose-500 to-pink-600", badge: "Page 3 → Top 3", badgeColor: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" },
];

const FAQS = [
  { q: "How does Repute route happy vs. unhappy customers?", a: "We send a simple branded message. The customer taps one of two options — happy goes to your Google Maps page; unhappy goes to a private form only you can see." },
  { q: "What file formats can I upload for contacts?", a: "CSV, Excel, Google Sheets URL, pasted text, or manual entry. We auto-detect column names like 'email', 'name', and 'phone'." },
  { q: "Can unhappy customers still post on Google themselves?", a: "Yes — we can't block direct access. But by giving them a fast private channel, the vast majority choose that over a public post." },
  { q: "Is there a free trial?", a: "Every plan includes a 14-day free trial. No credit card required. Run real campaigns with real contacts before spending a penny." },
  { q: "Is this compliant with anti-spam laws?", a: "Yes. Every message includes unsubscribe links, opt-outs are honored instantly, and we comply with CAN-SPAM, CASL, and GDPR." },
];

const PLANS = [
  { name: "Starter", price: "49", desc: "For single-location businesses.", features: ["500 contacts/mo", "Email outreach", "1 Google Maps profile", "Private feedback inbox", "Basic analytics"], cta: "Start Free Trial", highlight: false },
  { name: "Growth", price: "129", desc: "For businesses serious about reputation.", features: ["2,500 contacts/mo", "Email + SMS", "3 Google Maps profiles", "Private feedback inbox", "Advanced analytics", "Custom templates", "Priority support"], cta: "Start Free Trial", highlight: true },
  { name: "Enterprise", price: "349", desc: "Multi-location chains and agencies.", features: ["Unlimited contacts", "Email + SMS + WhatsApp", "Unlimited profiles", "Team inbox", "White-label branding", "API access", "Dedicated manager"], cta: "Contact Sales", highlight: false },
];

/* ══════════════════════════════════════════════════════════ */
export function LandingPage({ setView }: LandingPageProps) {
  const [phoneState, setPhoneState] = useState<"ask" | "positive" | "negative">("ask");
  const [activeStep, setActiveStep] = useState(0);
  const [panelKey, setPanelKey] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const statsSection = useInView(0.2);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useScrollReveal();

  /* Phone cycles every 5s — longer = fewer repaints */
  useEffect(() => {
    const t = setInterval(() => {
      setPhoneState((s) => (s === "ask" ? "positive" : s === "positive" ? "negative" : "ask"));
    }, 5000);
    return () => clearInterval(t);
  }, []);

  /* Step auto-cycle: 7s */
  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    timerRef.current = setInterval(() => {
      setActiveStep((prev) => {
        const next = (prev + 1) % STEPS.length;
        setPanelKey((k) => k + 1);
        return next;
      });
    }, 7000);
  }, []);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [startTimer]);

  const goToStep = useCallback(
    (i: number) => {
      setActiveStep(i);
      setPanelKey((k) => k + 1);
      startTimer();
    },
    [startTimer]
  );

  return (
    <div className="overflow-x-hidden" style={{ background: "transparent" }}>

      {/* ══ HERO ══ */}
      <ReviewFlowHero onStart={() => setView("signup")} />

      {/* ══ STATS BAR ══ */}
      <section
        style={{
          background: "var(--bg-base)",
          borderTop: "1px solid var(--border-subtle)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div ref={statsSection.ref} className="max-w-4xl mx-auto px-6 py-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {[
              { end: 2400, suffix: "+", label: "Businesses" },
              { end: 480000, suffix: "+", label: "Reviews Generated" },
              { end: 94, suffix: "%", label: "Positive Routing" },
              { end: 4, suffix: ".8★", label: "Avg Rating After" },
            ].map((s) => (
              <AnimatedStat key={s.label} {...s} active={statsSection.inView} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="py-36" style={{ background: "var(--bg-surface)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-20 reveal">
            <p className="text-violet-400 font-bold text-xs uppercase tracking-widest mb-4">
              How it works
            </p>
            <h2
              className="text-4xl md:text-5xl font-black leading-tight mb-5"
              style={{ color: "var(--text-primary)" }}
            >
              Four steps.<br />Completely automatic.
            </h2>
            <p
              className="text-lg leading-relaxed max-w-md"
              style={{ color: "var(--text-secondary)" }}
            >
              Set it up once. Repute handles every customer, every campaign, on autopilot.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Steps list */}
            <div className="space-y-3">
              {STEPS.map((step, i) => {
                const active = activeStep === i;
                const StepIcon = step.icon;
                return (
                  <button
                    key={step.num}
                    onClick={() => goToStep(i)}
                    className="w-full text-left rounded-2xl border p-5 transition-all duration-400 relative overflow-hidden"
                    style={{
                      background: active ? step.accentBg : "var(--bg-surface-2)",
                      borderColor: active ? step.accentBorder : "var(--border-subtle)",
                    }}
                  >
                    <div className="relative z-10 flex items-start gap-4">
                      <div
                        className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all text-sm font-bold ${
                          active ? `${step.iconActiveBg} text-white` : "text-zinc-500"
                        }`}
                        style={active ? {} : { background: "var(--bg-surface-3)" }}
                      >
                        <StepIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span
                            className={`text-[10px] font-black uppercase tracking-widest ${
                              active ? step.numColor : "text-zinc-600"
                            }`}
                          >
                            {step.num}
                          </span>
                          <h3
                            className="font-bold text-sm"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {step.title}
                          </h3>
                        </div>
                        <div
                          className="overflow-hidden transition-all duration-500"
                          style={{
                            maxHeight: active ? "80px" : "0px",
                            opacity: active ? 1 : 0,
                          }}
                        >
                          <p
                            className="text-sm leading-relaxed mt-2"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {step.body}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    {active && (
                      <div
                        className="absolute bottom-0 left-0 w-full h-[2px] rounded-b-2xl overflow-hidden"
                        style={{ background: "var(--border-subtle)" }}
                      >
                        <div
                          key={`pb-${panelKey}`}
                          className={`h-full progress-bar-fill rounded-full ${step.progressColor}`}
                        />
                      </div>
                    )}
                  </button>
                );
              })}

              {/* Dot navigator */}
              <div className="flex gap-2 pt-2 pl-1">
                {STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToStep(i)}
                    className={`rounded-full transition-all duration-300 ${
                      activeStep === i
                        ? "w-6 h-2 bg-violet-400"
                        : "w-2 h-2 bg-zinc-700 hover:bg-zinc-500"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Panel — key-remounted for fresh animations */}
            <div className="reveal-right lg:sticky lg:top-28">
              <div
                className="relative rounded-3xl border overflow-hidden shadow-2xl p-8 min-h-[480px]"
                style={{ background: "var(--bg-surface-2)", borderColor: "var(--border-subtle)" }}
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 0%, rgba(124,58,237,0.07), transparent 70%)",
                  }}
                />
                <div key={`panel-${panelKey}`} className="relative z-10">
                  {activeStep === 0 && <ImportPanel />}
                  {activeStep === 1 && <LiveSendPanel />}
                  {activeStep === 2 && <HappyFlowPanel />}
                  {activeStep === 3 && <PrivateInboxPanel />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ PHONE DEMO ══ */}
      <section className="py-36" style={{ background: "var(--bg-base)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10 reveal-left">
              <div>
                <p className="text-violet-400 font-bold text-xs uppercase tracking-widest mb-4">
                  The customer experience
                </p>
                <h2
                  className="text-4xl md:text-5xl font-black leading-tight mb-5"
                  style={{ color: "var(--text-primary)" }}
                >
                  Simple for them.<br />Powerful for you.
                </h2>
                <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Your customers get a clean, branded message. One tap tells you everything.
                </p>
              </div>
              <div className="space-y-6">
                {[
                  { icon: <BadgeCheck className="w-4 h-4 text-violet-400" />, title: "Branded & personal", body: "Messages use your business name and the customer's first name. Feels human, not automated." },
                  { icon: <Zap className="w-4 h-4 text-indigo-400" />, title: "One-tap response", body: "No forms to fill out. Happy or unhappy — one tap and the system handles everything." },
                  { icon: <Shield className="w-4 h-4 text-emerald-400" />, title: "Private by default", body: "Negative feedback never touches a public platform. Goes straight to your inbox." },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 border"
                      style={{ background: "var(--bg-surface-2)", borderColor: "var(--border-subtle)" }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-bold text-sm mb-1.5" style={{ color: "var(--text-primary)" }}>
                        {item.title}
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                        {item.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Phone mockup */}
            <div className="flex justify-center reveal-right">
              <div className="relative w-64">
                <div
                  className="absolute inset-0 rounded-full blur-3xl scale-125 pointer-events-none opacity-20"
                  style={{ background: "radial-gradient(circle, rgba(139,92,246,1) 0%, transparent 70%)" }}
                />
                <div className="relative rounded-[2.8rem] bg-zinc-900 p-2.5 shadow-[0_32px_80px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.06)]">
                  <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-16 h-4 bg-zinc-900 rounded-full z-10 border border-white/[0.05]" />
                  <div className="bg-zinc-950 rounded-[2.3rem] overflow-hidden min-h-[500px]">
                    <div className="flex justify-between items-center px-5 pt-7 pb-1 text-white text-xs">
                      <span className="font-semibold">9:41</span>
                      <span className="text-zinc-600 text-[10px]">●●●</span>
                    </div>
                    <div className="bg-gradient-to-r from-violet-700 to-indigo-700 px-4 py-3.5 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center border border-white/15 flex-shrink-0">
                        <Hotel className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-xs">The Grand Palms Hotel</p>
                        <p className="text-violet-200 text-[10px] flex items-center gap-1">
                          <BadgeCheck className="w-2.5 h-2.5" /> via Repute
                        </p>
                      </div>
                    </div>
                    <div className="px-4 py-5 space-y-4">
                      <div className="flex gap-2 items-end">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                          <Hotel className="w-3 h-3 text-white" />
                        </div>
                        <div className="bg-zinc-800 rounded-2xl rounded-bl-sm px-3 py-2.5 max-w-[82%]">
                          <p className="text-zinc-200 text-xs leading-relaxed">
                            Hi <span className="text-violet-300 font-semibold">Maria</span>! 👋 Thank
                            you for staying with us. How was your experience?
                          </p>
                          <p className="text-zinc-700 text-[10px] mt-1">Just now</p>
                        </div>
                      </div>

                      <div className="bg-zinc-800/50 border border-zinc-700/40 rounded-2xl px-3 py-4 space-y-2.5 mx-0.5">
                        <p className="text-zinc-500 text-[10px] text-center font-medium">
                          How would you rate your stay?
                        </p>
                        {phoneState === "ask" && (
                          <>
                            <button className="w-full bg-emerald-600 text-white rounded-xl py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5">
                              <ThumbsUp className="w-3.5 h-3.5" /> Loved it 🎉
                            </button>
                            <button className="w-full bg-zinc-700 text-zinc-300 rounded-xl py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5">
                              <ThumbsDown className="w-3.5 h-3.5" /> Had some issues
                            </button>
                          </>
                        )}
                        {phoneState === "positive" && (
                          <>
                            <div className="bg-emerald-900/30 border border-emerald-600/20 rounded-xl p-2.5 text-center">
                              <p className="text-lg mb-0.5">🎉</p>
                              <p className="text-emerald-300 text-[10px] font-semibold">
                                Awesome! Share it on Google
                              </p>
                            </div>
                            <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-1.5">
                              <Star className="w-3.5 h-3.5 fill-white" /> Leave a Google Review
                            </button>
                          </>
                        )}
                        {phoneState === "negative" && (
                          <>
                            <div className="bg-rose-900/20 border border-rose-600/20 rounded-xl p-2.5 text-center">
                              <p className="text-rose-300 text-[10px] font-semibold mb-0.5">
                                We're sorry to hear that 💙
                              </p>
                              <p className="text-zinc-600 text-[10px]">
                                Your feedback goes to management
                              </p>
                            </div>
                            <button className="w-full bg-indigo-600 text-white rounded-xl py-2.5 text-xs font-semibold">
                              Send Private Feedback →
                            </button>
                          </>
                        )}
                      </div>

                      <div className="flex justify-center gap-1.5 pt-1">
                        {(["ask", "positive", "negative"] as const).map((s, i) => (
                          <div
                            key={i}
                            className={`h-1 rounded-full transition-all duration-500 ${
                              phoneState === s ? "w-5 bg-violet-500" : "w-1 bg-zinc-800"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating badges — no backdrop-blur (expensive), solid bg instead */}
                <div className="absolute -right-16 top-16 float-badge bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl px-3.5 py-2.5 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                    <Star className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-none">New 5★ Review!</p>
                    <p className="text-[10px] text-zinc-500 leading-none mt-0.5">just now</p>
                  </div>
                </div>
                <div className="absolute -left-16 bottom-24 float-badge-slow bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl px-3.5 py-2.5 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-violet-500/15 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-3 h-3 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-none">Intercepted</p>
                    <p className="text-[10px] text-zinc-500 leading-none mt-0.5">Private inbox</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section className="py-36" style={{ background: "var(--bg-surface)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-20 reveal">
            <p className="text-violet-400 font-bold text-xs uppercase tracking-widest mb-4">
              Features
            </p>
            <h2
              className="text-4xl md:text-5xl font-black leading-tight mb-5"
              style={{ color: "var(--text-primary)" }}
            >
              Everything you need.<br />Nothing you don't.
            </h2>
            <p
              className="text-lg leading-relaxed max-w-md"
              style={{ color: "var(--text-secondary)" }}
            >
              Repute is a complete reputation management system — not just a messaging tool.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => {
              const FIcon = f.icon;
              return (
                <div
                  key={f.title}
                  className="reveal group rounded-2xl border p-7 transition-all duration-300 hover:scale-[1.01]"
                  style={{
                    background: "var(--bg-surface-2)",
                    borderColor: "var(--border-subtle)",
                    animationDelay: `${(i % 3) * 100}ms`,
                  }}
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-6`}
                  >
                    <FIcon className={`w-5 h-5 ${f.color}`} />
                  </div>
                  <h3
                    className="font-bold text-base mb-3"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {f.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="py-36" style={{ background: "var(--bg-base)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-20 reveal">
            <p className="text-amber-400 font-bold text-xs uppercase tracking-widest mb-4">
              Results
            </p>
            <h2
              className="text-4xl md:text-5xl font-black leading-tight mb-5"
              style={{ color: "var(--text-primary)" }}
            >
              Real businesses.<br />Real results.
            </h2>
            <p
              className="text-lg leading-relaxed max-w-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              Measurable improvements within the first 30 days — every time.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className="reveal rounded-3xl border p-7 flex flex-col gap-5 transition-all duration-300"
                style={{
                  background: "var(--bg-surface)",
                  borderColor: "var(--border-subtle)",
                  animationDelay: `${i * 150}ms`,
                }}
              >
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className={`self-start text-xs font-bold px-3 py-1 rounded-full ${t.badgeColor}`}>
                  {t.badge}
                </span>
                <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--text-secondary)" }}>
                  "{t.quote}"
                </p>
                <div
                  className="flex items-center gap-3 pt-4 border-t"
                  style={{ borderColor: "var(--border-subtle)" }}
                >
                  <div
                    className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.grad} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-bold text-xs" style={{ color: "var(--text-primary)" }}>
                      {t.name}
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {t.role}
                    </p>
                  </div>
                  <BadgeCheck className="w-4 h-4 text-sky-400 ml-auto flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PRICING ══ */}
      <section className="py-36" style={{ background: "var(--bg-surface)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20 reveal">
            <p className="text-indigo-400 font-bold text-xs uppercase tracking-widest mb-4">
              Pricing
            </p>
            <h2
              className="text-4xl md:text-5xl font-black leading-tight mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Simple, honest pricing.
            </h2>
            <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
              14-day free trial. No credit card. Cancel anytime.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
            {PLANS.map((plan, i) => (
              <div
                key={plan.name}
                className="reveal relative flex flex-col rounded-3xl p-7 border transition-all"
                style={{
                  background: "var(--bg-surface-2)",
                  borderColor: plan.highlight ? "rgba(139,92,246,0.5)" : "var(--border-subtle)",
                  boxShadow: plan.highlight ? "0 0 60px rgba(139,92,246,0.12)" : "none",
                  animationDelay: `${i * 100}ms`,
                }}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-violet-500 to-indigo-600 text-white text-[10px] font-black rounded-full px-4 py-1.5 whitespace-nowrap shadow-lg">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                <div className="mb-7">
                  <p className="font-bold text-base mb-1" style={{ color: "var(--text-primary)" }}>
                    {plan.name}
                  </p>
                  <div className="flex items-end gap-1 mb-2">
                    <span className="text-4xl font-black" style={{ color: "var(--text-primary)" }}>
                      ${plan.price}
                    </span>
                    <span className="text-sm mb-1.5" style={{ color: "var(--text-muted)" }}>
                      /mo
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {plan.desc}
                  </p>
                </div>
                <ul className="space-y-3 mb-7 flex-1">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle2
                        className={`w-4 h-4 flex-shrink-0 ${
                          plan.highlight ? "text-violet-400" : "text-zinc-600"
                        }`}
                      />
                      <span style={{ color: "var(--text-secondary)" }}>{feat}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setView("signup")}
                  className="w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                  style={
                    plan.highlight
                      ? {
                          background: "linear-gradient(to right, #8b5cf6, #6366f1)",
                          color: "#fff",
                          boxShadow: "0 10px 30px rgba(139,92,246,0.25)",
                        }
                      : {
                          background: "var(--bg-surface-3)",
                          border: "1px solid var(--border-medium)",
                          color: "var(--text-primary)",
                        }
                  }
                >
                  {plan.cta} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section className="py-36" style={{ background: "var(--bg-base)" }}>
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-16 reveal">
            <h2
              className="text-4xl md:text-5xl font-black mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Questions?
            </h2>
            <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
              Everything you need to know about Repute.
            </p>
          </div>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="reveal rounded-2xl border overflow-hidden transition-all duration-300"
                style={{
                  background: activeFaq === i ? "rgba(124,58,237,0.05)" : "var(--bg-surface)",
                  borderColor: activeFaq === i ? "rgba(124,58,237,0.3)" : "var(--border-subtle)",
                  animationDelay: `${i * 75}ms`,
                }}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                >
                  <span
                    className="font-semibold text-sm leading-relaxed"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${
                      activeFaq === i ? "rotate-180 text-violet-400" : "text-zinc-600"
                    }`}
                  />
                </button>
                <div
                  className="overflow-hidden transition-all duration-400"
                  style={{ maxHeight: activeFaq === i ? "200px" : "0px" }}
                >
                  <div className="px-6 pb-6">
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section className="relative py-48 overflow-hidden bg-black">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: [
              "radial-gradient(70% 60% at 50% 60%, rgba(139,92,246,0.32) 0%, rgba(109,40,217,0.22) 30%, rgba(0,0,0,0.9) 70%)",
              "radial-gradient(55% 50% at 15% 10%, rgba(167,139,250,0.30) 0%, transparent 60%)",
              "radial-gradient(55% 45% at 85% 15%, rgba(99,102,241,0.25) 0%, transparent 55%)",
            ].join(","),
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-15 mix-blend-screen pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 80px), repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 80px)",
          }}
        />
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center reveal">
          <div className="flex justify-center gap-1 mb-8">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
            ))}
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-[1.05] mb-6">
            Your next 100 Google<br />
            <span className="shimmer-text">reviews are waiting.</span>
          </h2>
          <p className="text-white/50 text-lg leading-relaxed mb-12 max-w-lg mx-auto">
            Join 2,400+ businesses who've stopped leaving reviews on the table. Launch your first
            campaign free.
          </p>
          <button
            onClick={() => setView("signup")}
            className="group inline-flex items-center gap-3 px-10 py-4 rounded-full bg-white text-zinc-950 font-bold text-sm hover:bg-zinc-100 hover:scale-[1.02] transition-all duration-300 mb-10 shadow-2xl"
          >
            <Sparkles className="w-4 h-4" />
            Launch Your First Campaign — Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <div className="flex flex-wrap justify-center gap-x-7 gap-y-2">
            {[
              "No credit card required",
              "14-day free trial",
              "Setup in 10 minutes",
              "Cancel anytime",
            ].map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-xs text-white/30">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ NEWSLETTER ══ */}
      <section className="py-20" style={{ background: "var(--bg-surface)" }}>
        <div className="max-w-5xl mx-auto px-6 reveal">
          <NewsletterBlock setView={setView} />
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer
        className="border-t pt-20 pb-10"
        style={{ background: "var(--bg-base)", borderColor: "var(--border-subtle)" }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
            <div className="md:col-span-5">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                  <MessageSquareHeart className="w-4 h-4 text-white" />
                </div>
                <span className="font-black text-lg" style={{ color: "var(--text-primary)" }}>
                  Repute
                </span>
              </div>
              <p
                className="text-sm leading-relaxed mb-6 max-w-xs"
                style={{ color: "var(--text-muted)" }}
              >
                The reputation management platform that routes happy customers to Google and
                unhappy ones to your private inbox.
              </p>
              <div className="flex gap-2">
                {["Email", "SMS", "WhatsApp"].map((ch) => (
                  <span
                    key={ch}
                    className="text-xs rounded-full px-3 py-1 border"
                    style={{ color: "var(--text-muted)", borderColor: "var(--border-subtle)" }}
                  >
                    {ch}
                  </span>
                ))}
              </div>
            </div>
            <div className="md:col-span-3 md:col-start-7">
              <p className="font-bold text-xs uppercase tracking-widest mb-6" style={{ color: "var(--text-primary)" }}>
                Product
              </p>
              <ul className="space-y-3.5">
                {["How it Works", "Features", "Pricing", "Integrations", "API Docs"].map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm transition-colors hover:text-violet-400" style={{ color: "var(--text-muted)" }}>
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-2">
              <p className="font-bold text-xs uppercase tracking-widest mb-6" style={{ color: "var(--text-primary)" }}>
                Legal
              </p>
              <ul className="space-y-3.5">
                <li>
                  <button
                    onClick={() => setView("terms")}
                    className="text-sm transition-colors hover:text-violet-400 text-left"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setView("privacy")}
                    className="text-sm transition-colors hover:text-violet-400 text-left"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <a href="#" className="text-sm transition-colors hover:text-violet-400" style={{ color: "var(--text-muted)" }}>
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="mailto:legal@repute.app" className="text-sm transition-colors hover:text-violet-400" style={{ color: "var(--text-muted)" }}>
                    legal@repute.app
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div
            className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              © {new Date().getFullYear()} Repute, Inc. All rights reserved. · San Francisco, CA
            </p>
            <div className="flex items-center gap-5">
              <button onClick={() => setView("terms")} className="text-xs hover:text-violet-400 transition-colors" style={{ color: "var(--text-muted)" }}>
                Terms
              </button>
              <button onClick={() => setView("privacy")} className="text-xs hover:text-violet-400 transition-colors" style={{ color: "var(--text-muted)" }}>
                Privacy
              </button>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                Turning every visit into a 5-star story.
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
