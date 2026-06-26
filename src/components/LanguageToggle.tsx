"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { motion } from "framer-motion";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[110] flex gap-2 language-toggle">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setLanguage("tk")}
        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all shadow-lg border ${
          language === "tk"
            ? "bg-wedding-sage text-white border-wedding-sage"
            : "bg-white/80 text-wedding-graphite border-white/40 hover:bg-white"
        }`}
      >
        TK
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setLanguage("ru")}
        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all shadow-lg border ${
          language === "ru"
            ? "bg-wedding-sage text-white border-wedding-sage"
            : "bg-white/80 text-wedding-graphite border-white/40 hover:bg-white"
        }`}
      >
        RU
      </motion.button>
    </div>
  );
}
