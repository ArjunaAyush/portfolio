import React, { useState, useEffect, useRef } from 'react';
import { triggerHaptic } from '../utils/haptics';

interface DevTerminalProps {
  onInspectProject: (projectId: string) => void;
}

type TabType = 'logcat' | 'telemetry' | 'cli';
type LogLevel = 'ALL' | 'VERBOSE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

interface LogEntry {
  id: number;
  time: string;
  level: 'V' | 'D' | 'I' | 'W' | 'E';
  tag: string;
  message: string;
}

interface CliLine {
  id: number;
  type: 'input' | 'output' | 'error' | 'success';
  text: string;
}

const INITIAL_LOGS: LogEntry[] = [
  {
    id: 1,
    time: '12:04:01.108',
    level: 'D',
    tag: 'D/Looply-Media',
    message: '[ExoPlayer] Preloaded 3 segments into SimpleCache (14.2 MB allocated)',
  },
  {
    id: 2,
    time: '12:04:01.320',
    level: 'I',
    tag: 'I/RoomSQLite',
    message: 'Query executed in 2.1ms: SELECT * FROM loop_items WHERE cached = 1',
  },
  {
    id: 3,
    time: '12:04:01.780',
    level: 'V',
    tag: 'V/ComposeRecompose',
    message: 'Skipped recomposition for LoopReelCard (@Immutable parameters)',
  },
  {
    id: 4,
    time: '12:04:02.110',
    level: 'I',
    tag: 'I/PerfettoTrace',
    message: 'Startup Macrobenchmark: TTID=412ms, Baseline Profiles compilation=SPEED_PROFILE',
  },
  {
    id: 5,
    time: '12:04:02.450',
    level: 'D',
    tag: 'D/StatSyncWorker',
    message: 'WorkManager enqueued Expedited Job (Constraints: UNMETERED_NETWORK, BATTERY_NOT_LOW)',
  },
  {
    id: 6,
    time: '12:04:03.002',
    level: 'W',
    tag: 'W/AndroidAudio',
    message: 'AudioTrack underrun avoided via Media3 pre-buffer headroom (4.2ms margin)',
  },
  {
    id: 7,
    time: '12:04:03.415',
    level: 'I',
    tag: 'I/HiltGraph',
    message: 'Dependency graph initialized in 18.4ms (@Singleton scope active)',
  },
  {
    id: 8,
    time: '12:04:03.890',
    level: 'D',
    tag: 'D/Looply-Media',
    message: 'Surface recycled successfully across reel boundary (0ms decoder delay)',
  },
];

const STREAMING_LOG_TEMPLATES: Omit<LogEntry, 'id' | 'time'>[] = [
  {
    level: 'D',
    tag: 'D/Looply-Media',
    message: 'Cache hit in SimpleCache: video/mp4 buffer chunk served in 0.8ms',
  },
  {
    level: 'I',
    tag: 'I/RoomSQLite',
    message: 'Transaction committed: 12 telemetry entries written to WAL staging log',
  },
  {
    level: 'V',
    tag: 'V/ComposeRecompose',
    message: 'StateFlow<LoopUiState> emitted new snapshot (0 dropped frames)',
  },
  {
    level: 'I',
    tag: 'I/PerfettoTrace',
    message: 'Frame timeline slice: doFrame duration=4.12ms (Target budget: 8.33ms / 120 FPS)',
  },
  {
    level: 'D',
    tag: 'D/StatSyncWorker',
    message: 'Monotonic vector clock synchronized across offline session queues',
  },
  {
    level: 'W',
    tag: 'W/AndroidAudio',
    message: 'Audio output latency verified: 3.8ms AAudio low-latency MMAP stream active',
  },
  {
    level: 'D',
    tag: 'D/ExoPlayerCache',
    message: 'LRU bounds check passed: disk footprint 342 MB / 2048 MB ceiling',
  },
  {
    level: 'I',
    tag: 'I/HiltGraph',
    message: 'ViewModel injection complete: SavedStateHandle restored process state',
  },
];

export const DevTerminal: React.FC<DevTerminalProps> = ({ onInspectProject }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('logcat');
  const [logLevel, setLogLevel] = useState<LogLevel>('ALL');
  const [isPaused, setIsPaused] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [heapMb, setHeapMb] = useState(48.2);
  const [fps, setFps] = useState(120.0);

  // CLI State
  const [cliInput, setCliInput] = useState('');
  const [cliLines, setCliLines] = useState<CliLine[]>([
    {
      id: 1,
      type: 'output',
      text: 'Android Telemetry Console v2.4 (Pixel 8 Pro • API 35 Android 15)',
    },
    {
      id: 2,
      type: 'output',
      text: 'Type "help" to view available diagnostic commands.',
    },
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const logContainerRef = useRef<HTMLDivElement>(null);
  const cliBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Live logcat stream timer
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
      ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(
        now.getMilliseconds()
      ).padStart(3, '0')}`;

      const template =
        STREAMING_LOG_TEMPLATES[
          Math.floor(Math.random() * STREAMING_LOG_TEMPLATES.length)
        ];

      setLogs((prev) => {
        const nextId = prev.length > 0 ? prev[prev.length - 1].id + 1 : 1;
        const newEntry: LogEntry = {
          id: nextId,
          time: timeStr,
          ...template,
        };
        // Keep last 60 logs
        return [...prev.slice(-59), newEntry];
      });

      // Subtle heap jitter (47.8 to 51.2 MB)
      setHeapMb((prev) => {
        const delta = (Math.random() - 0.5) * 0.4;
        const next = Math.max(45.0, Math.min(54.0, prev + delta));
        return parseFloat(next.toFixed(1));
      });

      // Dynamic FPS jitter (119.8 - 120.0)
      setFps(parseFloat((120.0 - Math.random() * 0.2).toFixed(1)));
    }, 2800);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Auto-scroll logcat to bottom on new entries
  useEffect(() => {
    if (!isPaused && activeTab === 'logcat' && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, isPaused, activeTab]);

  // Auto-scroll CLI on output
  useEffect(() => {
    if (activeTab === 'cli' && cliBottomRef.current) {
      cliBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [cliLines, activeTab]);

  // Filter logs by level
  const filteredLogs = logs.filter((log) => {
    if (logLevel === 'ALL') return true;
    if (logLevel === 'VERBOSE') return true;
    if (logLevel === 'DEBUG') return log.level !== 'V';
    if (logLevel === 'INFO') return log.level !== 'V' && log.level !== 'D';
    if (logLevel === 'WARN') return log.level === 'W' || log.level === 'E';
    if (logLevel === 'ERROR') return log.level === 'E';
    return true;
  });

  const getLogLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'V':
        return 'text-white/60';
      case 'D':
        return 'text-sky-400';
      case 'I':
        return 'text-emerald-400';
      case 'W':
        return 'text-amber-400';
      case 'E':
        return 'text-rose-400 font-semibold';
      default:
        return 'text-white/80';
    }
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawCmd = cliInput.trim();
    if (!rawCmd) return;

    triggerHaptic(12);

    // Add command to history
    setHistory((prev) => [...prev, rawCmd]);
    setHistoryIndex(-1);

    const inputLine: CliLine = {
      id: Date.now(),
      type: 'input',
      text: `$ ${rawCmd}`,
    };

    const parts = rawCmd.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();

    const outputLines: CliLine[] = [];

    switch (cmd) {
      case 'help':
        outputLines.push({
          id: Date.now() + 1,
          type: 'output',
          text: `Diagnostic Commands:
  projects         List native Android engineering projects
  inspect <id>     Open architecture deep-dive (looply, statsync, amurot)
  skills           Display senior Android technical toolkit
  metrics          Inspect live Pixel 8 Pro system telemetry & heap
  logcat           Dump recent adb logcat output
  whoami           Display engineer identity and academic credentials
  contact          Display email & GitHub communication channels
  adb devices      List attached adb devices and emulators
  gradle build     Simulate Gradle release compilation pipeline
  clear            Clear terminal display`,
        });
        break;

      case 'projects':
        outputLines.push({
          id: Date.now() + 1,
          type: 'success',
          text: `[1] Looply     - Offline Reels & Media3 Video Looper (ExoPlayer, Room, UDF)
[2] StatSync   - Developer Telemetry Synchronizer (Vector Clocks, WorkManager)
[3] Amurot     - Decentralized Open Source Hub (CI/CD, Gradle KTS, Turbine)

Tip: Type "inspect looply" to launch the interactive architecture modal!`,
        });
        break;

      case 'inspect':
        if (!arg) {
          outputLines.push({
            id: Date.now() + 1,
            type: 'error',
            text: 'Usage: inspect <looply | statsync | amurot>',
          });
        } else if (['looply', 'statsync', 'amurot'].includes(arg)) {
          outputLines.push({
            id: Date.now() + 1,
            type: 'success',
            text: `[ADB] Launching Architecture Inspector for "${arg}"...`,
          });
          onInspectProject(arg);
        } else {
          outputLines.push({
            id: Date.now() + 1,
            type: 'error',
            text: `Unknown project: "${arg}". Available: looply, statsync, amurot`,
          });
        }
        break;

      case 'skills':
        outputLines.push({
          id: Date.now() + 1,
          type: 'output',
          text: `Senior Android Technical Competencies:
  • Languages:      Kotlin 2.1, Java 21 LTS
  • Architecture:   Clean Architecture, MVI / UDF, Kotlin Multiplatform (KMP)
  • UI & Animation: Jetpack Compose 1.7, Material 3, Baseline Profiles
  • Storage:        Room SQLite (WAL mode, non-destructive migrations)
  • Concurrency:    Coroutines, StateFlow, SupervisorJob, Flow operators
  • Media:          AndroidX Media3 (ExoPlayer), SimpleCache, AAudio / Oboe
  • Profiling:      Android Studio Memory Profiler, Perfetto, Systrace, LeakCanary
  • Tooling & CI:   Gradle Kotlin DSL, libs.versions.toml, R8 Full Mode, GitHub Actions`,
        });
        break;

      case 'metrics':
        outputLines.push({
          id: Date.now() + 1,
          type: 'output',
          text: `Device Telemetry Snapshot:
  • Device:        Google Pixel 8 Pro (husky)
  • OS:            Android 15 (Vanilla Ice Cream) • API 35
  • Display:       120.0 Hz LTPO OLED • Render Budget: 8.33ms
  • JVM Heap:      ${heapMb} MB / 192 MB (${((heapMb / 192) * 100).toFixed(1)}% allocated)
  • Native Memory: 32.4 MB PSS • 0 memory leaks (LeakCanary verified)
  • Render Engine: Jetpack Compose 1.7.5 • Skiko / Vulkan HW Pipeline`,
        });
        break;

      case 'whoami':
        outputLines.push({
          id: Date.now() + 1,
          type: 'success',
          text: `Ayush Kumar (Arjuna Ayush)
Native Android & Systems Engineer • 2nd Year IT @ GGV Central University, Bilaspur
Focus: Jetpack Compose, Media3/ExoPlayer, Clean Architecture, Low-Latency Performance.`,
        });
        break;

      case 'contact':
        outputLines.push({
          id: Date.now() + 1,
          type: 'output',
          text: `Contact & Collaboration:
  • Personal Email:  ayush@arjunaayush.tech
  • Mainframe Agency: mainframe.org.in@gmail.com
  • GitHub:          https://github.com/ArjunaAyush`,
        });
        break;

      case 'adb':
        if (arg === 'devices') {
          outputLines.push({
            id: Date.now() + 1,
            type: 'output',
            text: `List of devices attached:
emulator-5554          device product:husky model:Pixel_8_Pro transport_id:1`,
          });
        } else {
          outputLines.push({
            id: Date.now() + 1,
            type: 'error',
            text: `Supported adb command: "adb devices"`,
          });
        }
        break;

      case 'gradle':
        if (arg.includes('build')) {
          outputLines.push({
            id: Date.now() + 1,
            type: 'success',
            text: `> Task :app:preBuild UP-TO-DATE
> Task :app:compileReleaseKotlin UP-TO-DATE
> Task :app:mergeReleaseArtProfile UP-TO-DATE
> Task :app:minifyReleaseWithR8 UP-TO-DATE (R8 Full Mode enabled)
> Task :app:packageRelease UP-TO-DATE (Signed APK generated)

BUILD SUCCESSFUL in 1.48s (18 tasks: 16 up-to-date, 2 cached)`,
          });
        } else {
          outputLines.push({
            id: Date.now() + 1,
            type: 'output',
            text: `Supported gradle command: "gradle build"`,
          });
        }
        break;

      case 'logcat':
        outputLines.push({
          id: Date.now() + 1,
          type: 'output',
          text: logs
            .slice(-4)
            .map((l) => `${l.time}  ${l.tag}: ${l.message}`)
            .join('\n'),
        });
        break;

      case 'clear':
        setCliLines([]);
        setCliInput('');
        return;

      default:
        outputLines.push({
          id: Date.now() + 1,
          type: 'error',
          text: `Command not found: "${cmd}". Type "help" for a list of available commands.`,
        });
    }

    setCliLines((prev) => [...prev, inputLine, ...outputLines]);
    setCliInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex =
        historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setCliInput(history[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(-1);
        setCliInput('');
      } else {
        setHistoryIndex(nextIndex);
        setCliInput(history[nextIndex]);
      }
    }
  };

  return (
    <>
      {/* Floating HUD Trigger Button (Docked Bottom-Left to avoid 3D Character Corridor) */}
      {!isOpen && (
        <aside
          aria-label="Developer Telemetry Console"
          className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-30"
        >
          <button
            type="button"
            onClick={() => {
              triggerHaptic(15);
              setIsOpen(true);
            }}
            className="flex items-center gap-2.5 px-3.5 sm:px-4 py-2.5 rounded-full bg-[#090305]/95 border border-white/20 text-white/90 text-xs font-mono shadow-2xl backdrop-blur-xl hover:border-[#ff3b5c]/60 hover:text-white transition-all active:scale-[0.97] group focus:outline-none focus:ring-2 focus:ring-[#ff3b5c] min-h-[48px]"
            aria-label="Open Android Telemetry Console and Logcat HUD"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="tracking-wide">
              &gt;_ Android Telemetry • Pixel 8 Pro
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] rounded bg-white/10 text-[#ff3b5c] font-semibold">
              120 FPS
            </span>
          </button>
        </aside>
      )}

      {/* Docked Developer Console Panel */}
      {isOpen && (
        <aside
          aria-label="Developer Telemetry Panel"
          tabIndex={-1}
          onTouchMove={(e) => e.stopPropagation()}
          className="fixed bottom-0 inset-x-0 sm:inset-x-auto sm:bottom-6 sm:left-6 z-30 w-full sm:w-[640px] max-w-full sm:max-w-2xl h-[380px] sm:h-[340px] rounded-t-2xl sm:rounded-2xl bg-[#090305]/98 border-t sm:border border-white/15 backdrop-blur-xl shadow-2xl flex flex-col font-mono text-xs overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Mobile Drag Pill */}
          <div className="sm:hidden pt-2 pb-1 shrink-0 flex justify-center bg-black/40">
            <div className="h-1 w-10 rounded-full bg-white/20" aria-hidden="true" />
          </div>

          {/* Console Header */}
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-black/60 border-b border-white/10 shrink-0">
            {/* Status Pill & Device Info */}
            <div className="flex items-center gap-2 overflow-hidden pr-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
              <span className="text-[11px] text-white/90 font-medium truncate">
                Pixel 8 Pro • API 35 Android 15 • {fps} FPS
              </span>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(10);
                  setIsOpen(false);
                }}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-all active:scale-[0.97]"
                title="Minimize console"
                aria-label="Minimize console"
              >
                <span>_</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(10);
                  setIsOpen(false);
                }}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-rose-500/20 text-white/70 hover:text-rose-400 flex items-center justify-center transition-all active:scale-[0.97]"
                title="Close console"
                aria-label="Close console"
              >
                <span>✕</span>
              </button>
            </div>
          </div>

          {/* Console Tab Navigation Bar */}
          <div className="flex items-center justify-between px-2 sm:px-3 py-1.5 bg-black/30 border-b border-white/10 shrink-0 overflow-x-auto no-scrollbar gap-2">
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(8);
                  setActiveTab('logcat');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all active:scale-[0.97] min-h-[36px] flex items-center gap-1.5 ${
                  activeTab === 'logcat'
                    ? 'bg-[#ff3b5c]/25 text-white border border-[#ff3b5c]/50'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>📑</span>
                <span>Logcat</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic(8);
                  setActiveTab('telemetry');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all active:scale-[0.97] min-h-[36px] flex items-center gap-1.5 ${
                  activeTab === 'telemetry'
                    ? 'bg-[#ff3b5c]/25 text-white border border-[#ff3b5c]/50'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>📊</span>
                <span>Telemetry</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic(8);
                  setActiveTab('cli');
                  setTimeout(() => inputRef.current?.focus(), 50);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all active:scale-[0.97] min-h-[36px] flex items-center gap-1.5 ${
                  activeTab === 'cli'
                    ? 'bg-[#ff3b5c]/25 text-white border border-[#ff3b5c]/50'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>&gt;_</span>
                <span>Interactive CLI</span>
              </button>
            </div>

            {/* Logcat Controls (Visible only on Logcat Tab) */}
            {activeTab === 'logcat' && (
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(8);
                    setIsPaused(!isPaused);
                  }}
                  className={`px-2 py-1 rounded text-[11px] font-mono border transition-all active:scale-[0.97] min-h-[32px] ${
                    isPaused
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}
                  aria-label={isPaused ? 'Resume Logcat stream' : 'Pause Logcat stream'}
                >
                  {isPaused ? '▶ Resume' : '⏸ Pause'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(8);
                    setLogs([]);
                  }}
                  className="px-2 py-1 rounded text-[11px] font-mono bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-all active:scale-[0.97] min-h-[32px]"
                  aria-label="Clear Logcat logs"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* TAB 1: LOGCAT STREAM */}
          {activeTab === 'logcat' && (
            <div className="flex-1 flex flex-col min-h-0 bg-[#060203]">
              {/* Log Level Filters */}
              <div className="flex items-center gap-1 px-3 py-1.5 bg-black/40 border-b border-white/5 overflow-x-auto no-scrollbar shrink-0">
                <span className="text-[10px] text-white/40 uppercase mr-1">Level:</span>
                {(['ALL', 'VERBOSE', 'DEBUG', 'INFO', 'WARN', 'ERROR'] as LogLevel[]).map(
                  (lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => {
                        triggerHaptic(6);
                        setLogLevel(lvl);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider transition-all active:scale-[0.97] ${
                        logLevel === lvl
                          ? 'bg-white/20 text-white font-semibold'
                          : 'text-white/40 hover:text-white/70'
                      }`}
                    >
                      {lvl}
                    </button>
                  )
                )}
              </div>

              {/* Log Stream Output */}
              <div
                ref={logContainerRef}
                className="flex-1 overflow-y-auto p-2.5 space-y-1 font-mono text-[11px] leading-tight selection:bg-white/20"
              >
                {filteredLogs.length === 0 ? (
                  <div className="text-white/40 italic py-4 text-center">
                    No logcat entries match filter "{logLevel}".
                  </div>
                ) : (
                  filteredLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-2 hover:bg-white/[0.03] px-1 py-0.5 rounded transition-colors"
                    >
                      <span className="text-white/40 shrink-0 select-none">
                        {log.time}
                      </span>
                      <span
                        className={`shrink-0 font-medium ${getLogLevelColor(
                          log.level
                        )}`}
                      >
                        {log.tag}:
                      </span>
                      <span className="text-white/80 break-words flex-1">
                        {log.message}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: TELEMETRY & PROFILING */}
          {activeTab === 'telemetry' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#060203]">
              {/* Device & Engine Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="text-[10px] uppercase text-white/40 font-mono">
                    Target Device
                  </div>
                  <div className="text-xs text-white font-medium mt-0.5">
                    Google Pixel 8 Pro
                  </div>
                  <div className="text-[11px] text-[#ff3b5c] font-mono mt-0.5">
                    Android 15 (Vanilla Ice Cream) • API 35
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="text-[10px] uppercase text-white/40 font-mono">
                    Graphics & Render Engine
                  </div>
                  <div className="text-xs text-white font-medium mt-0.5">
                    Jetpack Compose 1.7.5
                  </div>
                  <div className="text-[11px] text-cyan-400 font-mono mt-0.5">
                    Skiko / Vulkan HW Acceleration
                  </div>
                </div>
              </div>

              {/* Dynamic JVM Heap Gauge */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white/60">JVM Heap Allocation</span>
                  <span className="text-emerald-400 font-semibold">
                    Heap: {heapMb} MB / 192 MB ({((heapMb / 192) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-[#ff3b5c] transition-all duration-500 rounded-full"
                    style={{ width: `${(heapMb / 192) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-white/40 font-mono">
                  <span>0 MB (Min)</span>
                  <span>Steady-State Bound</span>
                  <span>192 MB (Max Limit)</span>
                </div>
              </div>

              {/* Frame Budget & Gradle Daemon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="text-[10px] uppercase text-white/40 font-mono">
                    Frame Render Budget
                  </div>
                  <div className="text-xs text-white font-medium mt-0.5">
                    {fps} FPS • 0 dropped frames
                  </div>
                  <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
                    8.33ms budget / 120Hz LTPO display
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="text-[10px] uppercase text-white/40 font-mono">
                    Gradle Daemon Build
                  </div>
                  <div className="text-xs text-white font-medium mt-0.5">
                    BUILD SUCCESSFUL in 1.48s
                  </div>
                  <div className="text-[11px] text-amber-300 font-mono mt-0.5">
                    18 tasks: 16 up-to-date, 2 cached
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INTERACTIVE CLI */}
          {activeTab === 'cli' && (
            <div className="flex-1 flex flex-col min-h-0 bg-[#060203]">
              {/* Console History Output */}
              <div className="flex-1 overflow-y-auto p-3 space-y-1.5 font-mono text-[11px] leading-relaxed">
                {cliLines.map((line) => (
                  <div
                    key={line.id}
                    className={`whitespace-pre-wrap break-words ${
                      line.type === 'input'
                        ? 'text-cyan-300 font-semibold'
                        : line.type === 'error'
                        ? 'text-rose-400'
                        : line.type === 'success'
                        ? 'text-emerald-400'
                        : 'text-white/80'
                    }`}
                  >
                    {line.text}
                  </div>
                ))}
                <div ref={cliBottomRef} />
              </div>

              {/* Command Input Form */}
              <form
                onSubmit={handleCommandSubmit}
                className="p-2 bg-black/60 border-t border-white/10 flex items-center gap-2 shrink-0"
              >
                <span className="text-[#ff3b5c] font-bold select-none pl-1">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={cliInput}
                  onChange={(e) => setCliInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder='Try "help", "projects", "inspect looply", or "metrics"...'
                  className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none placeholder:text-white/30"
                  autoComplete="off"
                  spellCheck="false"
                  aria-label="Terminal command input"
                />
                <button
                  type="submit"
                  className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] transition-all active:scale-[0.97]"
                >
                  Run
                </button>
              </form>
            </div>
          )}
        </aside>
      )}
    </>
  );
};
