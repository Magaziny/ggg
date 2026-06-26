import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { photoId } = await req.json();
    if (!photoId) return NextResponse.json({ error: 'Photo ID is required' }, { status: 400 });

    const result = await db.execute({
      sql: 'UPDATE gallery SET likes = likes + 1 WHERE id = ?',
      args: [photoId]
    });

    if (result.rowsAffected === 0) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Like error:', err);
    return NextResponse.json({ error: 'Failed to like photo' }, { status: 500 });
  }
}
