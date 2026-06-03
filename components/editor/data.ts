import type { LucideIcon } from 'lucide-react';
import { Github, Linkedin, Mail, Facebook, Instagram } from 'lucide-react';

/** Shared ease-out curve used across the editor (matches the rest of the app). */
export const EASE = [0.25, 1, 0.5, 1] as const;

export const PROFILE = {
  name: 'Chester Luke A. Maligaso',
  handle: 'kukaass',
  role: 'Full-stack Developer',
  location: 'Philippines',
  email: 'maligaso.chesterlukea@gmail.com',
  github: 'https://github.com/Kukaas',
  linkedin: 'https://www.linkedin.com/in/chester-luke-maligaso-812732359',
} as const;

export interface SocialLink {
  name: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

export const SOCIALS: SocialLink[] = [
  { name: 'GitHub', label: 'github.com/Kukaas', href: PROFILE.github, icon: Github },
  { name: 'LinkedIn', label: 'in/chester-luke-maligaso', href: PROFILE.linkedin, icon: Linkedin },
  { name: 'Email', label: PROFILE.email, href: `mailto:${PROFILE.email}`, icon: Mail },
  { name: 'Facebook', label: 'facebook.com/kukaass.dev', href: 'https://www.facebook.com/kukaass.dev/', icon: Facebook },
  { name: 'Instagram', label: 'instagram.com/itsmechester_', href: 'https://www.instagram.com/itsmechester_/', icon: Instagram },
];
