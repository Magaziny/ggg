"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";

export default function LoveStory({ settings }: { settings: Record<string, string | undefined> }) {
  const { language, t } = useLanguage();
  const title = settings[`love_story_title_${language}`] || settings.love_story_title;
  const text = settings[`love_story_text_${language}`] || settings.love_story_text;
  const quote = settings[`love_story_quote_${language}`] || settings.love_story_quote;

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Decoration */}
      <motion.div 
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 0.2, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="absolute top-0 right-0 w-[400px] h-[400px] pointer-events-none"
      >
        <img src={settings.flowers_bg || "/images/flowers-bg.png"} alt="" className="w-full h-full object-contain rotate-90" />
      </motion.div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl"
        >
          {settings.love_story_image ? (
            <img 
              src={settings.love_story_image} 
              alt="Our Story" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-tr from-wedding-sage/30 to-wedding-champagne/30" />
              <div className="absolute inset-0 flex items-center justify-center text-wedding-sage/20 font-serif italic text-4xl">
                {t.love_story.title}
              </div>
            </>
          )}
          {/* Overlay border */}
          <div className="absolute inset-6 border border-white/40 rounded-2xl" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="space-y-8"
        >
          <span className="text-wedding-sage uppercase tracking-widest text-sm font-sans">
            {(settings.event_type || "wedding") === "wedding" ? t.love_story.title : 
             (settings.event_type || "wedding") === "birthday" ? "Обо мне" : 
             (settings.event_type || "wedding") === "corporate" ? "О событии" : "История"}
          </span>
          <h2 className="text-5xl font-serif text-wedding-graphite leading-tight">
            {title || (
              (settings.event_type || "wedding") === "wedding" ? (language === 'ru' ? 'История Нашей Любви' : 'Söýgi taryhymyz') :
              (settings.event_type || "wedding") === "birthday" ? (language === 'ru' ? 'Немного обо мне' : 'Men barada gysgaça') :
              (settings.event_type || "wedding") === "corporate" ? (language === 'ru' ? 'О мероприятии' : 'Çäre barada') :
              (language === 'ru' ? 'Наша история' : 'Biziň taryhymyz')
            )}
          </h2>
          <p className="text-lg text-wedding-graphite/70 leading-relaxed font-sans whitespace-pre-wrap">
            {text}
          </p>
          <div className="pt-4">
            <p className="text-2xl font-serif italic text-wedding-sage">
              {quote}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


