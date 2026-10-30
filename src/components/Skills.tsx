import React, { useState } from 'react';
import { triggerHaptic } from '../utils/haptics';

interface BentoSkill {
  name: string;
  category: 'Core Android & UI' | 'Architecture & Data' | 'Build & DevOps';
  icon: string;
  metric: string;
  summary: string;
  productionProof: string;
  colSpan?: string; // for bento layout variation
}

const BENTO_SKILLS: BentoSkill[] = [
  {
    name: 'Kotlin 2.1',
    category: 'Core Android & UI',
    icon: '/icons/kotlin.svg',
    metric: '100% Primary Language',
    summary: 'Null-safety, Coroutines, Flow, and Kotlin Multiplatform-ready patterns.',
    productionProof: 'Used across all projects with K2 compiler enabled, strict type safety, and zero Java interop overhead.',
    colSpan: 'sm:col-span-2 lg:col-span-2',
  },
  {
    name: 'Jetpack Compose',
    category: 'Core Android & UI',
    icon: '/icons/compose.svg',
    metric: '120 FPS Recomposition',
    summary: 'Declarative Android UI with Material 3 design tokens and custom canvas animations.',
    productionProof: 'Engineered stable composables using @Immutable contracts, eliminating unnecessary redraws on high-refresh phone displays.',
    colSpan: 'sm:col-span-2 lg:col-span-2',
  },
  {
    name: 'AndroidX Media3',
    category: 'Architecture & Data',
    icon: '/icons/media3.svg',
    metric: '< 150ms Reel TTFB',
    summary: 'Low-latency video playback using ExoPlayer surface recycling and disk LRU cache.',
    productionProof: 'Engineered Looply video feeds with pre-fetching workers and SurfaceView texture binding for zero buffer stutter.',
    colSpan: 'sm:col-span-2 lg:col-span-2',
  },
  {
    name: 'Room SQLite',
    category: 'Architecture & Data',
    icon: '/icons/room.svg',
    metric: 'ACID Offline Cache',
    summary: 'Robust local database layer with schema migrations and reactive Flow queries.',
    productionProof: 'Serves as offline source-of-truth with Write-Ahead Logging (WAL) and automated entity conflict resolution.',
    colSpan: 'sm:col-span-2 lg:col-span-1',
  },
  {
    name: 'Coroutines & Flow',
    category: 'Core Android & UI',
    icon: '/icons/coroutines.svg',
    metric: '0ms UI Block',
    summary: 'Structured asynchronous concurrency, StateFlow state holders, and SharedFlow events.',
    productionProof: 'Replaces raw threads and callbacks; automatically cancels tasks on ViewModel lifecycle teardown.',
    colSpan: 'sm:col-span-2 lg:col-span-1',
  },
  {
    name: 'Android SDK (API 26-35)',
    category: 'Core Android & UI',
    icon: '/icons/android.svg',
    metric: 'Android 15 Ready',
    summary: 'Modern Android OS features including edge-to-edge layout, predictive back, and notifications.',
    productionProof: 'Fully compatible with targetSdkVersion 35, following strict Google Play 64-bit and privacy mandates.',
    colSpan: 'sm:col-span-2 lg:col-span-1',
  },
  {
    name: 'Gradle KTS',
    category: 'Build & DevOps',
    icon: '/icons/gradle.svg',
    metric: 'Version Catalogs',
    summary: 'Kotlin DSL build scripts with libs.versions.toml and configuration cache optimization.',
    productionProof: 'Modularized multi-module build logic with custom convention plugins and dependency hygiene.',
    colSpan: 'sm:col-span-2 lg:col-span-1',
  },
  {
    name: 'Firebase Suite',
    category: 'Architecture & Data',
    icon: '/icons/firebase.svg',
    metric: 'Auth & Cloud DB',
    summary: 'Firestore document persistence, Firebase Authentication, and Cloud Messaging.',
    productionProof: 'Integrated secure client-side tokens and offline document listener queues for live sync.',
    colSpan: 'sm:col-span-2 lg:col-span-1',
  },
  {
    name: 'Git & GitHub CI',
    category: 'Build & DevOps',
    icon: '/icons/git.svg',
    metric: 'Automated CI/CD',
    summary: 'Feature branch workflows, pull-request verification, and automated APK artifact builds.',
    productionProof: 'Configured GitHub Actions for lint verification (Detekt) and release APK signing workflows.',
    colSpan: 'sm:col-span-2 lg:col-span-1',
  },
  {
    name: 'Figma to Compose',
    category: 'Core Android & UI',
    icon: '/icons/figma.svg',
    metric: 'Pixel-Perfect Tokens',
    summary: 'Translating design specs, color tokens, and fluid motion springs into Compose UI.',
    productionProof: 'Engineers ergonomic touch targets (48dp+), accessible typography scales, and high-contrast dark themes.',
    colSpan: 'sm:col-span-2 lg:col-span-2',
  },
];

const CATEGORIES = ['All', 'Core Android & UI', 'Architecture & Data', 'Build & DevOps'] as const;

export const Skills: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<(typeof CATEGORIES)[number]>('All');
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);

  const filteredSkills = BENTO_SKILLS.filter((skill) =>
    selectedCategory === 'All' ? true : skill.category === selectedCategory
  );

  const toggleExpand = (skillName: string) => {
    triggerHaptic();
    setExpandedSkill((prev) => (prev === skillName ? null : skillName));
  };

  return (
    <section
      id="skills"
      className="relative w-full py-16 sm:py-24 px-5 sm:px-8 md:px-12 lg:px-16 z-10"
    >
      <div className="site-container mx-auto">
        {/* Eyebrow Tag */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-amber-500/25 mb-6 backdrop-blur-xl bg-[#081638]/70 shadow-lg shadow-black/40">
          <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.9)] animate-pulse" />
          <span className="text-xs tracking-wider uppercase text-amber-300 font-semibold font-mono">
            04 / Tech Stack &amp; Capabilities
          </span>
        </div>

        {/* Section Heading */}
        <h2
          className="text-3xl sm:text-5xl lg:text-6xl font-normal text-[#FAF8F5] tracking-tight leading-[1.1] mb-6"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Native toolchain &amp;{' '}
          <span className="text-red-gold-gradient font-medium">production telemetry.</span>
        </h2>

        <p className="text-[#E2DFD8] text-base sm:text-lg mb-10 font-normal leading-relaxed site-paragraph">
          Bento grid of core technologies used across production Android codebases. Click any card to inspect architectural proof and metrics.
        </p>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  triggerHaptic();
                  setSelectedCategory(cat);
                }}
                className={`px-4 py-2 rounded-full text-xs font-mono transition-all duration-200 cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-500/10'
                    : 'bg-white/5 text-slate-400 border border-white/10 hover:text-[#FAF8F5] hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {filteredSkills.map((skill) => {
            const isExpanded = expandedSkill === skill.name;

            return (
              <div
                key={skill.name}
                onClick={() => toggleExpand(skill.name)}
                className={`${
                  skill.colSpan || 'sm:col-span-1'
                } group p-6 rounded-2xl border transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isExpanded
                    ? 'border-amber-500/50 bg-[#081638]/90 shadow-xl shadow-amber-500/10'
                    : 'border-white/10 bg-[#000000]/80 hover:border-amber-500/30 hover:bg-[#081638]/40'
                }`}
              >
                <div>
                  {/* Top Bar with Authentic Icon & Metric */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 p-2 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <img
                        src={skill.icon}
                        alt={`${skill.name} icon`}
                        className="w-full h-full object-contain filter drop-shadow"
                        loading="lazy"
                      />
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/25">
                      {skill.metric}
                    </span>
                  </div>

                  {/* Title & Category */}
                  <h3 className="text-lg font-semibold text-[#FAF8F5] tracking-tight mb-1">
                    {skill.name}
                  </h3>
                  <div className="text-[11px] font-mono text-slate-400 mb-3">
                    {skill.category}
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-[#E2DFD8]/80 leading-relaxed mb-3">
                    {skill.summary}
                  </p>
                </div>

                {/* Expandable Production Proof Area */}
                <div>
                  {isExpanded ? (
                    <div className="mt-3 pt-3 border-t border-amber-500/30 bg-amber-500/5 -mx-6 -mb-6 p-4 rounded-b-2xl animate-fadeIn">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-amber-300 mb-1">
                        Architecture Proof
                      </div>
                      <p className="text-xs text-[#FAF8F5] leading-relaxed">
                        {skill.productionProof}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[11px] font-mono text-slate-400 group-hover:text-amber-300 transition-colors">
                      <span>Inspect Telemetry</span>
                      <span className="text-xs">↓</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
