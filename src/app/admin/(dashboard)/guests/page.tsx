import db from "@/lib/db";
import GuestsPanel from "@/components/admin/GuestsPanel";

export default function GuestsPage() {
  const guests = db.prepare("SELECT * FROM guests ORDER BY created_at DESC").all() as any[];

  return <GuestsPanel initialGuests={guests} />;
}
