"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Volume2, VolumeX } from "lucide-react";

interface MusicPlayerProps {
  url?: string;
}

export default function MusicPlayer({ url }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Hide tooltip after 5 seconds
    const timer = setTimeout(() => setShowTooltip(false), 5000);

    const handleExternalPlay = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play().catch(err => console.log("Audio playback blocked", err));
        setIsPlaying(true);
      }
    };

    window.addEventListener('playWeddingMusic', handleExternalPlay);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('playWeddingMusic', handleExternalPlay);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.log("Audio playback blocked", err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[100] flex items-center gap-3">
      {url && <audio ref={audioRef} src={url} loop />}
      
      <AnimatePresence>
        {showTooltip && !isPlaying && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-wedding-sage/10 text-wedding-sage text-xs font-medium whitespace-nowrap"
          >
            Включить атмосферу ✨
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${
          isPlaying 
            ? "bg-wedding-sage text-white shadow-wedding-sage/20" 
            : "bg-white/90 text-wedding-sage hover:bg-wedding-sage hover:text-white"
        } backdrop-blur-md border border-white/50`}
      >
        {isPlaying ? (
          <div className="flex items-end gap-[2px] h-3">
            {[0.4, 0.7, 0.5, 0.9, 0.6].map((h, i) => (
              <motion.div
                key={i}
                animate={{ height: ["20%", "100%", "20%"] }}
                transition={{ 
                  duration: 0.5 + i * 0.1, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-[2px] bg-current rounded-full"
              />
            ))}
          </div>
        ) : (
          <Music className="w-5 h-5" />
        )}
      </motion.button>
    </div>
  );
}
