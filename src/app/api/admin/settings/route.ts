import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';

export async function GET() {
  try {
    const result = await db.execute('SELECT * FROM settings');
    const settingsRows = result.rows as unknown as { key: string, value: string }[];
    const settings = settingsRows.reduce((acc: any, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});

    return NextResponse.json(settings);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (!session || session.value !== 'active') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    
    // Создаем батч-запросы для атомарного обновления в транзакции
    const statements = Object.entries(data).map(([key, value]) => ({
      sql: 'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
      args: [key, typeof value === 'string' ? value : JSON.stringify(value)]
    }));

    await db.batch(statements, 'write');

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Settings Update Error:', err);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
