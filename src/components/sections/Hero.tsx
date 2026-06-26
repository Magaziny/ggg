"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Countdown from "@/components/ui/Countdown";
import { useLanguage } from "@/hooks/useLanguage";
import { useGuest } from "@/hooks/useGuest";

export default function Hero({ settings }: { settings: Record<string, string | undefined> }) {
  const { language, t } = useLanguage();
  const { guest } = useGuest();
  const [formattedDate, setFormattedDate] = useState("");
  const weddingDateStr = settings.wedding_date || '2026-08-15';
  const weddingTimeStr = settings.wedding_time || '15:00';
  const targetDateTime = `${weddingDateStr}T${weddingTimeStr}`;

  const brideName = settings[`bride_name_${language}`] || settings.bride_name;
  const groomName = settings[`groom_name_${language}`] || settings.groom_name;

  useEffect(() => {
    if (settings.wedding_date) {
      const date = new Date(settings.wedding_date);
      if (language === 'ru') {
        setFormattedDate(date.toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }) + ' г.');
      } else {
        const monthsTk = [
          "ýanwar", "fewral", "mart", "aprel", "maý", "iýun", 
          "iýul", "awgust", "sentýabr", "oktýabr", "noýabr", "dekabr"
        ];
        const day = date.getDate();
        const month = monthsTk[date.getMonth()];
        const year = date.getFullYear();
        setFormattedDate(`${day}-nji ${month} ${year} ý.`);
      }
    }
  }, [settings.wedding_date, language]);

  const addToCalendar = () => {
    const title = encodeURIComponent(t.hero.wedding_title || "Wedding Invitation");
    const location = encodeURIComponent(settings[`venue_address_${language}`] || settings.venue_address || "");
    const details = encodeURIComponent(t.hero.welcome_guest.replace('[name]', guest?.name || ''));
    
    const start = targetDateTime.replace(/[-:]/g, "") + "00Z"; // Simplistic UTC conversion
    const end = targetDateTime.replace(/[-:]/g, "") + "00Z"; // One day event
    
    const googleUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
    window.open(googleUrl, '_blank');
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, x: -100, y: -100, rotate: -10 }}
          animate={{ opacity: 0.6, x: 0, y: 0, rotate: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute -top-20 -left-20 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px]"
        >
          <img src={settings.flowers_bg || "/images/flowers-bg.png"} alt="" className="w-full h-full object-contain" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 100, y: 100, rotate: 10 }}
          animate={{ opacity: 0.4, x: 0, y: 0, rotate: 0 }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
          className="absolute -bottom-20 -right-20 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] scale-x-[-1] rotate-180"
        >
          <img src={settings.flowers_bg || "/images/flowers-bg.png"} alt="" className="w-full h-full object-contain opacity-70" />
        </motion.div>
      </div>

      <div className="relative z-10 text-center px-4">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-wedding-sage uppercase tracking-[0.2em] mb-6 text-sm sm:text-base font-sans font-medium"
        >
          {(settings[`welcome_text_${language}`] || t.hero.welcome_guest).replace('[name]', guest?.name || '')}
        </motion.p>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-6xl sm:text-8xl md:text-9xl mb-8 font-serif text-wedding-graphite leading-tight"
        >
          {(settings.event_type || "wedding") === "wedding" ? (
            <>
              {groomName} <br />
              <span className="text-wedding-sage">{t.hero.and}</span> {brideName}
            </>
          ) : (settings.event_type || "wedding") === "birthday" ? (
            <>
              {brideName}
            </>
          ) : (settings.event_type || "wedding") === "corporate" ? (
            <>
              <span className="text-4xl sm:text-6xl text-wedding-sage">{brideName}</span> <br />
              {groomName}
            </>
          ) : (
            <>
              {brideName} {groomName && <><br/> <span className="text-wedding-sage">&</span> {groomName}</>}
            </>
          )}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="h-px w-24 bg-wedding-gold/50" />
          <p className="text-2xl sm:text-3xl font-serif italic text-wedding-graphite/80">
            {formattedDate}
          </p>
          <div className="h-px w-24 bg-wedding-gold/50" />
          
          <Countdown targetDate={targetDateTime} />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addToCalendar}
            className="flex items-center gap-2 px-6 py-2.5 bg-white/40 backdrop-blur-md border border-wedding-sage/20 rounded-full text-wedding-sage text-sm font-medium hover:bg-white/60 transition-all shadow-sm"
          >
            <CalendarIcon className="w-4 h-4" />
            {t.hero.calendar}
          </motion.button>

          <Button 
            onClick={() => document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' })}
            variant="primary" 
            size="lg" 
            className="mt-4"
          >
            {t.rsvp.submit}
          </Button>
        </motion.div>
      </div>


      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-wedding-sage"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-wedding-sage to-transparent mx-auto" />
      </motion.div>
    </section>
  );
}

