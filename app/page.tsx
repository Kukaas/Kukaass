import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import TechStack from '@/components/TechStack';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Chester Luke A. Maligaso",
    "alternateName": ["Chester Maligaso", "Chester Luke", "Kukaass"],
    "jobTitle": "Full-stack Developer",
    "description": "Full-stack developer specializing in MERN stack, Laravel, React, Node.js, and modern web solutions",
    "url": "https://kukaass.vercel.app",
    "sameAs": [
      "https://github.com/Kukaas",
      "https://www.linkedin.com/in/chester-luke-maligaso-812732359",
      "https://www.facebook.com/kukaass.dev/",
      "https://www.tiktok.com/@kukaassdev",
      "https://www.instagram.com/itsmechester_/"
    ],
    "knowsAbout": [
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
      "Web Development",
      "Full-stack Development"
    ],
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Full-stack Developer",
      "description": "Developing modern web applications using various technologies and frameworks"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-x-hidden">
        <Navbar />
        <Hero />
        <About />
        <TechStack />
        <Projects />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
