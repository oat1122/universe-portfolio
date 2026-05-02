// Label primitive — uppercase tracked eyebrow style per MU brand voice.
// Pairs with Input/Textarea via standard `htmlFor` + `id` association.
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Label({ className, ...props }: ComponentProps<"label">) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: Label is a primitive — control association is via `htmlFor`, not nesting
    <label
      className={cn("text-xs font-medium uppercase tracking-wide text-muted-foreground", className)}
      {...props}
    />
  );
}
