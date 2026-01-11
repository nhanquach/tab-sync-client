import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * GlassCard Component
 *
 * Implements the "Glassmorphic Expressive" design style:
 * - Asymmetric Shape: rounded-tl-[48px] (Desktop), rounded-tl-[32px] (Mobile)
 * - Material: High blur, translucent white/black background
 *
 * Usage: Use this as the main container for heavy-content views (Auth, Dashboards).
 */
export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          // Base Transitions
          "transition-all duration-300",

          // Shape: Asymmetric "Professional Expressive"
          "rounded-none rounded-tl-[32px]",
          "md:rounded-tl-[48px] md:rounded-tr-[16px] md:rounded-bl-[16px] md:rounded-br-[16px]",

          // Material: Glassmorphism
          "backdrop-blur-xl",
          // Light Mode
          "bg-white/40 border-0 md:border md:border-white/40",
          // Dark Mode
          "dark:bg-black/40 dark:border-0 md:dark:border md:dark:border-white/10",

          // Shadow
          "shadow-none md:shadow-2xl",

          className
        )}
        {...props}
      >
        {children}
      </Card>
    );
  }
);

GlassCard.displayName = "GlassCard";
