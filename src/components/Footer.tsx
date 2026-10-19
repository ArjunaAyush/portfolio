import React from 'react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number) => void } }).__lenis;
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative w-full border-t border-rose-500/15 py-12 px-5 sm:px-8 md:px-12 lg:px-16 z-10 backdrop-blur-xl bg-[#060913]/90">
      <div className="site-container max-w-6xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span
              className="text-lg text-white font-semibold tracking-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Arjuna<span className="text-rose-500">Ayush</span>
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-sm text-slate-300 font-medium">
              Ayush Kumar
            </span>
          </div>
          <p className="text-xs text-slate-400 font-normal">
            Guru Ghasidas Central University (GGV), Bilaspur • Native Android Developer
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <a
            href="https://github.com/arjunaayush"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-rose-300 transition-colors"
          >
            GitHub
          </a>
          <span className="text-slate-700">•</span>
          <a
            href="https://linkedin.com/in/arjunaayush"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-rose-300 transition-colors"
          >
            LinkedIn
          </a>
          <span className="text-slate-700">•</span>
          <a
            href="mailto:ayushkumar134go@gmail.com"
            className="text-slate-400 hover:text-rose-300 transition-colors"
          >
            Email
          </a>
          <span className="text-slate-700">•</span>
          <button
            type="button"
            onClick={scrollToTop}
            className="text-rose-400/90 hover:text-rose-300 transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Top</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
};
