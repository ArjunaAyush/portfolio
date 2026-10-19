import React, { useState } from 'react';

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
      className="relative w-full min-h-[92vh] sm:min-h-screen flex flex-col justify-center px-5 sm:px-8 md:px-12 lg:px-16 pt-28 pb-20 overflow-hidden z-[5]"
    >
      <div className="site-container relative z-10 max-w-2xl">
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
        <p className="text-slate-300 text-base sm:text-xl leading-relaxed font-normal mb-10 max-w-xl site-paragraph">
          Hi, I'm <strong className="text-white font-medium">Ayush Kumar</strong> (known online as{' '}
          <strong className="text-rose-400 font-medium">ArjunaAyush</strong>). Building native Android apps with Kotlin, Jetpack Compose, Room SQLite, and AndroidX Media3.
        </p>

        {/* Action CTAs Stack */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
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
            <span>{copied ? 'Copied to Clipboard! ✓' : 'ayushkumar134go@gmail.com'}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
