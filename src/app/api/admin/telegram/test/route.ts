import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sendTelegramNotification } from '@/lib/telegram';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    if (!session || session.value !== 'active') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Тестовые данные для уведомления
    await sendTelegramNotification({
      name: "Тестовый Гость",
      attending: true,
      guests_count: 1,
      drinks: "Чай, Кофе",
      with_children: false,
      allergies: "Нет"
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Telegram Test Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to send test message' }, { status: 500 });
  }
}
