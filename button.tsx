import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400/70 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-sky-500 text-white shadow-sm shadow-sky-900/20 hover:bg-sky-400 active:scale-[0.98]",
        destructive:
          "bg-red-500 text-white shadow-sm shadow-red-900/20 hover:bg-red-400 active:scale-[0.98]",
        outline:
          "border border-sky-500/30 bg-transparent text-sky-400 hover:bg-sky-500/10 hover:border-sky-400 active:scale-[0.98]",
        secondary:
          "bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 active:scale-[0.98]",
        ghost:
          "hover:bg-sky-500/10 hover:text-sky-400 active:scale-[0.98]",
        link: "text-sky-400 underline-offset-4 hover:underline",
        glow:
          "bg-sky-500 text-white shadow-[0_0_20px_rgba(14,165,233,0.4)] hover:shadow-[0_0_30px_rgba(14,165,233,0.6)] hover:bg-sky-400 active:scale-[0.98]",
        danger:
          "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] hover:bg-red-400 active:scale-[0.98]",
      },
      size: {
        default: "h-9 px-5 py-2",
        sm: "h-8 px-4 text-xs",
        lg: "h-11 px-8 text-base",
        xl: "h-13 px-10 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
