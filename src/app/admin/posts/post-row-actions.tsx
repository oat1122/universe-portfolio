"use client";

import { Button } from "@/components/ui/button";
import { deletePostAction, togglePublishAction } from "@/modules/posts/posts.actions";

type Props = {
  id: string;
  title: string;
  published: boolean;
};

export function PostRowActions({ id, title, published }: Props) {
  // Confirm in the browser before submitting — avoids a Dialog dep for now.
  // The form's onSubmit returns false to prevent submission when the user cancels.
  function confirmDelete(e: React.FormEvent<HTMLFormElement>) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      e.preventDefault();
    }
  }

  return (
    <div className="flex justify-end gap-2">
      <form action={togglePublishAction}>
        <input type="hidden" name="id" value={id} />
        <Button type="submit" variant="ghost" size="sm">
          {published ? "Unpublish" : "Publish"}
        </Button>
      </form>
      <form action={deletePostAction} onSubmit={confirmDelete}>
        <input type="hidden" name="id" value={id} />
        <Button type="submit" variant="ghost" size="sm" className="text-destructive">
          Delete
        </Button>
      </form>
    </div>
  );
}
