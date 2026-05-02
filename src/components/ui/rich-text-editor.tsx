"use client";

import { type Editor, EditorContent, useEditor } from "@tiptap/react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
// Direct-import Server Action per module-pattern.md "Server Action import exception".
import { uploadBlogImageAction } from "@/modules/posts/posts.actions";
import {
  EMPTY_DOC,
  editorExtensions,
  placeholderExtension,
  type TiptapDoc,
} from "@/shared/lib/tiptap";

type RichTextEditorProps = {
  /** Hidden form input name — receives JSON.stringify(doc) on every change */
  name: string;
  initialValue?: TiptapDoc;
  placeholder?: string;
  className?: string;
};

export function RichTextEditor({
  name,
  initialValue,
  placeholder = "Start writing…",
  className,
}: RichTextEditorProps) {
  // Mirror editor JSON into a state slice so the hidden <input> re-serializes
  // on every keystroke. The form just submits whatever string is current.
  const [serialized, setSerialized] = useState<string>(JSON.stringify(initialValue ?? EMPTY_DOC));

  const editor = useEditor({
    extensions: [...editorExtensions, placeholderExtension(placeholder)],
    content: initialValue ?? EMPTY_DOC,
    editorProps: {
      attributes: {
        // Prose-ish styling without the @tailwindcss/typography plugin — block
        // spacing + font-mono on code lives here.
        class: cn(
          "min-h-[300px] max-w-none focus:outline-none",
          "[&_p]:my-3 [&_p]:leading-relaxed",
          "[&_h1]:mt-6 [&_h1]:mb-3 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:tracking-tight",
          "[&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight",
          "[&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:tracking-tight",
          "[&_ul]:my-3 [&_ul]:ml-6 [&_ul]:list-disc",
          "[&_ol]:my-3 [&_ol]:ml-6 [&_ol]:list-decimal",
          "[&_li]:my-1",
          "[&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground",
          "[&_code]:rounded [&_code]:bg-surface-elevated [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm",
          "[&_pre]:my-4 [&_pre]:rounded-md [&_pre]:bg-surface-elevated [&_pre]:p-4 [&_pre]:overflow-x-auto",
          "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
          "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2",
          "[&_img]:my-4 [&_img]:max-w-full [&_img]:rounded-lg [&_img]:border [&_img]:border-border",
          "[&_p.is-editor-empty:first-child]:before:text-muted-foreground [&_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)] [&_p.is-editor-empty:first-child]:before:float-left [&_p.is-editor-empty:first-child]:before:h-0 [&_p.is-editor-empty:first-child]:before:pointer-events-none",
        ),
      },
    },
    onUpdate({ editor }) {
      setSerialized(JSON.stringify(editor.getJSON()));
    },
    // Avoid SSR hydration warnings: Tiptap nodes are deterministic but ref equality differs.
    immediatelyRender: false,
  });

  return (
    <div
      className={cn(
        "rounded-md border border-border bg-background transition-colors duration-150 focus-within:border-primary focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
        className,
      )}
    >
      {editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} className="px-3 py-2" />
      <input type="hidden" name={name} value={serialized} />
    </div>
  );
}

// ── Toolbar ───────────────────────────────────────────────────────────────

function Toolbar({ editor }: { editor: Editor }) {
  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border bg-surface px-2 py-1.5">
      <ToolbarButton
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <strong className="text-sm">B</strong>
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <em className="text-sm">I</em>
      </ToolbarButton>
      <ToolbarButton
        label="Strike"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <span className="text-sm line-through">S</span>
      </ToolbarButton>

      <ToolbarSeparator />

      <ToolbarButton
        label="Heading 1"
        active={editor.isActive("heading", { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <span className="text-xs font-semibold">H1</span>
      </ToolbarButton>
      <ToolbarButton
        label="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <span className="text-xs font-semibold">H2</span>
      </ToolbarButton>
      <ToolbarButton
        label="Heading 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <span className="text-xs font-semibold">H3</span>
      </ToolbarButton>

      <ToolbarSeparator />

      <ToolbarButton
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <span className="text-xs">• List</span>
      </ToolbarButton>
      <ToolbarButton
        label="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <span className="text-xs">1. List</span>
      </ToolbarButton>
      <ToolbarButton
        label="Blockquote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <span className="text-xs">"</span>
      </ToolbarButton>

      <ToolbarSeparator />

      <ToolbarButton
        label="Inline code"
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <span className="font-mono text-xs">{`<>`}</span>
      </ToolbarButton>
      <ToolbarButton
        label="Code block"
        active={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <span className="font-mono text-xs">{`{ }`}</span>
      </ToolbarButton>

      <ToolbarSeparator />

      <ToolbarButton
        label="Link"
        active={editor.isActive("link")}
        onClick={() => promptLink(editor)}
      >
        <span className="text-xs">Link</span>
      </ToolbarButton>
      <ImageUploadButton editor={editor} />

      <ToolbarSeparator />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={!editor.can().chain().focus().undo().run()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        Undo
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={!editor.can().chain().focus().redo().run()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        Redo
      </Button>
    </div>
  );
}

function ToolbarButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 min-w-8 items-center justify-center rounded px-2 transition-colors duration-150",
        active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-surface-elevated",
      )}
    >
      {children}
    </button>
  );
}

function ToolbarSeparator() {
  return <span aria-hidden className="mx-1 h-5 w-px bg-border" />;
}

// Cheap prompt UX — replace with shadcn Dialog when one is added.
function promptLink(editor: Editor) {
  const previous = editor.getAttributes("link").href as string | undefined;
  const url = window.prompt("Enter URL (leave empty to remove)", previous ?? "");
  if (url === null) return;
  if (url === "") {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    return;
  }
  editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
}

// Inline image upload — picks a file, sends it through uploadBlogImageAction,
// then inserts the returned public URL with alt text suggested from the filename.
// Pending state disables the button so a slow upload can't double-fire.
function ImageUploadButton({ editor }: { editor: Editor }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, setPending] = useState(false);

  function pick() {
    inputRef.current?.click();
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPending(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadBlogImageAction(formData);
      if (!result.ok) {
        toast.error("Image upload failed", { description: result.message });
        return;
      }
      // Tiptap Image extension persists `alt` on the node — accessible + indexed for SEO.
      editor.chain().focus().setImage({ src: result.url, alt: result.suggestedAlt }).run();
      toast.success("Image inserted");
    } finally {
      // Reset so picking the same file again still triggers onChange.
      if (inputRef.current) inputRef.current.value = "";
      setPending(false);
    }
  }

  return (
    <>
      <ToolbarButton label="Insert image" onClick={pick}>
        <span className="text-xs">{isPending ? "Uploading…" : "Image"}</span>
      </ToolbarButton>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        className="sr-only"
        onChange={onFile}
      />
    </>
  );
}
