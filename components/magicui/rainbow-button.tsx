import React from "react";
import { cn } from "@/lib/utils";

interface RainbowCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const RainbowCard = React.forwardRef<HTMLDivElement, RainbowCardProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group relative inline-flex animate-rainbow items-center justify-center rounded-xl border-0 bg-[length:200%] p-4 text-primary-foreground transition-colors [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.08*1rem)_solid_transparent] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          // before styles
          "before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:animate-rainbow before:[filter:blur(calc(0.8*1rem))]",
          // light mode colors
          "bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))]",
          // dark mode colors
          "dark:bg-[linear-gradient(#fff,#fff),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))]",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

RainbowCard.displayName = "RainbowCard";