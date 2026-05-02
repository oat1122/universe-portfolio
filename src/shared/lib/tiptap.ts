// Shared Tiptap extensions config — used by:
//   - the admin editor (Client Component, useEditor)
//   - the public renderer (Server Component, generateHTML)
//   - SEO metadata (generateText to derive plain-text descriptions)
// Both sides MUST import from here so node coercion stays consistent — if the
// editor allows a node the renderer doesn't, content silently disappears.

import { generateText } from "@tiptap/core";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { common, createLowlight } from "lowlight";

// ── Tiptap document types ──────────────────────────────────────────────────
// Keep loose — only require enough structure to validate "this is a Tiptap doc".
// Field validators (in posts.dto.ts) keep the wire format constrained.
export type TiptapDoc = {
  type: "doc";
  content?: TiptapNode[];
};

export type TiptapNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
  text?: string;
};

export const EMPTY_DOC: TiptapDoc = { type: "doc", content: [] };

// ── Extensions ────────────────────────────────────────────────────────────
const lowlight = createLowlight(common);

export const editorExtensions = [
  StarterKit.configure({
    // Replaced by CodeBlockLowlight below
    codeBlock: false,
  }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: { rel: "noopener", target: "_blank" },
  }),
  Image.configure({
    HTMLAttributes: { class: "rounded-lg border border-border" },
  }),
  CodeBlockLowlight.configure({
    lowlight,
    HTMLAttributes: { class: "rounded-md bg-surface-elevated p-4 overflow-x-auto" },
  }),
];

// Client-only extensions (Placeholder needs editor instance). Stack on top of
// editorExtensions when constructing the useEditor instance.
export const placeholderExtension = (placeholder: string) => Placeholder.configure({ placeholder });

// ── Server-side helpers ───────────────────────────────────────────────────

/** Render a Tiptap doc to HTML. Safe to inject via dangerouslySetInnerHTML
 *  because the doc shape is constrained by editorExtensions (no raw HTML). */
export function renderTiptapHTML(doc: TiptapDoc): string {
  return generateHTML(doc, editorExtensions);
}

/** Extract plain text from a Tiptap doc — for SEO descriptions, OG fallback,
 *  search indexing. Block boundaries become spaces. */
export function extractTiptapText(doc: TiptapDoc): string {
  return generateText(doc, editorExtensions, { blockSeparator: " " }).trim();
}

/** Truncate plain text for description fields (160 chars per SEO rules). */
export function truncateForDescription(text: string, max = 160): string {
  if (text.length <= max) return text;
  // Cut at the last word boundary before the limit, append ellipsis.
  const cut = text.slice(0, max - 1).replace(/\s+\S*$/, "");
  return `${cut}…`;
}
