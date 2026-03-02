import { cn } from "@/lib/utils";

interface CubeLoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  label?: string;
  sublabel?: string;
}

export default function CubeLoader({
  className,
  size = "md",
  showText = true,
  label = "Loading",
  sublabel = "Preparing your experience…",
}: CubeLoaderProps) {
  const dim = size === "sm" ? 64 : size === "lg" ? 128 : 96;
  const half = dim / 2;
  const breatheTo = half + 32;

  return (
    <div className={cn("flex flex-col items-center justify-center gap-10", className)}>
      {/* 3-D scene */}
      <div
        className="cube-perspective relative flex items-center justify-center"
        style={{ width: dim, height: dim }}
      >
        {/* Spinning assembly */}
        <div
          className="cube-spin-wrapper relative preserve-3d"
          style={{ width: "100%", height: "100%" }}
        >
          {/* Core glow */}
          <div
            className="cube-core absolute inset-0 m-auto rounded-full"
            style={{
              width: dim * 0.33,
              height: dim * 0.33,
              background: "radial-gradient(circle, rgba(167,139,250,0.95) 0%, rgba(109,40,217,0.6) 60%, transparent 100%)",
              boxShadow: "0 0 40px rgba(139,92,246,0.9), 0 0 80px rgba(109,40,217,0.4)",
              filter: "blur(2px)",
            }}
          />

          {/* Front */}
          <div className="cube-side-wrapper" style={{ transform: "rotateY(0deg)" }}>
            <div
              className="cube-face"
              style={{
                border: "2px solid rgba(167,139,250,0.8)",
                background: "rgba(139,92,246,0.08)",
                boxShadow: "0 0 18px rgba(139,92,246,0.45), inset 0 0 18px rgba(139,92,246,0.05)",
                animationDelay: "0s",
              }}
            />
          </div>

          {/* Back */}
          <div className="cube-side-wrapper" style={{ transform: "rotateY(180deg)" }}>
            <div
              className="cube-face"
              style={{
                border: "2px solid rgba(167,139,250,0.8)",
                background: "rgba(139,92,246,0.08)",
                boxShadow: "0 0 18px rgba(139,92,246,0.45), inset 0 0 18px rgba(139,92,246,0.05)",
                animationDelay: "0.4s",
              }}
            />
          </div>

          {/* Right */}
          <div className="cube-side-wrapper" style={{ transform: "rotateY(90deg)" }}>
            <div
              className="cube-face"
              style={{
                border: "2px solid rgba(99,102,241,0.8)",
                background: "rgba(99,102,241,0.08)",
                boxShadow: "0 0 18px rgba(99,102,241,0.45), inset 0 0 18px rgba(99,102,241,0.05)",
                animationDelay: "0.8s",
              }}
            />
          </div>

          {/* Left */}
          <div className="cube-side-wrapper" style={{ transform: "rotateY(-90deg)" }}>
            <div
              className="cube-face"
              style={{
                border: "2px solid rgba(99,102,241,0.8)",
                background: "rgba(99,102,241,0.08)",
                boxShadow: "0 0 18px rgba(99,102,241,0.45), inset 0 0 18px rgba(99,102,241,0.05)",
                animationDelay: "1.2s",
              }}
            />
          </div>

          {/* Top */}
          <div className="cube-side-wrapper" style={{ transform: "rotateX(90deg)" }}>
            <div
              className="cube-face"
              style={{
                border: "2px solid rgba(52,211,153,0.7)",
                background: "rgba(52,211,153,0.06)",
                boxShadow: "0 0 18px rgba(52,211,153,0.35), inset 0 0 18px rgba(52,211,153,0.04)",
                animationDelay: "1.6s",
              }}
            />
          </div>

          {/* Bottom */}
          <div className="cube-side-wrapper" style={{ transform: "rotateX(-90deg)" }}>
            <div
              className="cube-face"
              style={{
                border: "2px solid rgba(52,211,153,0.7)",
                background: "rgba(52,211,153,0.06)",
                boxShadow: "0 0 18px rgba(52,211,153,0.35), inset 0 0 18px rgba(52,211,153,0.04)",
                animationDelay: "2s",
              }}
            />
          </div>
        </div>

        {/* Floor shadow */}
        <div
          className="cube-shadow absolute rounded-full"
          style={{
            bottom: -dim * 0.28,
            width: dim * 0.9,
            height: dim * 0.12,
            background: "radial-gradient(ellipse, rgba(109,40,217,0.35) 0%, transparent 70%)",
            filter: "blur(10px)",
          }}
        />
      </div>

      {showText && (
        <div className="flex flex-col items-center gap-1.5 text-center">
          <p
            className="text-xs font-bold tracking-[0.35em] uppercase"
            style={{ color: "rgba(167,139,250,0.9)" }}
          >
            {label}
          </p>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            {sublabel}
          </p>
        </div>
      )}

      <style>{`
        .cube-perspective { perspective: 1200px; }
        .preserve-3d { transform-style: preserve-3d; }

        @keyframes cubeRepute {
          0%   { transform: rotateX(0deg)   rotateY(0deg); }
          100% { transform: rotateX(360deg) rotateY(360deg); }
        }
        @keyframes cubeFaceBreathe {
          0%,100% {
            transform: translateZ(${half}px);
            opacity: 0.85;
          }
          50% {
            transform: translateZ(${breatheTo}px);
            opacity: 0.4;
          }
        }
        @keyframes cubeCorePulse {
          0%,100% { transform: scale(0.85); opacity: 0.7; }
          50%      { transform: scale(1.2);  opacity: 1; }
        }
        @keyframes cubeShadow {
          0%,100% { transform: scale(1);   opacity: 0.5; }
          50%      { transform: scale(1.4); opacity: 0.25; }
        }

        .cube-spin-wrapper {
          animation: cubeRepute 9s linear infinite;
          transform-style: preserve-3d;
        }
        .cube-core {
          animation: cubeCorePulse 2.2s ease-in-out infinite;
        }
        .cube-side-wrapper {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transform-style: preserve-3d;
        }
        .cube-face {
          position: absolute;
          width: 100%;
          height: 100%;
          animation: cubeFaceBreathe 3.2s ease-in-out infinite;
          backdrop-filter: blur(2px);
          border-radius: 3px;
        }
        .cube-shadow {
          animation: cubeShadow 3.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
