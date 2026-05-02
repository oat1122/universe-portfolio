// Strip combining diacritical marks (U+0300..U+036F) using explicit escapes.
const COMBINING_MARKS = /[̀-ͯ]/g;

export function generateSlug(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(COMBINING_MARKS, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
