import React, { useEffect, useRef, useState } from 'react';
import type { SeniorProjectData } from '../data/projectsData';

interface ProjectModalProps {
  project: SeniorProjectData | null;
  onClose: () => void;
}

type TabType = 'architecture' | 'telemetry' | 'challenges';

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('architecture');
  const [copied, setCopied] = useState<boolean>(false);
  const modalContainerRef = useRef<HTMLDivElement>(null);


  // Accessibility: escape key, focus management, body scroll locking
  useEffect(() => {
    if (!project) return;

    // Lock body scroll cleanly without shifting scroll position or layout
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Auto-focus the dialog container
    const timer = setTimeout(() => {
      modalContainerRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const handleCopyClone = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(project.cloneCommand);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = project.cloneCommand;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      aria-describedby="project-modal-tagline"
      className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center sm:items-center bg-black/80 backdrop-blur-md transition-opacity duration-200 p-0 sm:p-4 md:p-6"
      onClick={onClose}
    >
      {/* Modal Dialog Container */}
      <div
        ref={modalContainerRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[90vh] sm:max-h-[85vh] bg-[#080e22] border-t sm:border border-white/15 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden outline-none animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Mobile Drag Indicator Bar */}
        <div className="sm:hidden pt-3 pb-1 shrink-0 flex justify-center">
          <div
            className="h-1.5 w-12 rounded-full bg-white/20 mx-auto"
            aria-hidden="true"
          />
        </div>

        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 pr-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 border border-white/15 font-mono">
                  {project.category}
                </span>
                <span className="text-xs text-white/40 font-mono">
                  Target API {project.targetSdk} • Min API {project.minSdk}
                </span>
              </div>
              <h2
                id="project-modal-title"
                className="text-2xl sm:text-3xl text-white font-normal tracking-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {project.title}
              </h2>
              <p
                id="project-modal-tagline"
                className="text-xs sm:text-sm text-white/60 font-normal"
              >
                {project.tagline}
              </p>
            </div>

            {/* Close Button with >=48px touch target */}
            <button
              onClick={onClose}
              className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all active:scale-95 shrink-0 focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
              aria-label="Close project specifications modal"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Navigation Tabs (min 48px touch target each) */}
          <div className="flex items-center gap-2 mt-5 overflow-x-auto no-scrollbar pb-1">
            <button
              type="button"
              onClick={() => setActiveTab('architecture')}
              className={`min-h-[48px] px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all active:scale-[0.97] flex items-center gap-2 shrink-0 border ${
                activeTab === 'architecture'
                  ? 'bg-rose-500/20 text-white border-rose-500/50 shadow-sm'
                  : 'bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/[0.08] border-white/10'
              }`}
            >
              <span>🏛️</span>
              <span>Architecture &amp; Data Flow</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('telemetry')}
              className={`min-h-[48px] px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all active:scale-[0.97] flex items-center gap-2 shrink-0 border ${
                activeTab === 'telemetry'
                  ? 'bg-rose-500/20 text-white border-rose-500/50 shadow-sm'
                  : 'bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/[0.08] border-white/10'
              }`}
            >
              <span>📊</span>
              <span>Telemetry &amp; Benchmarks</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('challenges')}
              className={`min-h-[48px] px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all active:scale-[0.97] flex items-center gap-2 shrink-0 border ${
                activeTab === 'challenges'
                  ? 'bg-rose-500/20 text-white border-rose-500/50 shadow-sm'
                  : 'bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/[0.08] border-white/10'
              }`}
            >
              <span>⚡</span>
              <span>Engineering Challenges</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 overscroll-contain">
          {/* TAB 1: ARCHITECTURE & DATA FLOW */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              {/* Pattern Overview */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#f59e0b] font-medium">
                  Architecture Model
                </span>
                <h3 className="text-base sm:text-lg text-white font-medium mt-1">
                  {project.architecturePattern}
                </h3>
                <p className="text-xs sm:text-sm text-white/70 mt-2 leading-relaxed">
                  {project.udfNotes}
                </p>
              </div>

              {/* Visual Clean Architecture Tier Diagram */}
              <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-white/50">
                    Clean Architecture & UDF Flow
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400">
                    Dependency Inversion Enforced
                  </span>
                </div>

                {/* Tier 1: Presentation */}
                <div className="p-3.5 rounded-xl bg-white/[0.05] border border-white/15">
                  <div className="flex items-center justify-between text-xs font-mono text-[#f59e0b] mb-1.5">
                    <span className="font-semibold">01 / Presentation Layer</span>
                    <span>Compose UI & ViewModels</span>
                  </div>
                  <ul className="space-y-1 text-xs text-white/80">
                    {project.layers.presentation.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#f59e0b] mt-0.5">↳</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Flow Arrow */}
                <div className="flex items-center justify-center text-xs font-mono text-white/40 gap-2 py-0.5">
                  <span>↓ Intents / User Events</span>
                  <span>•</span>
                  <span>↑ Immutable StateFlow Stream</span>
                </div>

                {/* Tier 2: Domain */}
                <div className="p-3.5 rounded-xl bg-white/[0.05] border border-white/15">
                  <div className="flex items-center justify-between text-xs font-mono text-amber-400 mb-1.5">
                    <span className="font-semibold">02 / Domain Layer (Pure Kotlin)</span>
                    <span>UseCases & Repository Interfaces</span>
                  </div>
                  <ul className="space-y-1 text-xs text-white/80">
                    {project.layers.domain.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-400 mt-0.5">↳</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Flow Arrow */}
                <div className="flex items-center justify-center text-xs font-mono text-white/40 gap-2 py-0.5">
                  <span>↓ Reactive Queries</span>
                  <span>•</span>
                  <span>↑ Monitored Data Ingestion</span>
                </div>

                {/* Tier 3: Data */}
                <div className="p-3.5 rounded-xl bg-white/[0.05] border border-white/15">
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-1.5">
                    <span className="font-semibold">03 / Data Layer</span>
                    <span>Room DB • Media3 • Network • WorkManager</span>
                  </div>
                  <ul className="space-y-1 text-xs text-white/80">
                    {project.layers.data.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-cyan-400 mt-0.5">↳</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Concurrency Model */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <span className="text-[11px] font-mono uppercase tracking-wider text-white/50">
                  Concurrency & Thread Safety Model
                </span>
                <p className="text-xs sm:text-sm text-white/80 mt-1.5 leading-relaxed font-mono">
                  {project.concurrencyModel}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: TELEMETRY & BENCHMARKS */}
          {activeTab === 'telemetry' && (
            <div className="space-y-6">
              {/* 4 KPI Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Metric 1: Startup Time */}
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col justify-between">
                  <span className="text-[11px] font-mono uppercase text-white/50">
                    Cold Startup Time (TTID)
                  </span>
                  <div className="my-2">
                    <span className="text-2xl sm:text-3xl font-mono font-medium text-white">
                      {project.metrics.startupTime}
                    </span>
                  </div>
                  <span className="text-xs text-emerald-400 font-mono">
                    ✓ Macrobenchmark + Baseline Profiles
                  </span>
                </div>

                {/* Metric 2: Jank Rate */}
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col justify-between">
                  <span className="text-[11px] font-mono uppercase text-white/50">
                    Frame Render Jank Rate
                  </span>
                  <div className="my-2">
                    <span className="text-2xl sm:text-3xl font-mono font-medium text-white">
                      {project.metrics.jankRate}
                    </span>
                  </div>
                  <span className="text-xs text-emerald-400 font-mono">
                    ✓ 8.33ms budget on 120Hz Displays
                  </span>
                </div>

                {/* Metric 3: Memory Footprint */}
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col justify-between">
                  <span className="text-[11px] font-mono uppercase text-white/50">
                    Steady-State Memory (PSS)
                  </span>
                  <div className="my-2">
                    <span className="text-2xl sm:text-3xl font-mono font-medium text-white">
                      {project.metrics.memoryPss}
                    </span>
                  </div>
                  <span className="text-xs text-emerald-400 font-mono">
                    ✓ Android Studio Memory Profiler
                  </span>
                </div>

                {/* Metric 4: Compressed APK Size */}
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col justify-between">
                  <span className="text-[11px] font-mono uppercase text-white/50">
                    Compressed APK Size
                  </span>
                  <div className="my-2">
                    <span className="text-2xl sm:text-3xl font-mono font-medium text-white">
                      {project.metrics.apkSize}
                    </span>
                  </div>
                  <span className="text-xs text-emerald-400 font-mono">
                    ✓ R8 Full Mode + ProGuard Shrinking
                  </span>
                </div>
              </div>

              {/* SDK Target Matrix */}
              <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10">
                <span className="text-xs font-mono uppercase tracking-wider text-white/50 block mb-3">
                  Android Platform & Compiler Matrix
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="text-[11px] font-mono text-white/50">Min SDK</div>
                    <div className="text-sm font-mono text-white font-medium mt-0.5">
                      API {project.minSdk}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="text-[11px] font-mono text-white/50">Target SDK</div>
                    <div className="text-sm font-mono text-[#f59e0b] font-medium mt-0.5">
                      API {project.targetSdk} (A15)
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="text-[11px] font-mono text-white/50">JVM Bytecode</div>
                    <div className="text-sm font-mono text-white font-medium mt-0.5">
                      {project.javaVersion}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="text-[11px] font-mono text-white/50">Kotlin Compiler</div>
                    <div className="text-sm font-mono text-white font-medium mt-0.5">
                      {project.kotlinVersion}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tech Stack Chips */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <span className="text-[11px] font-mono uppercase tracking-wider text-white/50 block mb-2.5">
                  Production Libraries & Frameworks
                </span>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-xs rounded-full bg-white/[0.06] border border-white/15 text-white/90 font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ENGINEERING CHALLENGES */}
          {activeTab === 'challenges' && (
            <div className="space-y-4">
              {project.challengesSolved.map((challenge, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#f59e0b]/20 text-[#f59e0b] text-xs font-mono flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <h4 className="text-sm sm:text-base text-white font-medium">
                      {challenge.title}
                    </h4>
                  </div>

                  {/* Problem */}
                  <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/20 text-xs sm:text-sm text-red-200/90 leading-relaxed">
                    <span className="font-mono text-red-400 font-semibold uppercase text-[10px] block mb-1">
                      Problem Statement
                    </span>
                    {challenge.problem}
                  </div>

                  {/* Solution */}
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs sm:text-sm text-white/80 leading-relaxed">
                    <span className="font-mono text-amber-400 font-semibold uppercase text-[10px] block mb-1">
                      Engineering Solution
                    </span>
                    {challenge.solution}
                  </div>

                  {/* Impact */}
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/25 text-xs sm:text-sm text-emerald-200/90 leading-relaxed">
                    <span className="font-mono text-emerald-400 font-semibold uppercase text-[10px] block mb-1">
                      Production Impact & Verification
                    </span>
                    {challenge.impact}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-black/60 shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* GitHub Repo Link */}
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[48px] px-4 sm:px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs sm:text-sm font-medium inline-flex items-center gap-2 transition-all active:scale-[0.97]"
                aria-label={`Open ${project.title} GitHub repository in a new tab`}
              >
                <span>GitHub Repository</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </a>

              {/* Download Demo APK */}
              <a
                href={project.demoApkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[48px] px-4 sm:px-5 py-2.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-white text-xs sm:text-sm font-medium inline-flex items-center gap-2 transition-all active:scale-[0.97]"
                aria-label={`Download ${project.title} demo release APK`}
              >
                <span>📦 Download Demo APK</span>
              </a>
            </div>

            {/* Copy Git Clone Command */}
            <button
              type="button"
              onClick={handleCopyClone}
              className="min-h-[48px] px-4 sm:px-5 py-2.5 rounded-full bg-white/[0.05] hover:bg-white/10 border border-white/10 text-white/90 hover:text-white text-xs sm:text-sm font-mono inline-flex items-center gap-2 transition-all active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-rose-500"
              aria-label="Copy Git clone command to clipboard"
            >
              {copied ? (
                <>
                  <span className="text-emerald-400">✓</span>
                  <span className="text-emerald-300">Copied clone command</span>
                </>
              ) : (
                <>
                  <span className="text-white/40">$</span>
                  <span>Copy Clone Command</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
