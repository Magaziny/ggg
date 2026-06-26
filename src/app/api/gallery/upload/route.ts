import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";

async function checkAuth() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get("admin_session");
  const guestSession = cookieStore.get("guest_session");
  
  return (adminSession && adminSession.value === "active") || !!guestSession;
}

export async function POST(req: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log(`Uploading file: ${file.name}, size: ${file.size}, type: ${file.type}`);

    const uploadDir = path.join(process.cwd(), "public/uploads");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {}

    // Ensure we have an extension
    let ext = path.extname(file.name) || ".jpg";
    const cleanName = file.name.replace(ext, "").replace(/[^a-z0-9]/gi, "-").toLowerCase();
    const filename = `gallery-${Date.now()}-${cleanName}${ext}`;
    const filePath = path.join(uploadDir, filename);
    
    await writeFile(filePath, buffer);
    console.log(`Saved to: ${filePath}`);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error("Gallery upload error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
