'use client';

import { motion } from 'framer-motion';
import ContactCard from './ContactCard';

export default function Contact() {
  return (
    <section id="contact" className="py-16 sm:py-20 lg:py-24 px-3 sm:px-4 lg:px-8">
      <div className="w-[95%] sm:w-[90%] max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-8">
            Let&apos;s Connect
          </h2>
          <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full" />
          <p className="text-sm sm:text-base text-gray-400 mt-6 sm:mt-8 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
            Ready to start a project or just want to chat? I&apos;d love to hear from you!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <ContactCard />
        </motion.div>
      </div>
    </section>
  );
}
