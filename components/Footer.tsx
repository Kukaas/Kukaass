'use client';

import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-gradient-to-b from-transparent to-gray-900/20">
      <div className="w-[90%] max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Main Footer Content */}
          <div className="space-y-4">
            <p className="text-gray-400 text-sm sm:text-base">
              © {currentYear} Chester Luke A. Maligaso. All rights reserved.
            </p>

            <p className="text-gray-500 text-xs">
              Built with modern web technologies and best practices
            </p>
          </div>

          {/* Decorative Line */}
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto mt-8" />
        </motion.div>
      </div>
    </footer>
  );
}
