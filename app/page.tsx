import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import TechStack from '@/components/TechStack';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Chester Luke A. Maligaso",
    "alternateName": ["Chester Maligaso", "Chester Luke", "Kukaass"],
    "jobTitle": "Full-Stack Software Developer",
    "description": "Full-Stack Developer specializing in MERN stack, Laravel, React, Node.js, and modern web solutions. Based in the Philippines.",
    "url": "https://kukaass.vercel.app",
    "image": "https://kukaass.vercel.app/logo.jpeg",
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
        <Experience />
        <Projects />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
