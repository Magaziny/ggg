import db, { sanitizeRows } from "@/lib/db";
import GalleryPanel from "@/components/admin/GalleryPanel";

export default async function AdminGalleryPage() {
  const result = await db.execute("SELECT * FROM gallery ORDER BY created_at DESC");
  const photos = sanitizeRows(result.rows as any[]);

  return <GalleryPanel initialPhotos={photos} />;
}
