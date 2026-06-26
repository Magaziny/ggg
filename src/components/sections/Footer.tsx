"use client";

import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, UserPlus, X } from "lucide-react";

export default function Footer({ settings }: { settings: Record<string, string | undefined> }) {
  const { language, t } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  
  const brideName = settings[`bride_name_${language}`] || settings.bride_name;
  const groomName = settings[`groom_name_${language}`] || settings.groom_name;
  
  const handleSaveContact = () => {
    const phone = settings.developer_phone || "";
    const vCardData = `BEGIN:VCARD\nVERSION:3.0\nFN:Создание Приглашений\nTEL;TYPE=CELL:${phone}\nEND:VCARD`;
    const dataUrl = `data:text/vcard;charset=utf-8,${encodeURIComponent(vCardData)}`;
    window.location.href = dataUrl;
    setShowModal(false);
  };

  return (
    <>
      <footer className="py-12 text-center bg-wedding-graphite text-wedding-champagne/60 font-sans text-sm flex flex-col items-center justify-center gap-4">
        
        {settings.developer_ad_enabled === 'true' && (
          <button 
            onClick={() => setShowModal(true)}
            className="text-sm font-medium animate-shimmer hover:opacity-80 transition-opacity underline underline-offset-4 leading-relaxed"
          >
            Заказать приглашение<br />можно по номеру
          </button>
        )}
      </footer>

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, y: "100%", scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: "100%", scale: 0.95 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed bottom-0 left-0 right-0 z-[101] p-4 sm:p-6 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-sm w-full"
            >
              <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative">
                <button 
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 text-wedding-graphite/40 hover:text-wedding-graphite p-2"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-xl font-serif text-wedding-graphite text-center mb-6 pr-6">
                  Связаться с разработчиком
                </h3>

                <div className="space-y-3">
                  <a 
                    href={`tel:${settings.developer_phone || ""}`}
                    onClick={() => setShowModal(false)}
                    className="flex items-center justify-center gap-3 w-full bg-wedding-sage text-white py-4 rounded-2xl font-medium shadow-lg hover:bg-wedding-sage/90 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    Позвонить
                  </a>

                  <button 
                    onClick={handleSaveContact}
                    className="flex items-center justify-center gap-3 w-full bg-wedding-sage/10 text-wedding-sage py-4 rounded-2xl font-medium hover:bg-wedding-sage/20 transition-colors"
                  >
                    <UserPlus className="w-5 h-5" />
                    Сохранить контакт
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
