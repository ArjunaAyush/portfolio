import React, { useState, useEffect, useRef } from 'react';

interface ArchitectureFlowStep {
  step: number;
  label: string;
  source: string;
  target: string;
  description: string;
  metric: string;
}

interface ShowcaseItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  steps: ArchitectureFlowStep[];
  tags: string[];
}

const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: 'media3-pipeline',
    badge: 'Media3 Engine',
    title: 'Zero-Lag Video Reels & LRU Caching',
    subtitle: 'High-throughput ExoPlayer surface binding in Looply',
    steps: [
      {
        step: 1,
        label: 'Pre-fetch Next Segment',
        source: 'Feed Pager',
        target: 'CacheDataSource',
        description: 'Anticipates vertical swipe by pre-allocating byte streams 2 items ahead in memory.',
        metric: '0ms stall latency',
      },
      {
        step: 2,
        label: 'LRU Disk Verification',
        source: 'CacheDataSource',
        target: 'SimpleCache DB',
        description: 'Hits local LRU disk cache for cached chunks, bypassing cellular radio invocation.',
        metric: '92% cache hit rate',
      },
      {
        step: 3,
        label: 'Hardware Surface Render',
        source: 'MediaCodec',
        target: 'SurfaceView / Compose',
        description: 'Direct GPU texture mapping via AndroidX Media3 without extra UI layer compositing.',
        metric: 'Solid 60 FPS playback',
      },
    ],
    tags: ['AndroidX Media3', 'ExoPlayer', 'LRU Disk Cache', 'Compose SurfaceView'],
  },
  {
    id: 'udf-architecture',
    badge: 'State & Concurrency',
    title: 'Unidirectional Data Flow (UDF)',
    subtitle: 'Decoupled asynchronous state streams with Coroutines',
    steps: [
      {
        step: 1,
        label: 'User Intent Dispatched',
        source: 'Compose UI',
        target: 'ViewModel Intent',
        description: 'Immutable UI events captured and channeled to ViewModel without direct mutability.',
        metric: '< 2ms dispatch',
      },
      {
        step: 2,
        label: 'Coroutine Background Reducer',
        source: 'ViewModel Scope',
        target: 'Dispatchers.Default',
        description: 'Runs state transformation logic off the main thread to prevent frame drops.',
        metric: 'Zero UI thread blocking',
      },
      {
        step: 3,
        label: 'StateFlow Emission',
        source: 'StateFlow<T>',
        target: 'Compose Recomposition',
        description: 'Emits distinct, diffed UI states collected with Lifecycle.repeatOnLifecycle.',
        metric: 'Deterministic renders',
      },
    ],
    tags: ['Kotlin Coroutines', 'StateFlow', 'MVI / Clean', 'Thread Isolation'],
  },
  {
    id: 'offline-room',
    badge: 'Offline-First DB',
    title: 'Local SQLite & Background Sync',
    subtitle: 'Room reactive DAO combined with WorkManager',
    steps: [
      {
        step: 1,
        label: 'Instant Local Write',
        source: 'Repository',
        target: 'Room SQLite DAO',
        description: 'App immediately commits changes to SQLite; UI reflects update synchronously.',
        metric: '< 5ms query time',
      },
      {
        step: 2,
        label: 'Reactive Flow Notification',
        source: 'Room Flow Table',
        target: 'Active Observers',
        description: 'Room automatically detects entity mutation and triggers reactive Flow streams.',
        metric: 'Instant UI update',
      },
      {
        step: 3,
        label: 'WorkManager Background Sync',
        source: 'WorkManager',
        target: 'Cloud Backend',
        description: 'Schedules exponential backoff sync with unmetered network battery constraints.',
        metric: '100% data durability',
      },
    ],
    tags: ['Room Database', 'SQLite WAL', 'WorkManager', 'Flow Queries'],
  },
  {
    id: 'compose-motion',
    badge: 'Runtime Rendering',
    title: 'Smart Recomposition & Skipping',
    subtitle: 'Optimized Jetpack Compose compiler stability',
    steps: [
      {
        step: 1,
        label: 'Snapshot Mutation',
        source: 'Snapshot State',
        target: 'Compose Runtime',
        description: 'Snapshot system isolates state mutations to specific reader scopes.',
        metric: 'Sub-millisecond tracking',
      },
      {
        step: 2,
        label: 'Stability Check & Skip',
        source: 'Compose Compiler',
        target: 'Stable Nodes',
        description: 'Unchanged composables with @Immutable/@Stable parameters are completely skipped.',
        metric: 'Zero unnecessary renders',
      },
      {
        step: 3,
        label: 'Hardware Draw Phase',
        source: 'Choreographer',
        target: 'Display Pipeline',
        description: 'Layout coordinates sent directly to GPU frame buffer ahead of 8.3ms VSYNC tick.',
        metric: '120 Hz smooth scrolling',
      },
    ],
    tags: ['Compose Compiler', 'Stability Metrics', 'Choreographer', 'VSYNC Timing'],
  },
];

export const HorizontalShowcase: React.FC = () => {
  const [activeStepIndices, setActiveStepIndices] = useState<Record<string, number>>({
    'media3-pipeline': 0,
    'udf-architecture': 0,
    'offline-room': 0,
    'compose-motion': 0,
  });

  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({
    'media3-pipeline': false,
    'udf-architecture': false,
    'offline-room': false,
    'compose-motion': false,
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  // Playback timer effect for auto-stepping
  useEffect(() => {
    const intervals: ReturnType<typeof setInterval>[] = [];
    Object.entries(isPlaying).forEach(([itemId, playing]) => {
      if (playing) {
        const interval = setInterval(() => {
          setActiveStepIndices((prev) => {
            const currentIdx = prev[itemId] || 0;
            const item = SHOWCASE_ITEMS.find((it) => it.id === itemId);
            const nextIdx = item ? (currentIdx + 1) % item.steps.length : 0;
            return { ...prev, [itemId]: nextIdx };
          });
        }, 2400);
        intervals.push(interval);
      }
    });

    return () => {
      intervals.forEach((i) => clearInterval(i));
    };
  }, [isPlaying]);

  const handleStepChange = (itemId: string, direction: 'next' | 'prev') => {
    setActiveStepIndices((prev) => {
      const currentIdx = prev[itemId] || 0;
      const item = SHOWCASE_ITEMS.find((it) => it.id === itemId);
      if (!item) return prev;
      const max = item.steps.length;
      const nextIdx = direction === 'next' ? (currentIdx + 1) % max : (currentIdx - 1 + max) % max;
      return { ...prev, [itemId]: nextIdx };
    });
  };

  const togglePlay = (itemId: string) => {
    setIsPlaying((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  // Drag-scroll support
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.4;
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  return (
    <section
      id="showcase"
      className="relative w-full py-16 sm:py-24 z-10 select-none overflow-hidden"
    >
      {/* Section Header */}
      <div className="px-5 sm:px-8 md:px-12 lg:px-16 mb-10">
        <div className="site-container mx-auto">
          {/* Eyebrow Badge: Redaction 70 */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-amber-500/25 mb-6 backdrop-blur-xl bg-[#081638]/70 shadow-lg shadow-black/40">
            <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.9)] animate-pulse" />
            <span className="font-redaction-70 text-xs tracking-wider uppercase text-amber-300">
              03 / Subsystems
            </span>
          </div>

          <h2
            className="text-3xl sm:text-5xl lg:text-6xl font-normal text-[#FAF8F5] tracking-tight leading-[1.1] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            How the mobile pipeline runs at{' '}
            <span className="font-redaction-100 italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#FF2A00] to-[#F59E0B]">
              runtime.
            </span>
          </h2>

          <p className="text-[#E2DFD8] text-base sm:text-lg site-paragraph font-normal leading-relaxed">
            Step through the Media3 buffer engine, reactive state flow, and local SQLite sync. Use controls to inspect individual stages.
          </p>
        </div>
      </div>

      {/* Horizontal Scroll Track of Architecture Diagrams */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        className={`flex gap-6 overflow-x-auto no-scrollbar px-5 sm:px-8 md:px-12 lg:px-16 py-4 cursor-grab ${
          isDragging ? 'cursor-grabbing active' : ''
        }`}
        style={{ scrollSnapType: isDragging ? 'none' : 'x mandatory' }}
      >
        {SHOWCASE_ITEMS.map((item, idx) => {
          const currentStepIdx = activeStepIndices[item.id] || 0;
          const currentStep = item.steps[currentStepIdx];
          const playing = isPlaying[item.id] || false;

          return (
            <div
              key={item.id}
              className="flex-shrink-0 w-[88vw] sm:w-[540px] md:w-[580px] p-6 sm:p-8 rounded-3xl border border-white/10 backdrop-blur-xl bg-[#000000]/80 shadow-2xl shadow-black/60 flex flex-col justify-between"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/25 font-mono font-medium">
                    {item.badge}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    [0{idx + 1} / 0{SHOWCASE_ITEMS.length}]
                  </span>
                </div>

                <h3
                  className="text-2xl sm:text-3xl text-[#FAF8F5] font-normal mb-1 tracking-tight"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-amber-400/90 mb-6 font-medium">
                  {item.subtitle}
                </p>

                {/* Animated SVG Flow Diagram Container */}
                <div className="w-full rounded-2xl bg-[#081638]/40 border border-white/10 p-4 mb-5 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3 text-[11px] font-mono text-slate-400 border-b border-white/10 pb-2">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      Runtime Execution Flow
                    </span>
                    <span className="text-amber-300">
                      Step {currentStepIdx + 1} of {item.steps.length}
                    </span>
                  </div>

                  {/* SVG Visualization */}
                  <svg
                    viewBox="0 0 500 120"
                    className="w-full h-auto max-h-[140px] select-none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id={`flowGrad-${item.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#081638" />
                        <stop offset="50%" stopColor="#F59E0B" />
                        <stop offset="100%" stopColor="#FF2A00" />
                      </linearGradient>
                      <filter id={`glow-${item.id}`} x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Connecting Pipe Track */}
                    <line
                      x1="60"
                      y1="60"
                      x2="440"
                      y2="60"
                      stroke="#1e293b"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />

                    {/* Active Connecting Pipeline Segment */}
                    <line
                      x1="60"
                      y1="60"
                      x2={60 + (380 / (item.steps.length - 1)) * currentStepIdx}
                      y2="60"
                      stroke={`url(#flowGrad-${item.id})`}
                      strokeWidth="4"
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />

                    {/* Nodes */}
                    {item.steps.map((st, sIdx) => {
                      const cx = 60 + (380 / (item.steps.length - 1)) * sIdx;
                      const isCurrent = sIdx === currentStepIdx;
                      const isPassed = sIdx <= currentStepIdx;

                      return (
                        <g key={st.step} className="cursor-pointer" onClick={() => setActiveStepIndices((p) => ({ ...p, [item.id]: sIdx }))}>
                          {/* Outer pulse circle for active step */}
                          {isCurrent && (
                            <circle
                              cx={cx}
                              cy="60"
                              r="26"
                              fill="none"
                              stroke="#F59E0B"
                              strokeWidth="2"
                              opacity="0.4"
                              className="animate-ping"
                            />
                          )}

                          {/* Node circle */}
                          <circle
                            cx={cx}
                            cy="60"
                            r="20"
                            fill={isCurrent ? '#081638' : isPassed ? '#1e293b' : '#0a0f1d'}
                            stroke={isCurrent ? '#F59E0B' : isPassed ? '#475569' : '#1e293b'}
                            strokeWidth={isCurrent ? '3' : '2'}
                            filter={isCurrent ? `url(#glow-${item.id})` : undefined}
                            className="transition-all duration-200"
                          />

                          {/* Step Number */}
                          <text
                            x={cx}
                            y="65"
                            textAnchor="middle"
                            fill={isCurrent ? '#FAF8F5' : isPassed ? '#cbd5e1' : '#64748b'}
                            fontSize="13"
                            fontWeight="bold"
                            fontFamily="monospace"
                          >
                            0{st.step}
                          </text>

                          {/* Node Label Top */}
                          <text
                            x={cx}
                            y="25"
                            textAnchor="middle"
                            fill={isCurrent ? '#F59E0B' : '#64748b'}
                            fontSize="11"
                            fontWeight={isCurrent ? '600' : '400'}
                            fontFamily="monospace"
                          >
                            {st.source}
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  {/* Dynamic Step Detail Card */}
                  <div className="mt-3 p-3 rounded-xl bg-[#000000]/60 border border-white/5">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-semibold text-[#FAF8F5] font-mono">
                        Stage 0{currentStep.step}: {currentStep.label}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {currentStep.metric}
                      </span>
                    </div>
                    <p className="text-xs text-[#E2DFD8]/80 leading-relaxed">
                      {currentStep.description}
                    </p>
                  </div>
                </div>

                {/* Step Playback Controls */}
                <div className="flex items-center justify-between gap-3 mb-6 p-2 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleStepChange(item.id, 'prev')}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono text-[#FAF8F5] bg-white/5 hover:bg-white/10 border border-white/10 transition-colors active:scale-95 cursor-pointer"
                      title="Previous Step"
                    >
                      ← Prev
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStepChange(item.id, 'next')}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono text-[#FAF8F5] bg-white/5 hover:bg-white/10 border border-white/10 transition-colors active:scale-95 cursor-pointer"
                      title="Next Step"
                    >
                      Next →
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => togglePlay(item.id)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors active:scale-95 cursor-pointer"
                  >
                    <span>{playing ? '⏸ Pause Loop' : '▶ Auto Step'}</span>
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10 items-center">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-[11px] rounded-full bg-[#081638]/60 border border-white/10 text-slate-300 font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
