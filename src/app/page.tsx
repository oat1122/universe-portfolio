import Link from "next/link";
import { AccentStripe } from "@/components/ui/accent-stripe";
import { buttonVariants } from "@/components/ui/button";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { SITE_NAME } from "@/config/constants";

// Temporary landing — to be replaced by the 3D Universe scene.
export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 py-24">
      <EyebrowLabel className="mb-4">Personal portfolio · Blog</EyebrowLabel>

      <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-foreground md:text-7xl">
        {SITE_NAME}
      </h1>

      <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
        A 3D universe scene, blog, and admin dashboard — built with Next 16, Drizzle, and Supabase.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/blog/hello-universe" className={buttonVariants({ variant: "default" })}>
          Read the latest post
        </Link>
        <Link href="/login" className={buttonVariants({ variant: "outline" })}>
          Admin sign in
        </Link>
      </div>

      <AccentStripe variant="trident" className="mt-12" />
    </main>
  );
}
