import React, { useState } from 'react';
import { triggerHaptic } from '../utils/haptics';

interface SkillGroup {
  category: string;
  description: string;
  skills: { name: string; detail: string; primary?: boolean }[];
}

const FILTER_CATEGORIES = [
  'All',
  'Core Android & UI',
  'Architecture & Data',
  'Tooling & Release',
  'Design & Motion',
] as const;

type FilterCategory = (typeof FILTER_CATEGORIES)[number];

const SKILL_GROUPS: SkillGroup[] = [
  {
    category: 'Core Android & UI',
    description: 'Kotlin programming, modern Jetpack Compose UI, and app performance.',
    skills: [
      {
        name: 'Kotlin',
        detail: 'Modern Kotlin 2.x, Coroutines, Flow, StateFlow, async programming, and thread safety',
        primary: true,
      },
      {
        name: 'Jetpack Compose',
        detail: 'Declarative UI, responsive phone layouts, state hoisting, and Material 3 design tokens',
        primary: true,
      },
      {
        name: 'Performance & Profiling',
        detail: 'Android Studio Memory Profiler, LeakCanary leak detection, and Baseline Profiles generation',
        primary: true,
      },
      {
        name: 'Android Studio & SDK',
        detail: 'Android SDK 26–35, Layout Inspector, Logcat debugging, APK Analyzer',
        primary: true,
      },
      {
        name: 'Java & Platform Interop',
        detail: 'Java 21 LTS support, Android framework internals, and backward compatibility',
      },
    ],
  },
  {
    category: 'Architecture & Data',
    description: 'Offline database storage, predictable data flow, and networking.',
    skills: [
      {
        name: 'Clean Architecture & MVI',
        detail: 'Separation of concerns, immutable UI state modeling, and ViewModel state preservation',
        primary: true,
      },
      {
        name: 'Room SQLite',
        detail: 'Local offline database, DAOs, schema migrations, and reactive Flow queries',
        primary: true,
      },
      {
        name: 'AndroidX Media3 (ExoPlayer)',
        detail: 'Fast video reels playback, surface recycling, disk caching, and low-latency looping',
        primary: true,
      },
      {
        name: 'WorkManager & Background Sync',
        detail: 'Reliable background downloads and sync tasks with battery and network constraints',
        primary: true,
      },
      {
        name: 'Firebase & Cloud',
        detail: 'Authentication, Firestore cloud database, and push messaging',
      },
    ],
  },
  {
    category: 'Tooling & Release',
    description: 'Build automation, code optimization, and continuous integration.',
    skills: [
      {
        name: 'Gradle & Build Systems',
        detail: 'Gradle Kotlin DSL (build.gradle.kts), Version Catalogs (libs.versions.toml), build caching',
        primary: true,
      },
      {
        name: 'ProGuard & R8',
        detail: 'Code shrinking, obfuscation rules, APK optimization, and Baseline Profiles compilation',
        primary: true,
      },
      {
        name: 'GitHub Actions & CI/CD',
        detail: 'Automated test pipelines, code style checking (Detekt/Spotless), release APK packaging',
        primary: true,
      },
      {
        name: 'Git Version Control',
        detail: 'Clean branching, pull requests, semantic versioning, and team collaboration',
      },
    ],
  },
  {
    category: 'Design & Motion',
    description: 'Clean mobile ergonomics, fluid animations, and user-friendly interfaces.',
    skills: [
      {
        name: 'Mobile UI/UX Design',
        detail: 'Clean typography, accessible touch targets, cohesive spacing, and dark mode design',
        primary: true,
      },
      {
        name: 'Figma to Compose',
        detail: 'Translating design mockups directly into reusable Jetpack Compose components',
        primary: true,
      },
      {
        name: 'Smooth Gestures & Motion',
        detail: 'Natural swipe transitions, spring physics, and subtle micro-interactions',
      },
    ],
  },
];

export const Skills: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('All');

  const displayedGroups =
    selectedCategory === 'All'
      ? SKILL_GROUPS
      : SKILL_GROUPS.filter((group) => group.category === selectedCategory);

  return (
    <section
      id="skills"
      className="relative w-full py-14 sm:py-20 px-5 sm:px-8 md:px-12 lg:px-16 z-10"
    >
      <div className="site-container">
        {/* Eyebrow Tag */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass-pill border border-rose-500/25 mb-6 backdrop-blur-xl bg-[#0b1329]/80 shadow-lg shadow-black/40">
          <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)] animate-pulse" />
          <span className="text-xs tracking-wider uppercase text-rose-300 font-semibold font-mono">
            04 / Skills &amp; Technologies
          </span>
        </div>

        {/* Section Heading */}
        <h2
          className="text-3xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-[1.1] mb-6"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Technical toolkit &amp;{' '}
          <span className="text-red-gold-gradient font-medium">engineering skills.</span>
        </h2>

        <p className="text-slate-300 text-base sm:text-lg mb-8 font-normal leading-relaxed site-paragraph">
          Focused across native Android development, reliable offline architectures,
          clean UI craft, and performance profiling.
        </p>

        {/* Interactive Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {FILTER_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  triggerHaptic(12);
                  setSelectedCategory(cat);
                }}
                className={`px-4 py-2 rounded-full text-xs font-mono transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-rose-500 text-white font-semibold shadow-md shadow-rose-500/30'
                    : 'glass-pill border border-rose-500/20 text-slate-300 hover:text-rose-300 hover:border-rose-500/40'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Categories Stack */}
        <div className="grid grid-cols-1 gap-6 w-full">
          {displayedGroups.map((group) => (
            <div
              key={group.category}
              className="p-7 sm:p-8 rounded-3xl glass-pill border border-rose-500/20 backdrop-blur-xl bg-[#0b1329]/70 transition-all duration-300 hover:border-rose-500/40 hover:bg-[#0f1b3d]/80 shadow-xl shadow-black/50"
            >
              <h3
                className="text-xl sm:text-2xl text-white font-normal mb-1 tracking-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {group.category}
              </h3>
              <p className="text-xs text-amber-300/90 mb-6 font-mono font-medium">
                {group.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {group.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="p-4 rounded-2xl bg-[#060913]/70 border border-white/5 hover:border-rose-500/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white flex items-center gap-2">
                        {skill.primary && (
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        )}
                        {skill.name}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-normal leading-normal">
                      {skill.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
