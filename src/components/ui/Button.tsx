import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  as?: any;
  href?: string;
  download?: any;
}

const Button = React.forwardRef<any, ButtonProps>(
  ({ className, variant = "primary", size = "md", as: Component = "button", ...props }, ref) => {
    const variants = {
      primary: "bg-wedding-sage text-white hover:bg-wedding-sage-light shadow-md",
      secondary: "bg-wedding-champagne text-wedding-graphite hover:bg-white shadow-sm",
      outline: "border-2 border-wedding-sage text-wedding-sage hover:bg-wedding-sage hover:text-white",
      ghost: "text-wedding-graphite hover:bg-black/5",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg font-semibold",
    };

    return (
      <Component
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-95 font-sans",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
