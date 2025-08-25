import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Chester Luke A. Maligaso - Full-stack Developer",
  description: "Portfolio of Chester Luke A. Maligaso, a full-stack developer specializing in MERN stack, Laravel, and modern web solutions.",
  keywords: ["full-stack developer", "MERN stack", "Laravel", "web development", "portfolio"],
  authors: [{ name: "Chester Luke A. Maligaso" }],
  creator: "Chester Luke A. Maligaso",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${poppins.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
