import React, { useState } from 'react';
import { PROJECTS_DATA, type SeniorProjectData } from '../data/projectsData';
import { ProjectModal } from './ProjectModal';

export const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<SeniorProjectData | null>(null);

  return (
    <section
      id="projects"
      className="relative w-full py-28 sm:py-36 px-5 sm:px-8 md:px-12 lg:px-16 z-10"
    >
      <div className="site-container">
        {/* Eyebrow Tag (Royal Red Accent) */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass-pill border border-rose-500/25 mb-6 backdrop-blur-xl bg-[#0b1329]/80 shadow-lg shadow-black/40">
          <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)] animate-pulse" />
          <span className="text-xs tracking-wider uppercase text-rose-300 font-semibold font-mono">
            02 / Selected Projects
          </span>
        </div>

        {/* Section Heading */}
        <h2
          className="text-3xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-[1.1] mb-6"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Selected projects &amp;{' '}
          <span className="text-red-gold-gradient font-medium">native implementations.</span>
        </h2>

        <p className="text-slate-300 text-base sm:text-lg mb-12 font-normal leading-relaxed site-paragraph">
          Real Android applications built with modern Kotlin, Jetpack Compose, Room SQLite,
          and AndroidX Media3. Open-source source code and technical architecture breakdowns below.
        </p>

        {/* Projects Stack */}
        <div className="space-y-10 w-full">
          {PROJECTS_DATA.map((project, idx) => (
            <div
              key={project.id || project.title}
              className="p-7 sm:p-9 rounded-3xl glass-pill border border-rose-500/20 backdrop-blur-xl bg-[#0b1329]/70 transition-all duration-300 hover:border-rose-500/40 hover:bg-[#0f1b3d]/80 shadow-xl shadow-black/50 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-400">
                    [0{idx + 1}]
                  </span>
                  <span className="text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/25 font-mono font-medium">
                    {project.category}
                  </span>
                </div>

                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-amber-300 font-medium transition-colors underline underline-offset-4"
                  aria-label={`View ${project.title} repository on GitHub`}
                >
                  <span>View Repository</span>
                  <svg
                    width="14"
                    height="14"
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

              <h3
                className="text-2xl sm:text-3xl text-white font-normal mb-1.5 tracking-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {project.title}
              </h3>
              <p className="text-xs sm:text-sm text-amber-300/90 mb-4 font-medium font-mono">
                {project.tagline}
              </p>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 font-normal">
                {project.description}
              </p>

              {/* Architectural Highlights */}
              <div className="mb-6">
                <h4 className="text-xs uppercase tracking-wider text-slate-400 font-mono mb-2.5">
                  Core Highlights &amp; Features
                </h4>
                <ul className="space-y-2">
                  {project.contributions.map((c, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal"
                    >
                      <span className="text-rose-500 shrink-0 mt-0.5">✦</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech Stack Badges */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap gap-2 items-center mb-6">
                <span className="text-[11px] font-mono text-slate-400 uppercase mr-1">
                  Stack:
                </span>
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 text-xs rounded-full bg-slate-900/70 border border-slate-700/60 text-slate-300 font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Primary Tactile Deep-Dive Trigger Button */}
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setSelectedProject(project)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/35 hover:border-rose-500/60 text-rose-200 hover:text-white text-xs sm:text-sm font-medium tracking-wide transition-all duration-200 active:scale-[0.97] hover:shadow-[0_0_24px_rgba(225,29,72,0.25)] min-h-[48px] focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
                  aria-label={`Open architecture and tech specs for ${project.title}`}
                >
                  <span className="text-rose-400">⚡</span>
                  <span>Architecture &amp; Tech Specs</span>
                  <span className="text-rose-400 transition-transform duration-200 group-hover:translate-x-1">→</span>
                </button>
              </div>
            </div>
          ))}
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
