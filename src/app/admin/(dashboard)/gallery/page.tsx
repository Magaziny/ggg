import db, { sanitizeRows } from "@/lib/db";
import GalleryPanel from "@/components/admin/GalleryPanel";

export default async function AdminGalleryPage() {
  const result = await db.execute("SELECT * FROM gallery ORDER BY created_at DESC");
<<<<<<< HEAD
  const photos = sanitizeRows(result.rows as any[]);
=======
  const photos = result.rows as any[];
>>>>>>> fe169060315675383b13606d40e9f1951e110e4c

  return <GalleryPanel initialPhotos={photos} />;
}
