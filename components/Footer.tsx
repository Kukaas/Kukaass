'use client';

import { motion, useReducedMotion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const reduce = useReducedMotion();

  return (
    <footer className="py-16 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="w-[90%] max-w-4xl mx-auto">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          viewport={{ once: true }}
          className="text-center space-y-3"
        >
          <p className="text-muted-foreground text-sm sm:text-base">
            © {currentYear} Chester Luke A. Maligaso. All rights reserved.
          </p>
          <p className="text-muted-foreground/80 text-xs">
            Built with Next.js, TypeScript, and Tailwind CSS.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
