"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ImageIcon, CheckCircle2, Loader2, X, LogOut, Heart, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/hooks/useLanguage";
import { useGuest } from "@/hooks/useGuest";
import { compressImage } from "@/lib/imageUtils";
import { GallerySkeleton } from "@/components/ui/GallerySkeleton";

interface Photo {
  id: number;
  url: string;
  guest_name: string;
  created_at: string;
  likes: number;
}

export default function LiveGallery() {
  const { t } = useLanguage();
  const { guest, logout } = useGuest();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const fetchPhotos = useCallback(async () => {
    try {
      const res = await fetch("/api/gallery");
      if (!res.ok) {
        // Используем warn вместо error, чтобы не вызывать overlay в Next.js dev mode
        console.warn(`Gallery fetch failed: ${res.status}`);
        return;
      }
      const data = await res.json();
      if (Array.isArray(data) && isMounted.current) {
        setPhotos(data);
      }
    } catch (err) {
      console.warn("LIVE_GALLERY_FETCH_ERROR:", err);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
    const interval = setInterval(fetchPhotos, 30000);
    return () => clearInterval(interval);
  }, [fetchPhotos]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    
    const totalFiles = files.length;
    let uploadedCount = 0;

    try {
      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        
        // 1. Ужимаем изображение на клиенте (под экран телефона: макс. 800px ширина, 60% качество)
        const compressedBlob = await compressImage(file, 800, 0.6);
        
        const formData = new FormData();
        formData.append("file", compressedBlob, `moment-${Date.now()}-${i}.jpg`);

        // 2. Upload to storage
        const uploadRes = await fetch("/api/gallery/upload", {
          method: "POST",
          body: formData,
        });
        
        if (!uploadRes.ok) throw new Error("Upload failed");

        const uploadData = await uploadRes.json();

        if (uploadData.url) {
          // 3. Save to gallery DB
          await fetch("/api/gallery", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: uploadData.url }),
          });
        }
        
        uploadedCount++;
        setUploadProgress(Math.round((uploadedCount / totalFiles) * 100));
      }

      setShowSuccess(true);
      fetchPhotos();
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Upload error", err);
      alert(t.gallery.error_upload);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleLike = async (e: React.MouseEvent, photoId: number) => {
    e.stopPropagation();
    
    // Optimistic UI update
    setPhotos(prev => prev.map(p => p.id === photoId ? { ...p, likes: (p.likes || 0) + 1 } : p));

    try {
      await fetch("/api/gallery/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId }),
      });
    } catch (err) {
      console.error("Failed to like", err);
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    }
  };

  useEffect(() => {
    if (selectedPhotoIndex !== null) {
      document.body.classList.add("viewer-open", "overflow-hidden");
    } else {
      document.body.classList.remove("viewer-open", "overflow-hidden");
    }
    return () => document.body.classList.remove("viewer-open", "overflow-hidden");
  }, [selectedPhotoIndex]);

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedPhotoIndex !== null && selectedPhotoIndex < photos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") setSelectedPhotoIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhotoIndex, photos.length]);

  return (
    <section id="gallery" className="relative py-24 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-6xl font-serif text-wedding-graphite"
          >
            {t.gallery.title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-wedding-sage italic text-lg"
          >
            {t.gallery.subtitle}
          </motion.p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-16">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleUpload}
          />
          
          <Button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="rounded-full px-8 py-6 h-auto flex flex-col items-center gap-1 shadow-xl hover:scale-105 transition-transform bg-wedding-sage relative overflow-hidden"
          >
            {uploading && (
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                className="absolute inset-0 bg-wedding-graphite/10"
              />
            )}
            <div className="flex items-center gap-3">
              {uploading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Camera className="w-6 h-6" />
              )}
              <span className="text-lg uppercase tracking-widest relative z-10">
                {uploading ? `${t.gallery.uploading} ${uploadProgress}%` : t.gallery.take_photo}
              </span>
            </div>
          </Button>

          {photos.length > 0 && (
            <Button 
              as="a"
              href="/api/gallery/download-all"
              className="rounded-full px-8 py-6 h-auto flex flex-col items-center gap-1 shadow-xl hover:scale-105 transition-transform bg-white border-2 border-wedding-sage text-wedding-sage hover:bg-wedding-sage hover:text-white group"
            >
              <div className="flex items-center gap-3">
                <Download className="w-6 h-6 transition-transform group-hover:translate-y-1" />
                <span className="text-lg uppercase tracking-widest">{t.gallery.download_all}</span>
              </div>
            </Button>
          )}

          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-2 text-green-600 font-medium bg-green-50 px-4 py-2 rounded-full border border-green-100"
              >
                <CheckCircle2 className="w-5 h-5" />
                {t.gallery.success}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Photo Grid */}
        {loading ? (
          <GallerySkeleton />
        ) : (
          <div className="columns-2 lg:columns-3 gap-3 sm:gap-6 space-y-3 sm:space-y-6">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group break-inside-avoid"
              >
                <div className="relative overflow-hidden rounded-3xl shadow-lg bg-wedding-sage/5 aspect-auto">
                  <img 
                    src={photo.url} 
                    alt={`Moment by ${photo.guest_name}`}
                    className="w-full h-auto block group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  
                  {/* Overlay with Actions - Always Visible */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-5">
                    <div className="flex justify-between items-end">
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="text-white font-medium text-lg truncate">{photo.guest_name}</p>
                        <p className="text-white/60 text-xs">
                          {new Date(photo.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => handleLike(e, photo.id)}
                          className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-white hover:bg-white/20 transition-all active:scale-90"
                          title="Like"
                        >
                          <Heart className={`w-4 h-4 ${photo.likes > 0 ? "fill-red-500 text-red-500" : ""}`} />
                          <span className="text-sm font-bold">{photo.likes || 0}</span>
                        </button>
                        <a 
                          href={photo.url}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 bg-wedding-sage/80 backdrop-blur-md rounded-full text-white hover:bg-wedding-sage transition-all active:scale-90 shadow-lg"
                          title={t.gallery.download}
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {photos.length === 0 && !loading && !uploading && (
          <div className="text-center py-20 bg-wedding-sage/5 rounded-[3rem] border-2 border-dashed border-wedding-sage/20">
            <ImageIcon className="w-12 h-12 text-wedding-sage/20 mx-auto mb-4" />
            <p className="text-wedding-graphite/40 italic">{t.gallery.no_photos}</p>
          </div>
        )}
      </div>
    </section>
  );
}
