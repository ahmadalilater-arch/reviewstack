import { cn } from "@/lib/utils";

interface ReputeLogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  variant?: "light" | "dark";
}

export const ReputeLogo = ({ className, iconClassName, textClassName, variant = "light" }: ReputeLogoProps) => {
  return (
    <div className={cn("flex items-center gap-2.5 select-none", className)}>
      {/* Icon: Gradient Rounded Square with White Abstract 'R' */}
      <div className={cn("relative flex items-center justify-center", iconClassName)}>
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 shadow-lg shadow-indigo-500/20"
        >
          {/* Background Gradient Rect */}
          <rect width="32" height="32" rx="8" fill="url(#repute_gradient)" />
          
          {/* White 'R' Shape */}
          <path
            d="M10 23V9H14.5C18.0899 9 21 11.9101 21 15.5C21 19.0899 18.0899 22 14.5 22H13"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21 23L17.5 19"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          <defs>
            <linearGradient id="repute_gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366f1" /> {/* Indigo 500 */}
              <stop offset="0.5" stopColor="#8b5cf6" /> {/* Violet 500 */}
              <stop offset="1" stopColor="#d946ef" /> {/* Fuchsia 500 */}
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Text Wordmark */}
      <span
        className={cn(
          "font-sans text-xl font-bold tracking-tight",
          variant === "light" ? "text-white" : "text-zinc-900",
          textClassName
        )}
      >
        Repute
      </span>
    </div>
  );
};
