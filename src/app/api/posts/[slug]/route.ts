import { postsController } from "@/modules/posts";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return postsController.getBySlug(slug);
}
