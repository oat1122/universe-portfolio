"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Post } from "@/modules/posts";
// Direct-import per module-pattern.md "Server Action import exception" —
// the auth/posts module barrels would drag server-only deps into the client bundle.
import {
  createPostAction,
  type PostActionState,
  updatePostAction,
} from "@/modules/posts/posts.actions";

type PostFormProps = {
  // When editing, pass the existing post; omit for create.
  post?: Pick<Post, "id" | "title" | "content" | "excerpt" | "coverImage" | "published">;
};

export function PostForm({ post }: PostFormProps) {
  const isEdit = post !== undefined;

  // For edit, we need to bind the post id into the action — useActionState only
  // accepts a (prevState, formData) signature, so we wrap with a closure.
  const action = isEdit
    ? (prev: PostActionState, formData: FormData) => updatePostAction(post.id, prev, formData)
    : createPostAction;

  const [state, formAction, isPending] = useActionState<PostActionState, FormData>(action, null);

  // Field error helper
  const fieldError = (name: string) =>
    state && !state.ok ? state.fieldErrors?.[name]?.[0] : undefined;

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          required
          maxLength={200}
          defaultValue={post?.title}
          aria-invalid={fieldError("title") ? "true" : undefined}
        />
        {fieldError("title") && <p className="text-xs text-destructive">{fieldError("title")}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          name="excerpt"
          maxLength={500}
          rows={2}
          placeholder="Short summary shown in listings and OG previews"
          defaultValue={post?.excerpt ?? ""}
        />
        {fieldError("excerpt") && (
          <p className="text-xs text-destructive">{fieldError("excerpt")}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="coverImage">Cover image URL</Label>
        <Input
          id="coverImage"
          name="coverImage"
          type="url"
          placeholder="https://..."
          defaultValue={post?.coverImage ?? ""}
        />
        {fieldError("coverImage") && (
          <p className="text-xs text-destructive">{fieldError("coverImage")}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          name="content"
          required
          rows={14}
          className="font-mono"
          placeholder="Markdown body — MDX rendering arrives with the content module."
          defaultValue={post?.content}
        />
        {fieldError("content") && (
          <p className="text-xs text-destructive">{fieldError("content")}</p>
        )}
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          name="published"
          defaultChecked={post?.published ?? false}
          className="h-4 w-4 cursor-pointer accent-primary"
        />
        <span>Published</span>
        <span className="text-xs text-muted-foreground">
          (Saves the first publish time when checked)
        </span>
      </label>

      {state && !state.ok && !state.fieldErrors && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      {state?.ok && isEdit && (
        <p className="rounded-md border border-border bg-surface-elevated px-3 py-2 text-sm text-muted-foreground">
          Saved.
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : isEdit ? "Save changes" : "Create post"}
        </Button>
      </div>
    </form>
  );
}
