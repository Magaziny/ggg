"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { LayoutDashboard, Users, Image as ImageIcon, Settings, LogOut } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  const tabs = [
    { name: "Дашборд", href: "/admin", icon: LayoutDashboard },
    { name: "Гости", href: "/admin/guests", icon: Users },
    { name: "Галерея", href: "/admin/gallery", icon: ImageIcon },
    { name: "Настройки", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-wedding-champagne/5 p-4 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif text-wedding-graphite mb-2">Управление тоем</h1>
            <p className="text-wedding-sage/60 italic">Панель администратора</p>
          </div>
          <form action="/api/admin/logout" method="POST">
            <Button
              variant="outline"
              className="border-red-100 text-red-400 hover:bg-red-50 rounded-full px-8 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Выйти
            </Button>
          </form>
        </div>

        {/* Tabs Navigation */}
        <div className="flex p-1 bg-wedding-sage/5 rounded-2xl mb-12 w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-white text-wedding-graphite shadow-sm" 
                    : "text-wedding-graphite/40 hover:text-wedding-sage hover:bg-white/50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-wedding-sage" : ""}`} />
                {tab.name}
              </Link>
            );
          })}
        </div>

        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
