import "server-only";

import { createAdminClient } from "./admin";

const BLOG_IMAGES_BUCKET = "blog-images";

// Validation rules for blog image uploads — kept here so they're enforced at
// the only entry point (Server Action) and can't be bypassed from the client.
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);

const EXTENSION_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

export type UploadValidationError =
  | "INVALID_FILE"
  | "FILE_TOO_LARGE"
  | "UNSUPPORTED_TYPE"
  | "UPLOAD_FAILED";

export type UploadResult =
  | { ok: true; url: string; path: string; suggestedAlt: string }
  | { ok: false; error: UploadValidationError; message: string };

/** Sanitize a user-supplied filename to a path-safe slug, keeping the original
 *  for SEO-friendly URLs but stripping anything that could collide with the
 *  filesystem or break the URL. */
function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Strip the extension and turn the remaining slug into something a human
 *  would type as alt text. Caller should still let the editor override. */
export function suggestAltFromFilename(name: string): string {
  const stem = name.replace(/\.[a-z0-9]+$/i, "");
  const cleaned = stem.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  const first = cleaned.charAt(0);
  if (first === "") return "";
  return first.toUpperCase() + cleaned.slice(1);
}

/** Build a path of the form `<authorId>/<yyyy>/<mm>/<random>-<sanitized>.<ext>`.
 *  Author scoping makes per-user cleanup possible later. */
function buildObjectPath(authorId: string, file: File): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");

  const ext = EXTENSION_BY_MIME[file.type] ?? "bin";
  const stem = sanitizeFilename(file.name.replace(/\.[a-z0-9]+$/i, "")) || "image";
  const id = crypto.randomUUID().slice(0, 8);

  return `${authorId}/${year}/${month}/${id}-${stem}.${ext}`;
}

export async function uploadBlogImage(authorId: string, file: File): Promise<UploadResult> {
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "INVALID_FILE", message: "No file provided" };
  }
  if (file.size > MAX_BYTES) {
    return {
      ok: false,
      error: "FILE_TOO_LARGE",
      message: `File exceeds ${Math.floor(MAX_BYTES / 1024 / 1024)} MB limit`,
    };
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return {
      ok: false,
      error: "UNSUPPORTED_TYPE",
      message: `Unsupported file type: ${file.type}`,
    };
  }

  const path = buildObjectPath(authorId, file);
  const supabase = createAdminClient();

  const { error } = await supabase.storage.from(BLOG_IMAGES_BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000", // 1 year — paths are unique, immutable
    upsert: false,
  });
  if (error) {
    return { ok: false, error: "UPLOAD_FAILED", message: error.message };
  }

  const { data } = supabase.storage.from(BLOG_IMAGES_BUCKET).getPublicUrl(path);

  return {
    ok: true,
    url: data.publicUrl,
    path,
    suggestedAlt: suggestAltFromFilename(file.name),
  };
}

export async function deleteBlogImage(path: string): Promise<{ ok: boolean }> {
  const supabase = createAdminClient();
  const { error } = await supabase.storage.from(BLOG_IMAGES_BUCKET).remove([path]);
  return { ok: !error };
}

/** Best-effort path extraction from a public URL. Returns null when the URL
 *  doesn't match our bucket — callers should treat that as "external image,
 *  don't try to delete". */
export function pathFromPublicUrl(url: string): string | null {
  // Public URL shape: <project>/storage/v1/object/public/blog-images/<path>
  const marker = `/storage/v1/object/public/${BLOG_IMAGES_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}
