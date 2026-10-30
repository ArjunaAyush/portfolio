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
import { NotFound } from './components/NotFound';
import { BlurredTransition } from './components/ui/blurred-transition';
import { type SeniorProjectData } from './data/projectsData';

export const App: React.FC = () => {
  const [modalProject, setModalProject] = useState<SeniorProjectData | null>(null);
  const [currentPath, setCurrentPath] = useState(() =>
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  // Client-side route listener for custom 404 support
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Initialize Lenis smooth scroll with clean natural physics (no laggy drag or wheel fight)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Make lenis globally available for smooth anchor triggers
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // Check if current route should display custom 404 page
  const is404 = currentPath !== '/' && currentPath !== '' && currentPath !== '/index.html';

  if (is404) {
    return <NotFound onNavigateHome={() => setCurrentPath('/')} />;
  }

  return (
    <div className="relative w-full min-h-screen bg-[#000000] text-[#FAF8F5] selection:bg-[#FF2A00] selection:text-white font-sans">
      {/* 
        Scroll-responsive 3D animated character layer (fixed, z-index: 20):
        Desktop: smooth head-turn with scroll-linked docking.
        Mobile: completely static neutral frame at original size.
      */}
      <BackgroundVideo />

      {/* Floating Glassomorphic Pill Navbar (z-index: 40) */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="relative flex flex-col">
        {/* Hero Section */}
        <Hero />

        {/* Apple-style Blurred Transition: Hero -> Gradient Section */}
        <BlurredTransition intensity="medium" />

        {/* 01 / Background */}
        <About />

        {/* 02 / Projects */}
        <Projects />

        {/* 03 / Subsystems */}
        <HorizontalShowcase />

        {/* 04 / Stack */}
        <Skills />

        {/* 05 / Sprints */}
        <Hackathons />

        {/* 06 / Contact */}
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
