import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';
import path from 'path';
import fs from 'fs';
import AdmZip from 'adm-zip';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin_session');
    const guestSession = cookieStore.get('guest_session');

    let photos: { url: string, guest_name: string }[] = [];

    if (adminSession && adminSession.value === 'active') {
      const result = await db.execute('SELECT url, guest_name FROM gallery');
      photos = result.rows as unknown as { url: string, guest_name: string }[];
    } else {
      let guestId = null;
      if (guestSession) {
        try {
          const decodedValue = decodeURIComponent(guestSession.value);
          const data = JSON.parse(decodedValue);
          guestId = data.id;
        } catch (e) {}
      }

      if (guestId) {
        const result = await db.execute({
          sql: 'SELECT url, guest_name FROM gallery WHERE guest_id = ?',
          args: [guestId]
        });
        photos = result.rows as unknown as { url: string, guest_name: string }[];
      } else {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }
    
    if (photos.length === 0) {
      return NextResponse.json({ error: 'No photos found' }, { status: 404 });
    }

    const zip = new AdmZip();
    const publicDir = path.join(process.cwd(), 'public');

    photos.forEach((photo, index) => {
      const relativePath = photo.url.startsWith('/') ? photo.url.slice(1) : photo.url;
      const filePath = path.join(publicDir, relativePath);
      
      if (fs.existsSync(filePath)) {
        const ext = path.extname(filePath);
        // Санитизация имени гостя для папки
        const folderName = (photo.guest_name || 'Anonymous').replace(/[<>:"/\\|?*]/g, '_');
        // Добавляем файл в папку гостя внутри ZIP
        zip.addLocalFile(filePath, folderName, `photo-${index + 1}${ext}`);
      }
    });

    const zipBuffer = zip.toBuffer();

    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename=gallery-all-photos.zip',
      },
    });
  } catch (error) {
    console.error('Download all error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
