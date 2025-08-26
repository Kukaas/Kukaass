import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Kukaass",
  description: "Portfolio of Chester Luke A. Maligaso, a skilled full-stack developer specializing in MERN stack, Laravel, React, Node.js, and modern web solutions. View projects, skills, and contact information.",
  keywords: [
    "Chester Luke A. Maligaso",
    "Chester Maligaso",
    "Chester Luke",
    "Kukaass",
    "full-stack developer",
    "MERN stack",
    "Laravel",
    "React",
    "Node.js",
    "web development",
    "portfolio",
    "software developer",
    "frontend developer",
    "backend developer",
    "JavaScript",
    "TypeScript",
    "PHP",
    "MongoDB",
    "MySQL",
    "Next.js"
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
    title: "Kukaass Portfolio",
    description: "Portfolio of Chester Luke A. Maligaso, a skilled full-stack developer specializing in MERN stack, Laravel, React, Node.js, and modern web solutions.",
    type: "website",
    locale: "en_US",
    siteName: "Kukaass Portfolio",
    url: "https://kukaass.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kukaass Portfolio",
    description: "Portfolio of Chester Luke A. Maligaso, a skilled full-stack developer specializing in MERN stack, Laravel, React, Node.js, and modern web solutions.",
  },
  verification: {
    google: "Ji90_WE6M1rUzdy1bigGQjBUkw3kmwu8rVp-NDUCrkU",
  },
  icons: {
    icon: '/logo.jpeg',
    shortcut: '/logo.jpeg',
    apple: '/logo.jpeg',
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
        <meta name="google-site-verification" content="Ji90_WE6M1rUzdy1bigGQjBUkw3kmwu8rVp-NDUCrkU" />
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
        <link rel="sitemap" type="application/xml" title="Sitemap" href="https://kukaass.vercel.app/sitemap.xml" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="googlebot-news" content="nosnippet" />
        <link rel="canonical" href="https://kukaass.vercel.app/" />
      </head>
      <body
        className={`${poppins.variable} antialiased bg-background text-foreground overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
