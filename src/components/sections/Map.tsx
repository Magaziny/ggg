"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/hooks/useLanguage";

interface VenuePhoto {
  url: string;
  caption: string;
}

export default function Map({ settings }: { settings: Record<string, string | undefined> }) {
  const { language, t } = useLanguage();
  const venuePhotos: VenuePhoto[] = settings.venue_photos_json ? JSON.parse(settings.venue_photos_json) : [];

  const venueName = settings[`venue_name_${language}`] || settings.venue_name;
  const venueAddress = settings[`venue_address_${language}`] || settings.venue_address;

  // Helper to convert share links to embed links
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    
    // Yandex Maps: Convert share link to widget link
    if (url.includes('yandex') && url.includes('/maps/-/')) {
      return url.replace('/maps/-/', '/map-widget/v1/-/');
    }

    // Google Maps: If it's already an embed link, keep it
    if (url.includes('google.com/maps/embed')) return url;
    
    return url;
  };

  const embedUrl = getEmbedUrl(settings.map_url || "") || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2244.430481195669!2d37.6173!3d55.7558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTXCsDQ1JzIwLjkiTiAzN8KwMzcnMDIuMyJF!5e0!3m2!1sru!2sru!4v1620000000000!5m2!1sru!2sru";
  
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-serif text-wedding-graphite mb-4">{t.map.title}</h2>
          <p className="text-wedding-sage italic">{t.map.address}</p>
        </div>

        {/* Venue Slider */}
        {venuePhotos.length > 0 && (
          <div className="mb-20">
            <div className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar">
              {venuePhotos.map((photo: VenuePhoto, idx: number) => photo.url && (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="min-w-[280px] sm:min-w-[400px] snap-center"
                >
                  <div className="aspect-[16/10] rounded-3xl overflow-hidden shadow-xl mb-4 group relative">
                    <img 
                      src={photo.url} 
                      alt={photo.caption} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <p className="text-white font-serif text-xl">{photo.caption}</p>
                    </div>
                  </div>
                  <p className="text-center text-wedding-graphite/60 font-medium text-sm tracking-widest uppercase">
                    {photo.caption}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="glass-card p-8 rounded-3xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-wedding-sage/10 rounded-full">
                  <MapPin className="text-wedding-sage w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif text-wedding-graphite mb-2">{t.map.title}</h3>
                  <p className="text-wedding-graphite/70">
                    {venueName || (language === 'ru' ? 'Усадьба "Золотой Лев"' : 'Toý dabarasy')}
                    <br />
                    {venueAddress}
                  </p>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open(settings.map_url || 'https://maps.google.com', '_blank')}
              >
                {t.map.open_maps}
              </Button>
            </div>

            {settings.dress_code_enabled === "true" && (
              <div className="glass-card p-8 rounded-3xl">
                <h3 className="text-2xl font-serif text-wedding-graphite mb-4">
                  {t.map.dress_code}
                </h3>
                <p className="text-wedding-graphite/70 mb-6">
                  {settings[`dress_code_text_${language}`] || settings.dress_code_text || t.map.dress_code_desc}
                </p>
                <div className="flex flex-wrap gap-4">
                  {(settings.dress_code_colors_json ? JSON.parse(settings.dress_code_colors_json) : ['#8A9A5B', '#F7E7CE', '#36454F', '#D4AF37']).map((color: string, idx: number) => (
                    <div 
                      key={idx} 
                      className="w-12 h-12 rounded-full shadow-inner border border-black/5" 
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="h-[500px] rounded-3xl overflow-hidden shadow-2xl border-8 border-white"
          >
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </motion.div>
        </div>
      </div>
    </section>
  );
}



