import React from 'react';

export const About: React.FC = () => {
  return (
    <section
      id="about"
      className="relative w-full py-14 sm:py-20 px-5 sm:px-8 md:px-12 lg:px-16 z-10"
    >
      <div className="site-container">
        {/* Eyebrow Tag */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass-pill border border-rose-500/25 mb-6 backdrop-blur-xl bg-[#0b1329]/80 shadow-lg shadow-black/40">
          <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)] animate-pulse" />
          <span className="text-xs tracking-wider uppercase text-rose-300 font-semibold font-mono">
            01 / Identity &amp; Background
          </span>
        </div>

        {/* Section Heading */}
        <h2
          className="text-3xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-[1.1] mb-8"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Building modern Android applications with{' '}
          <span className="text-red-gold-gradient font-medium">craftsmanship &amp; care.</span>
        </h2>

        {/* Narrative & Context (Optimal Reading Measure) */}
        <div className="space-y-6 text-slate-300 text-base sm:text-lg leading-relaxed font-normal site-paragraph">
          <p>
            I'm <strong className="text-white font-medium">Ayush Kumar</strong>,
            known across GitHub and developer communities as{' '}
            <strong className="text-rose-400 font-medium">ArjunaAyush</strong>. Currently
            in my second year studying Information Technology at{' '}
            <strong className="text-white font-medium">
              Guru Ghasidas Vishwavidyalaya (GGV)
            </strong>
            , Bilaspur — a Central University established under the Central Universities Act.
          </p>

          <p>
            My engineering work focuses on native Android development: crafting
            modern user interfaces with <span className="text-rose-300 font-medium">Jetpack Compose</span>,
            building reliable offline storage with{' '}
            <span className="text-rose-300 font-medium">Room SQLite &amp; Kotlin Coroutines</span>, and engineering
            responsive video playback using <span className="text-rose-300 font-medium">AndroidX Media3 (ExoPlayer)</span>.
          </p>

          <p>
            Through projects like <span className="text-white font-medium">Looply</span>{' '}
            and <span className="text-white font-medium">StatSync</span>, I prioritize
            clean code structure, stable data flow, and smooth performance on physical devices.
          </p>
        </div>

        {/* Facts & Highlights Grid (Tri-Color Red / Gold / Navy) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 mt-12 w-full">
          <div className="p-5 rounded-2xl glass-pill border border-rose-500/20 backdrop-blur-xl bg-[#0b1329]/70 hover:border-rose-500/40 hover:bg-[#0f1b3d]/80 transition-all">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              Institution
            </div>
            <div className="text-base sm:text-lg font-medium text-white">
              GGV Bilaspur
            </div>
            <div className="text-xs text-rose-300/90 mt-0.5">Central University</div>
          </div>

          <div className="p-5 rounded-2xl glass-pill border border-rose-500/20 backdrop-blur-xl bg-[#0b1329]/70 hover:border-rose-500/40 hover:bg-[#0f1b3d]/80 transition-all">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              Academic Stage
            </div>
            <div className="text-base sm:text-lg font-medium text-white">
              2nd Year
            </div>
            <div className="text-xs text-rose-300/90 mt-0.5">Information Tech</div>
          </div>

          <div className="p-5 rounded-2xl glass-pill border border-rose-500/20 backdrop-blur-xl bg-[#0b1329]/70 hover:border-rose-500/40 hover:bg-[#0f1b3d]/80 transition-all">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              Specialization
            </div>
            <div className="text-base sm:text-lg font-medium text-white">
              Android SDK
            </div>
            <div className="text-xs text-rose-300/90 mt-0.5">Kotlin &amp; Compose</div>
          </div>

          <div className="p-5 rounded-2xl glass-pill border border-rose-500/20 backdrop-blur-xl bg-[#0b1329]/70 hover:border-rose-500/40 hover:bg-[#0f1b3d]/80 transition-all">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              Open Source
            </div>
            <div className="text-base sm:text-lg font-medium text-white">
              @arjunaayush
            </div>
            <div className="text-xs text-rose-300/90 mt-0.5">Active Contributor</div>
          </div>
        </div>
      </div>
    </section>
  );
};
