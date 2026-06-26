import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';

async function checkAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return session && session.value === 'active';
}

export async function GET() {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    const result = await db.execute("SELECT * FROM guests ORDER BY created_at DESC");
    return NextResponse.json(result.rows);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { name, phone } = await req.json();
    const result = await db.execute({
      sql: 'INSERT INTO guests (name, phone) VALUES (?, ?)',
      args: [name, phone]
    });
    return NextResponse.json({ success: true, id: Number(result.lastInsertRowid) });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    await db.execute({
      sql: 'DELETE FROM guests WHERE id = ?',
      args: [id]
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
