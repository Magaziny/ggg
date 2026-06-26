import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';
import { sendTelegramNotification } from '@/lib/telegram';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const cookieStore = await cookies();
    const session = cookieStore.get('guest_session');
    
    let guestId = null;
    if (session) {
      try {
        guestId = JSON.parse(session.value).id;
      } catch (e) {}
    }
    
    let finalName = data.name;
    
    if (guestId) {
      // Если имя не передано (обычно для зарегистрированных гостей), берем его из БД
      if (!finalName) {
        const guestResult = await db.execute({
          sql: 'SELECT name FROM guests WHERE id = ?',
          args: [guestId]
        });
        const guest = guestResult.rows[0] as { name: string } | undefined;
        finalName = guest?.name;
      }

      // Обновляем существующего гостя
      await db.execute({
        sql: `
          UPDATE guests 
          SET attending = ?, guests_count = ?, drinks = ?, with_children = ?, allergies = ?
          WHERE id = ?
        `,
        args: [
          data.attending === 'yes' ? 1 : 0,
          parseInt(data.guests_count as string) || 1,
          Array.isArray(data.drinks) ? data.drinks.join(', ') : (data.drinks || ''),
          data.with_children === 'yes' ? 1 : 0,
          data.allergies || '',
          guestId
        ]
      });
    } else {
      // Создаем новую запись
      await db.execute({
        sql: `
          INSERT INTO guests (name, attending, guests_count, drinks, with_children, allergies)
          VALUES (?, ?, ?, ?, ?, ?)
        `,
        args: [
          data.name,
          data.attending === 'yes' ? 1 : 0,
          parseInt(data.guests_count as string) || 1,
          Array.isArray(data.drinks) ? data.drinks.join(', ') : (data.drinks || ''),
          data.with_children === 'yes' ? 1 : 0,
          data.allergies || ''
        ]
      });
    }

    // Отправка уведомления в Telegram (не дожидаемся завершения, чтобы не блокировать ответ пользователю)
    sendTelegramNotification({
      name: finalName || data.name || "Аноним",
      attending: data.attending === 'yes',
      guests_count: parseInt(data.guests_count as string) || 1,
      drinks: Array.isArray(data.drinks) ? data.drinks.join(', ') : (data.drinks || ''),
      with_children: data.with_children === 'yes',
      allergies: data.allergies || ''
    }).catch(err => console.error('Notification error:', err));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('RSVP Error:', err);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}
