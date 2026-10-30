import React, { useState } from 'react';
import { BackgroundCubesGrid } from './ui/background-cubes-grid';
import { AnimatedTooltip } from './ui/animated-tooltip';
import { triggerHaptic } from '../utils/haptics';

const TECH_STACK_ITEMS = [
  {
    id: 1,
    name: 'Kotlin',
    designation: 'Coroutines & Flow 2.1',
    image: '/icons/kotlin.svg',
  },
  {
    id: 2,
    name: 'Jetpack Compose',
    designation: 'Declarative UI & Material 3',
    image: '/icons/compose.svg',
  },
  {
    id: 3,
    name: 'Android SDK',
    designation: 'API 26–35 Target Support',
    image: '/icons/android.svg',
  },
  {
    id: 4,
    name: 'AndroidX Media3',
    designation: 'ExoPlayer & Feed Pre-fetching',
    image: '/icons/media3.svg',
  },
  {
    id: 5,
    name: 'Room SQLite',
    designation: 'Offline ACID Persistence',
    image: '/icons/room.svg',
  },
  {
    id: 6,
    name: 'Coroutines & Flow',
    designation: 'Async Background Concurrency',
    image: '/icons/coroutines.svg',
  },
];

export const Hero: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleScrollTo = (targetId: string) => {
    triggerHaptic();
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
    triggerHaptic();
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
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen min-h-[100dvh] flex flex-col justify-center px-5 sm:px-8 md:px-12 lg:px-16 pt-20 pb-12 overflow-hidden z-10"
    >
      {/* 3D Perspective Cubes Grid (Deep Navy Secondary on Pure Black) */}
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
        {/* Subtle radial blend for crisp Milk text readability */}
        <div
          aria-hidden="true"
          className="pointer-none absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_45%_50%,rgba(0,0,0,0.1),#000000_90%)]"
        />
      </div>

      <div className="site-container relative z-30 max-w-2xl">
        {/* Eyebrow Badge: Redaction 70 */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-[#FF2A00]/30 mb-6 backdrop-blur-xl bg-black/75 shadow-lg shadow-black/50">
          <span className="w-2 h-2 rounded-full bg-[#FF2A00] shadow-[0_0_10px_rgba(255,42,0,0.9)] animate-pulse" />
          <span className="font-redaction-70 text-xs tracking-wider uppercase text-[#FAF8F5]">
            Android Engineer · GGV Bilaspur
          </span>
        </div>

        {/* Hero Headline: Bricolage Grotesque base + Redaction 100 punchline */}
        <h1
          className="text-4xl sm:text-6xl lg:text-7xl font-normal text-[#FAF8F5] tracking-tight leading-[1.08] mb-6"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Writing Android apps that boot fast and don't drop{' '}
          <span className="font-redaction-100 italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#FF2A00] via-[#E11D48] to-[#F59E0B]">
            frames.
          </span>
        </h1>

        {/* Grounded Human Narrative (Anti-AI Slop) */}
        <p className="text-[#E2DFD8] text-base sm:text-lg leading-relaxed font-normal mb-8 max-w-xl site-paragraph">
          I'm <strong className="text-[#FAF8F5] font-medium">Ayush Kumar</strong> (<span className="text-[#FF2A00] font-mono font-medium">@ArjunaAyush</span>), a 2nd-year IT undergraduate building native Android software. Most of my day is spent tuning Jetpack Compose recompositions, managing offline SQLite state with Room, and squeezing video startup latency down with AndroidX Media3.
        </p>

        {/* Action CTAs: Apple-design tactile press response */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-9">
          {/* Primary Action */}
          <button
            type="button"
            onClick={() => handleScrollTo('#projects')}
            className="apple-press inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#FF2A00] via-[#E11D48] to-[#F59E0B] text-[#FAF8F5] text-xs font-semibold hover:brightness-110 shadow-lg shadow-[#FF2A00]/25 transition-all duration-200 cursor-pointer"
          >
            <span>See Projects</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </button>

          {/* GitHub CTA */}
          <a
            href="https://github.com/arjunaayush"
            target="_blank"
            rel="noopener noreferrer"
            className="apple-press inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/15 bg-black/60 text-[#FAF8F5] hover:text-[#FF2A00] hover:border-[#FF2A00]/40 text-xs font-mono transition-all duration-200 cursor-pointer backdrop-blur-md"
          >
            <img src="/icons/git.svg" alt="Git" className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>

          {/* LinkedIn CTA */}
          <a
            href="https://linkedin.com/in/arjunaayush"
            target="_blank"
            rel="noopener noreferrer"
            className="apple-press inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/15 bg-black/60 text-[#FAF8F5] hover:text-[#F59E0B] hover:border-[#F59E0B]/40 text-xs font-mono transition-all duration-200 cursor-pointer backdrop-blur-md"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-[#F59E0B]">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
            <span>LinkedIn</span>
          </a>

          {/* Copy Email CTA */}
          <button
            type="button"
            onClick={handleCopyEmail}
            className="apple-press inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/15 bg-black/60 text-[#FAF8F5] hover:text-white hover:border-[#FF2A00]/50 text-xs font-mono transition-all duration-200 cursor-pointer backdrop-blur-md"
          >
            <span>{copied ? 'Copied to clipboard ✓' : 'ayushkumar134go@gmail.com'}</span>
          </button>
        </div>

        {/* Tech Stack Vector Icons Strip */}
        <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-4">
          <div className="flex items-center pl-2">
            <AnimatedTooltip items={TECH_STACK_ITEMS} />
          </div>
          <div className="text-xs text-[#E2DFD8]">
            <p className="font-medium text-[#FAF8F5] flex items-center gap-1.5 font-mono text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A00] animate-pulse" />
              Active Daily Stack
            </p>
            <p className="text-[11px] text-slate-400">Kotlin · Jetpack Compose · Media3 · Room SQLite</p>
          </div>
        </div>
      </div>

      {/* Clean Horizontal Separation Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF2A00]/30 via-[#F59E0B]/20 to-transparent pointer-events-none" />
    </section>
  );
};
