import React, { useState } from 'react';

export const Contact: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedEmail(text);
      setTimeout(() => setCopiedEmail(null), 2200);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full py-28 sm:py-36 px-5 sm:px-8 md:px-12 lg:px-16 z-10"
    >
      <div className="site-container">
        {/* Eyebrow Tag */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass-pill border border-rose-500/25 mb-6 backdrop-blur-xl bg-[#0b1329]/80 shadow-lg shadow-black/40">
          <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)] animate-pulse" />
          <span className="text-xs tracking-wider uppercase text-rose-300 font-semibold font-mono">
            06 / Get In Touch
          </span>
        </div>

        {/* Section Heading */}
        <h2
          className="text-3xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-[1.1] mb-6"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Let's connect &amp; build{' '}
          <span className="text-red-gold-gradient font-medium">great Android apps.</span>
        </h2>

        <p className="text-slate-300 text-base sm:text-lg mb-12 font-normal leading-relaxed site-paragraph">
          Open to native Android developer opportunities, internships, open-source collaborations,
          and technical conversations. Feel free to reach out anytime.
        </p>

        {/* Contact Methods Stack (Tri-Color Red / Gold / Navy) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full mb-12">
          {/* Primary Personal Email */}
          <div className="p-7 rounded-3xl glass-pill border border-rose-500/20 backdrop-blur-xl bg-[#0b1329]/70 flex flex-col justify-between shadow-xl shadow-black/50 hover:border-rose-500/40 hover:bg-[#0f1b3d]/80 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-mono">
                  Primary Mailbox
                </span>
                <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
              </div>
              <div className="text-lg sm:text-xl text-white font-medium mb-1.5 break-all">
                ayushkumar134go@gmail.com
              </div>
              <p className="text-xs text-slate-400 mb-6">
                Direct mailbox for engineering discussions, collaborations, and opportunities.
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-4 border-t border-white/10">
              <a
                href="mailto:ayushkumar134go@gmail.com"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white text-xs font-semibold hover:brightness-110 transition-all shadow-md shadow-rose-600/25 active:scale-95"
              >
                Send Email
              </a>
              <button
                type="button"
                onClick={() => copyToClipboard('ayushkumar134go@gmail.com')}
                className="px-4 py-2 rounded-full glass-pill border border-rose-500/20 hover:border-rose-500/40 text-slate-200 text-xs font-medium transition-all active:scale-95 cursor-pointer"
              >
                {copiedEmail === 'ayushkumar134go@gmail.com' ? 'Copied! ✓' : 'Copy Address'}
              </button>
            </div>
          </div>

          {/* Location & Academic Base */}
          <div className="p-7 rounded-3xl glass-pill border border-rose-500/20 backdrop-blur-xl bg-[#0b1329]/70 flex flex-col justify-between shadow-xl shadow-black/50 hover:border-rose-500/40 hover:bg-[#0f1b3d]/80 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-mono">
                  University &amp; Base
                </span>
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
              </div>
              <div className="text-lg sm:text-xl text-white font-medium mb-1.5">
                GGV Bilaspur, India
              </div>
              <p className="text-xs text-slate-400 mb-6">
                Central University established under the Central Universities Act • Information Technology.
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-4 border-t border-white/10">
              <span className="text-xs font-mono text-rose-300">
                Available for Remote &amp; On-site Opportunities
              </span>
            </div>
          </div>
        </div>

        {/* Social / Professional Profiles (Glassomorphic Pills) */}
        <div className="flex flex-wrap items-center gap-4 w-full">
          <a
            href="https://github.com/arjunaayush"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full glass-pill border border-rose-500/20 hover:border-rose-500/50 text-slate-200 hover:text-rose-300 text-sm font-medium transition-all active:scale-95 group shadow-lg shadow-black/40"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-rose-400"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub @arjunaayush</span>
            <span className="text-xs text-rose-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
          </a>

          <a
            href="https://linkedin.com/in/arjunaayush"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full glass-pill border border-rose-500/20 hover:border-rose-500/50 text-slate-200 hover:text-amber-300 text-sm font-medium transition-all active:scale-95 group shadow-lg shadow-black/40"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-amber-400"
            >
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
            <span>LinkedIn /in/arjunaayush</span>
            <span className="text-xs text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
};
