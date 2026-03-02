'use client';

import React from "react";
import { motion, Transition } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  variant?: "blue" | "red" | "ghost";
  showArrow?: boolean;
}

export const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "Button", className, variant = "blue", showArrow = true, children, ...props }, ref) => {

  // Brand colors: Light Blue primary, Red for danger/action — zero purple
  const glowColorMap = {
    blue: ["#7dd3fc", "#38bdf8", "#0ea5e9", "#0284c7"],   // sky-300 → sky-600
    red:  ["#fca5a5", "#f87171", "#ef4444", "#dc2626"],    // red-300 → red-600
    ghost: ["#bae6fd", "#7dd3fc", "#38bdf8", "#0ea5e9"],   // very soft blue
  };

  const glowColors = glowColorMap[variant];
  const scale = 1.6;
  const duration = 6;

  const breatheEffect = {
    background: glowColors.map(
      (color) =>
        `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 100%)`
    ),
    scale: [1 * scale, 1.05 * scale, 1 * scale],
    transition: {
      repeat: Infinity,
      duration: duration,
      repeatType: "mirror",
      ease: "easeInOut",
    } as Transition,
  };

  const variantClasses = {
    blue: "border-sky-400/30 bg-sky-500/10 text-sky-100 hover:border-sky-400/60 hover:bg-sky-500/20 hover:shadow-[0_0_24px_rgba(14,165,233,0.35)]",
    red:  "border-red-400/30 bg-red-500/10 text-red-100 hover:border-red-400/60 hover:bg-red-500/20 hover:shadow-[0_0_24px_rgba(239,68,68,0.35)]",
    ghost: "border-white/10 bg-white/5 text-white hover:border-sky-400/30 hover:bg-sky-500/10 hover:shadow-[0_0_24px_rgba(14,165,233,0.2)]",
  };

  return (
    <button
      ref={ref}
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-full px-6 py-2.5 font-semibold transition-all duration-300 backdrop-blur-md border",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {/* Embedded animated glow */}
      <motion.div
        animate={breatheEffect}
        className="pointer-events-none absolute inset-0 z-0 transform-gpu blur-lg"
        style={{
          willChange: "transform",
          backfaceVisibility: "hidden",
        }}
      />

      {/* Foreground content */}
      <span className="relative z-10 flex items-center gap-2 transition-all duration-300 group-hover:translate-x-0.5">
        {children ?? text}
        {showArrow && <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />}
      </span>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

// Solid version — no glow animation, just a clean filled button
export const SolidButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "Button", className, variant = "blue", showArrow = false, children, ...props }, ref) => {
  const variantClasses = {
    blue: "bg-sky-500 hover:bg-sky-400 text-white shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)]",
    red:  "bg-red-500 hover:bg-red-400 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]",
    ghost: "bg-white/10 hover:bg-white/15 text-white border border-white/10 hover:border-white/20",
  };

  return (
    <button
      ref={ref}
      className={cn(
        "group inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 font-semibold transition-all duration-200 active:scale-[0.97]",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children ?? text}
      {showArrow && <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />}
    </button>
  );
});

SolidButton.displayName = "SolidButton";
