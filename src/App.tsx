import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { BackgroundVideo } from './components/BackgroundVideo';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { HorizontalShowcase } from './components/HorizontalShowcase';
import { Skills } from './components/Skills';
import { Hackathons } from './components/Hackathons';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { type SeniorProjectData } from './data/projectsData';

export const App: React.FC = () => {
  const [modalProject, setModalProject] = useState<SeniorProjectData | null>(null);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Make lenis available on window for scroll triggers
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#060913] text-slate-100 selection:bg-rose-500 selection:text-white font-sans">
      {/* 
        Scroll-responsive 3D animated character layer (fixed, z-index: 0):
        Big in Hero without overlapping text.
        By the time the user reaches Section 02 (#projects), it has smoothly resized to its final small size.
      */}
      <BackgroundVideo />

      {/* Floating Glassomorphic Pill Navbar (z-index: 30) */}
      <Navbar />

      {/* Main Content Sections (z-index: 10) */}
      <main className="relative z-10 flex flex-col">
        {/* Hero Section */}
        <Hero />

        {/* 01 / Identity & Background */}
        <About />

        {/* 02 / Selected Projects */}
        <Projects />

        {/* 03 / Architectural Showcase */}
        <HorizontalShowcase />

        {/* 04 / Skills & Technologies */}
        <Skills />

        {/* 05 / Hackathons & Collaboration */}
        <Hackathons />

        {/* 06 / Get In Touch */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Senior Android Architecture & Project Deep-Dive Modal (z-index: 50) */}
      <ProjectModal
        key={modalProject?.id || 'none'}
        project={modalProject}
        onClose={() => setModalProject(null)}
      />
    </div>
  );
};

export default App;
