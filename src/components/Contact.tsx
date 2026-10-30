import React, { useState } from 'react';
import { triggerHaptic } from '../utils/haptics';

export const Contact: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const copyToClipboard = async (text: string) => {
    triggerHaptic();
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
      setTimeout(() => setCopiedEmail(null), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full py-16 sm:py-24 px-5 sm:px-8 md:px-12 lg:px-16 z-10"
    >
      <div className="site-container mx-auto">
        {/* Eyebrow Tag: Redaction 70 */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-amber-500/25 mb-6 backdrop-blur-xl bg-[#081638]/70 shadow-lg shadow-black/40">
          <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.9)] animate-pulse" />
          <span className="font-redaction-70 text-xs tracking-wider uppercase text-amber-300">
            06 / Contact
          </span>
        </div>

        {/* Section Heading: Bricolage base + Redaction 100 punchline */}
        <h2
          className="text-3xl sm:text-5xl lg:text-6xl font-normal text-[#FAF8F5] tracking-tight leading-[1.1] mb-6"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Let's build{' '}
          <span className="font-redaction-100 italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#FF2A00] to-[#F59E0B]">
            together.
          </span>
        </h2>

        <p className="text-[#E2DFD8] text-base sm:text-lg mb-12 font-normal leading-relaxed site-paragraph">
          Open to Android developer roles, summer internships, and open-source collaborations. Feel free to send me a note.
        </p>

        {/* Contact Methods Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full mb-10">
          {/* Primary Mailbox */}
          <div className="p-7 rounded-2xl border border-white/10 bg-[#000000]/80 hover:border-amber-500/40 hover:bg-[#081638]/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-mono">
                  Primary Mailbox
                </span>
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
              </div>
              <div className="text-lg sm:text-xl text-[#FAF8F5] font-semibold mb-1.5 break-all">
                ayushkumar134go@gmail.com
              </div>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Direct channel for developer opportunities, internships, and project collaborations.
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-4 border-t border-white/10">
              <a
                href="mailto:ayushkumar134go@gmail.com"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-[#FF2A00] text-black font-semibold text-xs hover:brightness-110 transition-all active:scale-95"
              >
                Send Email
              </a>
              <button
                type="button"
                onClick={() => copyToClipboard('ayushkumar134go@gmail.com')}
                className="px-4 py-2 rounded-full border border-white/10 hover:border-amber-500/40 text-slate-200 text-xs font-mono transition-all active:scale-95 cursor-pointer"
              >
                {copiedEmail === 'ayushkumar134go@gmail.com' ? 'Copied! ✓' : 'Copy Address'}
              </button>
            </div>
          </div>

          {/* Academic Base & Availability */}
          <div className="p-7 rounded-2xl border border-white/10 bg-[#000000]/80 hover:border-amber-500/40 hover:bg-[#081638]/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-mono">
                  Base &amp; University
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              </div>
              <div className="text-lg sm:text-xl text-[#FAF8F5] font-semibold mb-1.5">
                GGV Bilaspur, India
              </div>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Guru Ghasidas Central University • Information Technology (B.Tech 2nd Year).
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-4 border-t border-white/10">
              <span className="text-xs font-mono text-amber-400">
                Available for Remote &amp; On-Site Sprints
              </span>
            </div>
          </div>
        </div>

        {/* Professional Profiles */}
        <div className="flex flex-wrap items-center gap-4 w-full">
          <a
            href="https://github.com/arjunaayush"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 hover:border-amber-500/40 hover:bg-[#081638]/60 text-slate-200 hover:text-amber-300 text-xs font-mono transition-all active:scale-95 group"
          >
            <img src="/icons/git.svg" alt="Git" className="w-4 h-4 filter invert opacity-80 group-hover:opacity-100" />
            <span>GitHub @arjunaayush</span>
            <span className="text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
          </a>

          <a
            href="https://linkedin.com/in/arjunaayush"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 hover:border-amber-500/40 hover:bg-[#081638]/60 text-slate-200 hover:text-amber-300 text-xs font-mono transition-all active:scale-95 group"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
            <span>LinkedIn /in/arjunaayush</span>
            <span className="text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
};
