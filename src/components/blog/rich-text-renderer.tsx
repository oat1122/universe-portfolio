// Server Component — renders a Tiptap doc to safe HTML using shared
// extensions config. Doc shape is constrained by the editor's allow-list, so
// dangerouslySetInnerHTML is acceptable here (no raw HTML can sneak in).

import { cn } from "@/lib/utils";
import { renderTiptapHTML, type TiptapDoc } from "@/shared/lib/tiptap";

type RichTextRendererProps = {
  doc: TiptapDoc;
  className?: string;
};

export function RichTextRenderer({ doc, className }: RichTextRendererProps) {
  const html = renderTiptapHTML(doc);

  return (
    <div
      className={cn(
        // Mirror the editor's prose styling so admin preview matches the
        // public rendering.
        "max-w-none text-foreground",
        "[&_p]:my-4 [&_p]:leading-relaxed",
        "[&_h1]:mt-10 [&_h1]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:tracking-tight",
        "[&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight",
        "[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:tracking-tight",
        "[&_ul]:my-4 [&_ul]:ml-6 [&_ul]:list-disc",
        "[&_ol]:my-4 [&_ol]:ml-6 [&_ol]:list-decimal",
        "[&_li]:my-1",
        "[&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground",
        "[&_code]:rounded [&_code]:bg-surface-elevated [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm",
        "[&_pre]:my-6 [&_pre]:rounded-md [&_pre]:bg-surface-elevated [&_pre]:p-4 [&_pre]:overflow-x-auto",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:font-mono [&_pre_code]:text-sm",
        "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-primary-hover",
        "[&_img]:my-6 [&_img]:max-w-full [&_img]:rounded-lg [&_img]:border [&_img]:border-border",
        "[&_hr]:my-8 [&_hr]:border-border",
        className,
      )}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: HTML is generated server-side from a constrained Tiptap doc; no raw user HTML is interpolated
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
