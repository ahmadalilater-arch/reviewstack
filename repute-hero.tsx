import { useState, useEffect, memo } from "react";
import { Star, Shield, TrendingUp } from "lucide-react";
import { WavyBackground } from "./wavy-background";
import { useTheme } from "../../context/ThemeContext";

interface ReputeHeroProps {
  onStart: () => void;
  onDemo?: () => void;
}

export const ReputeHero = memo(function ReputeHero({ onStart }: ReputeHeroProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    const t = setTimeout(() => setIsMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const fade = (delay: number): React.CSSProperties => ({
    opacity: isMounted ? 1 : 0,
    transform: isMounted ? "translateY(0)" : "translateY(22px)",
    transition: "opacity 0.7s ease, transform 0.7s ease",
    transitionDelay: `${delay}ms`,
  });

  // Wave colors — light pink + rose + warm gold — NO purple
  const waveColors = [
    "rgba(253, 164, 175, 0.85)",  // red-300   — soft pink
    "rgba(251, 113, 133, 0.80)",  // red-400   — warm pink
    "rgba(249, 168, 212, 0.75)",  // red-300   — light blush
    "rgba(254, 205, 211, 0.65)",  // red-200   — pale blush
    "rgba(251, 191, 36,  0.50)",  // red-400  — warm gold
  ];

  // Background fill adapts to theme
  const bgFill = isDark ? "rgba(14, 15, 20, 1)" : "rgba(247, 246, 243, 1)";

  // Headline gradient changes per theme
  const headlineGradient = isDark
    ? "linear-gradient(135deg, #fda4af 0%, #f9a8d4 35%, #ffffff 60%, #fecdd3 100%)"
    : "linear-gradient(135deg, #be123c 0%, #e11d48 35%, #9f1239 65%, #ef4444 100%)";

  // Overlay adapts to theme
  const overlayGradient = isDark
    ? [
        "radial-gradient(120% 55% at 50% 0%, rgba(14,15,20,0.85) 0%, transparent 60%)",
        "linear-gradient(to bottom, rgba(14,15,20,0.65) 0%, rgba(14,15,20,0.1) 40%, rgba(14,15,20,0.1) 60%, rgba(14,15,20,0.95) 100%)",
      ].join(",")
    : [
        "radial-gradient(120% 55% at 50% 0%, rgba(247,246,243,0.80) 0%, transparent 55%)",
        "linear-gradient(to bottom, rgba(247,246,243,0.60) 0%, rgba(247,246,243,0.05) 38%, rgba(247,246,243,0.05) 60%, rgba(247,246,243,0.92) 100%)",
      ].join(",");

  const textColor = isDark ? "text-white" : "text-[#0D1117]";
  const subTextColor = isDark ? "text-white/60" : "text-[#3D4350]";
  const accentTextColor = isDark ? "text-white/90" : "text-[#0D1117]";
  const badgeBg = isDark ? "bg-black/35 border-white/10" : "bg-white/60 border-red-200/60";
  const badgeText = isDark ? "text-white/70" : "text-red-900/80";
  const pillBg = isDark ? "bg-black/25 border-white/[0.09]" : "bg-white/50 border-red-200/50";
  const pillText = isDark ? "text-white/55" : "text-[#3D4350]";
  const secondaryBtnBg = isDark
    ? "border-white/15 bg-white/5 text-white/80 hover:bg-white/10 hover:border-white/25 hover:text-white"
    : "border-red-300/40 bg-white/50 text-red-900/80 hover:bg-white/80 hover:border-red-400/60 hover:text-red-900";

  return (
    <section
      className="relative isolate w-full h-screen overflow-hidden"
      style={{ contain: "layout paint" }}
    >
      {/* ── WavyBackground fills the entire hero ── */}
      <WavyBackground
        containerClassName="absolute inset-0 w-full h-full"
        colors={waveColors}
        backgroundFill={bgFill}
        blur={9}
        speed="slow"
        waveOpacity={isDark ? 0.48 : 0.55}
        waveWidth={52}
      />

      {/* ── Gradient overlays for readability ── */}
      <div
        aria-hidden
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: overlayGradient }}
      />

      {/* ── Center atmospheric bloom — sky/red ── */}
      <div
        aria-hidden
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: isDark
            ? "radial-gradient(55% 38% at 50% 52%, rgba(244,63,94,0.18) 0%, rgba(251,113,133,0.09) 45%, transparent 70%)"
            : "radial-gradient(55% 38% at 50% 52%, rgba(254,205,211,0.45) 0%, rgba(253,164,175,0.22) 45%, transparent 70%)",
        }}
      />

      {/* ── Hero content ── */}
      <div className={`relative z-10 flex flex-col items-center justify-center h-full px-6 text-center ${textColor}`}>

        {/* Eyebrow badge */}
        <div style={fade(80)} className="mb-8">
          <span className={`inline-flex items-center gap-2 rounded-full border ${badgeBg} ${badgeText} px-4 py-1.5 text-[11px] uppercase tracking-widest backdrop-blur-sm`}>
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sky-400" />
            </span>
            2,400+ businesses trust Repute
          </span>
        </div>

        {/* Headline */}
        <h1
          className="max-w-4xl text-5xl sm:text-6xl lg:text-7xl xl:text-[5.25rem] font-black tracking-tight leading-[1.02]"
          style={fade(200)}
        >
          Stop losing 5-star reviews
          <br />
          <span
            style={{
              background: headlineGradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            to silence.
          </span>
        </h1>

        {/* Sub-headline */}
        <p
          className={`mt-7 max-w-xl text-lg ${subTextColor} leading-relaxed`}
          style={fade(330)}
        >
          Upload your customer list. We message them automatically — happy ones go
          straight to Google.{" "}
          <span className={`${accentTextColor} font-semibold`}>
            Unhappy ones go only to your private inbox.
          </span>
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-3" style={fade(450)}>
          <button
            onClick={onStart}
            className="group relative inline-flex items-center gap-2.5 rounded-full px-9 py-4 text-sm font-bold shadow-2xl transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 50%, #0284c7 100%)",
              color: "#ffffff",
              boxShadow: "0 8px 32px rgba(14,165,233,0.40), 0 2px 8px rgba(14,165,233,0.22)",
            }}
          >
            Start for free
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            onClick={onStart}
            className={`inline-flex items-center gap-2 rounded-full border ${secondaryBtnBg} px-7 py-4 text-sm font-semibold backdrop-blur-sm transition-all duration-200 cursor-pointer`}
          >
            View pricing
          </button>
        </div>

        {/* Trust pills */}
        <div className="mt-14 flex flex-wrap justify-center gap-3" style={fade(570)}>
          {[
            { icon: <Star className="w-3.5 h-3.5 text-red-500 fill-red-500" />, label: "4.8★ avg after 60 days" },
            { icon: <Shield className="w-3.5 h-3.5 text-red-400" />, label: "Reputation firewall built-in" },
            { icon: <TrendingUp className="w-3.5 h-3.5 text-sky-500" />, label: "480K+ reviews generated" },
          ].map((item) => (
            <div
              key={item.label}
              className={`inline-flex items-center gap-2 rounded-full border ${pillBg} ${pillText} px-4 py-1.5 text-xs backdrop-blur-sm`}
            >
              {item.icon}
              {item.label}
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
          style={fade(700)}
        >
          <span className={`text-[10px] uppercase tracking-widest ${isDark ? "text-white/25" : "text-red-900/30"}`}>Scroll</span>
          <div className={`w-px h-8 bg-gradient-to-b ${isDark ? "from-white/20" : "from-red-400/30"} to-transparent`} />
        </div>
      </div>
    </section>
  );
});
