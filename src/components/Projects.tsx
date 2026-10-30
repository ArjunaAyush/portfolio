import React, { useState } from 'react';
import { PROJECTS_DATA, type SeniorProjectData } from '../data/projectsData';
import { ProjectModal } from './ProjectModal';
import { ShaderAnimation } from './ui/shader-animation';

export const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<SeniorProjectData | null>(null);
  const [flippedIds, setFlippedIds] = useState<Record<string, boolean>>({});

  const toggleFlip = (id: string) => {
    setFlippedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section
      id="projects"
      className="relative w-full py-20 sm:py-28 px-5 sm:px-8 md:px-12 lg:px-16 overflow-hidden z-10 isolate"
    >
      {/* Ambient Looping WebGL Shader Backdrop (Brilliantly Visible at z-0) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <ShaderAnimation className="w-full h-full opacity-90" />
        {/* Subtle Dark Vignette: Keeps Shader Lines Pulsing while Text Remains 100% Legible */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000] via-transparent to-[#000000]" />
      </div>

      <div className="site-container relative z-20">
        {/* Eyebrow Tag (Amber Red + Milk) */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-[#FF2A00]/30 mb-6 backdrop-blur-xl bg-black/75 shadow-lg shadow-black/50">
          <span className="w-2 h-2 rounded-full bg-[#FF2A00] shadow-[0_0_8px_rgba(255,42,0,0.9)] animate-pulse" />
          <span className="text-xs tracking-wider uppercase text-[#FAF8F5] font-semibold font-mono">
            02 / Selected Projects
          </span>
        </div>

        {/* Section Heading (Milk Typography) */}
        <h2
          className="text-3xl sm:text-5xl lg:text-6xl font-normal text-[#FAF8F5] tracking-tight leading-[1.1] mb-4"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Selected projects &amp;{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2A00] via-[#E11D48] to-[#F59E0B] font-medium">
            native implementations.
          </span>
        </h2>

        <p className="text-[#E2DFD8] text-sm sm:text-base mb-10 max-w-xl font-normal leading-relaxed site-paragraph">
          Production Android applications engineered with modern Kotlin, Jetpack Compose, Room SQLite, and AndroidX Media3. Tap any card to flip between telemetry benchmarks and architecture diagrams.
        </p>

        {/* SHOW, DON'T TELL: Interactive Flip Cards Stack */}
        <div className="space-y-8 w-full">
          {PROJECTS_DATA.map((project, idx) => {
            const isFlipped = !!flippedIds[project.id];

            return (
              <div
                key={project.id || project.title}
                className="relative rounded-3xl border border-white/10 backdrop-blur-2xl bg-black/85 hover:border-[#FF2A00]/40 transition-all duration-300 shadow-2xl shadow-black/80 overflow-hidden group"
              >
                {!isFlipped ? (
                  /* FRONT FACE: Overview + Telemetry Benchmark Charts */
                  <div className="p-6 sm:p-8 flex flex-col justify-between min-h-[380px]">
                    <div>
                      {/* Header Row: Index, Category, GitHub link */}
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-mono text-stone-400">
                            [0{idx + 1}]
                          </span>
                          <span className="text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FF2A00]/15 text-[#FF2A00] border border-[#FF2A00]/30 font-mono font-medium">
                            {project.category}
                          </span>
                        </div>

                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-[#FAF8F5] hover:text-[#F59E0B] font-medium transition-colors underline underline-offset-4"
                          aria-label={`View ${project.title} on GitHub`}
                        >
                          <span>View Repository</span>
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          >
                            <path d="M7 17L17 7M17 7H7M17 7V17" />
                          </svg>
                        </a>
                      </div>

                      {/* Title & Tagline */}
                      <h3
                        className="text-2xl sm:text-3xl text-[#FAF8F5] font-normal mb-1 tracking-tight"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {project.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#F59E0B] mb-3 font-medium font-mono">
                        {project.tagline}
                      </p>

                      <p className="text-sm text-[#E2DFD8] leading-relaxed mb-6 font-normal">
                        {project.description}
                      </p>

                      {/* SHOW, DON'T TELL: Benchmark Visual Charts & Telemetry */}
                      <div className="mb-6 p-4 rounded-2xl bg-stone-950/90 border border-white/5 space-y-3">
                        <div className="text-[11px] uppercase tracking-wider text-stone-400 font-mono flex items-center justify-between">
                          <span>Live Telemetry &amp; Optimization Benchmarks</span>
                          <span className="text-emerald-400 font-semibold">Verified on Hardware</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                          {/* Cold TTID */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-mono text-stone-400">
                              <span>Cold TTID</span>
                              <span className="text-[#FF2A00]">{project.metrics.startupTime}</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-stone-800 overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-[#FF2A00] to-[#E11D48] w-[46%]" />
                            </div>
                          </div>

                          {/* Jank Rate */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-mono text-stone-400">
                              <span>Jank Rate</span>
                              <span className="text-emerald-400">{project.metrics.jankRate}</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-stone-800 overflow-hidden">
                              <div className="h-full bg-emerald-400 w-[98%]" />
                            </div>
                          </div>

                          {/* Memory PSS */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-mono text-stone-400">
                              <span>Memory PSS</span>
                              <span className="text-[#F59E0B]">{project.metrics.memoryPss}</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-stone-800 overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-[#F59E0B] to-amber-300 w-[35%]" />
                            </div>
                          </div>

                          {/* APK Size */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-mono text-stone-400">
                              <span>R8 Full APK</span>
                              <span className="text-cyan-400">{project.metrics.apkSize}</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-stone-800 overflow-hidden">
                              <div className="h-full bg-cyan-400 w-[28%]" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tech Stack Badges */}
                      <div className="flex flex-wrap gap-1.5 items-center mb-6">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-0.5 text-[11px] rounded-full bg-stone-950 border border-stone-800 text-[#FAF8F5] font-mono"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => toggleFlip(project.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF2A00]/25 via-[#E11D48]/20 to-[#F59E0B]/20 hover:from-[#FF2A00]/40 hover:to-[#F59E0B]/35 border border-[#FF2A00]/40 text-xs font-mono text-[#FAF8F5] transition-all duration-200 active:scale-95 cursor-pointer shadow-md"
                      >
                        <span>Flip to System Diagram</span>
                        <span className="text-[#FF2A00] font-bold">⟲</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedProject(project)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-white/25 text-xs font-mono text-[#FAF8F5] transition-all duration-200 active:scale-95 cursor-pointer"
                      >
                        <span>⚡ Tech Specs Modal</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* BACK FACE: Visual System Architecture Pipeline & Data Flow Diagram */
                  <div className="p-6 sm:p-8 flex flex-col justify-between min-h-[380px] bg-[#05060A]/95 animate-in fade-in duration-300">
                    <div>
                      {/* Header */}
                      <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#FF2A00] animate-pulse" />
                          <h4 className="text-sm font-mono uppercase tracking-wider text-[#FAF8F5] font-semibold">
                            {project.title} // System Architecture Diagram
                          </h4>
                        </div>
                        <span className="text-xs font-mono text-[#F59E0B]">
                          {project.architecturePattern.split('+')[0].trim()}
                        </span>
                      </div>

                      {/* Visual System Pipeline (SHOW, DON'T TELL) */}
                      <div className="mb-6 space-y-3">
                        <div className="p-4 rounded-2xl bg-black/90 border border-white/10 space-y-3">
                          <div className="text-[11px] font-mono uppercase tracking-wider text-stone-400">
                            Unidirectional Data Flow Pipeline (UDF)
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                            {/* Layer 1 */}
                            <div className="p-3 rounded-xl bg-stone-900/90 border border-[#FF2A00]/30 space-y-1">
                              <div className="text-[10px] text-[#FF2A00] uppercase font-bold">1. Presentation</div>
                              <div className="text-[#FAF8F5] font-semibold">Compose UI</div>
                              <p className="text-[10px] text-stone-400">Immutable StateFlow emission, @Immutable models, 0 recomposition</p>
                            </div>

                            {/* Layer 2 */}
                            <div className="p-3 rounded-xl bg-stone-900/90 border border-[#F59E0B]/30 space-y-1">
                              <div className="text-[10px] text-[#F59E0B] uppercase font-bold">2. Domain Logic</div>
                              <div className="text-[#FAF8F5] font-semibold">Pure UseCases</div>
                              <p className="text-[10px] text-stone-400">0 Android framework imports, Coroutine Worker, state machine</p>
                            </div>

                            {/* Layer 3 */}
                            <div className="p-3 rounded-xl bg-stone-900/90 border border-cyan-500/30 space-y-1">
                              <div className="text-[10px] text-cyan-300 uppercase font-bold">3. Data &amp; Hardware</div>
                              <div className="text-[#FAF8F5] font-semibold">Room + Media3</div>
                              <p className="text-[10px] text-stone-400">WAL SQLite cache, ExoPlayer decoder recycling, zero-buffer</p>
                            </div>
                          </div>
                        </div>

                        {/* Engineering Challenge Solved Highlight */}
                        {project.challengesSolved?.[0] && (
                          <div className="p-3.5 rounded-xl bg-stone-950/70 border border-white/5 space-y-1">
                            <span className="text-[10px] font-mono uppercase text-[#F59E0B] font-semibold">
                              Key Challenge Solved: {project.challengesSolved[0].title}
                            </span>
                            <p className="text-xs text-[#E2DFD8] leading-relaxed">
                              {project.challengesSolved[0].impact}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => toggleFlip(project.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#F59E0B]/25 to-[#FF2A00]/25 hover:from-[#F59E0B]/40 hover:to-[#FF2A00]/40 border border-[#F59E0B]/40 text-xs font-mono text-[#FAF8F5] transition-all duration-200 active:scale-95 cursor-pointer shadow-md"
                      >
                        <span>Flip to Overview &amp; Benchmarks</span>
                        <span className="text-[#F59E0B] font-bold">⟳</span>
                      </button>

                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-white/25 text-xs font-mono text-[#FAF8F5] transition-all duration-200 active:scale-95 cursor-pointer"
                      >
                        <span>Open GitHub Repo ↗</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Senior Android Deep-Dive Modal */}
      <ProjectModal
        key={selectedProject?.id || 'none'}
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
