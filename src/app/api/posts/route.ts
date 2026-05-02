import { postsController } from "@/modules/posts";

export async function GET(request: Request) {
  return postsController.list(request);
}
