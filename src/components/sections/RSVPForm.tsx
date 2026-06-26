"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/hooks/useLanguage";
import { useGuest } from "@/hooks/useGuest";

export default function RSVPForm({ settings = {} }: { settings?: Record<string, string> }) {
  const { language, t } = useLanguage();
  const { guest } = useGuest();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) setStatus("success");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-12 glass-card rounded-3xl"
      >
        <h3 className="text-3xl font-serif text-wedding-sage mb-4">{t.rsvp.success_title}</h3>
        <p className="text-wedding-graphite/80">{t.rsvp.success_desc}</p>
      </motion.div>
    );
  }

  return (
    <section id="rsvp" className="relative py-24 px-4 bg-wedding-champagne/10 overflow-hidden">
      {/* Decoration */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.15, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="absolute -bottom-20 -left-20 w-[500px] h-[500px] pointer-events-none"
      >
        <img src={settings.flowers_bg || "/images/flowers-bg.png"} alt="" className="w-full h-full object-contain -rotate-12" />
      </motion.div>

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-serif text-wedding-graphite mb-4">{t.rsvp.title}</h2>
          <p className="text-wedding-sage italic">
            {settings[`rsvp_deadline_text_${language}`] || t.rsvp.subtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 sm:p-12 rounded-3xl shadow-xl space-y-8">
          <div>
            <label className="block text-sm font-sans uppercase tracking-widest text-wedding-graphite/60 mb-2">
              {t.rsvp.name_label}
            </label>
            <input
              required
              name="name"
              type="text"
              defaultValue={guest?.name || ""}
              readOnly={!!guest}
              placeholder={t.rsvp.name_placeholder}
              className={`w-full bg-white/50 border-b-2 border-wedding-sage/30 py-3 focus:border-wedding-sage outline-none transition-colors font-sans ${guest ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-sans uppercase tracking-widest text-wedding-graphite/60 mb-4">
                {t.rsvp.attending_label}
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="attending" value="yes" required className="accent-wedding-sage w-4 h-4" />
                  <span className="group-hover:text-wedding-sage transition-colors">{t.rsvp.attending_yes}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="attending" value="no" className="accent-wedding-sage w-4 h-4" />
                  <span className="group-hover:text-wedding-sage transition-colors">{t.rsvp.attending_no}</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-sans uppercase tracking-widest text-wedding-graphite/60 mb-2">
                {t.rsvp.guests_count_label}
              </label>
              <select name="guests_count" className="w-full bg-white/50 border-b-2 border-wedding-sage/30 py-3 focus:border-wedding-sage outline-none transition-colors">
                <option value="1">{t.rsvp.person_1}</option>
                <option value="2">{t.rsvp.person_2}</option>
                <option value="3">{t.rsvp.person_3}</option>
              </select>
              <div className="mt-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    name="with_children" 
                    value="yes" 
                    className="accent-wedding-sage w-4 h-4 rounded" 
                  />
                  <span className="text-sm group-hover:text-wedding-sage transition-colors">
                    {t.rsvp.with_children_label}
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-sans uppercase tracking-widest text-wedding-graphite/60 mb-2">
              {t.rsvp.drinks_label}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 pt-2">
              {Object.entries(t.rsvp.drinks).map(([key, label]) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    name="drinks" 
                    value={label as string} 
                    className="accent-wedding-sage w-4 h-4 rounded" 
                  />
                  <span className="text-sm group-hover:text-wedding-sage transition-colors">
                    {label as string}
                  </span>
                </label>
              ))}
            </div>
          </div>


          <Button 
            type="submit" 
            disabled={status === "loading"}
            className="w-full py-5 text-xl tracking-widest uppercase"
          >
            {status === "loading" ? t.rsvp.submitting : t.rsvp.submit}
          </Button>
          
          {status === "error" && (
            <p className="text-red-500 text-center text-sm">{t.rsvp.error}</p>
          )}
        </form>
      </div>
    </section>
  );
}

