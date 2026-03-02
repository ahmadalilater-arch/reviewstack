import { useEffect, useRef, useState, memo } from "react";
import { createNoise3D } from "simplex-noise";
import { cn } from "@/lib/utils";

interface WavyBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
}

export const WavyBackground = memo(function WavyBackground({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 8,
  speed = "slow",
  waveOpacity = 0.4,
}: WavyBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const ntRef = useRef(0);
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const noise = createNoise3D();

    const getSpeed = () => (speed === "fast" ? 0.002 : 0.0008);

    const waveColors = colors ?? [
      "rgba(253, 164, 175, 0.85)",  // rose-300   — soft pink
      "rgba(251, 113, 133, 0.75)",  // rose-400   — warm pink
      "rgba(249, 168, 212, 0.80)",  // pink-300   — light blush pink
      "rgba(254, 205, 211, 0.65)",  // rose-200   — pale blush
      "rgba(251, 191, 36,  0.55)",  // amber-400  — warm gold
    ];

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    ctx.filter = `blur(${blur}px)`;

    const drawWave = (n: number) => {
      ntRef.current += getSpeed();
      for (let i = 0; i < n; i++) {
        ctx.beginPath();
        ctx.lineWidth = waveWidth ?? 45;
        ctx.strokeStyle = waveColors[i % waveColors.length];
        for (let x = 0; x < w; x += 4) {
          const y = noise(x / 900, 0.25 * i, ntRef.current) * 120;
          ctx.lineTo(x, y + h * 0.5);
        }
        ctx.stroke();
        ctx.closePath();
      }
    };

    const render = () => {
      ctx.fillStyle = backgroundFill ?? "rgba(3, 3, 5, 1)";
      ctx.globalAlpha = waveOpacity;
      ctx.fillRect(0, 0, w, h);
      drawWave(5);
      animationRef.current = requestAnimationFrame(render);
    };

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      ctx.filter = `blur(${blur}px)`;
    };

    window.addEventListener("resize", handleResize, { passive: true });
    render();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [blur, speed, waveWidth, waveOpacity, backgroundFill, colors]);

  return (
    <div className={cn("relative flex flex-col items-center justify-center", containerClassName)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={isSafari ? { filter: `blur(${blur}px)` } : undefined}
      />
      {children && (
        <div className={cn("relative z-10 w-full", className)}>
          {children}
        </div>
      )}
    </div>
  );
});
