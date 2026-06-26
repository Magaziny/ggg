"use client";

import { motion } from "framer-motion";
import { 
  Heart, Music, Utensils, Cake, Camera, GlassWater, 
  Star, MapPin, Calendar, Sparkles, Waves, Clock, 
  Users, PartyPopper 
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Heart, Music, Utensils, Cake, Camera, GlassWater, 
  Star, MapPin, Calendar, Sparkles, Waves, Clock, 
  Users, PartyPopper
};
import { useLanguage } from "@/hooks/useLanguage";

interface TimingEvent {
  time: string;
  title?: string;
  desc?: string;
  [key: string]: string | undefined; // Allow title_ru, title_tk etc
}

export default function Timing({ settings }: { settings: Record<string, string | undefined> }) {
  const { language, t } = useLanguage();
  const events: TimingEvent[] = settings.timing_json ? JSON.parse(settings.timing_json) : [
    { time: "15:00", title_ru: "Церемония", title_tk: "Dabaranyň açylyşy", desc_ru: "Торжественная регистрация брака", desc_tk: "Nika dabarasy" },
    { time: "18:00", title_ru: "Ужин", title_tk: "Agşam nahary", desc_ru: "Праздничный банкет", desc_tk: "Toý saçagy" }
  ];

  const icons = [Heart, Calendar, Music, MapPin];

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-serif text-wedding-graphite mb-6">{t.timing.title}</h2>
          <div className="w-24 h-1 bg-wedding-sage mx-auto" />
          <p className="mt-4 text-wedding-graphite/60 italic">{t.timing.desc}</p>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-wedding-sage/20 hidden sm:block" />

          <div className="space-y-12">
            {events.map((event: TimingEvent, index: number) => {
              const Icon = ICON_MAP[event.icon || ""] || Clock;
              const title = event[`title_${language}`] || event.title;
              const desc = event[`desc_${language}`] || event.desc;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className={`flex flex-col sm:flex-row items-center ${
                    index % 2 === 0 ? "sm:flex-row-reverse" : ""
                  }`}
                >
                  <div className="flex-1 w-full sm:w-1/2 px-8 text-center sm:text-left">
                    <div className={`${index % 2 === 0 ? "sm:text-right" : ""}`}>
                      <span className="text-wedding-sage font-serif text-2xl">{event.time}</span>
                      <h3 className="text-2xl font-serif text-wedding-graphite mt-2">{title}</h3>
                      <p className="text-wedding-graphite/60 mt-2">{desc}</p>
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-wedding-sage rounded-full my-4 sm:my-0 shadow-lg">
                    <Icon className="text-white w-6 h-6" />
                  </div>

                  <div className="flex-1 hidden sm:block w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}


