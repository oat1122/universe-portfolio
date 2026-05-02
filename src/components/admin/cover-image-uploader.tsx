"use client";

import { useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
// Direct-import Server Action per module-pattern.md "Server Action import exception".
import { deleteBlogImageAction, uploadBlogImageAction } from "@/modules/posts/posts.actions";

type CoverImageUploaderProps = {
  initialUrl?: string | null;
  initialAlt?: string | null;
};

export function CoverImageUploader({ initialUrl, initialAlt }: CoverImageUploaderProps) {
  // The form submits these two fields — we drive them imperatively after upload.
  const [url, setUrl] = useState<string>(initialUrl ?? "");
  const [alt, setAlt] = useState<string>(initialAlt ?? "");
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function pickFile() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    const previousUrl = url;

    startTransition(async () => {
      const result = await uploadBlogImageAction(formData);
      // Always reset the file input so picking the same file again triggers onChange.
      if (fileInputRef.current) fileInputRef.current.value = "";

      if (!result.ok) {
        toast.error("Image upload failed", { description: result.message });
        return;
      }

      setUrl(result.url);
      // Only auto-fill alt when blank — don't clobber a user's edits on replace.
      if (alt.trim() === "") setAlt(result.suggestedAlt);

      // Clean up the previous image once the new one is in place.
      if (previousUrl) {
        await deleteBlogImageAction(previousUrl);
      }
      toast.success(previousUrl ? "Cover image replaced" : "Cover image uploaded");
    });
  }

  function handleRemove() {
    if (!url) return;
    const toDelete = url;
    startTransition(async () => {
      setUrl("");
      setAlt("");
      await deleteBlogImageAction(toDelete);
      toast.success("Cover image removed");
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label>Cover image</Label>

        {url ? (
          <div className="flex flex-col gap-3 rounded-md border border-border bg-surface p-3">
            {/* biome-ignore lint/performance/noImgElement: Supabase Storage URL — next/image config TBD */}
            <img
              src={url}
              alt={alt || "Cover image preview"}
              className="aspect-video w-full rounded object-cover"
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={pickFile}
                disabled={isPending}
              >
                {isPending ? "Uploading..." : "Replace"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                disabled={isPending}
                className="text-destructive"
              >
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-start gap-2 rounded-md border border-dashed border-border bg-surface p-6 text-sm text-muted-foreground">
            <p>JPEG / PNG / WebP / AVIF / GIF · up to 5 MB</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={pickFile}
              disabled={isPending}
            >
              {isPending ? "Uploading..." : "Upload image"}
            </Button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          className="sr-only"
          onChange={handleFileChange}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="coverImageAlt">
          Alt text <span className="ml-1 text-muted-foreground/70 normal-case">(SEO)</span>
        </Label>
        <Input
          id="coverImageAlt"
          name="coverImageAlt"
          maxLength={200}
          placeholder="Describe the image — auto-filled from filename"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Describes the image for screen readers and search engines. Falls back to a slugified
          filename when blank.
        </p>
      </div>

      {/* Hidden submission fields — the form action reads these */}
      <input type="hidden" name="coverImage" value={url} />
    </div>
  );
}
