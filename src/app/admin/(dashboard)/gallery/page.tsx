import db from "@/lib/db";
import GalleryPanel from "@/components/admin/GalleryPanel";

export default function AdminGalleryPage() {
  const photos = db.prepare("SELECT * FROM gallery ORDER BY created_at DESC").all() as any[];

  return <GalleryPanel initialPhotos={photos} />;
}
