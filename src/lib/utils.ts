import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// shadcn-canonical helper: merges conditional classNames via clsx, then resolves
// Tailwind conflicts via tailwind-merge (so `cn("p-2", "p-4")` -> "p-4").
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
