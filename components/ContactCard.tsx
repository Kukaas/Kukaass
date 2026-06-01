'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Mail, Github, Facebook, Instagram, ExternalLink } from 'lucide-react';
import GlassCard from './GlassCard';

const socialLinks = [
  { name: 'Email', href: 'mailto:maligaso.chesterlukea@gmail.com', icon: Mail },
  { name: 'GitHub', href: 'https://github.com/Kukaas', icon: Github },
  { name: 'Facebook', href: 'https://www.facebook.com/kukaass.dev/', icon: Facebook },
  { name: 'Instagram', href: 'https://www.instagram.com/itsmechester_/', icon: Instagram },
];

export default function ContactCard() {
  const reduce = useReducedMotion();

  return (
    <GlassCard className="max-w-md mx-auto p-6 sm:p-8">
      <div className="text-center space-y-6 sm:space-y-8">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
            Get in touch
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Let&apos;s work together on your next project.
          </p>
        </div>

        <div className="space-y-3">
          {socialLinks.map((link, index) => (
            <motion.a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={reduce ? false : { opacity: 0, x: -16 }}
              whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: index * 0.08, ease: [0.25, 1, 0.5, 1] }}
              viewport={{ once: true }}
              className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent hover:border-foreground/20 transition-colors duration-300 group text-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <div className="flex items-center gap-4">
                <link.icon className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" aria-hidden="true" />
                <span className="font-medium text-sm sm:text-base">{link.name}</span>
              </div>
              <ExternalLink className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
            </motion.a>
          ))}
        </div>

        <div className="pt-4 sm:pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Available for freelance projects and full-time roles.
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
