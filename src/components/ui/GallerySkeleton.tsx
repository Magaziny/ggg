"use client";

import { motion } from "framer-motion";

export function GallerySkeleton() {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="break-inside-avoid">
          <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-full bg-wedding-sage/5 rounded-3xl"
            style={{ height: `${200 + (i % 3) * 100}px` }}
          />
        </div>
      ))}
    </div>
  );
}
