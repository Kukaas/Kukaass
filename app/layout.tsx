import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "./providers";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import './globals.css'

// Geist Sans carries reading prose; Geist Mono carries all editor chrome
// (file tree, tabs, status bar, terminal). See DESIGN.md "Filament Dark".
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// The canonical origin: the apex, no www. Everything below derives from it so
// the structured data can never drift onto a different host than the
// canonical/OG URLs — it used to claim kukaass.vercel.app while every other
// signal said www.kukaass.app.
//
// This must agree with the host Vercel treats as primary. If www is primary
// there, www serves 200 and the apex 308-redirects to it, so a page reachable
// at www would be claiming a canonical that redirects away from itself — and
// Google discards a canonical it can't confirm. Apex must be the primary
// domain, with www redirecting to it.
const SITE_URL = "https://kukaass.app";

// The site name Google prints above the URL in a search result. Short and
// commonly-recognized on purpose: a title-shaped name ("… Portfolio",
// "Name | Job Title") gets declined and Google falls back to the bare domain.
// This must stay byte-identical to `openGraph.siteName` below — those are
// Google's #1 and #2 signals, and it wants them agreeing.
const SITE_NAME = "Kukaass";

const PERSON_ID = `${SITE_URL}/#person`;

// WebSite + Person structured data, in one @graph so the site and the person
// behind it are linked rather than two unrelated nodes. Rendered server-side in
// <head> so it stays stable and does not collide with client-injected
// third-party scripts during hydration.
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      "name": SITE_NAME,
      // Fallbacks Google may pick from if it declines the name above, most to
      // least preferred. The bare host is last: Google documents a lowercase
      // domain as the final backup.
      "alternateName": [
        "Chester Luke A. Maligaso",
        "Chester Luke A. Maligaso Portfolio",
        "kukaass.app"
      ],
      "url": SITE_URL,
      "description": "Portfolio of Chester Luke A. Maligaso (Kukaass), a Full-Stack Developer specializing in MERN stack, Laravel, React, Node.js, and modern web solutions.",
      "inLanguage": "en",
      "publisher": { "@id": PERSON_ID },
      "author": { "@id": PERSON_ID }
    },
    {
      "@type": "Person",
      "@id": PERSON_ID,
      "name": "Chester Luke A. Maligaso",
      "alternateName": ["Chester Maligaso", "Chester Luke", "Kukaass"],
      "jobTitle": "Full-Stack Software Developer",
      "description": "Full-Stack Developer specializing in MERN stack, Laravel, React, Node.js, and modern web solutions. Based in the Philippines.",
      "url": SITE_URL,
      "image": `${SITE_URL}/logo.jpeg`,
      "sameAs": [
        "https://github.com/Kukaas",
        "https://www.linkedin.com/in/chester-luke-maligaso-812732359",
        "https://www.facebook.com/kukaass.dev/",
        "https://www.tiktok.com/@kukaassdev",
        "https://www.instagram.com/itsmechester_/"
      ],
      "knowsAbout": [
        "Software Engineering",
        "Full-Stack Development",
        "MERN Stack",
        "Laravel",
        "React",
        "Node.js",
        "JavaScript",
        "TypeScript",
        "PHP",
        "MongoDB",
        "MySQL",
        "Next.js",
        "REST APIs",
        "Database Design"
      ],
      "worksFor": {
        "@type": "Organization",
        "name": "Freelance / Open for Opportunities"
      },
      "hasOccupation": {
        "@type": "Occupation",
        "name": "Software Developer",
        "occupationLocation": {
          "@type": "City",
          "name": "Manila"
        },
        "skills": "React, Node.js, Laravel, MongoDB, SQL"
      }
    }
  ]
};

export const metadata: Metadata = {
  title: "Chester Luke A. Maligaso (Kukaass) | Full-Stack Software Developer",
  description: "Portfolio of Chester Luke A. Maligaso (Kukaass), a skilled Full-Stack Developer specializing in MERN stack, Laravel, React, Node.js, and modern web solutions.",
  keywords: [
    "Chester Luke A. Maligaso",
    "Chester Maligaso",
    "Chester Luke",
    "Kukaass",
    "Full-Stack Developer",
    "Software Engineer",
    "Web Developer Philippines",
    "MERN Stack Developer",
    "Laravel Developer",
    "React Developer",
    "Node.js Developer",
    "Next.js Developer",
    "JavaScript expert",
    "TypeScript",
    "PHP",
    "MongoDB",
    "MySQL",
    "Portfolio",
    "Software Development"
  ],
  authors: [{ name: "Chester Luke A. Maligaso" }],
  creator: "Chester Luke A. Maligaso",
  publisher: "Chester Luke A. Maligaso",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Chester Luke A. Maligaso (Kukaass) | Full-Stack Software Developer",
    description: "Explore the portfolio of Chester Luke A. Maligaso (Kukaass), a Full-Stack Developer specializing in building modern, scalable web applications.",
    type: "website",
    locale: "en_US",
    // Google's second-choice source for the site name, after the WebSite
    // JSON-LD. Must match it, or the two signals compete and neither wins.
    siteName: SITE_NAME,
    url: SITE_URL,
    images: [
      {
        url: "/logo.jpeg",
        width: 1200,
        height: 630,
        alt: "Chester Luke A. Maligaso Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chester Luke A. Maligaso (Kukaass) | Full-Stack Software Developer",
    description: "Full-Stack Developer specializing in MERN stack, Laravel, and React. View my projects and skills.",
    images: ["/logo.jpeg"],
  },
  verification: {
    google: "-TXhZVd-r4o9jU4MDbDqfFDGOX6axZ5I-doaLReJ5ec",
    other: {
      'msvalidate.01': 'C77691FD4D0CFBB0AE2FB1AE6C4C552F',
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo.jpeg', type: 'image/jpeg', sizes: '32x32' },
    ],
    shortcut: '/favicon.ico',
    apple: '/logo.jpeg',
    other: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        url: '/favicon.ico',
      },
      {
        rel: 'icon',
        type: 'image/jpeg',
        url: '/logo.jpeg',
        sizes: '32x32',
      },
    ],
  },
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Apply the saved editor theme before paint to avoid a flash back to
            the default. Mirrors components/editor/theme.ts. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var T={'filament-dark':{m:'dark',b:'oklch(0.78 0.145 75)',d:'oklch(0.7 0.15 70)'},'filament-light':{m:'light',b:'oklch(0.72 0.15 70)',d:'oklch(0.66 0.16 65)'},'ember':{m:'dark',b:'oklch(0.7 0.19 35)',d:'oklch(0.63 0.2 32)'},'mint':{m:'dark',b:'oklch(0.78 0.14 165)',d:'oklch(0.71 0.15 163)'},'iris':{m:'dark',b:'oklch(0.72 0.15 285)',d:'oklch(0.65 0.17 285)'}};var id=localStorage.getItem('kukaass.theme')||'filament-dark';var t=T[id]||T['filament-dark'];var r=document.documentElement;r.classList.toggle('dark',t.m==='dark');r.style.setProperty('--brand',t.b);r.style.setProperty('--brand-deep',t.d);r.style.setProperty('--ring',t.b);}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
        <meta name="googlebot-news" content="nosnippet" />

        {/* Favicon links for better browser and search engine support */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/jpeg" href="/logo.jpeg" sizes="32x32" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo.jpeg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground overflow-x-hidden`}
      >
        <Providers>
          {children}
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
