"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/hooks/useLanguage";
import { useGuest } from "@/hooks/useGuest";
import LanguageToggle from "./LanguageToggle";
import GuestLogin from "./GuestLogin";
import MusicPlayer from "./MusicPlayer";
import { Sparkles } from "lucide-react";

interface EnvelopeProps {
  children: React.ReactNode;
  settings?: Record<string, any>;
}

export default function Envelope({ children, settings = {} }: EnvelopeProps) {
  const { language, t } = useLanguage();
  const { guest, setGuest, loading } = useGuest();
  const [isOpen, setIsOpen] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const [showContent, setShowContent] = useState(false);
  const brideName = settings[`bride_name_${language}`] || settings.bride_name;
  const groomName = settings[`groom_name_${language}`] || settings.groom_name;
  const [formattedDate, setFormattedDate] = useState("");

  const [isPastWedding, setIsPastWedding] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

  useEffect(() => {
    const now = new Date();
    
    // Проверка даты свадьбы
    if (settings.wedding_date) {
      const weddingDate = new Date(settings.wedding_date);
      // Устанавливаем конец дня свадьбы
      weddingDate.setHours(23, 59, 59);
      if (now > weddingDate) {
        setIsPastWedding(true);
      }
    }

    // Проверка даты закрытия сайта
    if (settings.site_close_date) {
      const closeDate = new Date(settings.site_close_date);
      closeDate.setHours(23, 59, 59);
      if (now > closeDate) {
        setIsClosed(true);
      } else {
        const diff = closeDate.getTime() - now.getTime();
        setDaysRemaining(Math.ceil(diff / (1000 * 60 * 60 * 24)));
      }
    }
  }, [settings.wedding_date, settings.site_close_date]);

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

  const envelopeText = settings[`envelope_text_${language}`] || settings.envelope_text;
  
  const colors = {
    top: settings.envelope_color_top || "#dcd7c5",
    bottom: settings.envelope_color_bottom || "#d4cfbd",
    inside: settings.envelope_color_inside || "#e6e2d3",
    text: settings.envelope_text_color || "#3d3d3d",
    stroke: settings.envelope_text_stroke_color || "#ffffff",
    strokeWidth: parseFloat(settings.envelope_text_stroke_width || "0"),
    fontFamily: settings.envelope_font_family === "custom" 
      ? settings.envelope_font_custom 
      : (settings.envelope_font_family || "var(--font-playfair)"),
  };

  const textStyle = {
    color: colors.text,
    fontFamily: colors.fontFamily,
    textShadow: (settings.envelope_text_stroke_enabled === "true" && colors.strokeWidth > 0) ? `
      -${colors.strokeWidth}px -${colors.strokeWidth}px 0 ${colors.stroke},
      ${colors.strokeWidth}px -${colors.strokeWidth}px 0 ${colors.stroke},
      -${colors.strokeWidth}px ${colors.strokeWidth}px 0 ${colors.stroke},
      ${colors.strokeWidth}px ${colors.strokeWidth}px 0 ${colors.stroke},
      0px -${colors.strokeWidth}px 0 ${colors.stroke},
      0px ${colors.strokeWidth}px 0 ${colors.stroke},
      -${colors.strokeWidth}px 0px 0 ${colors.stroke},
      ${colors.strokeWidth}px 0px 0 ${colors.stroke}
    ` : 'none'
  };

  const handleOpen = () => {
    setIsOpen(true);
    window.dispatchEvent(new CustomEvent('playWeddingMusic'));
    
    const doc = document.documentElement as any;
    if (doc.requestFullscreen) doc.requestFullscreen().catch(() => {});
    else if (doc.webkitRequestFullscreen) doc.webkitRequestFullscreen().catch(() => {});
    else if (doc.msRequestFullscreen) doc.msRequestFullscreen().catch(() => {});

    setTimeout(() => {
      setShowContent(true);
    }, 2200);
    
    setTimeout(() => {
      setIsRemoved(true);
    }, 4500);
  };

  if (isClosed) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#fdfbf7] p-8 text-center">
        <div className="max-w-md space-y-6">
          <div className="w-20 h-20 rounded-full bg-wedding-sage/10 flex items-center justify-center mx-auto mb-8">
            <Sparkles className="text-wedding-sage w-10 h-10" />
          </div>
          <h1 className="font-serif text-3xl text-wedding-graphite">Сайт завершил свою работу</h1>
          <p className="text-wedding-graphite/60 italic">
            Это приглашение больше недоступно. Благодарим вас за то, что разделили этот момент с нами!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <LanguageToggle />
      
      {daysRemaining !== null && daysRemaining <= 30 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[110] bg-wedding-sage/90 text-white px-6 py-2 rounded-full text-[10px] uppercase tracking-widest backdrop-blur-sm shadow-lg whitespace-nowrap">
          Сайт будет доступен еще {daysRemaining} {daysRemaining === 1 ? "день" : "дн."}
        </div>
      )}

      {loading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-[#fdfbf7] z-50">
          <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !guest ? (
        <GuestLogin onLogin={(g) => setGuest(g)} />
      ) : (
        <>
          <AnimatePresence>
            {!isRemoved && (
              <motion.div
                initial={{ opacity: 1, y: 0 }}
                exit={{ 
                  opacity: 0, 
                  scale: 2.5,
                  filter: "blur(15px)",
                  transition: { duration: 0.8, ease: "easeIn" }
                }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-[#f5f2eb]"
                style={{ perspective: "2500px" }}
              >
                <motion.div 
                  className="relative w-[90vw] max-w-[600px] aspect-[3/2] shadow-2xl"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={isOpen ? { y: isMobile ? 80 : 160, rotateX: 5, scale: isMobile ? 0.9 : 0.85 } : {}}
                  transition={{ duration: 2.5, ease: "easeInOut" }}
                >
                  <div 
                    className="absolute inset-0 rounded-sm border border-black/5 overflow-hidden"
                    style={{ backgroundColor: colors.inside }}
                  >
                    <div 
                      className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply"
                      style={{ backgroundImage: `url(${settings.paper_texture || 'https://www.transparenttextures.com/patterns/paper-fibers.png'})` }}
                    />
                  </div>

                  <motion.div
                    className="absolute inset-x-4 top-4 bottom-4 bg-white shadow-lg rounded-sm z-10 flex flex-col items-center justify-center p-8 overflow-hidden"
                    initial={{ y: 0 }}
                    animate={isOpen ? { y: isMobile ? "-75%" : "-65%", scale: isMobile ? 1.1 : 1.05 } : { y: 0 }}
                    transition={{ delay: 1.2, duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
                  >
                    <div className="absolute inset-2 border border-[#d4af37]/30 rounded-sm pointer-events-none" />
                    <div className="absolute inset-4 border border-[#d4af37]/10 rounded-sm pointer-events-none" />
                    
                    {isPastWedding ? (
                      <div className="text-center px-4">
                        <span className="block font-serif italic text-[#d4af37] text-lg mb-2">
                          {settings[`thank_you_title_${language}`]}
                        </span>
                        <p className="text-xs text-gray-500 mb-6 italic leading-relaxed">
                          {settings[`thank_you_desc_${language}`]}
                        </p>
                        <div className="flex flex-col gap-2">
                          {settings.prof_photos_url && (
                            <a 
                              href={settings.prof_photos_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[10px] uppercase tracking-widest text-[#d4af37] border border-[#d4af37]/30 py-2 px-4 rounded-full hover:bg-[#d4af37] hover:text-white transition-all"
                            >
                              Фотографии
                            </a>
                          )}
                          {settings.prof_videos_url && (
                            <a 
                              href={settings.prof_videos_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[10px] uppercase tracking-widest text-gray-400 border border-gray-200 py-2 px-4 rounded-full hover:bg-gray-100 transition-all"
                            >
                              Видео
                            </a>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <span className="block font-serif italic text-[#d4af37] text-xl mb-4">
                          {t.envelope.save_the_date}
                        </span>
                        <h2 className="font-serif text-2xl sm:text-3xl text-gray-800 tracking-widest uppercase mb-6 leading-tight">
                          {(settings.event_type || "wedding") === "wedding" ? (
                            <>{groomName || "Groom"} <br/> & <br/> {brideName || "Bride"}</>
                          ) : (settings.event_type || "wedding") === "birthday" ? (
                            <>{brideName || "Birthday Person"}</>
                          ) : (settings.event_type || "wedding") === "corporate" ? (
                            <>{brideName || "Company"} <br/> <span className="text-xl">{groomName || "Event"}</span></>
                          ) : (
                            <>{brideName} {groomName && <>& {groomName}</>}</>
                          )}
                        </h2>
                      </div>
                    )}
                  </motion.div>

                  <div 
                    className="absolute inset-0 z-20"
                    style={{ 
                      clipPath: "polygon(0% 0%, 0% 100%, 50% 50%)",
                      backgroundColor: colors.top,
                      filter: "brightness(0.95)"
                    }}
                  />

                  <div 
                    className="absolute inset-0 z-20"
                    style={{ 
                      clipPath: "polygon(100% 0%, 100% 100%, 50% 50%)",
                      backgroundColor: colors.top,
                      filter: "brightness(0.95)"
                    }}
                  />

                  <div 
                    className="absolute inset-0 z-20"
                    style={{ 
                      clipPath: "polygon(0% 100%, 100% 100%, 50% 50%)",
                      backgroundColor: colors.bottom,
                      filter: "brightness(0.98)"
                    }}
                  />

                  <motion.div 
                    className="absolute top-0 left-0 w-full h-full z-30 origin-top"
                    style={{ transformStyle: "preserve-3d" }}
                    initial={{ rotateX: 0 }}
                    animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                    transition={{ duration: 1.0, ease: "easeInOut", delay: 0.3 }}
                  >
                    <div 
                      className="absolute inset-0"
                      style={{ 
                        clipPath: "polygon(0% 0%, 100% 0%, 50% 50%)",
                        backgroundColor: colors.top,
                        backfaceVisibility: "hidden",
                        zIndex: 2
                      }}
                    >
                        <div className="absolute top-[12%] sm:top-[20%] left-1/2 -translate-x-1/2 text-center w-full px-4 sm:px-8">
                          <p 
                            className="italic text-base sm:text-2xl tracking-wide leading-tight"
                            style={textStyle}
                          >
                            {isPastWedding ? "Thank You!" : (envelopeText || t.envelope.invite_text)}
                          </p>
                        </div>
                    </div>

                    <div 
                      className="absolute inset-0"
                      style={{ 
                        clipPath: "polygon(0% 0%, 100% 0%, 50% 50%)",
                        backgroundColor: colors.inside,
                        transform: "rotateX(180deg)",
                        backfaceVisibility: "hidden",
                        zIndex: 1
                      }}
                    />
                  </motion.div>

                  <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center">
                    <motion.button
                      onClick={handleOpen}
                      className="pointer-events-auto outline-none group"
                      animate={isOpen ? { 
                        scale: 0, 
                        opacity: 0, 
                        rotate: 15,
                        y: -150 
                      } : { 
                        scale: 1, 
                        opacity: 1 
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.8, ease: "backIn" }}
                    >
                      <div className="relative w-20 h-20 sm:w-32 sm:h-32 drop-shadow-2xl rounded-full overflow-hidden">
                        <Image
                          src={settings.envelope_seal_image || "/images/wax-seal.png"}
                          alt="Wax Seal"
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover scale-[1.5] sm:scale-[1.7]"
                          priority
                        />
                      </div>
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <MusicPlayer url={settings.music_url} />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            animate={showContent ? { opacity: 1, scale: 1, filter: "blur(0px)" } : { opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </>
      )}
    </div>
  );
}
