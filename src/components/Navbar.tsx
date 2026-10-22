import React, { useState } from 'react';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Showcase', href: '#showcase' },
  { label: 'Skills', href: '#skills' },
  { label: 'Hackathons', href: '#hackathons' },
  { label: 'Contact', href: '#contact' },
];

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const lenis = (window as unknown as { __lenis?: { scrollTo: (target: string | number) => void } }).__lenis;

    if (href === '#') {
      if (lenis) {
        lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (lenis) {
      lenis.scrollTo(href);
    } else {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 w-full z-50 px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between pointer-events-none transition-all">
        {/* Brand / Monogram Pill (Left) */}
        <a
          href="#"
          onClick={(e) => handleScrollTo(e, '#')}
          className="pointer-events-auto group flex items-center gap-2.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full glass-pill border border-rose-500/25 backdrop-blur-xl bg-[#0b1329]/80 shadow-lg shadow-black/40 hover:border-rose-500/50 hover:bg-[#0f1b3d]/90 transition-all duration-300 active:scale-95 cursor-pointer"
          aria-label="ArjunaAyush Home"
        >
          <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)] animate-pulse" />
          <span className="text-[14px] sm:text-[15px] font-semibold tracking-tight text-white group-hover:text-rose-300 transition-colors">
            Arjuna<span className="text-rose-500">Ayush</span>
          </span>
        </a>

        {/* Floating Glassomorphic Pill Navbar (Center, hidden below md) */}
        <nav
          className="pointer-events-auto hidden md:flex items-center gap-1 p-1.5 rounded-full glass-pill border border-rose-500/20 backdrop-blur-2xl bg-[#080e22]/85 shadow-2xl shadow-black/60"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="px-3.5 py-1.5 rounded-full text-[13px] font-medium text-slate-300 hover:text-rose-300 hover:bg-rose-500/10 hover:border-rose-500/25 border border-transparent transition-all duration-200 active:scale-95 cursor-pointer"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTA Pill: GitHub & Get in Touch (hidden below md) */}
        <div className="pointer-events-auto hidden md:flex items-center gap-2.5">
          <a
            href="https://github.com/arjunaayush"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-pill border border-rose-500/20 text-slate-300 hover:text-rose-300 hover:border-rose-500/40 text-[13px] font-medium transition-all active:scale-95 cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </a>

          <a
            href="#contact"
            onClick={(e) => handleScrollTo(e, '#contact')}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white text-[13px] font-semibold hover:brightness-110 shadow-md shadow-rose-600/30 transition-all active:scale-95 cursor-pointer"
          >
            <span>Connect</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Mobile menu toggle (Visible below md) */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="pointer-events-auto md:hidden p-2 rounded-full glass-pill border border-rose-500/25 text-white cursor-pointer active:scale-95"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
        >
          <div className="w-5 h-4 flex flex-col justify-between">
            <span className={`w-full h-0.5 bg-rose-500 transition-all duration-300 origin-center ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`w-full h-0.5 bg-white transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`w-full h-0.5 bg-rose-500 transition-all duration-300 origin-center ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </header>

      {/* Mobile Drawer (z-index: 40, above header z-30 and main content z-10) */}
      <div
        className={`fixed inset-0 z-40 bg-[#060913] flex flex-col justify-center px-8 md:hidden transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!isMenuOpen}
      >
        <div className="flex flex-col gap-6 text-left max-w-sm">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="text-2xl font-medium text-slate-200 hover:text-rose-400 active:text-rose-400 transition-colors py-1 cursor-pointer"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
};
