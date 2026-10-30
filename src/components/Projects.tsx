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
      className="relative w-full py-16 sm:py-24 px-5 sm:px-8 md:px-12 lg:px-16 overflow-hidden"
    >
      {/* Ambient Looping WebGL Shader Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
        <ShaderAnimation className="w-full h-full opacity-35" />
        {/* Dark Tint & Gradients for Crisp Text Legibility */}
        <div className="absolute inset-0 bg-[#060913]/85 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060913] via-transparent to-[#060913]" />
      </div>

      <div className="site-container relative z-10">
        {/* Eyebrow Tag */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass-pill border border-rose-500/25 mb-6 backdrop-blur-xl bg-[#0b1329]/80 shadow-lg shadow-black/40">
          <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)] animate-pulse" />
          <span className="text-xs tracking-wider uppercase text-rose-300 font-semibold font-mono">
            02 / Selected Projects
          </span>
        </div>

        {/* Section Heading */}
        <h2
          className="text-3xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-[1.1] mb-4"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Selected projects &amp;{' '}
          <span className="text-red-gold-gradient font-medium">native implementations.</span>
        </h2>

        <p className="text-slate-300 text-sm sm:text-base mb-10 max-w-xl font-normal leading-relaxed site-paragraph">
          Production Android applications engineered with modern Kotlin, Jetpack Compose, Room SQLite, and AndroidX Media3.
        </p>

        {/* Compact, Expandable Projects Stack */}
        <div className="space-y-6 w-full">
          {PROJECTS_DATA.map((project, idx) => {
            const isExpanded = expandedId === project.id;

            return (
              <div
                key={project.id || project.title}
                className="p-6 sm:p-7 rounded-3xl border border-rose-500/20 backdrop-blur-xl bg-[#08122a]/80 hover:border-rose-500/40 hover:bg-[#0b1736]/90 transition-all duration-300 shadow-xl shadow-black/50"
              >
                {/* Header Row: Index, Category, GitHub link */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono text-slate-400">
                      [0{idx + 1}]
                    </span>
                    <span className="text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/25 font-mono font-medium">
                      {project.category}
                    </span>
                  </div>

                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-amber-300 font-medium transition-colors underline underline-offset-4"
                    aria-label={`View ${project.title} on GitHub`}
                  >
                    <span>GitHub</span>
                    <svg
                      width="13"
                      height="13"
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
                </div>

                {/* Title & Concise Summary */}
                <h3
                  className="text-2xl sm:text-3xl text-white font-normal mb-1 tracking-tight"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {project.title}
                </h3>
                <p className="text-xs sm:text-sm text-amber-300/90 mb-3 font-medium font-mono">
                  {project.tagline}
                </p>

                {/* Compact Description (Trimmed, Non-Redundant) */}
                <p className="text-sm text-slate-300 leading-relaxed mb-4 font-normal">
                  {project.description}
                </p>

                {/* Tech Stack Pills (Always Visible, Compact) */}
                <div className="flex flex-wrap gap-1.5 items-center mb-5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-0.5 text-[11px] rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-300 font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Expandable Architecture & Highlights Tray */}
                {isExpanded && (
                  <div className="pt-5 pb-3 border-t border-rose-500/15 space-y-5 animate-in fade-in duration-300">
                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                        <div className="text-[10px] font-mono uppercase text-slate-400">Cold Startup</div>
                        <div className="text-sm font-semibold text-rose-300">{project.metrics.startupTime}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                        <div className="text-[10px] font-mono uppercase text-slate-400">Jank Rate</div>
                        <div className="text-sm font-semibold text-emerald-400">{project.metrics.jankRate}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                        <div className="text-[10px] font-mono uppercase text-slate-400">Memory PSS</div>
                        <div className="text-sm font-semibold text-amber-300">{project.metrics.memoryPss}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                        <div className="text-[10px] font-mono uppercase text-slate-400">APK Size</div>
                        <div className="text-sm font-semibold text-sky-300">{project.metrics.apkSize}</div>
                      </div>
                    </div>

                    {/* Architecture Highlights */}
                    <div>
                      <h4 className="text-xs uppercase tracking-wider text-slate-400 font-mono mb-2">
                        Key Architecture Highlights
                      </h4>
                      <ul className="space-y-1.5">
                        {project.contributions.slice(0, 3).map((c, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                            <span className="text-rose-500 shrink-0 mt-0.5">✦</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Action Bar: Expand Toggle & Full Specs Modal Trigger */}
                <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => toggleExpand(project.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-rose-500/30 text-xs font-mono text-slate-300 hover:text-white transition-all duration-200 active:scale-95 cursor-pointer"
                  >
                    <span>{isExpanded ? 'Collapse Details' : 'Expand Architecture'}</span>
                    <span className="text-rose-400 transition-transform duration-200">
                      {isExpanded ? '▴' : '▾'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 hover:border-rose-500/60 text-xs font-mono text-rose-200 hover:text-white transition-all duration-200 active:scale-95 cursor-pointer"
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
