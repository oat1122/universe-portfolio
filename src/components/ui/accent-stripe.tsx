// Section divider / brand mark.
//   - `single`  : one short red stripe — used above/below section headings
//   - `trident` : three bars (red / foreground / accent) — homage to the MU crest
// See ui-style.md "Geometric accents (trident-inspired)".
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type AccentStripeProps = ComponentProps<"div"> & {
  variant?: "single" | "trident";
};

export function AccentStripe({ className, variant = "single", ...props }: AccentStripeProps) {
  if (variant === "trident") {
    return (
      <div className={cn("flex gap-1", className)} aria-hidden {...props}>
        <span className="h-1 w-8 bg-primary" />
        <span className="h-1 w-8 bg-foreground" />
        <span className="h-1 w-8 bg-accent" />
      </div>
    );
  }

  return <div className={cn("h-1 w-12 bg-primary", className)} aria-hidden {...props} />;
}
