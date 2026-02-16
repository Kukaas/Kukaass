import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

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
    siteName: "Chester Luke A. Maligaso Portfolio",
    url: "https://kukaass.vercel.app",
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
    canonical: "https://kukaass.vercel.app/",
  },
  metadataBase: new URL('https://kukaass.vercel.app'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="google-site-verification" content="-TXhZVd-r4o9jU4MDbDqfFDGOX6axZ5I-doaLReJ5ec" />
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
        <link rel="sitemap" type="application/xml" title="Sitemap" href="https://kukaass.vercel.app/sitemap.xml" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="googlebot-news" content="nosnippet" />
        <link rel="canonical" href="https://kukaass.vercel.app/" />

        {/* Favicon links for better browser and search engine support */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/jpeg" href="/logo.jpeg" sizes="32x32" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo.jpeg" />
      </head>
      <body
        className={`${poppins.variable} antialiased bg-background text-foreground overflow-x-hidden`}
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
