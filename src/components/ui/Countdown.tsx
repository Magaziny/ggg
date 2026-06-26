"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";

interface CountdownProps {
  targetDate: string;
}

export default function Countdown({ targetDate }: CountdownProps) {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return null;

  const items = [
    { label: t.hero.days, value: timeLeft.days },
    { label: t.hero.hours, value: timeLeft.hours },
    { label: t.hero.minutes, value: timeLeft.minutes },
    { label: t.hero.seconds, value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-4 sm:gap-8 justify-center items-center mt-8">
      {items.map((item, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="text-3xl sm:text-5xl font-serif text-wedding-graphite"
          >
            {String(item.value).padStart(2, '0')}
          </motion.div>
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-wedding-sage mt-2">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

