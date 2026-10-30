import React, { useState } from 'react';
import { PROJECTS_DATA, type SeniorProjectData } from '../data/projectsData';
import { ProjectModal } from './ProjectModal';
import { ShaderAnimation } from './ui/shader-animation';

export const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<SeniorProjectData | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="projects"
      className="relative w-full py-20 sm:py-28 px-5 sm:px-8 md:px-12 lg:px-16 overflow-hidden z-10 isolate"
    >
      {/* Ambient Looping WebGL Shader Backdrop (Brilliantly Visible at z-0) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <ShaderAnimation className="w-full h-full opacity-80" />
        {/* Subtle Dark Vignette: Keeps Shader Lines Pulsing while Text Remains 100% Legible */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
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
          Production Android applications engineered with modern Kotlin, Jetpack Compose, Room SQLite, and AndroidX Media3.
        </p>

        {/* Compact, Expandable Projects Stack (Show, Don't Tell) */}
        <div className="space-y-6 w-full">
          {PROJECTS_DATA.map((project, idx) => {
            const isExpanded = expandedId === project.id;

            return (
              <div
                key={project.id || project.title}
                className="p-6 sm:p-8 rounded-3xl border border-white/10 backdrop-blur-2xl bg-black/80 hover:border-[#FF2A00]/40 transition-all duration-300 shadow-2xl shadow-black/80 group"
              >
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

                {/* Compact 1-line Summary */}
                <p className="text-sm text-[#E2DFD8] leading-relaxed mb-4 font-normal">
                  {project.description}
                </p>

                {/* SHOW, DON'T TELL: Live Telemetry Metrics Pill Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
                  <div className="px-3 py-2 rounded-xl bg-stone-950/80 border border-white/5 flex flex-col">
                    <span className="text-[10px] font-mono uppercase text-stone-400">Cold TTID</span>
                    <span className="text-xs font-semibold text-[#FF2A00] font-mono">{project.metrics.startupTime}</span>
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-stone-950/80 border border-white/5 flex flex-col">
                    <span className="text-[10px] font-mono uppercase text-stone-400">Jank Rate</span>
                    <span className="text-xs font-semibold text-emerald-400 font-mono">{project.metrics.jankRate}</span>
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-stone-950/80 border border-white/5 flex flex-col">
                    <span className="text-[10px] font-mono uppercase text-stone-400">Memory PSS</span>
                    <span className="text-xs font-semibold text-[#F59E0B] font-mono">{project.metrics.memoryPss}</span>
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-stone-950/80 border border-white/5 flex flex-col">
                    <span className="text-[10px] font-mono uppercase text-stone-400">APK Size</span>
                    <span className="text-xs font-semibold text-cyan-400 font-mono">{project.metrics.apkSize}</span>
                  </div>
                </div>

                {/* Tech Stack Pills (Always Visible, Compact) */}
                <div className="flex flex-wrap gap-1.5 items-center mb-5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-0.5 text-[11px] rounded-full bg-stone-950 border border-stone-800 text-[#FAF8F5] font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* SHOW, DON'T TELL: Expandable Visual Architecture & Specs Tray */}
                {isExpanded && (
                  <div className="pt-5 pb-3 border-t border-white/10 space-y-5 animate-in fade-in duration-300">
                    {/* Visual Architecture Flow Diagram (SHOW, DON'T TELL) */}
                    <div>
                      <h4 className="text-xs uppercase tracking-wider text-stone-400 font-mono mb-2.5">
                        Clean Architecture Pipeline (UDF Flow)
                      </h4>
                      <div className="p-3.5 rounded-2xl bg-stone-950/90 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-[#FAF8F5]">
                        <div className="px-3 py-1.5 rounded-lg bg-[#FF2A00]/20 border border-[#FF2A00]/40 text-[#FF2A00]">
                          Presentation (Compose UI)
                        </div>
                        <span className="text-stone-500">──StateFlow──▶</span>
                        <div className="px-3 py-1.5 rounded-lg bg-[#F59E0B]/20 border border-[#F59E0B]/40 text-[#F59E0B]">
                          Domain (UseCases)
                        </div>
                        <span className="text-stone-500">──Coroutines──▶</span>
                        <div className="px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
                          Data (Room + Media3)
                        </div>
                      </div>
                    </div>

                    {/* Engineering Highlights */}
                    <div>
                      <h4 className="text-xs uppercase tracking-wider text-stone-400 font-mono mb-2">
                        Core Engineering Highlights
                      </h4>
                      <ul className="space-y-1.5">
                        {project.contributions.slice(0, 3).map((c, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-[#E2DFD8] leading-relaxed">
                            <span className="text-[#FF2A00] shrink-0 mt-0.5">✦</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Action Bar: Stateful Expand & Modal Trigger */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => toggleExpand(project.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-[#FF2A00]/40 text-xs font-mono text-[#FAF8F5] transition-all duration-200 active:scale-95 cursor-pointer"
                  >
                    <span>{isExpanded ? 'Collapse Details' : 'Expand Architecture'}</span>
                    <span className="text-[#FF2A00] transition-transform duration-200">
                      {isExpanded ? '▴' : '▾'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF2A00]/20 hover:bg-[#FF2A00]/30 border border-[#FF2A00]/40 hover:border-[#FF2A00]/70 text-xs font-mono text-[#FAF8F5] hover:text-white transition-all duration-200 active:scale-95 cursor-pointer"
                  >
                    <span>⚡ Tech Specs Modal</span>
                  </button>
                </div>
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
