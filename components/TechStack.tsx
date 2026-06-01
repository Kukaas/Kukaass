'use client';

import { motion, useAnimation, useReducedMotion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import SectionHeading from './SectionHeading';

interface TechItem {
  name: string;
  category: string;
  image: string;
  alt: string;
}

const techStack: TechItem[] = [
  // Frontend
  { name: 'React.js', category: 'Frontend', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', alt: 'React.js' },
  { name: 'Tailwind CSS', category: 'Frontend', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/1200px-Tailwind_CSS_Logo.svg.png', alt: 'Tailwind CSS' },
  { name: 'shadcn/ui', category: 'Frontend', image: 'https://images.seeklogo.com/logo-png/51/1/shadcn-ui-logo-png_seeklogo-519786.png', alt: 'shadcn/ui' },
  { name: 'TanStack', category: 'Frontend', image: 'https://tanstack.com/assets/splash-light-CHqMsyq8.png', alt: 'TanStack' },
  { name: 'Framer Motion', category: 'Frontend', image: 'https://cdn.worldvectorlogo.com/logos/framer-1.svg', alt: 'Framer Motion' },

  // Backend
  { name: 'Node.js', category: 'Backend', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', alt: 'Node.js' },
  { name: 'Express.js', category: 'Backend', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', alt: 'Express.js' },
  { name: 'Laravel', category: 'Backend', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Laravel.svg/1200px-Laravel.svg.png', alt: 'Laravel' },
  { name: 'PHP', category: 'Backend', image: 'https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg', alt: 'PHP' },

  // Databases
  { name: 'MongoDB', category: 'Database', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', alt: 'MongoDB' },
  { name: 'MySQL', category: 'Database', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', alt: 'MySQL' },

  // DevOps & Deployment
  { name: 'Docker', category: 'DevOps', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', alt: 'Docker' },
  { name: 'Ubuntu', category: 'DevOps', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ubuntu/ubuntu-plain.svg', alt: 'Ubuntu' },
  { name: 'Amazon Linux', category: 'DevOps', image: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg', alt: 'Amazon Linux' },
  { name: 'XAMPP', category: 'DevOps', image: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/78/XAMPP_logo.svg/1200px-XAMPP_logo.svg.png', alt: 'XAMPP' },

  // Payments & Integrations
  { name: 'Stripe', category: 'Payments', image: 'https://cdn.worldvectorlogo.com/logos/stripe-4.svg', alt: 'Stripe' },

  // Other Tools & Libraries
  { name: 'Mongoose', category: 'Tools', image: 'https://mongoosejs.com/docs/images/mongoose5_62x30_transparent.png', alt: 'Mongoose' },
  { name: 'JWT', category: 'Tools', image: 'https://jwt.io/img/pic_logo.svg', alt: 'JWT' },
];

export default function TechStack() {
  const [duplicatedStack, setDuplicatedStack] = useState<TechItem[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    // Duplicate the stack multiple times for infinite scroll effect
    const duplicated = [...techStack, ...techStack, ...techStack, ...techStack];
    setDuplicatedStack(duplicated);
  }, []);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is the sm breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (reduce) {
      controls.stop();
      return;
    }
    if (!isPaused) {
      controls.start({
        x: [positionRef.current, -50 * duplicatedStack.length],
        transition: {
          duration: 50,
          repeat: Infinity,
          ease: "linear"
        }
      });
    } else {
      controls.stop();
    }
  }, [controls, duplicatedStack.length, isPaused, reduce]);

  const handleMouseEnter = () => {
    // Only pause on desktop (non-mobile)
    if (!isMobile) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    // Only resume on desktop (non-mobile)
    if (!isMobile) {
      setIsPaused(false);
    }
  };

  const handleAnimationUpdate = (latest: { x: number }) => {
    if (latest && typeof latest.x === 'number') {
      positionRef.current = latest.x;
    }
  };

  return (
         <section id="tech-stack" className="py-12 sm:py-16 lg:py-20 px-2 sm:px-4 lg:px-8 overflow-hidden">
       <div className="w-full sm:w-[95%] max-w-6xl mx-auto">
        <SectionHeading
          title="Tech Stack"
          subtitle="The technologies and tools I reach for to build and ship web applications."
          className="mb-8 sm:mb-12 lg:mb-16"
        />

        <div className="relative">
          {/* Fade overlays so logos enter and leave the strip cleanly. */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          {/* Hybrid scroll container */}
          <div
            ref={containerRef}
            className={`overflow-x-auto scrollbar-hide ${isMobile ? 'pointer-events-none' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              animate={controls}
              onUpdate={handleAnimationUpdate}
              className="flex gap-8 sm:gap-12 lg:gap-16 items-center min-w-max py-4"
            >
              {duplicatedStack.map((tech, index) => (
                <motion.div
                  key={`${tech.name}-${index}`}
                  whileHover={reduce ? undefined : { y: -4 }}
                  className="flex flex-col items-center gap-3 sm:gap-4 min-w-[80px] sm:min-w-[100px] lg:min-w-[120px] group"
                >
                  <div className="relative">
                    <div
                      className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-card rounded-xl sm:rounded-2xl flex items-center justify-center p-2 sm:p-3 border border-border group-hover:border-foreground/30 transition-colors duration-300"
                      data-tech={`${tech.name}-${index}`}
                    >
                                             <Image
                         src={tech.image}
                         alt={tech.alt}
                         width={48}
                         height={48}
                                                 className={`w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300 ${
                          tech.name === 'Framer Motion' || tech.name === 'Express.js' || tech.name === 'Ubuntu' || tech.name === 'Amazon Linux' ? 'filter brightness-0 invert' : ''
                        }`}
                         onError={() => {
                           // Fallback for failed images - show text instead
                           const parent = document.querySelector(`[data-tech="${tech.name}-${index}"]`);
                           if (parent) {
                             parent.innerHTML = `<div class="text-white text-xs sm:text-sm font-medium">${tech.name}</div>`;
                           }
                         }}
                         unoptimized
                       />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs sm:text-sm font-medium text-foreground group-hover:text-brand transition-colors duration-300">
                      {tech.name}
                    </p>
                    <p className="text-xs text-muted-foreground transition-colors duration-300">
                      {tech.category}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
