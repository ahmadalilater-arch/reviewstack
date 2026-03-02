import { useState, useCallback } from "react";
import { Toaster } from "react-hot-toast";
import { Navbar } from "./components/Navbar";
import { LandingPage } from "./components/LandingPage";
import { AuthPage } from "./components/AuthPage";
import { NewCampaign } from "./components/NewCampaign";
import Dashboard from "./components/Dashboard";
import { CampaignDetail } from "./components/CampaignDetail";
import { DemoPage } from "./components/DemoPage";
import { TermsOfService } from "./components/TermsOfService";
import { PrivacyPolicy } from "./components/PrivacyPolicy";
import { PageLoader } from "./components/PageLoader";
import { Campaign, AppView } from "./types";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

/* ── Dark global bg — "Midnight Deep" ────────────────────── */
function DarkGlobalBg() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#0E0F14" }}>
      {/* Top-center — rose/pink bloom matching hero waves */}
      <div style={{
        position: "absolute",
        top: "-20%", left: "20%",
        width: "65vw", height: "65vw",
        maxWidth: 860, maxHeight: 860,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(244,63,94,0.14) 0%, rgba(251,113,133,0.07) 45%, transparent 70%)",
        filter: "blur(70px)",
        animation: "bgOrb1 22s ease-in-out infinite",
        pointerEvents: "none",
      }} />
      {/* Bottom-right — sky blue depth */}
      <div style={{
        position: "absolute",
        bottom: "-12%", right: "-8%",
        width: "52vw", height: "52vw",
        maxWidth: 680, maxHeight: 680,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(14,165,233,0.12) 0%, rgba(56,189,248,0.06) 50%, transparent 70%)",
        filter: "blur(65px)",
        animation: "bgOrb2 28s ease-in-out infinite",
        pointerEvents: "none",
      }} />
      {/* Bottom-left — warm amber accent */}
      <div style={{
        position: "absolute",
        bottom: "8%", left: "-10%",
        width: "42vw", height: "42vw",
        maxWidth: 560, maxHeight: 560,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 65%)",
        filter: "blur(55px)",
        animation: "bgOrb3 32s ease-in-out infinite",
        pointerEvents: "none",
      }} />
      {/* Subtle dot grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.018) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
        pointerEvents: "none",
      }} />
    </div>
  );
}

/* ── Light mode bg — "Soft Bone" ──────────────────────────── */
function LightGlobalBg() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#F7F6F3" }}>
      {/* Warm rose bloom top */}
      <div style={{
        position: "absolute",
        top: "-10%", left: "25%",
        width: "60vw", height: "60vw",
        maxWidth: 780, maxHeight: 780,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(253,164,175,0.22) 0%, rgba(249,168,212,0.10) 50%, transparent 70%)",
        filter: "blur(60px)",
        animation: "bgOrb1 22s ease-in-out infinite",
        pointerEvents: "none",
      }} />
      {/* Sky blue cool bottom-right */}
      <div style={{
        position: "absolute",
        bottom: "-5%", right: "-5%",
        width: "45vw", height: "45vw",
        maxWidth: 580, maxHeight: 580,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(14,165,233,0.10) 0%, transparent 65%)",
        filter: "blur(50px)",
        animation: "bgOrb2 28s ease-in-out infinite",
        pointerEvents: "none",
      }} />
      {/* Subtle warm grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, rgba(13,17,23,0.04) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
        pointerEvents: "none",
      }} />
    </div>
  );
}

/* ── Views that NEVER show the loader ────────────────────── */
const SKIP_LOADER: AppView[] = ["login", "signup", "terms", "privacy", "demo"];

/* ── Only show loader for genuinely heavy cross-context jumps */
function needsLoader(from: AppView, to: AppView): boolean {
  if (SKIP_LOADER.includes(from) || SKIP_LOADER.includes(to)) return false;
  // Same-area navigation: no loader
  const dashboardArea: AppView[] = ["dashboard", "new-campaign", "campaign-detail"];
  const fromDash = dashboardArea.includes(from);
  const toDash   = dashboardArea.includes(to);
  // landing → dashboard area OR dashboard area → landing
  if (!fromDash && toDash) return true;
  if (fromDash && !toDash) return true;
  // Within dashboard area: no loader (sidebar tabs are instant)
  return false;
}

/* ── Animated page content wrapper ───────────────────────── */
const viewOrder: AppView[] = [
  "landing", "terms", "privacy", "demo", "login", "signup",
  "dashboard", "new-campaign", "campaign-detail",
];

function AnimatedView({
  viewKey, prevView, children,
}: {
  viewKey: AppView; prevView: AppView | null; children: React.ReactNode;
}) {
  const isAuth = viewKey === "login" || viewKey === "signup";
  const wasAuth = prevView === "login" || prevView === "signup";
  const isLegal = viewKey === "terms" || viewKey === "privacy";
  const currIdx = viewOrder.indexOf(viewKey);
  const prevIdx = prevView ? viewOrder.indexOf(prevView) : -1;

  let animClass = "page-enter";
  if (isAuth || wasAuth || isLegal) animClass = "page-fade";
  else if (prevIdx >= 0 && currIdx > prevIdx) animClass = "page-enter-right";
  else if (prevIdx >= 0 && currIdx < prevIdx) animClass = "page-enter-left";

  return (
    <div key={viewKey} className={animClass} style={{ willChange: "transform, opacity" }}>
      {children}
    </div>
  );
}

/* ── Inner App ────────────────────────────────────────────── */
function AppInner() {
  const { isDark } = useTheme();

  // Current displayed view
  const [view, setView] = useState<AppView>("landing");
  const [prevView, setPrevView] = useState<AppView | null>(null);

  // Loader state
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [loaderTarget, setLoaderTarget] = useState<AppView>("landing");
  const [pendingView, setPendingView] = useState<AppView | null>(null);

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null);
  const [user, setUser] = useState<{ name: string; email: string; business: string } | null>(null);

  const isAuthed = !!user;

  /** Navigate to a new view — shows PageLoader only for heavy transitions */
  const navigateTo = useCallback((next: AppView, skipLoader = false) => {
    if (next === view) return;

    const shouldLoad = !skipLoader && needsLoader(view, next);

    if (!shouldLoad) {
      setPrevView(view);
      setView(next);
      return;
    }

    // Show loader → swap view when loader finishes
    setLoaderTarget(next);
    setPendingView(next);
    setLoaderVisible(true);
  }, [view]);

  /** Called by PageLoader when its animation finishes */
  const handleLoaderDone = useCallback(() => {
    setLoaderVisible(false);
    if (pendingView) {
      setPrevView(view);
      setView(pendingView);
      setPendingView(null);
    }
  }, [pendingView, view]);

  const guardedSetView = useCallback((v: AppView) => {
    const protectedViews: AppView[] = ["dashboard", "new-campaign", "campaign-detail"];
    if (protectedViews.includes(v) && !isAuthed) {
      navigateTo("signup");
      return;
    }
    navigateTo(v);
  }, [isAuthed, navigateTo]);

  const handleCampaignCreate = (campaign: Campaign) => {
    setCampaigns((prev) => [campaign, ...prev]);
  };

  const handleViewCampaign = (id: string) => {
    setActiveCampaignId(id);
    navigateTo("campaign-detail");
  };

  const handleUpdateCampaign = (updated: Campaign) => {
    setCampaigns((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleAuth = (name: string, email?: string, business?: string) => {
    setUser({ name, email: email ?? "", business: business ?? "" });
  };

  const handleSignOut = () => {
    setUser(null);
    navigateTo("landing", true);
  };

  const activeCampaign = campaigns.find((c) => c.id === activeCampaignId);
  const showNavbar = !["login", "signup", "terms", "privacy"].includes(view);

  // Auth pages navigate without loader
  const setViewFromAuth = (v: AppView) => navigateTo(v, true);

  const toastStyle = isDark
    ? { background: "#18181b", color: "#fff", border: "1px solid rgba(255,255,255,0.08)" }
    : { background: "#ffffff", color: "#09090b", border: "1px solid rgba(0,0,0,0.10)" };

  return (
    <div
      className="min-h-screen font-sans overflow-x-hidden relative"
      style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}
    >
      {/* ── GLOBAL ANIMATED BACKGROUND ──────────────────── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {isDark ? <DarkGlobalBg /> : <LightGlobalBg />}
      </div>

      {/* ── PAGE TRANSITION LOADER ───────────────────────── */}
      <PageLoader
        targetView={loaderTarget}
        visible={loaderVisible}
        onDone={handleLoaderDone}
      />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            ...toastStyle,
            borderRadius: "14px",
            fontSize: "13px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          },
          success: { iconTheme: { primary: "#38bdf8", secondary: isDark ? "#fff" : "#09090b" } },
          error:   { iconTheme: { primary: "#f87171", secondary: isDark ? "#fff" : "#09090b" } },
        }}
      />

      {showNavbar && (
        <div className="relative z-50">
          <Navbar
            view={view}
            setView={guardedSetView}
            campaignCount={campaigns.length}
            user={user}
            onSignOut={handleSignOut}
          />
        </div>
      )}

      <div className="relative z-10">
        <AnimatedView viewKey={view} prevView={prevView}>
          {view === "landing"   && <LandingPage setView={guardedSetView} />}
          {view === "terms"     && <TermsOfService setView={guardedSetView} />}
          {view === "privacy"   && <PrivacyPolicy setView={guardedSetView} />}
          {view === "demo"      && <DemoPage />}

          {(view === "login" || view === "signup") && (
            <AuthPage mode={view} setView={setViewFromAuth} onAuth={handleAuth} />
          )}

          {view === "dashboard" && isAuthed && (
            <Dashboard
              campaigns={campaigns}
              setView={guardedSetView}
              onViewCampaign={handleViewCampaign}
              user={user!}
            />
          )}

          {view === "new-campaign" && isAuthed && (
            <NewCampaign
              onCampaignCreate={handleCampaignCreate}
              onViewCampaign={(id) => {
                setPrevView("new-campaign");
                navigateTo("dashboard");
                setTimeout(() => handleViewCampaign(id), 900);
              }}
            />
          )}

          {view === "campaign-detail" && activeCampaign && isAuthed && (
            <CampaignDetail
              campaign={activeCampaign}
              onBack={() => guardedSetView("dashboard")}
              onUpdateCampaign={handleUpdateCampaign}
            />
          )}
        </AnimatedView>
      </div>
    </div>
  );
}

/* ── Root App ─────────────────────────────────────────────── */
export function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
