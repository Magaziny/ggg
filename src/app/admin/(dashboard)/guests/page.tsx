import db from "@/lib/db";
import GuestsPanel from "@/components/admin/GuestsPanel";

export default async function GuestsPage() {
  const result = await db.execute("SELECT * FROM guests ORDER BY created_at DESC");
  const guests = result.rows as any[];

  return <GuestsPanel initialGuests={guests} />;
}
