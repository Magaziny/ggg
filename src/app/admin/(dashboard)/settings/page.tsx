import db from "@/lib/db";
import SettingsPanel from "@/components/admin/SettingsPanel";

export default function SettingsPage() {
  try {
    const settingsRows = db.prepare("SELECT * FROM settings").all() as { key: string; value: string }[];
    const settings = settingsRows.reduce((acc: any, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});

    return <SettingsPanel initialSettings={settings} />;
  } catch (error: any) {
    return (
      <div className="p-8 text-red-500 bg-red-50 rounded-xl border border-red-200">
        <h1 className="text-xl font-bold mb-4">Ошибка загрузки настроек</h1>
        <pre className="text-xs overflow-auto">{error.message}</pre>
        <pre className="text-xs mt-4">{error.stack}</pre>
      </div>
    );
  }
}
