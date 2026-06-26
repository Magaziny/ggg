import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session || session.value !== "active") {
    redirect("/admin/login");
  }

  return <AdminLayout>{children}</AdminLayout>;
}
