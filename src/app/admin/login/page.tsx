"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ password }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      setError("Неверный пароль");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={handleLogin} className="glass-card p-12 rounded-3xl w-full max-w-md shadow-2xl">
        <h1 className="text-3xl font-serif text-wedding-graphite text-center mb-8">Вход в панель</h1>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-sans uppercase tracking-widest text-wedding-graphite/60 mb-2">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/50 border-b-2 border-wedding-sage/30 py-3 focus:border-wedding-sage outline-none transition-colors"
              placeholder="Введите пароль"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <Button type="submit" className="w-full py-4 uppercase tracking-widest">
            Войти
          </Button>
        </div>
      </form>
    </div>
  );
}
