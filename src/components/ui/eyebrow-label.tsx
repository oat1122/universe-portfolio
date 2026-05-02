// MU-flavoured eyebrow: red leading bar + uppercase tracked label.
// See ui-style.md "Brand voice — Manchester United inspired" / "Geometric accents".
// Used above headings as a section-context cue (e.g. "RESTRICTED AREA" before "Sign in").
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type EyebrowLabelProps = ComponentProps<"div"> & {
  /** Tone of the leading bar. `primary` = MU red (default), `accent` = MU yellow */
  tone?: "primary" | "accent";
};

export function EyebrowLabel({
  className,
  children,
  tone = "primary",
  ...props
}: EyebrowLabelProps) {
  return (
    <div className={cn("flex items-center gap-3", className)} {...props}>
      <span
        aria-hidden
        className={cn("h-5 w-1", tone === "primary" ? "bg-primary" : "bg-accent")}
      />
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {children}
      </span>
    </div>
  );
}
