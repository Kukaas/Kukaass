'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import GlassCard from './GlassCard';
import { viewTransitionStyle } from '@/hooks/use-view-transition-router';

// Custom CSS for hiding scrollbar
const scrollbarHideStyles = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;

interface ImageCarouselProps {
  images: string[];
  title: string;
  className?: string;
  /** view-transition-name for the hero image box, to morph from a project card. */
  heroViewTransitionName?: string;
  /** Stable id for the shared hero element, used as a wait target. */
  heroId?: string;
}

export default function ImageCarousel({
  images,
  title,
  className = '',
  heroViewTransitionName,
  heroId,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!images || images.length === 0) {
    return null;
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: scrollbarHideStyles }} />
      {/* Main Carousel */}
      <div className={`relative ${className}`}>
        <GlassCard>
          <div
            data-vt-image={heroId}
            style={viewTransitionStyle(heroViewTransitionName)}
            className="relative overflow-hidden rounded-xl aspect-video sm:aspect-video"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full"
              >
                <Image
                  src={images[currentIndex]}
                  alt={`${title} - Image ${currentIndex + 1}`}
                  fill
                  className="object-cover cursor-pointer"
                  onClick={toggleFullscreen}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevImage}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full transition-colors duration-200 backdrop-blur-sm"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextImage}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full transition-colors duration-200 backdrop-blur-sm"
                >
                  <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
                </motion.button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-black/50 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm backdrop-blur-sm">
              {currentIndex + 1} / {images.length}
            </div>

            {/* Fullscreen Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleFullscreen}
              className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full transition-colors duration-200 backdrop-blur-sm"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </motion.button>
          </div>

          {/* Thumbnail Navigation */}
          {images.length > 1 && (
            <div className="flex gap-1.5 sm:gap-2 mt-3 sm:mt-4 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((image, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => goToImage(index)}
                  className={`flex-shrink-0 relative overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                    index === currentIndex
                      ? 'border-brand scale-105'
                      : 'border-border hover:border-foreground/40'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    width={80}
                    height={60}
                    className="object-cover w-16 h-12 sm:w-20 sm:h-15"
                  />
                </motion.button>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="relative w-full h-full flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative max-w-full max-h-full"
              >
                <Image
                  src={images[currentIndex]}
                  alt={`${title} - Image ${currentIndex + 1}`}
                  width={1200}
                  height={800}
                  className="max-w-full max-h-full object-contain"
                  sizes="100vw"
                />
              </motion.div>
            </AnimatePresence>

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleFullscreen}
              className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition-colors duration-200 backdrop-blur-sm"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.button>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevImage}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-4 rounded-full transition-colors duration-200 backdrop-blur-sm"
                >
                  <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextImage}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-4 rounded-full transition-colors duration-200 backdrop-blur-sm"
                >
                  <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                </motion.button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-lg backdrop-blur-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
