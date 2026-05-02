// Button primitive — shadcn-derived but rewritten for our token catalog.
// Source: https://ui.shadcn.com/docs/components/button (new-york style)
// Customizations:
//   - All colors swapped to our semantic tokens (no hsl(--primary), uses var directly via Tailwind)
//   - `default` variant uses MU red CTA (bg-primary + bold weight) per ui-style.md "red is the strike"
//   - Snap hover (`duration-150`) instead of generic transitions per MU brand voice
//   - Added `accent` variant for the rare yellow-on-something usage
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base — shared across all variants. Snap interactions, ring focus, disabled state.
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground font-bold hover:bg-primary-hover",
        destructive: "bg-destructive text-primary-foreground hover:bg-destructive/90",
        outline: "border border-border bg-background text-foreground hover:bg-surface-elevated",
        ghost: "text-foreground hover:bg-surface-elevated",
        link: "text-primary underline-offset-4 hover:underline",
        accent: "bg-accent text-accent-foreground font-semibold hover:bg-accent/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = ComponentProps<"button"> & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { buttonVariants };
