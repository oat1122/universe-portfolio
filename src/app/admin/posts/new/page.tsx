import Link from "next/link";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { PostForm } from "../post-form";

export const metadata = {
  title: "New post",
};

export default function NewPostPage() {
  return (
    <section className="mx-auto max-w-3xl">
      <header className="mb-6">
        <EyebrowLabel className="mb-2">New</EyebrowLabel>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Create post</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          <Link
            href="/admin/posts"
            className="transition-colors duration-150 hover:text-foreground"
          >
            ← Back to posts
          </Link>
        </p>
      </header>

      <PostForm />
    </section>
  );
}
