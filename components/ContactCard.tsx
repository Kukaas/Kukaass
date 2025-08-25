'use client';

import { motion } from 'framer-motion';
import { Mail, Github, Facebook, Instagram, ExternalLink } from 'lucide-react';
import GlassCard from './GlassCard';

const socialLinks = [
  {
    name: 'Email',
    href: 'mailto:maligaso.chesterlukea@gmail.com',
    icon: Mail,
    color: 'text-red-400 hover:text-red-300',
  },
  {
    name: 'GitHub',
    href: 'https://github.com/Kukaas',
    icon: Github,
    color: 'text-gray-400 hover:text-gray-300',
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/kukaass.dev/',
    icon: Facebook,
    color: 'text-blue-400 hover:text-blue-300',
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/itsmechester_/',
    icon: Instagram,
    color: 'text-pink-400 hover:text-pink-300',
  },
];

export default function ContactCard() {
  return (
    <GlassCard className="max-w-md mx-auto p-8">
      <div className="text-center space-y-8">
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">
            Get In Touch
          </h3>
          <p className="text-gray-400 leading-relaxed">
            Let&apos;s work together on your next project
          </p>
        </div>

        <div className="space-y-4">
          {socialLinks.map((link, index) => (
            <motion.a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 group ${link.color}`}
            >
              <div className="flex items-center gap-4">
                <link.icon className="w-5 h-5" />
                <span className="font-medium">{link.name}</span>
              </div>
              <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.a>
          ))}
        </div>

        <div className="pt-6 border-t border-white/10">
          <p className="text-sm text-gray-500 leading-relaxed">
            Available for freelance opportunities and full-time positions
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
