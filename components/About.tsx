'use client';

import { motion } from 'framer-motion';
import GlassCard from './GlassCard';

export default function About() {
  return (
    <section id="about" className="py-16 sm:py-20 lg:py-24 px-3 sm:px-4 lg:px-8">
      <div className="w-[95%] sm:w-[90%] max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-8">
            About Me
          </h2>
          <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            <GlassCard className="h-full p-6 sm:p-8 lg:p-12">
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
                    I&apos;m chester
                  </h3>
                </div>

                <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-gray-300 leading-relaxed">
                  <p className="text-lg sm:text-xl font-medium">
                    full-stack developer crafting digital experiences through code
                  </p>
                  <p className="text-sm sm:text-base text-gray-400">
                    transforming ideas into elegant, scalable applications with expertise in{' '}
                    <span className="text-blue-400 font-semibold">MERN stack</span> and{' '}
                    <span className="text-cyan-400 font-semibold">modern technologies</span>
                  </p>
                </div>

                <div className="pt-4 sm:pt-6 border-t border-white/10">
                  <p className="text-xs sm:text-sm text-gray-500">
                    available for freelance opportunities and full-time positions
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-4 sm:space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-6 sm:p-8">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">🚀</div>
                  <h4 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">
                    Frontend Development
                  </h4>
                  <p className="text-sm sm:text-base text-gray-400">
                    React, Next.js, TypeScript, TailwindCSS
                  </p>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-6 sm:p-8">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">⚡</div>
                  <h4 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">
                    Backend Development
                  </h4>
                  <p className="text-sm sm:text-base text-gray-400">
                    Node.js, Express, MongoDB, Laravel
                  </p>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-6 sm:p-8">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">🎯</div>
                  <h4 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">
                    Full-Stack Solutions
                  </h4>
                  <p className="text-sm sm:text-base text-gray-400">
                    MERN Stack, REST APIs, GraphQL
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
