import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const { password } = await req.json();

  if (password === process.env.ADMIN_PASSWORD) {
    const response = NextResponse.json({ success: true });
    
    // Set a simple session cookie
    response.cookies.set('admin_session', 'active', {
      httpOnly: true,
      secure: false, // Set to false to allow login via HTTP (non-SSL)
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return response;
  }

  return NextResponse.json({ success: false }, { status: 401 });
}
