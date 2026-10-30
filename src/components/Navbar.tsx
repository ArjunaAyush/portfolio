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
          className="pointer-events-auto group flex items-center gap-2.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-amber-500/25 backdrop-blur-xl bg-[#081638]/80 shadow-lg shadow-black/40 hover:border-amber-500/50 hover:bg-[#081638]/95 transition-all duration-300 active:scale-95 cursor-pointer"
          aria-label="ArjunaAyush Home"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.9)] animate-pulse" />
          <span className="font-redaction-70 text-[15px] sm:text-[16px] tracking-tight text-[#FAF8F5] group-hover:text-amber-300 transition-colors">
            Arjuna<span className="text-amber-400">Ayush</span>
          </span>
        </a>

        {/* Floating Glassomorphic Pill Navbar (Center, hidden below md) */}
        <nav
          className="pointer-events-auto hidden md:flex items-center gap-1 p-1.5 rounded-full border border-white/10 backdrop-blur-2xl bg-[#000000]/80 shadow-2xl shadow-black/60"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="px-3.5 py-1.5 rounded-full text-[13px] font-medium text-slate-300 hover:text-amber-300 hover:bg-amber-500/10 hover:border-amber-500/25 border border-transparent transition-all duration-200 active:scale-95 cursor-pointer"
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
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 text-slate-300 hover:text-amber-300 hover:border-amber-500/40 text-[13px] font-medium transition-all active:scale-95 cursor-pointer"
          >
            <img src="/icons/git.svg" alt="GitHub" className="w-3.5 h-3.5 filter invert opacity-80" />
            <span>GitHub</span>
          </a>

          <a
            href="#contact"
            onClick={(e) => handleScrollTo(e, '#contact')}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-[#FF2A00] text-black text-[13px] font-semibold hover:brightness-110 shadow-md shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
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
          className="pointer-events-auto md:hidden p-2 rounded-full border border-amber-500/25 bg-[#081638]/80 text-[#FAF8F5] cursor-pointer active:scale-95"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
        >
          <div className="w-5 h-4 flex flex-col justify-between">
            <span className={`w-full h-0.5 bg-amber-400 transition-all duration-300 origin-center ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`w-full h-0.5 bg-white transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`w-full h-0.5 bg-amber-400 transition-all duration-300 origin-center ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </header>

      {/* Mobile Drawer Menu (Visible below md when open) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center gap-6 p-6">
          <nav className="flex flex-col items-center gap-5 text-lg font-medium text-[#FAF8F5]">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className="text-[#E2DFD8] hover:text-amber-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/10 w-full max-w-xs justify-center">
            <a
              href="https://github.com/arjunaayush"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-amber-300 text-sm font-mono"
            >
              GitHub ↗
            </a>
            <span className="text-slate-700">•</span>
            <a
              href="#contact"
              onClick={(e) => handleScrollTo(e, '#contact')}
              className="text-amber-400 hover:text-amber-300 text-sm font-mono"
            >
              Get In Touch ↗
            </a>
          </div>
        </div>
      )}
    </>
  );
};
