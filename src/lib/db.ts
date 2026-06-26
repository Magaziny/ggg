import { createClient } from '@libsql/client';
import path from 'path';
import fs from 'fs';

const isTurso = !!process.env.TURSO_DATABASE_URL;

let dbUrl = process.env.TURSO_DATABASE_URL || '';
let dbAuthToken = process.env.TURSO_AUTH_TOKEN || '';

if (!isTurso) {
  // Локальный режим работы с локальным SQLite файлом
  const dbDir = path.resolve(process.cwd(), 'db');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir);
  }
  const dbPath = path.resolve(dbDir, 'wedding.db');
  dbUrl = `file:${dbPath}`;
}

// Создаем глобальный клиент для предотвращения множественных подключений в режиме разработки Next.js
const globalForDb = global as unknown as { db: ReturnType<typeof createClient> };
export const db = globalForDb.db || createClient({
  url: dbUrl,
  authToken: dbAuthToken,
});

if (process.env.NODE_ENV !== 'production') globalForDb.db = db;

// Инициализация таблиц и начальных настроек
export async function initDb() {
  try {
    // Создание таблиц
    await db.execute(`
      CREATE TABLE IF NOT EXISTS guests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT,
        attending INTEGER DEFAULT 0,
        guests_count INTEGER DEFAULT 1,
        drinks TEXT,
        allergies TEXT,
        food_preference TEXT,
        with_children INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS gallery (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guest_id INTEGER,
        guest_name TEXT,
        url TEXT NOT NULL,
        likes INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Проверка наличия настроек и сидинг
    const settingsCountResult = await db.execute('SELECT COUNT(*) as count FROM settings');
    const count = Number(settingsCountResult.rows[0]?.count || 0);

    if (count === 0) {
      const defaultSettings = [
        ['bride_name', 'Мария'],
        ['groom_name', 'Александр'],
        ['wedding_date', '2026-08-15'],
        ['wedding_time', '15:00'],
        ['venue_name', 'Villa Politeama'],
        ['venue_address', 'г. Москва, ул. Примерная, 123'],
        ['map_url', 'https://yandex.ru/map-widget/v1/-/CCU8Z-R8~D'],
        ['love_story_title', 'История Нашей Любви'],
        ['love_story_text', 'Наша встреча была случайной, но именно она изменила всё. От первой прогулки в парке до того самого заветного "Да" — каждый момент был наполнен нежностью и смыслом.'],
        ['love_story_quote', '"Любовь — это не смотреть друг на друга, а смотреть в одном направлении."'],
        ['love_story_image', ''],
        ['venue_photos_json', JSON.stringify([
          { url: "", caption: "Зал" },
          { url: "", caption: "Тамада" },
          { url: "", caption: "Певцы" }
        ])],
        ['timing_json', JSON.stringify([
          { time: "15:00", title: "Церемония", desc: "Торжественная регистрация брака" },
          { time: "16:30", title: "Фуршет", desc: "Легкие закуски и поздравления" },
          { time: "18:00", title: "Ужин", desc: "Праздничный банкет" }
        ])],
        ['paper_texture', '/images/paper-texture.png'],
        ['flowers_bg', '/images/flowers-bg.png'],
        ['envelope_color_top', '#dcd7c5'],
        ['envelope_color_bottom', '#d4cfbd'],
        ['envelope_color_inside', '#e6e2d3'],
        ['envelope_text', 'Приглашение на свадьбу'],
        ['envelope_image_top', ''],
        ['envelope_image_bottom', ''],
        ['dress_code_enabled', 'true'],
        ['dress_code_text_ru', 'Мы будем очень рады, если вы поддержите цветовую гамму нашей свадьбы:'],
        ['dress_code_text_tk', 'Toýumyzyň reňk gammasyny goldasaňyz, örän şat bolarys:'],
        ['dress_code_colors_json', JSON.stringify(['#8A9A5B', '#F7E7CE', '#36454F', '#D4AF37'])],
        ['welcome_text_ru', 'Дорогой(ая) [name], приглашаем вас на нашу свадьбу!'],
        ['welcome_text_tk', 'Hormatly [name], Sizi toýymyza çagyrýarys!'],
        ['rsvp_deadline_text_ru', 'Будем признательны за ваш ответ до 1 июля'],
        ['rsvp_deadline_text_tk', 'Jogabyňyza 1-nji iýula çenli garaşýarys'],
        ['thank_you_title_ru', 'Спасибо, что были с нами!'],
        ['thank_you_title_tk', 'Biziň bilen bolanyňyz üçin sag boluň!'],
        ['thank_you_desc_ru', 'Этот день стал особенным благодаря вам. Ниже вы можете найти фотографии и видео с нашего торжества.'],
        ['thank_you_desc_tk', 'Siziň saýawyňyzda bu gün diýseň üýtgeşik boldy. Aşakda dabaramyzdan düşürilen suratlary we wideolary tapyp bilersiňiz.'],
        ['prof_photos_url', ''],
        ['prof_videos_url', ''],
        ['site_close_date', ''],
        ['event_type', 'wedding'],
        ['telegram_notifications_enabled', 'false'],
        ['telegram_chat_id', ''],
        ['telegram_bot_token', ''],
        ['site_theme', 'theme-sage'],
        ['heading_font', 'Playfair_Display']
      ];

      const statements = defaultSettings.map(s => ({
        sql: 'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
        args: [s[0], s[1]]
      }));
      
      await db.batch(statements, 'write');
    }
  } catch (err) {
    console.error('Error during database initialization:', err);
  }
}

// Запускаем инициализацию базы данных в фоне при первом импорте модуля
initDb().catch(err => {
  console.error('Database async initialization failed:', err);
});

export async function getSetting(key: string): Promise<string | null> {
  try {
    const result = await db.execute({
      sql: 'SELECT value FROM settings WHERE key = ?',
      args: [key]
    });
    const row = result.rows[0];
    return row ? (row.value as string) : null;
  } catch (e) {
    console.error(`Error fetching setting ${key}:`, e);
    return null;
  }
}

export default db;
