'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useActiveResume } from '@/hooks/use-resumes';

export default function Hero() {
  const { isLoading: isQueryLoading } = useActiveResume();
  const [isDownloading, setIsDownloading] = useState(false);
  const reduce = useReducedMotion();

  const isLoading = isQueryLoading || isDownloading;

  const handleDownloadCV = async () => {
    setIsDownloading(true);

    // A short delay so the loading state reads before the navigation.
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      // The server-side endpoint is more robust for in-app browsers (Facebook, etc.).
      window.location.href = '/api/resumes/active/download';
    } catch (error) {
      console.error('Download execution failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const scrollToProjects = () => {
    document.querySelector('#projects')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.25, 1, 0.5, 1] as const },
        };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16 sm:pt-20 lg:pt-24"
    >
      <div className="relative z-10 text-center w-[95%] sm:w-[90%] max-w-3xl mx-auto px-3 sm:px-4 lg:px-8">
        <motion.div {...rise(0)} className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium tracking-wide text-muted-foreground">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              {!reduce && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
              )}
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
            </span>
            Open to roles &amp; freelance work
          </span>
        </motion.div>

        <motion.p {...rise(0.05)} className="text-sm sm:text-base text-muted-foreground mb-3">
          Hello, I&apos;m
        </motion.p>

        <motion.h1
          {...rise(0.1)}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-[1.05] tracking-[-0.02em] mb-6"
          style={{ textWrap: 'balance' }}
        >
          Chester Luke A. Maligaso
        </motion.h1>

        <motion.div {...rise(0.2)} className="mb-9 sm:mb-12">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground mb-4">
            Full-stack Developer
          </h2>
          <p
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            style={{ textWrap: 'pretty' }}
          >
            I build full-stack web apps with React, Next.js, Node.js, and Laravel, from database
            schema to production deploy. Currently shipping projects across the MERN stack.
          </p>
        </motion.div>

        <motion.div
          {...rise(0.3)}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
        >
          <Button
            size="lg"
            onClick={scrollToProjects}
            className="group h-12 px-6 text-base w-full sm:w-auto"
          >
            View my work
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={handleDownloadCV}
            disabled={isLoading}
            aria-label="Download CV"
            className="h-12 px-6 text-base w-full sm:w-auto"
          >
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
            {isLoading ? 'Preparing…' : 'Download CV'}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
