-- 1. Schema change — alt text for blog cover images (separate from filename).
ALTER TABLE "posts" ADD COLUMN "cover_image_alt" text;
--> statement-breakpoint

-- 2. Storage bucket for blog images (public read, admin write).
-- ON CONFLICT DO NOTHING so re-running this migration on a fresh project still works.
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- 3. Storage RLS policies. The Server Action layer uses the service-role key
-- (bypasses RLS), but these policies still defend against:
--   - direct anon-key client uploads from a compromised browser session
--   - future Edge Function / cron writers that legitimately need RLS
DROP POLICY IF EXISTS "Anyone can read blog images" ON storage.objects;--> statement-breakpoint
CREATE POLICY "Anyone can read blog images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'blog-images');
--> statement-breakpoint

DROP POLICY IF EXISTS "Admins can upload blog images" ON storage.objects;--> statement-breakpoint
CREATE POLICY "Admins can upload blog images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'blog-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid()) AND role = 'admin'
    )
  );
--> statement-breakpoint

DROP POLICY IF EXISTS "Admins can update blog images" ON storage.objects;--> statement-breakpoint
CREATE POLICY "Admins can update blog images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'blog-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid()) AND role = 'admin'
    )
  );
--> statement-breakpoint

DROP POLICY IF EXISTS "Admins can delete blog images" ON storage.objects;--> statement-breakpoint
CREATE POLICY "Admins can delete blog images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'blog-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid()) AND role = 'admin'
    )
  );
