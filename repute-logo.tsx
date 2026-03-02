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
      {/* Icon: Brand Logo Image */}
      <div className={cn("relative flex items-center justify-center", iconClassName)}>
        <img
          src="./logoweb.png"
          alt="Repute Logo"
          className="h-8 w-8 object-contain"
        />
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
