import db, { sanitizeRows } from "@/lib/db";
import GuestsPanel from "@/components/admin/GuestsPanel";

export default async function GuestsPage() {
  const result = await db.execute("SELECT * FROM guests ORDER BY created_at DESC");
<<<<<<< HEAD
  const guests = sanitizeRows(result.rows as any[]);
=======
  const guests = result.rows as any[];
>>>>>>> fe169060315675383b13606d40e9f1951e110e4c

  return <GuestsPanel initialGuests={guests} />;
}
