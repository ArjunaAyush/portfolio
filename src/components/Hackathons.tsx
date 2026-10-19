import React from 'react';

interface Initiative {
  title: string;
  tagline: string;
  badge: string;
  description: string;
  focusAreas: string[];
}

const INITIATIVES: Initiative[] = [
  {
    title: 'HackXsprint 2026',
    tagline: 'Competitive Hackathon Sprint',
    badge: 'Sprint 2026',
    description:
      'Participated in a high-intensity innovation sprint focused on building rapid prototypes, reactive UI state machines, and real-time mobile API integrations under strict deadline constraints.',
    focusAreas: [
      'Rapid Android and mobile prototype engineering',
      'High-speed Git branching and cross-developer integration',
      'Resilient client-side state handling under deadline pressure',
    ],
  },
  {
    title: 'NHIDE 2026',
    tagline: 'National Innovation & Development Initiative',
    badge: 'National Initiative',
    description:
      'Engaged in the NHIDE 2026 national innovation framework, addressing real-world problem statements through modular software architecture, feasibility analysis, and scalable systems design.',
    focusAreas: [
      'Collaborative problem deconstruction and software specification',
      'System architecture modeling and API contract definition',
      'Designing accessible, user-focused mobile interfaces',
    ],
  },
  {
    title: 'Amurot Open Source Team Contributor',
    tagline: 'Continuous Collaborative Development',
    badge: 'Team Collaboration',
    description:
      'Active contributor to the Amurot open-source launchpad, collaborating on shared code repositories, conducting peer pull-request reviews, and maintaining documentation hygiene.',
    focusAreas: [
      'Peer review and pull-request verification workflows',
      'Establishing clean repository structure and contribution guidelines',
      'Promoting open-source culture and Git standards among university peers',
    ],
  },
];

export const Hackathons: React.FC = () => {
  return (
    <section
      id="hackathons"
      className="relative w-full py-28 sm:py-36 px-5 sm:px-8 md:px-12 lg:px-16 z-10"
    >
      <div className="site-container">
        {/* Eyebrow Tag */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass-pill border border-rose-500/25 mb-6 backdrop-blur-xl bg-[#0b1329]/80 shadow-lg shadow-black/40">
          <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)] animate-pulse" />
          <span className="text-xs tracking-wider uppercase text-rose-300 font-semibold font-mono">
            05 / Hackathons &amp; Collaboration
          </span>
        </div>

        {/* Section Heading */}
        <h2
          className="text-3xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-[1.1] mb-6"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Hackathon sprints &amp;{' '}
          <span className="text-red-gold-gradient font-medium">team collaboration.</span>
        </h2>

        <p className="text-slate-300 text-base sm:text-lg mb-12 font-normal leading-relaxed site-paragraph">
          Collaborating under deadline pressure, building rapid prototypes,
          and contributing to open-source developer communities.
        </p>

        {/* Initiatives Cards */}
        <div className="space-y-6 w-full">
          {INITIATIVES.map((item) => (
            <div
              key={item.title}
              className="p-7 sm:p-8 rounded-3xl glass-pill border border-rose-500/20 backdrop-blur-xl bg-[#0b1329]/70 transition-all duration-300 hover:border-rose-500/40 hover:bg-[#0f1b3d]/80 shadow-xl shadow-black/50"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <span className="text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/25 font-mono font-medium w-fit">
                  {item.badge}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {item.tagline}
                </span>
              </div>

              <h3
                className="text-2xl sm:text-3xl text-white font-normal mb-3 tracking-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {item.title}
              </h3>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 font-normal">
                {item.description}
              </p>

              <div>
                <h4 className="text-xs uppercase tracking-wider text-slate-400 font-mono mb-2.5">
                  Key Focus &amp; Participation
                </h4>
                <ul className="space-y-2">
                  {item.focusAreas.map((area, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 font-normal"
                    >
                      <span className="text-rose-500 shrink-0 mt-0.5">✦</span>
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
