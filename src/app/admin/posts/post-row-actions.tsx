"use client";

import { useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deletePostAction, togglePublishAction } from "@/modules/posts/posts.actions";

type Props = {
  id: string;
  title: string;
  published: boolean;
};

export function PostRowActions({ id, title, published }: Props) {
  const [open, setOpen] = useState(false);
  // The AlertDialog Action is just a button — it doesn't submit our hidden form
  // automatically. We hold the form ref and call requestSubmit() on confirm.
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="flex justify-end gap-2">
      <form action={togglePublishAction}>
        <input type="hidden" name="id" value={id} />
        <Button type="submit" variant="ghost" size="sm">
          {published ? "Unpublish" : "Publish"}
        </Button>
      </form>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button type="button" variant="ghost" size="sm" className="text-destructive">
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              "{title}" will be permanently removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-primary-foreground hover:bg-destructive/90"
              onClick={() => {
                setOpen(false);
                formRef.current?.requestSubmit();
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Hidden form — AlertDialogAction calls requestSubmit() on the ref */}
      <form ref={formRef} action={deletePostAction} className="hidden">
        <input type="hidden" name="id" value={id} />
      </form>
    </div>
  );
}
