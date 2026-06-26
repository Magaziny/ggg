import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db, { sanitizeRows } from '@/lib/db';
import * as XLSX from 'xlsx';

async function checkAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return session && session.value === 'active';
}

export async function GET() {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const result = await db.execute("SELECT * FROM guests ORDER BY attending DESC, name ASC");
    const guests: any[] = sanitizeRows(result.rows);

    // Prepare data for Excel
    const data = guests.map(g => ({
      'Имя': g.name,
      'Телефон': g.phone || '-',
      'Статус': g.attending ? 'Подтвердил' : (g.created_at ? 'Отклонил' : 'Нет ответа'),
      'Кол-во гостей': g.guests_count || 1,
      'Напитки': g.drinks || '-',
      'С детьми': g.with_children ? 'Да' : 'Нет',
      'Аллергии': g.allergies || '-',
      'Дата ответа': g.created_at ? new Date(g.created_at).toLocaleDateString() : '-'
    }));

    // Calculate stats for the bottom
    const totalGuests = guests.reduce((acc, g) => acc + (Number(g.guests_count) || 1), 0);
    const confirmedCount = guests.filter(g => g.attending).reduce((acc, g) => acc + (Number(g.guests_count) || 1), 0);
    const childrenCount = guests.filter(g => g.attending).reduce((acc, g) => acc + (Number(g.with_children) || 0), 0);
    const drinkingCount = guests.filter(g => g.attending && g.drinks && g.drinks.toLowerCase() !== "не пью").length;

    // Add empty rows and stats
    data.push({} as any);
    data.push({ 'Имя': 'ИТОГОВАЯ СТАТИСТИКА' } as any);
    data.push({ 'Имя': 'Всего приглашенных', 'Телефон': totalGuests } as any);
    data.push({ 'Имя': 'Подтвердили участие', 'Телефон': confirmedCount } as any);
    data.push({ 'Имя': 'Будут с детьми', 'Телефон': childrenCount } as any);
    data.push({ 'Имя': 'Пьющие гости', 'Телефон': drinkingCount } as any);

    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Guests");

    // Generate buffer
    const buf = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Disposition': 'attachment; filename="wedding_guests.xlsx"',
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });
  } catch (err) {
    console.error('Export error:', err);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
