"use client";

import { Toaster as SonnerToaster } from "sonner";

// Toaster mount — placed once in the root layout. Re-export `toast` from sonner
// directly elsewhere; we don't wrap it because it's already typed and ergonomic.
//
// Style is driven by our semantic tokens, not Sonner's built-in palette, so
// dark/light theming follows the rest of the app via [data-theme="dark"].
export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      // Sonner uses richColors only when explicitly opted in; we leave it off
      // so success/error/info all share the same surface, with the icon
      // signaling tone.
      toastOptions={{
        unstyled: false,
        classNames: {
          toast: "!bg-surface !text-foreground !border !border-border !shadow-soft !rounded-xl",
          title: "!text-foreground !font-semibold !text-sm",
          description: "!text-muted-foreground !text-sm",
          actionButton: "!bg-primary !text-primary-foreground hover:!bg-primary-hover !rounded-md",
          cancelButton:
            "!bg-surface-elevated !text-foreground hover:!bg-surface-elevated !rounded-md",
          closeButton:
            "!bg-surface-elevated !text-muted-foreground hover:!text-foreground !border-border",
          success: "!text-foreground",
          error: "!text-destructive",
          warning: "!text-warning",
          info: "!text-foreground",
        },
      }}
    />
  );
}

// Re-export so callers import a single place: `import { toast } from "@/components/ui/sonner"`
export { toast } from "sonner";
