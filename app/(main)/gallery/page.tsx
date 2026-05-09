"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<any | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch("/api/gallery");
        const data = await res.json();
        if (data.success) {
          setImages(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch gallery", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 lg:py-20 min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold font-heading text-primary mb-4">Photo Gallery</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Glimpses of life, events, and beautiful moments at Ummul Institute.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 dark:bg-zinc-800 rounded-xl aspect-square"></div>
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">No images found in the gallery.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {images.map((img, index) => (
            <motion.div
              key={img._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="relative  rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => setSelectedImage(img)}
            >
              <img
                src={img.imageUrl}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 text-center">
                <span className="text-white font-medium">{img.title}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog
        open={!!selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
      >
        <DialogContent className="max-w-5xl p-0 overflow-hidden border-none bg-transparent shadow-none">
          {selectedImage && (
            <div className="relative w-full h-[85vh] flex items-center justify-center">

              {/* Background Blur */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${selectedImage.imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="w-full h-full backdrop-blur-3xl bg-black/70" />
              </div>

              {/* Main Image Card */}
              <div className="relative z-10 max-w-4xl w-full mx-4">
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">

                  {/* Image */}
                  <img
                    src={selectedImage.imageUrl}
                    alt={selectedImage.title}
                    className="w-full max-h-[75vh] object-contain"
                  />

                  {/* Bottom Content */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">

                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          {selectedImage.title}
                        </h2>

                        <p className="text-sm text-gray-300 mt-1">
                          {selectedImage.category}
                        </p>
                      </div>

                      {/* Download Button */}
                      <Button
                        className="rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/20"
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
