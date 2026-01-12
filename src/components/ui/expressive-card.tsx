import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ExpressiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * ExpressiveCard Component
 *
 * Implements the "Solid Geometric" design style:
 * - Uniform Shape: rounded-3xl (Professional, Friendly)
 * - Material: Solid opaque background (Reliable, Fast)
 * - Depth: Soft shadow to lift it off the background
 *
 * Usage: Use this as the main container for heavy-content views (Auth).
 */
export const ExpressiveCard = React.forwardRef<HTMLDivElement, ExpressiveCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          // Base Transitions
          "transition-all duration-300",

          // Shape: Uniform "Geometric"
          "rounded-3xl",

          // Material: Solid
          "bg-card border border-border",

          // Shadow
          "shadow-xl",

          className
        )}
        {...props}
      >
        {children}
      </Card>
    );
  }
);

ExpressiveCard.displayName = "ExpressiveCard";
