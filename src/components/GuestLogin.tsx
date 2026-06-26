"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/hooks/useLanguage";

export default function GuestLogin({ onLogin }: { onLogin: (guest: any) => void }) {
  const { language } = useLanguage();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [step, setStep] = useState<"phone" | "name">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/guest-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, name: step === "name" ? name : undefined }),
      });

      const data = await res.json();
      if (data.success) {
        onLogin(data.guest);
      } else if (data.needsName) {
        setStep("name");
      } else {
        setError(language === 'ru' ? "Произошла ошибка. Попробуйте еще раз." : "Ýalňyşlyk ýüze çykdy. Täzeden synanyşyň.");
      }
    } catch {
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white/50 backdrop-blur-sm">
      <motion.div 
        key={step}
        initial={{ opacity: 0, scale: 0.9, x: step === "name" ? 50 : 0 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        className="glass-card p-8 sm:p-12 rounded-[2.5rem] shadow-2xl max-w-md w-full text-center space-y-8"
      >
        <div className="space-y-2">
          <h2 className="text-3xl font-serif text-wedding-graphite">
            {step === "phone" 
              ? (language === 'ru' ? "Добро пожаловать" : "Hoş geldiňiz")
              : (language === 'ru' ? "Будем знакомы!" : "Tanyş bolalyň!")}
          </h2>
          <p className="text-wedding-graphite/60 italic">
            {step === "phone"
              ? (language === 'ru' ? "Введите номер телефона для входа" : "Girmek üçin telefon belgiňizi ýazyň")
              : (language === 'ru' ? "Вас нет в списке, но вы можете зарегистрироваться. Как вас зовут?" : "Siz sanawda ýok, ýöne hasaba durup bilersiňiz. Adyňyz näme?")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === "phone" ? (
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+993 61 123456"
                className="w-full bg-white/50 border-b-2 border-wedding-sage/30 py-4 px-6 text-center text-xl focus:border-wedding-sage outline-none transition-colors font-sans rounded-2xl"
                required
              />
            </div>
          ) : (
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={language === 'ru' ? "Имя и Фамилия" : "Adyňyz we Familiýaňyz"}
                className="w-full bg-white/50 border-b-2 border-wedding-sage/30 py-4 px-6 text-center text-xl focus:border-wedding-sage outline-none transition-colors font-sans rounded-2xl"
                required
                autoFocus
              />
            </div>
          )}

          {error && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm"
            >
              {error}
            </motion.p>
          )}

          <div className="flex flex-col gap-3">
            <Button 
              type="submit" 
              className="w-full py-6 text-lg uppercase tracking-widest"
              disabled={loading}
            >
              {loading 
                ? (language === 'ru' ? "Загрузка..." : "Ýüklenýär...") 
                : (step === "phone" 
                    ? (language === 'ru' ? "Далее" : "Dowam et")
                    : (language === 'ru' ? "Зарегистрироваться" : "Hasaba dur"))}
            </Button>
            
            {step === "name" && (
              <button 
                type="button"
                onClick={() => setStep("phone")}
                className="text-wedding-graphite/40 text-xs uppercase tracking-widest hover:text-wedding-graphite transition-colors"
              >
                {language === 'ru' ? "Назад" : "Yza"}
              </button>
            )}
          </div>
        </form>

        <p className="text-[10px] text-wedding-graphite/30 uppercase tracking-tighter">
          {language === 'ru' ? "Приглашение на свадьбу" : "Toý çakylygy"}
        </p>
      </motion.div>
    </div>
  );
}

