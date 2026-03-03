import { useState, useEffect, ChangeEvent } from "react";
import {
  Star, Shield, TrendingUp, Mail, MessageSquare,
  CheckCircle2, ArrowLeft, Bell,
} from "lucide-react";
import { AppView } from "../types";
import { ReputeLogo } from "@/components/ui/repute-logo";
import {
  AnimatedForm, TechOrbitDisplay, Ripple, IconConfig, Field,
} from "@/components/ui/modern-animated-sign-in";
import {
  sanitizeEmail, sanitizeName, sanitizeBusinessName, enforceMaxLength,
  validateEmail, validatePassword, validateName, validateBusinessName,
} from "../utils/sanitize";
import { useRateLimit } from "../hooks/useRateLimit";

interface AuthPageProps {
  mode: "login" | "signup";
  setView: (v: AppView) => void;
  onAuth: (name: string, email?: string, business?: string) => void;
}

/* ── Orbit icons — sky blue + red brand palette, zero purple ── */
const orbitIcons: IconConfig[] = [
  {
    component: () => (
      <div className="w-10 h-10 rounded-2xl bg-red-500/15 border border-red-500/25 flex items-center justify-center">
        <Star className="w-5 h-5 text-red-400 fill-red-400/80" />
      </div>
    ),
    className: "size-10 border-none bg-transparent", duration: 32, delay: 0, radius: 120, path: true, reverse: false,
  },
  {
    component: () => (
      <div className="w-10 h-10 rounded-2xl bg-sky-500/15 border border-sky-500/25 flex items-center justify-center">
        <CheckCircle2 className="w-5 h-5 text-sky-400" />
      </div>
    ),
    className: "size-10 border-none bg-transparent", duration: 32, delay: 16, radius: 120, path: false, reverse: false,
  },
  {
    component: () => (
      <div className="w-11 h-11 rounded-2xl bg-sky-500/15 border border-sky-500/25 flex items-center justify-center">
        <Shield className="w-5 h-5 text-sky-400" />
      </div>
    ),
    className: "size-11 border-none bg-transparent", duration: 44, delay: 0, radius: 200, path: true, reverse: true,
  },
  {
    component: () => (
      <div className="w-11 h-11 rounded-2xl bg-sky-400/15 border border-sky-400/25 flex items-center justify-center">
        <Mail className="w-5 h-5 text-sky-300" />
      </div>
    ),
    className: "size-11 border-none bg-transparent", duration: 44, delay: 14, radius: 200, path: false, reverse: true,
  },
  {
    component: () => (
      <div className="w-11 h-11 rounded-2xl bg-red-500/15 border border-red-500/25 flex items-center justify-center">
        <TrendingUp className="w-5 h-5 text-red-400" />
      </div>
    ),
    className: "size-11 border-none bg-transparent", duration: 44, delay: 28, radius: 200, path: false, reverse: true,
  },
  {
    component: () => (
      <div className="w-10 h-10 rounded-2xl bg-sky-500/15 border border-sky-500/25 flex items-center justify-center">
        <MessageSquare className="w-5 h-5 text-sky-400" />
      </div>
    ),
    className: "size-10 border-none bg-transparent", duration: 44, delay: 40, radius: 200, path: false, reverse: true,
  },
];

const STATS = [
  { value: "2,400+", label: "Businesses" },
  { value: "480K",   label: "Reviews Sent" },
  { value: "94%",    label: "Positive Rate" },
];

const TRUST_BADGES = [
  "No credit card required",
  "14-day free trial",
  "Cancel anytime",
  "GDPR compliant",
];

const AVATAR_INITIALS = ["MR", "JO", "SC", "DK", "AL"];
const AVATAR_COLORS   = ["#0ea5e9", "#38bdf8", "#059669", "#d97706", "#e11d48"];

export function AuthPage({ mode, setView, onAuth }: AuthPageProps) {
  const [isLogin, setIsLogin]       = useState(mode === "login");
  const [loading, setLoading]       = useState(false);
  const [mounted, setMounted]       = useState(false);
  const [newsletter, setNewsletter] = useState(true);
  const [agreedToTerms, setAgreedToTerms]     = useState(false);
  const [termsError, setTermsError]           = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [formData, setFormData]     = useState({ name: "", business: "", email: "", password: "" });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const loginRL  = useRateLimit("login");
  const signupRL = useRateLimit("signup");
  const nlRL     = useRateLimit("newsletter");

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const switchMode = (toLogin: boolean) => {
    setIsLogin(toLogin);
    setFormData({ name: "", business: "", email: "", password: "" });
    setTermsError(false);
    setAgreedToTerms(false);
    setNewsletter(true);
    setValidationErrors({});
    loginRL.clearError();
    signupRL.clearError();
  };

  const handleInput = (key: keyof typeof formData) => (e: ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (key === "email")    val = sanitizeEmail(val);
    if (key === "name")     val = sanitizeName(enforceMaxLength(val, 80));
    if (key === "business") val = sanitizeBusinessName(enforceMaxLength(val, 100));
    if (key === "password") val = enforceMaxLength(val, 128);
    setFormData((prev) => ({ ...prev, [key]: val }));
    if (validationErrors[key]) setValidationErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const rl = isLogin ? loginRL : signupRL;
    if (!rl.attempt()) return;
    if (!isLogin && !agreedToTerms) { setTermsError(true); return; }
    setTermsError(false);

    const errs: Record<string, string> = {};
    const emailV = validateEmail(formData.email);
    if (!emailV.valid) errs["Email"] = emailV.error!;
    const passV = validatePassword(formData.password);
    if (!passV.valid) errs["Password"] = passV.error!;
    if (!isLogin) {
      const nameV = validateName(formData.name);
      if (!nameV.valid) errs["Full Name"] = nameV.error!;
      const bizV = validateBusinessName(formData.business);
      if (!bizV.valid) errs["Business Name"] = bizV.error!;
    }
    if (Object.keys(errs).length > 0) { setValidationErrors(errs); return; }
    setValidationErrors({});

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    if (isLogin) loginRL.reset(); else signupRL.reset();

    const displayName = isLogin
      ? formData.email.split("@")[0]
      : formData.name.split(" ")[0] || "User";
    onAuth(displayName, formData.email, formData.business);
    setView("dashboard");
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    const emailV = validateEmail(sanitizeEmail(newsletterEmail));
    if (!emailV.valid) return;
    if (!nlRL.attempt()) return;
    await new Promise((r) => setTimeout(r, 800));
    nlRL.reset();
    setNewsletterSuccess(true);
    setNewsletterEmail("");
  };

  const loginFields: Field[] = [
    { label: "Email",    required: true, type: "email",    placeholder: "you@business.com", onChange: handleInput("email") },
    { label: "Password", required: true, type: "password", placeholder: "Your password",    onChange: handleInput("password") },
  ];

  const signupFields: Field[] = [
    { label: "Full Name",     required: true, type: "text",     placeholder: "Maria Garcia",      onChange: handleInput("name") },
    { label: "Business Name", required: true, type: "text",     placeholder: "Grand Palms Hotel", onChange: handleInput("business") },
    { label: "Email",         required: true, type: "email",    placeholder: "you@business.com",  onChange: handleInput("email") },
    { label: "Password",      required: true, type: "password", placeholder: "Min. 6 characters", onChange: handleInput("password") },
  ];

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: "#050810" }}>

      {/* ═══════════════ LEFT PANEL — Orbit ═══════════════ */}
      <div
        className="hidden lg:flex relative flex-col w-[52%] min-h-screen overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #050810 0%, #07091a 50%, #040610 100%)",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateX(0)" : "translateX(-30px)",
          transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{
            background: [
              "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(14,165,233,0.12) 0%, transparent 60%)",
              "radial-gradient(ellipse 40% 35% at 20% 75%, rgba(56,189,248,0.08) 0%, transparent 55%)",
              "radial-gradient(ellipse 35% 30% at 80% 15%, rgba(14,165,233,0.06) 0%, transparent 55%)",
            ].join(","),
          }} />
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
          }} />
        </div>

        <Ripple mainCircleSize={110} mainCircleOpacity={0.12} numCircles={8} />

        <div className="relative z-10 flex flex-1 flex-col h-full">
          <TechOrbitDisplay
            iconsArray={orbitIcons}
            centerContent={
              <div className="flex flex-col items-center gap-4">
                <ReputeLogo iconClassName="scale-110" textClassName="text-[1.35rem] font-black" />
                <p className="text-zinc-600 text-[0.72rem] text-center max-w-[170px] leading-relaxed tracking-wide uppercase font-semibold">
                  Automated reputation<br />management
                </p>
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-500/20 bg-sky-500/[0.08]">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sky-400" />
                  </span>
                  <span className="text-[10px] font-bold text-sky-400 tracking-widest uppercase">
                    Live · 2,400+ businesses
                  </span>
                </div>
              </div>
            }
          />
        </div>

        {/* Stats bar */}
        <div
          className="relative z-20 flex items-center justify-around px-10 py-5 border-t border-white/[0.035]"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)",
            backdropFilter: "blur(8px)",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease 0.55s, transform 0.6s ease 0.55s",
          }}
        >
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-lg font-black text-white leading-none">{s.value}</div>
              <div className="text-[9px] text-zinc-600 uppercase tracking-[0.15em] font-semibold mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#050810] to-transparent pointer-events-none z-30" />
      </div>

      {/* ═══════════════ RIGHT PANEL — Form ═══════════════ */}
      <div
        className="relative flex flex-col w-full lg:w-[48%] min-h-screen overflow-y-auto"
        style={{
          background: "#050810",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateX(0)" : "translateX(30px)",
          transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.08s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.08s",
        }}
      >
        {/* Ambient glows — sky blue */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 opacity-25"
            style={{ background: "radial-gradient(ellipse at top right, rgba(14,165,233,0.15) 0%, transparent 65%)" }} />
          <div className="absolute bottom-0 left-0 w-72 h-72 opacity-15"
            style={{ background: "radial-gradient(ellipse at bottom left, rgba(56,189,248,0.10) 0%, transparent 65%)" }} />
        </div>

        <div className="relative flex flex-col flex-1 px-8 sm:px-12 lg:px-14 xl:px-16 py-10">

          {/* Top bar */}
          <div className="flex items-center justify-between mb-12">
            <div className="lg:hidden"><ReputeLogo /></div>
            <div className="hidden lg:block" />
            <button
              onClick={() => setView("landing")}
              className="flex items-center gap-1.5 text-zinc-700 hover:text-zinc-300 text-xs font-medium tracking-wide transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Back
            </button>
          </div>

          {/* Mode toggle */}
          <div className="mb-10">
            <div className="inline-flex gap-0.5 p-1 bg-white/[0.03] border border-white/[0.05] rounded-2xl">
              {(["Sign In", "Sign Up"] as const).map((label, i) => {
                const active = i === 0 ? isLogin : !isLogin;
                return (
                  <button
                    key={label}
                    onClick={() => switchMode(i === 0)}
                    style={{ transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)" }}
                    className={`px-7 py-2.5 rounded-xl text-sm font-bold ${
                      active
                        ? "bg-white text-zinc-900 shadow-lg shadow-black/30 scale-[1.02]"
                        : "text-zinc-600 hover:text-zinc-400"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rate limit / validation errors */}
          {(loginRL.error || signupRL.error) && (
            <div className="max-w-md w-full mb-4 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-[9px] font-black">!</span>
              </div>
              <p className="text-red-400 text-xs leading-relaxed">{loginRL.error || signupRL.error}</p>
            </div>
          )}
          {Object.keys(validationErrors).length > 0 && (
            <div className="max-w-md w-full mb-4 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-[9px] font-black">!</span>
              </div>
              <div className="text-red-400 text-xs leading-relaxed">
                {Object.values(validationErrors).map((err, i) => <p key={i}>{err}</p>)}
              </div>
            </div>
          )}

          {/* Animated form */}
          <div className="max-w-md w-full" key={isLogin ? "login-form" : "signup-form"}>
            <AnimatedForm
              header={isLogin ? "Welcome back." : "Start for free."}
              subHeader={
                isLogin
                  ? "Sign in to your Repute dashboard."
                  : "Join 2,400+ businesses automating their Google reviews."
              }
              fields={isLogin ? loginFields : signupFields}
              fieldPerRow={!isLogin ? 2 : 1}
              submitButton={isLogin ? "Sign In to Dashboard" : "Create Free Account"}
              googleLogin={isLogin ? "Continue with Google" : undefined}
              textVariantButton={isLogin ? "Forgot password?" : undefined}
              altActionLabel={isLogin ? "Don't have an account?" : "Already have an account?"}
              altActionButton={isLogin ? "Sign up free →" : "Sign in →"}
              onAltAction={() => switchMode(!isLogin)}
              onSubmit={handleSubmit}
              isLoading={loading}
            />

            {/* Newsletter opt-in */}
            {!isLogin && (
              <div className="mt-4 flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => setNewsletter(!newsletter)}
                  className={`relative mt-0.5 flex-shrink-0 w-4 h-4 rounded border transition-all ${
                    newsletter ? "bg-sky-500 border-sky-500" : "border-zinc-700 bg-transparent"
                  }`}
                >
                  {newsletter && (
                    <svg className="w-2.5 h-2.5 text-white absolute inset-0 m-auto" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
                <label className="text-xs text-zinc-600 leading-relaxed cursor-pointer" onClick={() => setNewsletter(!newsletter)}>
                  <Bell className="w-3 h-3 text-sky-400 inline mr-1 mb-0.5" />
                  Send me Repute product updates, tips, and industry insights.{" "}
                  <span className="text-zinc-700">Unsubscribe anytime.</span>
                </label>
              </div>
            )}

            {/* Terms agreement */}
            {!isLogin && (
              <div className="mt-3">
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => { setAgreedToTerms(!agreedToTerms); setTermsError(false); }}
                    className={`relative mt-0.5 flex-shrink-0 w-4 h-4 rounded border transition-all ${
                      agreedToTerms
                        ? "bg-sky-500 border-sky-500"
                        : termsError
                          ? "border-red-500 bg-transparent"
                          : "border-zinc-700 bg-transparent"
                    }`}
                  >
                    {agreedToTerms && (
                      <svg className="w-2.5 h-2.5 text-white absolute inset-0 m-auto" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    By creating an account, you agree to our{" "}
                    <button type="button" onClick={() => setView("terms")}
                      className="text-sky-400 hover:text-sky-300 underline underline-offset-2 transition-colors">
                      Terms of Service
                    </button>{" "}and{" "}
                    <button type="button" onClick={() => setView("privacy")}
                      className="text-sky-400 hover:text-sky-300 underline underline-offset-2 transition-colors">
                      Privacy Policy
                    </button>.
                  </p>
                </div>
                {termsError && (
                  <p className="text-red-400 text-xs mt-1.5 ml-7">Please agree to the Terms of Service to continue.</p>
                )}
              </div>
            )}
          </div>

          {/* Trust badges (sign up) */}
          {!isLogin && (
            <div className="mt-10 pt-8 border-t border-white/[0.04] max-w-md"
              style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.5s ease 1s" }}>
              <div className="flex flex-wrap gap-x-5 gap-y-2.5 mb-6">
                {TRUST_BADGES.map((t) => (
                  <span key={t} className="flex items-center gap-1.5 text-xs text-zinc-600">
                    <CheckCircle2 className="w-3 h-3 text-sky-500 flex-shrink-0" />{t}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3.5">
                <div className="flex">
                  {AVATAR_INITIALS.map((init, i) => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-[#050810] flex items-center justify-center text-[9px] font-black text-white"
                      style={{ marginLeft: i === 0 ? 0 : -9, background: AVATAR_COLORS[i], zIndex: 5 - i }}>
                      {init}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5 mb-1">
                    {[1,2,3,4,5].map((s) => <Star key={s} className="w-2.5 h-2.5 text-red-400 fill-red-400" />)}
                  </div>
                  <p className="text-zinc-600 text-[11px]">Loved by 2,400+ businesses worldwide</p>
                </div>
              </div>
            </div>
          )}

          {/* Login social proof */}
          {isLogin && (
            <div className="mt-10 max-w-md"
              style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.5s ease 1s" }}>
              <div className="flex items-center gap-3 p-4 rounded-2xl border border-white/[0.04] bg-white/[0.01]">
                <div className="flex">
                  {AVATAR_INITIALS.slice(0, 3).map((init, i) => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-[#050810] flex items-center justify-center text-[8px] font-black text-white"
                      style={{ marginLeft: i === 0 ? 0 : -7, background: AVATAR_COLORS[i] }}>
                      {init}
                    </div>
                  ))}
                </div>
                <p className="text-zinc-600 text-xs leading-relaxed">
                  <span className="text-zinc-400 font-semibold">2,400+ businesses</span> are automating
                  their Google reviews with Repute right now.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <button onClick={() => setView("terms")} className="text-[11px] text-zinc-700 hover:text-zinc-400 transition-colors underline-offset-2 hover:underline">Terms of Service</button>
                <span className="text-zinc-800">·</span>
                <button onClick={() => setView("privacy")} className="text-[11px] text-zinc-700 hover:text-zinc-400 transition-colors underline-offset-2 hover:underline">Privacy Policy</button>
                <span className="text-zinc-800">·</span>
                <span className="text-[11px] text-zinc-800">© 2025 Repute, Inc.</span>
              </div>
            </div>
          )}

          {/* Newsletter block */}
          <div className="mt-12 max-w-md"
            style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.5s ease 1.2s" }}>
            <div className="p-5 rounded-2xl border border-white/[0.05] bg-white/[0.02]">
              <div className="flex items-center gap-2 mb-3">
                <Bell className="w-4 h-4 text-sky-400" />
                <p className="text-sm font-bold text-white">Stay in the loop</p>
              </div>
              <p className="text-xs text-zinc-600 mb-4 leading-relaxed">
                Get monthly tips on reputation management, Google review strategies, and Repute product updates. No spam, ever.
              </p>
              {newsletterSuccess ? (
                <div className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-sky-500/10 border border-sky-500/20">
                  <CheckCircle2 className="w-4 h-4 text-sky-400" />
                  <p className="text-xs font-semibold text-sky-400">You're subscribed! We'll be in touch.</p>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-sky-500/50 transition-colors"
                  />
                  <button type="submit"
                    className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition-colors flex-shrink-0">
                    Subscribe
                  </button>
                </form>
              )}
              <p className="text-[10px] text-zinc-800 mt-3">
                By subscribing you agree to our{" "}
                <button type="button" onClick={() => setView("privacy")} className="text-zinc-600 hover:text-zinc-400 underline underline-offset-2">Privacy Policy</button>.
                Unsubscribe anytime.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
