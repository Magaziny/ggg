import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';

async function checkAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return session && session.value === 'active';
}

export async function DELETE(req: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    await db.execute({
      sql: 'DELETE FROM gallery WHERE id = ?',
      args: [id]
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
