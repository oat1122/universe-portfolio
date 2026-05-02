// Jersey-number-style stat showcase.
// See ui-style.md "Number / stat showcase".
// Use for stats / years / counts — never for inline numbers in a table.
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card } from "./card";

type StatCardProps = ComponentProps<"div"> & {
  value: ReactNode;
  label: ReactNode;
  /** Color of the big number. `primary` (MU red, default) or `foreground` */
  tone?: "primary" | "foreground";
};

export function StatCard({ value, label, tone = "primary", className, ...props }: StatCardProps) {
  return (
    <Card className={cn("p-8", className)} {...props}>
      <div
        className={cn(
          "text-5xl font-extrabold tabular-nums tracking-tight md:text-7xl",
          tone === "primary" ? "text-primary" : "text-foreground",
        )}
      >
        {value}
      </div>
      <div className="mt-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
    </Card>
  );
}
