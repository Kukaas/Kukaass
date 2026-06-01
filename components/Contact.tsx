'use client';

import { motion, useReducedMotion } from 'framer-motion';
import ContactCard from './ContactCard';
import SectionHeading from './SectionHeading';

export default function Contact() {
  const reduce = useReducedMotion();

  return (
    <section id="contact" className="py-16 sm:py-20 lg:py-24 px-3 sm:px-4 lg:px-8 overflow-hidden">
      <div className="w-[95%] sm:w-[90%] max-w-4xl mx-auto">
        <SectionHeading
          title="Let's Connect"
          subtitle="Have a project in mind or a role to fill? Send a message through any of these."
          className="mb-12 sm:mb-16"
        />

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 32 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <ContactCard />
        </motion.div>
      </div>
    </section>
  );
}
