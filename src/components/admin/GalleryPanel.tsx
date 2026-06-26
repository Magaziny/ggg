"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Image as ImageIcon, X, ExternalLink, Calendar, User, Heart, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Photo {
  id: number;
  url: string;
  guest_name: string;
  created_at: string;
  likes: number;
}

interface GalleryPanelProps {
  initialPhotos: Photo[];
}

export default function GalleryPanel({ initialPhotos }: GalleryPanelProps) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [viewMode, setViewMode] = useState<"all" | "guests">("all");
  const [selectedGuest, setSelectedGuest] = useState<string | null>(null);

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Вы уверены, что хотите удалить это фото?")) return;
    
    try {
      const res = await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setPhotos(photos.filter(p => p.id !== id));
        if (selectedPhoto?.id === id) setSelectedPhoto(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Grouping logic
  const guestGroups = photos.reduce((acc, photo) => {
    if (!acc[photo.guest_name]) acc[photo.guest_name] = [];
    acc[photo.guest_name].push(photo);
    return acc;
  }, {} as Record<string, Photo[]>);

  const filteredPhotos = selectedGuest 
    ? photos.filter(p => p.guest_name === selectedGuest)
    : photos;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div>
            <h2 className="text-3xl font-serif text-wedding-graphite flex items-center gap-3">
              <ImageIcon className="text-wedding-sage w-8 h-8" />
              Живая галерея
            </h2>
            <p className="text-wedding-graphite/40 text-sm mt-1">
              Управление фотографиями гостей в реальном времени
            </p>
          </div>

          {photos.length > 0 && (
            <Button
              as="a"
              href="/api/gallery/download-all"
              variant="outline"
              className="rounded-xl px-4 py-2 border-wedding-sage/20 text-wedding-sage hover:bg-wedding-sage hover:text-white flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              Скачать всё (.zip)
            </Button>
          )}
        </div>

        <div className="flex bg-wedding-sage/5 p-1 rounded-2xl border border-wedding-sage/10">
          <button
            onClick={() => { setViewMode("all"); setSelectedGuest(null); }}
            className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
              viewMode === "all" ? "bg-white shadow-md text-wedding-sage" : "text-wedding-graphite/60 hover:text-wedding-sage"
            }`}
          >
            Все фото
          </button>
          <button
            onClick={() => setViewMode("guests")}
            className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
              viewMode === "guests" ? "bg-white shadow-md text-wedding-sage" : "text-wedding-graphite/60 hover:text-wedding-sage"
            }`}
          >
            По гостям
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "guests" && !selectedGuest ? (
          <motion.div
            key="guest-list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {Object.entries(guestGroups).map(([name, guestPhotos]) => (
              <button
                key={name}
                onClick={() => setSelectedGuest(name)}
                className="glass-card p-6 rounded-[2rem] border-white/40 shadow-sm hover:shadow-xl transition-all text-left flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-wedding-sage/10 relative">
                    <img src={guestPhotos[0].url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl text-wedding-graphite">{name}</h4>
                    <p className="text-xs text-wedding-graphite/40">{guestPhotos.length} фото</p>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-wedding-sage/5 text-wedding-sage group-hover:bg-wedding-sage group-hover:text-white transition-colors">
                  <ImageIcon className="w-5 h-5" />
                </div>
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="photo-grid"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {selectedGuest && (
              <div className="flex items-center gap-4 pb-4">
                <button 
                  onClick={() => setSelectedGuest(null)}
                  className="p-2 hover:bg-wedding-sage/5 rounded-full text-wedding-sage transition-colors"
                >
                  <X className="w-6 h-6 rotate-[-90deg]" />
                </button>
                <div>
                  <h3 className="text-2xl font-serif text-wedding-graphite">Фото от: {selectedGuest}</h3>
                  <p className="text-xs text-wedding-graphite/40">{guestGroups[selectedGuest]?.length} снимков</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredPhotos.map((photo) => (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="group relative glass-card p-2 rounded-[2rem] border-white/40 shadow-sm hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <div className="aspect-square rounded-[1.5rem] overflow-hidden bg-wedding-sage/5 relative">
                    <img src={photo.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                    <button
                      onClick={(e) => handleDelete(photo.id, e)}
                      className="absolute top-4 right-4 bg-white/90 text-red-500 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4 space-y-1">
                    <div className="flex items-center gap-2 text-wedding-graphite/60">
                      <User className="w-3 h-3 text-wedding-sage" />
                      <p className="text-xs font-medium truncate">{photo.guest_name}</p>
                    </div>
                    <div className="flex items-center gap-2 text-wedding-graphite/30">
                      <Calendar className="w-3 h-3" />
                      <p className="text-[10px] uppercase">
                        {new Date(photo.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-red-400/60 pt-1">
                      <Heart className={`w-3 h-3 ${photo.likes > 0 ? "fill-red-400" : ""}`} />
                      <p className="text-[10px] font-bold">{photo.likes || 0}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {photos.length === 0 && (
        <div className="text-center py-32 bg-wedding-sage/5 rounded-[3rem] border-2 border-dashed border-wedding-sage/20">
          <ImageIcon className="w-12 h-12 text-wedding-sage/20 mx-auto mb-4" />
          <p className="text-wedding-graphite/40 italic">Галерея пока пуста. Фото появятся здесь после того, как гости начнут их загружать.</p>
        </div>
      )}

      {/* Admin Fullscreen View */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
              className="absolute inset-0 bg-wedding-graphite/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-2/3 aspect-square md:aspect-auto bg-black flex items-center justify-center">
                  <img src={selectedPhoto.url} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="w-full md:w-1/3 p-8 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-2xl font-serif text-wedding-graphite">Детали фото</h3>
                      <button onClick={() => setSelectedPhoto(null)} className="p-2 hover:bg-wedding-sage/5 rounded-full">
                        <X className="w-5 h-5 text-wedding-graphite/40" />
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <p className="text-[10px] text-wedding-graphite/40 uppercase tracking-widest">Отправил гость</p>
                        <div className="flex items-center gap-2 text-wedding-graphite text-lg">
                          <User className="w-5 h-5 text-wedding-sage" />
                          {selectedPhoto.guest_name}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-wedding-graphite/40 uppercase tracking-widest">Время снимка</p>
                        <div className="flex items-center gap-2 text-wedding-graphite/60">
                          <Calendar className="w-4 h-4 text-wedding-sage" />
                          {new Date(selectedPhoto.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-wedding-sage/10 flex flex-col gap-3">
                    <a 
                      href={selectedPhoto.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-wedding-sage/10 text-wedding-sage rounded-xl font-medium hover:bg-wedding-sage/20 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" /> Открыть оригинал
                    </a>
                    <Button 
                      onClick={(e) => handleDelete(selectedPhoto.id, e)}
                      variant="outline" 
                      className="w-full border-red-100 text-red-500 hover:bg-red-50 py-3 rounded-xl flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" /> Удалить фото
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
