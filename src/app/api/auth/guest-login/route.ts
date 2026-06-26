import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db, { sanitizeRow } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { phone, name } = data;

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Phone is required' }, { status: 400 });
    }
    
    // Очищаем номер телефона
    const cleanPhone = String(phone).replace(/\D/g, '');
    
    // Ищем гостя
    const guestResult = await db.execute({
      sql: 'SELECT * FROM guests WHERE phone LIKE ?',
      args: [`%${cleanPhone}%`]
    });
    const guest = sanitizeRow(guestResult.rows[0]) as any;

    if (guest) {
      // Гость найден - логиним
      const response = NextResponse.json({ success: true, guest });
      const cookieStore = await cookies();
      cookieStore.set('guest_session', JSON.stringify({ id: guest.id, name: guest.name }), {
        httpOnly: true,
        secure: false, // Разрешаем куки по HTTP (без SSL)
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });
      return response;
    }

    // Если гость не найден и передано имя - регистрируем
    if (name) {
      const insertResult = await db.execute({
        sql: 'INSERT INTO guests (name, phone, attending, guests_count) VALUES (?, ?, 0, 1)',
        args: [name, phone]
      });
      const newGuest = { id: Number(insertResult.lastInsertRowid), name, phone };

      const response = NextResponse.json({ success: true, guest: newGuest });
      const cookieStore = await cookies();
      cookieStore.set('guest_session', JSON.stringify({ id: newGuest.id, name: newGuest.name }), {
        httpOnly: true,
        secure: false, // Разрешаем куки по HTTP (без SSL)
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });
      return response;
    }

    // Гость не найден и имя не передано - просим имя
    return NextResponse.json({ success: false, needsName: true });
  } catch (err) {
    console.error('Guest Login Error:', err);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('guest_session');
  
  if (session) {
    try {
      const guestData = JSON.parse(session.value);
      const guestResult = await db.execute({
        sql: 'SELECT * FROM guests WHERE id = ?',
        args: [guestData.id]
      });
      const guest = sanitizeRow(guestResult.rows[0]);
      if (guest) {
        return NextResponse.json({ authenticated: true, guest });
      }
    } catch (e) {
      return NextResponse.json({ authenticated: false });
    }
  }
  
  return NextResponse.json({ authenticated: false });
}
