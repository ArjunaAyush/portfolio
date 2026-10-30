import React, { useState } from 'react';
import { BackgroundCubesGrid } from './ui/background-cubes-grid';
import { AnimatedTooltip } from './ui/animated-tooltip';

const TECH_STACK_ITEMS = [
  {
    id: 1,
    name: 'Kotlin',
    designation: 'Modern Language & Coroutines v2.1',
    image: '/icons/kotlin.svg',
  },
  {
    id: 2,
    name: 'Jetpack Compose',
    designation: 'Declarative Reactive UI & M3 Tokens',
    image: '/icons/compose.svg',
  },
  {
    id: 3,
    name: 'Android SDK',
    designation: 'Native APIs & WorkManager',
    image: '/icons/android.svg',
  },
  {
    id: 4,
    name: 'AndroidX Media3',
    designation: 'ExoPlayer & Zero-Buffer Looping',
    image: '/icons/media3.svg',
  },
  {
    id: 5,
    name: 'Room SQLite',
    designation: 'Local-First Resilient Persistence',
    image: '/icons/room.svg',
  },
  {
    id: 6,
    name: 'Coroutines & Flow',
    designation: 'Structured Concurrency & StateFlow',
    image: '/icons/coroutines.svg',
  },
];

export const Hero: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleScrollTo = (targetId: string) => {
    const lenis = (window as unknown as { __lenis?: { scrollTo: (target: string) => void } }).__lenis;
    if (lenis) {
      lenis.scrollTo(targetId);
    } else {
      const el = document.querySelector(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleCopyEmail = async () => {
    const email = 'ayushkumar134go@gmail.com';
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = email;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen min-h-[100dvh] flex flex-col justify-center px-5 sm:px-8 md:px-12 lg:px-16 pt-20 pb-12 overflow-hidden z-10"
    >
      {/* 3D Perspective Cubes Grid (Hero Background Floor, Deep Navy Secondary on Pure Black) */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <BackgroundCubesGrid
          variant="perspective"
          backgroundColor="#000000"
          baseColor="#081638"
          waveColor="#FF2A00"
          glow={1.0}
          amplitude={0.38}
          tilt={0.65}
          idleRipples={true}
          className="w-full h-full"
        />
        {/* Subtle radial blend for high contrast Milk text readability */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_45%_50%,rgba(0,0,0,0.1),#000000_90%)]"
        />
      </div>

      <div className="site-container relative z-30 max-w-2xl">
        {/* Eyebrow Badge (Amber Red Accent + Milk Text) */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-[#FF2A00]/30 mb-6 backdrop-blur-xl bg-black/75 shadow-lg shadow-black/50">
          <span className="w-2 h-2 rounded-full bg-[#FF2A00] shadow-[0_0_10px_rgba(255,42,0,0.9)] animate-pulse" />
          <span className="text-xs tracking-wider uppercase text-[#FAF8F5] font-semibold font-mono">
            Native Android Developer
          </span>
        </div>

        {/* Hero Headline (Milk Typography) */}
        <h1
          className="text-4xl sm:text-6xl lg:text-7xl font-normal text-[#FAF8F5] tracking-tight leading-[1.08] mb-6"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Crafting native Android apps with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2A00] via-[#E11D48] to-[#F59E0B] font-medium">
            precision &amp; care.
          </span>
        </h1>

        {/* Narrative / Focus */}
        <p className="text-[#E2DFD8] text-base sm:text-xl leading-relaxed font-normal mb-9 max-w-xl site-paragraph">
          Hi, I'm <strong className="text-[#FAF8F5] font-medium">Ayush Kumar</strong> (<strong className="text-[#FF2A00] font-medium">@ArjunaAyush</strong>). Building high-performance, local-first Android apps with Kotlin, Jetpack Compose, Room SQLite, and AndroidX Media3.
        </p>

        {/* Action CTAs Stack */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-9">
          {/* Primary Action (Amber Red Gradient) */}
          <button
            type="button"
            onClick={() => handleScrollTo('#projects')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#FF2A00] via-[#E11D48] to-[#F59E0B] text-[#FAF8F5] text-sm font-semibold hover:brightness-110 shadow-lg shadow-[#FF2A00]/30 hover:shadow-[#FF2A00]/50 transition-all duration-200 cursor-pointer active:scale-95"
          >
            <span>Explore Work</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </button>

          {/* GitHub CTA */}
          <a
            href="https://github.com/arjunaayush"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/15 bg-black/60 text-[#FAF8F5] hover:text-[#FF2A00] hover:border-[#FF2A00]/40 text-sm font-medium transition-all duration-200 cursor-pointer active:scale-95 backdrop-blur-md"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </a>

          {/* LinkedIn CTA */}
          <a
            href="https://linkedin.com/in/arjunaayush"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/15 bg-black/60 text-[#FAF8F5] hover:text-[#F59E0B] hover:border-[#F59E0B]/40 text-sm font-medium transition-all duration-200 cursor-pointer active:scale-95 backdrop-blur-md"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
            <span>LinkedIn</span>
          </a>

          {/* Copy Email CTA */}
          <button
            type="button"
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/15 bg-black/60 text-[#FAF8F5] hover:text-white hover:border-[#FF2A00]/50 text-sm font-medium transition-all duration-200 cursor-pointer active:scale-95 backdrop-blur-md"
            title="Click to copy email address"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span>{copied ? 'Copied! ✓' : 'ayushkumar134go@gmail.com'}</span>
          </button>
        </div>

        {/* Core Tech Stack with Authentic Downloaded Vector Icons */}
        <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-4">
          <div className="flex items-center pl-2">
            <AnimatedTooltip items={TECH_STACK_ITEMS} />
          </div>
          <div className="text-xs text-[#E2DFD8]">
            <p className="font-medium text-[#FAF8F5] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A00] animate-pulse" />
              Production Android Stack
            </p>
            <p className="text-[11px] text-stone-400">Kotlin · Jetpack Compose · Media3 · Room SQLite</p>
          </div>
        </div>
      </div>

      {/* Clean Horizontal Separation Line at the bottom of Hero */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF2A00]/40 via-[#F59E0B]/30 to-transparent pointer-events-none" />
    </section>
  );
};
