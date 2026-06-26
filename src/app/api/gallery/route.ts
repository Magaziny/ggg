import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin_session');
    
    // Если это админ — отдаем все фотографии
    if (adminSession && adminSession.value === 'active') {
      const result = await db.execute('SELECT * FROM gallery ORDER BY created_at DESC');
      return NextResponse.json(result.rows);
    }

    const guestSession = cookieStore.get('guest_session');
    let guestId = null;
    
    if (guestSession) {
      try {
        const decodedValue = decodeURIComponent(guestSession.value);
        const data = JSON.parse(decodedValue);
        guestId = data.id;
      } catch (e) {
        console.error("Failed to parse guest session", e);
      }
    }

    if (guestId) {
      // Если это авторизованный гость — отдаем ТОЛЬКО ЕГО фотографии
      const result = await db.execute({
        sql: 'SELECT * FROM gallery WHERE guest_id = ? ORDER BY created_at DESC',
        args: [guestId]
      });
      return NextResponse.json(result.rows);
    } else {
      // Анонимные посетители не видят ничего
      return NextResponse.json([]);
    }
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('guest_session');
    
    let guestId = null;
    let guestName = 'Anonymous';
    
    if (session) {
      try {
        const decodedValue = decodeURIComponent(session.value);
        const data = JSON.parse(decodedValue);
        guestId = data.id;
        guestName = data.name;
        console.log(`Gallery upload from guest: ${guestName} (ID: ${guestId})`);
      } catch (e) {
        console.error("Failed to parse guest session", e);
      }
    } else {
      console.log("Gallery upload from anonymous or admin");
    }

    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

    await db.execute({
      sql: 'INSERT INTO gallery (guest_id, guest_name, url) VALUES (?, ?, ?)',
      args: [guestId, guestName, url]
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save photo' }, { status: 500 });
  }
}
