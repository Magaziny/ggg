import { getSetting } from './db';

export async function sendTelegramNotification(data: {
  name: string;
  attending: boolean;
  guests_count: number;
  drinks: string;
  with_children: boolean;
  allergies: string;
}) {
  const token = (await getSetting('telegram_bot_token')) || process.env.TELEGRAM_BOT_TOKEN;
  const chatId = await getSetting('telegram_chat_id');
  const enabled = (await getSetting('telegram_notifications_enabled')) === 'true';

  if (!token || !chatId || !enabled) {
    console.log('Telegram notification skipped:', { hasToken: !!token, hasChatId: !!chatId, enabled });
    return;
  }

  const eventType = (await getSetting('event_type')) || 'wedding';
  const brideName = (await getSetting('bride_name_ru')) || '';
  const groomName = (await getSetting('groom_name_ru')) || '';
  const eventDate = (await getSetting('wedding_date')) || '';

  const typeLabels: Record<string, string> = {
    wedding: 'Свадьба',
    birthday: 'День рождения',
    anniversary: 'Юбилей',
    corporate: 'Корпоратив',
    other: 'Событие'
  };

  const title = `${typeLabels[eventType] || 'Событие'}: ${brideName} ${eventType === 'wedding' ? '&' : ''} ${groomName}`.trim();
  const dateStr = eventDate ? new Date(eventDate).toLocaleDateString('ru-RU') : '';

  const statusEmoji = data.attending ? '✅' : '❌';
  const statusText = data.attending ? 'Придет' : 'Не сможет прийти';
  
  const message = `
<b>🔔 Новый ответ на приглашение!</b>
<b>${title}</b> ${dateStr ? `(${dateStr})` : ''}

👤 <b>Имя:</b> ${data.name}
${statusEmoji} <b>Статус:</b> ${statusText}
👥 <b>Гостей:</b> ${data.guests_count}
🍷 <b>Напитки:</b> ${data.drinks || '—'}
👶 <b>С детьми:</b> ${data.with_children ? 'Да' : 'Нет'}
⚠️ <b>Пожелания:</b> ${data.allergies || '—'}

#RSVP #Wedding #Invitation
  `.trim();

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Telegram API Error:', errorData);
    }
  } catch (err) {
    console.error('Failed to send Telegram notification:', err);
  }
}
