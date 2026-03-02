import { useEffect, useRef, useState } from "react";
import CubeLoader from "./ui/cube-loader";
import { ReputeLogo } from "./ui/repute-logo";
import { useTheme } from "../context/ThemeContext";
import { AppView } from "../types";

const VIEW_LABELS: Record<AppView, { label: string; sub: string }> = {
  landing:           { label: "Home",       sub: "Going to landing page…"      },
  dashboard:         { label: "Dashboard",  sub: "Loading your workspace…"     },
  "new-campaign":    { label: "Campaign",   sub: "Setting up new campaign…"    },
  "campaign-detail": { label: "Campaign",   sub: "Opening campaign details…"   },
  login:             { label: "Sign In",    sub: "Preparing sign in…"          },
  signup:            { label: "Sign Up",    sub: "Preparing sign up…"          },
  demo:              { label: "Demo",       sub: "Loading live demo…"          },
  terms:             { label: "Legal",      sub: "Loading Terms of Service…"   },
  privacy:           { label: "Privacy",    sub: "Loading Privacy Policy…"     },
};

interface PageLoaderProps {
  targetView: AppView;
  visible: boolean;
  onDone: () => void;
}

export function PageLoader({ targetView, visible, onDone }: PageLoaderProps) {
  const { isDark } = useTheme();
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [opacity, setOpacity] = useState(0);

  // Use window.setTimeout/requestAnimationFrame to get plain number IDs
  const rafId = useRef(0);
  const t1 = useRef(0);
  const t2 = useRef(0);
  const t3 = useRef(0);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const info = VIEW_LABELS[targetView] ?? { label: "Loading", sub: "Please wait…" };

  useEffect(() => {
    // Clean up everything from previous run
    window.cancelAnimationFrame(rafId.current);
    window.clearTimeout(t1.current);
    window.clearTimeout(t2.current);
    window.clearTimeout(t3.current);

    if (!visible) {
      // Externally dismissed — fade out and unmount
      setOpacity(0);
      t1.current = window.setTimeout(() => setMounted(false), 400);
      return;
    }

    // --- SHOW PATH ---
    setMounted(true);
    setProgress(0);
    setOpacity(0);

    // Fade in after first paint
    t1.current = window.setTimeout(() => setOpacity(1), 16);

    // Animate progress 0 → 90 over 700ms
    const startTime = Date.now();
    const HOLD_MS = 700;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / HOLD_MS) * 90, 90);
      setProgress(pct);

      if (elapsed < HOLD_MS) {
        rafId.current = window.requestAnimationFrame(tick);
      } else {
        // Snap to 100
        setProgress(100);
        // Short pause, then fade out
        t2.current = window.setTimeout(() => {
          setOpacity(0);
          // After fade-out, unmount + notify
          t3.current = window.setTimeout(() => {
            setMounted(false);
            onDoneRef.current();
          }, 380);
        }, 100);
      }
    };

    rafId.current = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId.current);
      window.clearTimeout(t1.current);
      window.clearTimeout(t2.current);
      window.clearTimeout(t3.current);
    };
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity,
        transition: "opacity 0.35s cubic-bezier(0.16,1,0.3,1)",
        pointerEvents: "none",
        background: isDark ? "rgba(3,3,5,0.96)" : "rgba(244,244,248,0.96)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      {/* Ambient violet orbs */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{
          position: "absolute",
          top: "25%", left: "40%",
          width: "38vw", height: "38vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(109,40,217,0.18) 0%, transparent 65%)",
          filter: "blur(55px)",
          transform: "translate(-50%,-50%)",
        }} />
        <div style={{
          position: "absolute",
          bottom: "20%", right: "22%",
          width: "28vw", height: "28vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 65%)",
          filter: "blur(45px)",
        }} />
      </div>

      {/* Logo */}
      <div style={{
        position: "absolute",
        top: 28,
        left: "50%",
        transform: "translateX(-50%)",
        opacity: 0.65,
      }}>
        <ReputeLogo
          variant={isDark ? "light" : "dark"}
          iconClassName="w-6 h-6"
          textClassName="text-lg"
        />
      </div>

      {/* Cube */}
      <CubeLoader
        size="lg"
        showText={true}
        label={info.label}
        sublabel={info.sub}
      />

      {/* Progress bar */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: 3,
        background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}>
        <div style={{
          height: "100%",
          width: `${progress}%`,
          background: "linear-gradient(90deg, #6d28d9, #7c3aed, #8b5cf6, #a78bfa)",
          transition: "width 0.12s linear",
          boxShadow: "0 0 10px rgba(139,92,246,0.7)",
          borderRadius: "0 2px 2px 0",
        }} />
      </div>
    </div>
  );
}
