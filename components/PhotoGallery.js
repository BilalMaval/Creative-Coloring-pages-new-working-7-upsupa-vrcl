'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function PhotoGallery({ images = [], mainImage, title }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  
  // Combine main image with gallery images
  const allImages = mainImage ? [mainImage, ...images] : images;
  
  if (allImages.length === 0) return null;
  
  const openGallery = (index) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };
  
  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };
  
  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };
  
  return (
    <>
      {/* Thumbnail Gallery */}
      {allImages.length > 1 && (
        <div className="mt-4">
          <p className="text-sm font-bold text-gray-700 mb-2">📷 Photo Gallery ({allImages.length} images)</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {allImages.map((img, index) => (
              <button
                key={index}
                onClick={() => openGallery(index)}
                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                  index === 0 ? 'border-blue-500' : 'border-gray-200 hover:border-blue-400'
                }`}
              >
                <Image
                  src={img}
                  alt={`${title} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 flex items-center justify-center transition-all">
                  <ZoomIn className="h-5 w-5 text-white opacity-0 hover:opacity-100" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Lightbox Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl bg-black/95 border-none p-0">
          <div className="relative">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X className="h-6 w-6 text-white" />
            </button>
            
            {/* Main Image */}
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={allImages[currentIndex]}
                alt={`${title} - Image ${currentIndex + 1}`}
                fill
                className="object-contain"
              />
            </div>
            
            {/* Navigation */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 rounded-full p-3 transition-colors"
                >
                  <ChevronLeft className="h-8 w-8 text-white" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 rounded-full p-3 transition-colors"
                >
                  <ChevronRight className="h-8 w-8 text-white" />
                </button>
                
                {/* Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-bold">
                  {currentIndex + 1} / {allImages.length}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
