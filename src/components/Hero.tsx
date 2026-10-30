import React, { useState } from 'react';
import { BackgroundCubesGrid } from './ui/background-cubes-grid';
import { AnimatedTooltip } from './ui/animated-tooltip';

const TECH_STACK_ITEMS = [
  {
    id: 1,
    name: 'Kotlin',
    designation: 'Modern Language & Coroutines (v2.1)',
    image:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%237F52FF" d="M24 24H0V0h24L12 12Z"/></svg>',
  },
  {
    id: 2,
    name: 'Jetpack Compose',
    designation: 'Declarative Reactive UI & M3 Tokens',
    image:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%234285F4" d="M12 2L2 7l10 5 10-5-10-5Z"/><path fill="%2334A853" d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
  },
  {
    id: 3,
    name: 'Android SDK',
    designation: 'Native APIs & WorkManager',
    image:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%233DDC84" d="M17.5 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm-11 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm12.6-4.8 1.9-3.3a.6.6 0 0 0-.2-.8.6.6 0 0 0-.8.2l-2 3.4A12.7 12.7 0 0 0 12 6c-2.2 0-4.2.6-5.9 1.5L4 4.1a.6.6 0 0 0-.8-.2.6.6 0 0 0-.2.8L5 8A10.7 10.7 0 0 0 1 16h22a10.7 10.7 0 0 0-3.9-8.8Z"/></svg>',
  },
  {
    id: 4,
    name: 'AndroidX Media3',
    designation: 'ExoPlayer & Zero-Buffer Looping',
    image:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23F43F5E" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm-2 14.5v-9l7 4.5-7 4.5Z"/></svg>',
  },
  {
    id: 5,
    name: 'Room SQLite',
    designation: 'Local-First Resilient Persistence',
    image:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23003B57" d="M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3v12c0 1.7-3.6 3-8 3s-8-1.3-8-3V6Z"/><path fill="%2300A3E0" d="M20 10c0 1.7-3.6 3-8 3s-8-1.3-8-3M20 14c0 1.7-3.6 3-8 3s-8-1.3-8-3"/></svg>',
  },
  {
    id: 6,
    name: 'Coroutines & Flow',
    designation: 'Structured Concurrency & StateFlow',
    image:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23F59E0B" d="M13 2L3 14h9l-1 8 10-12h-9l1-8Z"/></svg>',
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
      className="relative w-full min-h-[85vh] sm:min-h-[90vh] flex flex-col justify-center px-5 sm:px-8 md:px-12 lg:px-16 pt-24 pb-16 sm:pt-28 sm:pb-20 overflow-hidden"
    >
      {/* 3D Perspective Cubes Grid (Hero Section Floor, Deep Navy Secondary Color) */}
      <div className="absolute inset-0 -z-10 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <BackgroundCubesGrid
          variant="perspective"
          backgroundColor="#060913"
          baseColor="#081638"
          waveColor="#ff2a00"
          glow={0.85}
          amplitude={0.35}
          tilt={0.65}
          idleRipples={true}
          className="w-full h-full"
        />
        {/* Ambient radial blend to keep foreground text ultra-sharp */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_45%_50%,rgba(6,9,19,0.2),#060913_90%)]"
        />
      </div>

      <div className="site-container relative z-30 max-w-2xl">
        {/* Eyebrow Badge (Royal Red Accent) */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass-pill border border-rose-500/25 mb-6 backdrop-blur-xl bg-[#0b1329]/80 shadow-lg shadow-black/40">
          <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)] animate-pulse" />
          <span className="text-xs tracking-wider uppercase text-rose-300 font-semibold font-mono">
            Native Android Developer
          </span>
        </div>

        {/* Hero Headline */}
        <h1
          className="text-4xl sm:text-6xl lg:text-7xl font-normal text-white tracking-tight leading-[1.08] mb-6"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Crafting native Android apps with{' '}
          <span className="text-red-gold-gradient font-medium">precision &amp; care.</span>
        </h1>

        {/* Narrative / Focus */}
        <p className="text-slate-300 text-base sm:text-xl leading-relaxed font-normal mb-9 max-w-xl site-paragraph">
          Hi, I'm <strong className="text-white font-medium">Ayush Kumar</strong> (<strong className="text-rose-400 font-medium">@ArjunaAyush</strong>). Building responsive, local-first Android apps with Kotlin, Jetpack Compose, Room SQLite, and AndroidX Media3.
        </p>

        {/* Action CTAs Stack */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-9">
          {/* Primary Action (Royal Red Accent) */}
          <button
            type="button"
            onClick={() => handleScrollTo('#projects')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white text-sm font-semibold hover:brightness-110 shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 transition-all duration-200 cursor-pointer active:scale-95"
          >
            <span>Explore Selected Work</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </button>

          {/* GitHub CTA */}
          <a
            href="https://github.com/arjunaayush"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full glass-pill border border-rose-500/20 text-slate-200 hover:text-rose-300 hover:border-rose-500/40 text-sm font-medium transition-all duration-200 cursor-pointer active:scale-95"
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
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full glass-pill border border-rose-500/20 text-slate-200 hover:text-amber-300 hover:border-amber-400/40 text-sm font-medium transition-all duration-200 cursor-pointer active:scale-95"
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
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full glass-pill border border-rose-500/20 text-slate-200 hover:text-white hover:border-rose-500/50 text-sm font-medium transition-all duration-200 cursor-pointer active:scale-95"
            title="Click to copy email address"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span>{copied ? 'Copied! ✓' : 'ayushkumar134go@gmail.com'}</span>
          </button>
        </div>

        {/* Core Tech Stack with Animated Tooltips */}
        <div className="pt-6 border-t border-rose-500/15 flex flex-wrap items-center gap-4">
          <div className="flex items-center pl-2">
            <AnimatedTooltip items={TECH_STACK_ITEMS} />
          </div>
          <div className="text-xs text-slate-300">
            <p className="font-medium text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              Production Android Stack
            </p>
            <p className="text-[11px] text-slate-400">Kotlin · Jetpack Compose · Media3 · Room SQLite</p>
          </div>
        </div>
      </div>

      {/* Clean Horizontal Separation Line at the bottom of Hero */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-500/35 via-amber-400/20 to-transparent pointer-events-none" />
    </section>
  );
};
