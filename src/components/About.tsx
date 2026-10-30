import React, { useState } from 'react';
import { triggerHaptic } from '../utils/haptics';

const CAPABILITY_PILLARS = [
  {
    label: 'Android SDK',
    metric: 'API 26 – 35',
    detail: 'Full Android 15 target with backwards compatibility down to Android 8.0 Oreo.',
    status: 'Verified',
  },
  {
    label: 'Jetpack Compose',
    metric: '120 FPS UI',
    detail: 'Composable stability contracts with smart recomposition skipping on high-refresh screens.',
    status: 'Production',
  },
  {
    label: 'Media3 / ExoPlayer',
    metric: '< 150ms TTFB',
    detail: 'Pre-fetched chunk caching and SurfaceView texture binding for zero buffer lag.',
    status: 'Benchmarked',
  },
  {
    label: 'Room Database',
    metric: 'SQLite WAL',
    detail: 'Offline-first tables with Write-Ahead Logging and background WorkManager synchronization.',
    status: 'Tested',
  },
];

export const About: React.FC = () => {
  const [activePillar, setActivePillar] = useState<number | null>(null);

  const handleSelectPillar = (index: number) => {
    triggerHaptic();
    setActivePillar((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="about"
      className="relative w-full py-16 sm:py-24 px-5 sm:px-8 md:px-12 lg:px-16 z-10"
    >
      <div className="site-container mx-auto">
        {/* Eyebrow Tag: Redaction 70 */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-amber-500/25 mb-6 backdrop-blur-xl bg-[#081638]/70 shadow-lg shadow-black/40">
          <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.9)] animate-pulse" />
          <span className="font-redaction-70 text-xs tracking-wider uppercase text-amber-300">
            01 / Background
          </span>
        </div>

        {/* Section Heading: Bricolage base + Redaction 100 punchline */}
        <h2
          className="text-3xl sm:text-5xl lg:text-6xl font-normal text-[#FAF8F5] tracking-tight leading-[1.1] mb-8"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Engineering native Android on real{' '}
          <span className="font-redaction-100 italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#FF2A00] to-[#F59E0B]">
            hardware.
          </span>
        </h2>

        {/* Narrative (Clean, Human, Zero AI Slop) */}
        <div className="space-y-4 text-[#E2DFD8] text-base sm:text-lg leading-relaxed font-normal site-paragraph max-w-3xl mb-12">
          <p>
            I'm <strong className="text-[#FAF8F5] font-medium">Ayush Kumar</strong> (<span className="text-amber-400 font-mono font-medium">@ArjunaAyush</span>), an IT sophomore at <strong className="text-[#FAF8F5] font-medium">GGV Bilaspur</strong>.
          </p>
          <p>
            I got tired of slow hybrid apps stuttering on modest phones, so I stick strictly to native Android. I write Kotlin with Coroutines to keep heavy work off the UI thread, Room SQLite for reliable offline data, and AndroidX Media3 for instant short-form video streaming.
          </p>
        </div>

        {/* Visual Capability Pillars: Apple-design tactile feedback */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {CAPABILITY_PILLARS.map((pillar, index) => {
            const isSelected = activePillar === index;
            return (
              <div
                key={pillar.label}
                onClick={() => handleSelectPillar(index)}
                className={`apple-press p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-amber-500/50 bg-[#081638]/90 shadow-lg shadow-amber-500/10 scale-[1.01]'
                    : 'border-white/10 bg-[#000000]/80 hover:border-amber-500/30 hover:bg-[#081638]/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    [0{index + 1}]
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-amber-500/30 text-amber-300 bg-amber-500/10">
                    {pillar.status}
                  </span>
                </div>

                <div className="text-xs font-mono text-slate-400 mb-1">
                  {pillar.label}
                </div>
                <div className="text-xl sm:text-2xl font-bold text-[#FAF8F5] tracking-tight mb-2">
                  {pillar.metric}
                </div>

                <p className="text-xs text-[#E2DFD8]/80 leading-relaxed">
                  {pillar.detail}
                </p>
              </div>
            );
          })}
        </div>

        {/* Hardware & University Base Strip */}
        <div className="mt-8 p-5 rounded-2xl border border-white/10 bg-[#000000]/70 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[#FAF8F5] font-medium">Campus:</span>
            <span>Guru Ghasidas Central University (GGV), Bilaspur</span>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <span className="text-[#FAF8F5] font-medium">Program:</span> 2nd Year B.Tech IT
            </div>
            <span className="text-slate-700">•</span>
            <div>
              <span className="text-[#FAF8F5] font-medium">GitHub:</span>{' '}
              <a
                href="https://github.com/arjunaayush"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline"
              >
                github.com/arjunaayush
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
