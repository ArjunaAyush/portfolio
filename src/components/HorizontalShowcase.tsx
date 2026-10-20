import React, { useRef, useState, useEffect } from 'react';

interface ShowcaseItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  metrics: { label: string; value: string }[];
  description: string;
  tags: string[];
}

const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: 'media3-pipeline',
    badge: 'Media3 Engine',
    title: 'Smooth Video Reels & Instant Caching',
    subtitle: 'Integrated in Looply for responsive video playback',
    metrics: [
      { label: 'Buffering', value: 'Instant' },
      { label: 'Surface', value: 'ExoPlayer / Compose' },
      { label: 'Disk Cache', value: 'Local LRU' },
    ],
    description:
      'Fast video playback in Looply with background caching and instant replay. Preloads video feeds so users can swipe smoothly between reels with zero buffer lag.',
    tags: ['AndroidX Media3', 'ExoPlayer', 'Video Cache', 'Compose'],
  },
  {
    id: 'udf-architecture',
    badge: 'State & Flow',
    title: 'Reactive State & Kotlin Coroutines',
    subtitle: 'Predictable data flow across screens',
    metrics: [
      { label: 'Async Engine', value: 'Coroutines' },
      { label: 'State Holder', value: 'StateFlow' },
      { label: 'Architecture', value: 'Clean & MVI' },
    ],
    description:
      'Clean data flow with Kotlin Coroutines and StateFlow. Decouples UI screens from background processing to keep the app responsive and eliminate unexpected UI glitches.',
    tags: ['StateFlow', 'Clean Architecture', 'Coroutines', 'ViewModel'],
  },
  {
    id: 'offline-room',
    badge: 'Offline-First',
    title: 'Offline Storage & Background Sync',
    subtitle: 'Room SQLite database with background workers',
    metrics: [
      { label: 'Database', value: 'Room SQLite' },
      { label: 'Scheduler', value: 'WorkManager' },
      { label: 'Mode', value: 'Offline-First' },
    ],
    description:
      'Local SQLite database built with Room. Keeps user data saved on the device and syncs in the background with WorkManager when network connection is available.',
    tags: ['Room DB', 'SQLite', 'WorkManager', 'Flow DAO'],
  },
  {
    id: 'compose-design',
    badge: 'Modern UI',
    title: 'Clean Jetpack Compose UI & Motion',
    subtitle: 'Fluid gestures and ergonomic phone layouts',
    metrics: [
      { label: 'Frame Rate', value: '60 / 120 FPS' },
      { label: 'Design System', value: 'Material 3' },
      { label: 'Interaction', value: 'Touch & Haptics' },
    ],
    description:
      'Declarative Android UI built with Jetpack Compose. Responsive layouts, smooth spring animations, and Material 3 design crafted for modern phones.',
    tags: ['Jetpack Compose', 'Material 3', 'Animations', 'UI Components'],
  },
  {
    id: 'systems-profiling',
    badge: 'Performance',
    title: 'Fast App Startup & Memory Profiling',
    subtitle: 'Optimizing native Android performance',
    metrics: [
      { label: 'Startup TTID', value: '< 450 ms' },
      { label: 'Memory', value: 'Leak-Free' },
      { label: 'Build System', value: 'Gradle KTS' },
    ],
    description:
      'Optimized cold app launch times with Baseline Profiles and monitored memory allocations using LeakCanary and Android Studio Profiler.',
    tags: ['Baseline Profiles', 'LeakCanary', 'Gradle KTS', 'Android Profiler'],
  },
];

export const HorizontalShowcase: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [progress, setProgress] = useState(0);

  // 3D Card Hover Tilt and Swivel handlers
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Calculate tilt angles (degrees)
    const rotateX = -((y - centerY) / centerY) * 7.5;
    const rotateY = ((x - centerX) / centerX) * 7.5;

    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.boxShadow = '0 20px 40px -15px rgba(225, 29, 72, 0.25), 0 0 30px rgba(0, 0, 0, 0.7)';
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    card.style.boxShadow = '';
  };

  // Horizontal scroll / drag interactions
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftState - walk;
    updateProgress();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const updateProgress = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = Math.max(1, scrollWidth - clientWidth);
    setProgress(Math.min(1, Math.max(0, scrollLeft / maxScroll)));
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => updateProgress();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      id="showcase"
      ref={containerRef}
      className="relative w-full py-14 sm:py-20 z-10 select-none overflow-hidden"
    >
      {/* Section Header */}
      <div className="px-5 sm:px-8 md:px-12 lg:px-16 mb-12">
        <div className="site-container">
          {/* Eyebrow Badge (03 / Architectural Showcase) */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass-pill border border-rose-500/25 mb-6 backdrop-blur-xl bg-[#0b1329]/80 shadow-lg shadow-black/40">
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)] animate-pulse" />
            <span className="text-xs tracking-wider uppercase text-rose-300 font-semibold font-mono">
              03 / Architectural Showcase
            </span>
          </div>

          <h2
            className="text-3xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-[1.1] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Engineering deep-dives &amp;{' '}
            <span className="text-red-gold-gradient font-medium">mobile architecture.</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg site-paragraph font-normal leading-relaxed">
            Hover over cards for 3D perspective and swipe horizontally to explore core mobile
            patterns, offline database sync, and media playback architecture.
          </p>
        </div>
      </div>

      {/* Horizontal Swiping Track with 3D Tilt Cards */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        className={`flex gap-6 overflow-x-auto no-scrollbar px-5 sm:px-8 md:px-12 lg:px-16 py-6 cursor-grab ${
          isDragging ? 'cursor-grabbing active' : ''
        }`}
        style={{ scrollSnapType: isDragging ? 'none' : 'x mandatory' }}
      >
        {SHOWCASE_ITEMS.map((item, idx) => (
          <div
            key={item.id}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            className="tilt-card flex-shrink-0 w-[85vw] sm:w-[520px] md:w-[560px] p-7 sm:p-9 rounded-3xl glass-pill border border-rose-500/20 backdrop-blur-xl bg-[#0b1329]/70 hover:border-rose-500/40 hover:bg-[#0f1b3d]/80 transition-all duration-300 shadow-xl shadow-black/50 flex flex-col justify-between"
            style={{
              scrollSnapAlign: 'start',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.25s ease-out, box-shadow 0.25s ease-out',
            }}
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between gap-3 mb-6">
                <span className="text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/25 font-mono font-medium">
                  {item.badge}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  [0{idx + 1} / 0{SHOWCASE_ITEMS.length}]
                </span>
              </div>

              {/* Title & Subtitle */}
              <h3
                className="text-2xl sm:text-3xl text-white font-normal mb-2 tracking-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {item.title}
              </h3>
              <p className="text-sm text-amber-300/90 mb-6 font-medium">
                {item.subtitle}
              </p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 mb-6 p-4 rounded-2xl bg-[#060913]/70 border border-white/5">
                {item.metrics.map((m) => (
                  <div key={m.label}>
                    <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                      {m.label}
                    </div>
                    <div className="text-sm font-semibold text-rose-300">
                      {m.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal mb-6">
                {item.description}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10 items-center">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs rounded-full bg-slate-900/70 border border-slate-700/60 text-slate-300 font-mono"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Progress & Scrub Bar */}
      <div className="px-5 sm:px-8 md:px-12 lg:px-16 mt-8 flex items-center justify-between gap-4">
        <div className="text-xs font-mono text-slate-400">
          <span>01</span>
          <span className="mx-2 text-slate-600">/</span>
          <span>0{SHOWCASE_ITEMS.length}</span>
        </div>

        {/* Dynamic Red to Gold Progress Line */}
        <div className="flex-1 max-w-md h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-500 via-rose-400 to-amber-400 rounded-full transition-all duration-150"
            style={{ width: `${Math.max(12, progress * 100)}%` }}
          />
        </div>

        <div className="text-xs font-mono text-rose-400/80 hidden sm:block">
          Swipe or hover cards ↔
        </div>
      </div>
    </section>
  );
};
