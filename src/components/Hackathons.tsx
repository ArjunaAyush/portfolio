import React, { useState } from 'react';
import { triggerHaptic } from '../utils/haptics';

interface InitiativeItem {
  id: string;
  badge: string;
  title: string;
  role: string;
  keyOutcome: string;
  duration: string;
  focusAreas: string[];
  techStack: string[];
}

const INITIATIVES: InitiativeItem[] = [
  {
    id: 'hackxsprint-2026',
    badge: 'Competitive Sprint',
    title: 'HackXsprint 2026',
    role: 'Lead Android Engineer',
    keyOutcome: 'Delivered reactive prototype in 24 hours with zero merge conflicts',
    duration: '24-Hour Sprint',
    focusAreas: [
      'Engineered rapid Android UI state machine with Coroutines & StateFlow',
      'Implemented high-speed Git branching and automated pre-commit lint validation',
      'Ensured resilient client-side error boundaries under strict deadline pressure',
    ],
    techStack: ['Jetpack Compose', 'Kotlin Coroutines', 'MVI Architecture', 'Git Flow'],
  },
  {
    id: 'nhide-2026',
    badge: 'National Innovation',
    title: 'NHIDE 2026',
    role: 'Systems Architecture Lead',
    keyOutcome: 'Architected offline-first client specification for national problem statement',
    duration: 'National Initiative',
    focusAreas: [
      'Deconstructed complex multi-tenant specifications into decoupled module boundaries',
      'Designed Room SQLite offline-first database schemas with conflict resolution rules',
      'Enforced Material 3 accessible touch targets (48dp+) and contrast compliance',
    ],
    techStack: ['Room DB', 'Clean Architecture', 'Material 3', 'API Design'],
  },
  {
    id: 'amurot-oss',
    badge: 'Open Source',
    title: 'Amurot Open Source Team',
    role: 'Core Contributor & Reviewer',
    keyOutcome: 'Maintained repository hygiene, peer code reviews, and CI automation',
    duration: 'Continuous Contribution',
    focusAreas: [
      'Conducted peer pull-request code reviews focusing on thread safety and memory leaks',
      'Established GitHub Actions automated lint checking (Detekt) and unit test pipelines',
      'Authored developer onboarding documentation and clean architecture sample modules',
    ],
    techStack: ['GitHub Actions', 'Gradle KTS', 'Detekt', 'Android Profiler'],
  },
];

export const Hackathons: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    triggerHaptic();
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="hackathons"
      className="relative w-full py-16 sm:py-24 px-5 sm:px-8 md:px-12 lg:px-16 z-10"
    >
      <div className="site-container mx-auto">
        {/* Eyebrow Tag */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-amber-500/25 mb-6 backdrop-blur-xl bg-[#081638]/70 shadow-lg shadow-black/40">
          <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.9)] animate-pulse" />
          <span className="text-xs tracking-wider uppercase text-amber-300 font-semibold font-mono">
            05 / Hackathons &amp; Initiatives
          </span>
        </div>

        {/* Section Heading */}
        <h2
          className="text-3xl sm:text-5xl lg:text-6xl font-normal text-[#FAF8F5] tracking-tight leading-[1.1] mb-6"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Hackathon sprints &amp;{' '}
          <span className="text-red-gold-gradient font-medium">team collaboration.</span>
        </h2>

        <p className="text-[#E2DFD8] text-base sm:text-lg mb-10 font-normal leading-relaxed site-paragraph">
          High-velocity engineering under deadline pressure. Compact cards expand to reveal architecture breakdowns and sprint metrics.
        </p>

        {/* Minimalist Compact Expandable Cards */}
        <div className="space-y-3.5 w-full">
          {INITIATIVES.map((item) => {
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => toggleExpand(item.id)}
                className={`rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden ${
                  isExpanded
                    ? 'border-amber-500/50 bg-[#081638]/90 shadow-xl shadow-amber-500/10'
                    : 'border-white/10 bg-[#000000]/80 hover:border-amber-500/30 hover:bg-[#081638]/40'
                }`}
              >
                {/* Single-line collapsed summary header */}
                <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/25">
                      {item.badge}
                    </span>
                    <h3 className="text-lg sm:text-xl font-semibold text-[#FAF8F5] tracking-tight">
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 text-xs font-mono text-slate-400">
                    <span className="text-slate-300 hidden md:inline truncate max-w-xs">
                      {item.keyOutcome}
                    </span>
                    <span className="text-amber-400/90 text-[11px] sm:text-xs">
                      {item.duration}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-300 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180 text-amber-300 border-amber-500/40 bg-amber-500/10' : ''
                      }`}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Expanded architectural breakdown */}
                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-white/10 animate-fadeIn">
                    <div className="mb-4">
                      <div className="text-xs font-mono text-amber-300 uppercase tracking-wider mb-2">
                        Role &amp; Primary Impact
                      </div>
                      <p className="text-sm text-[#FAF8F5] font-medium leading-relaxed">
                        {item.role} — {item.keyOutcome}
                      </p>
                    </div>

                    <div className="mb-4">
                      <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                        Engineering Focus Areas
                      </div>
                      <ul className="space-y-1.5 text-xs text-[#E2DFD8]/90">
                        {item.focusAreas.map((area, aIdx) => (
                          <li key={aIdx} className="flex items-start gap-2">
                            <span className="text-amber-400 mt-0.5">▹</span>
                            <span>{area}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-3 border-t border-white/5">
                      {item.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-0.5 text-[11px] font-mono rounded-full bg-white/5 border border-white/10 text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
