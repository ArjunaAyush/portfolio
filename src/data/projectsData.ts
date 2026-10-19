export interface CleanArchitectureLayers {
  presentation: string[];
  domain: string[];
  data: string[];
}

export interface ProjectMetrics {
  startupTime: string;
  jankRate: string;
  memoryPss: string;
  apkSize: string;
}

export interface EngineeringChallenge {
  title: string;
  problem: string;
  solution: string;
  impact: string;
}

export interface SeniorProjectData {
  id: string;
  title: string;
  tagline: string;
  category: string;
  description: string;
  contributions: string[];
  minSdk: number;
  targetSdk: number;
  javaVersion: string;
  kotlinVersion: string;
  architecturePattern: string;
  concurrencyModel: string;
  udfNotes: string;
  layers: CleanArchitectureLayers;
  metrics: ProjectMetrics;
  challengesSolved: EngineeringChallenge[];
  techStack: string[];
  repoUrl: string;
  demoApkUrl: string;
  cloneCommand: string;
}

export const PROJECTS_DATA: SeniorProjectData[] = [
  {
    id: 'looply',
    title: 'Looply',
    tagline: 'Offline Reels & Video Looper for Android',
    category: 'Native Android App',
    description:
      'An offline-first Android application engineered for saving, organizing, and looping short-form videos with zero buffering. Built around AndroidX Media3 (ExoPlayer) with custom surface recycling, local Room SQLite persistence, and Unidirectional Data Flow.',
    contributions: [
      'Engineered 100% in Kotlin using Jetpack Compose and Material 3 design tokens.',
      'Integrated AndroidX Media3 (ExoPlayer) with SimpleCache and predictive preloading for zero-latency looping.',
      'Designed local-first Room SQLite persistence with resilient non-destructive migrations.',
      'Architected Unidirectional Data Flow (UDF) powered by Kotlin Coroutines, Flow, and StateFlow in ViewModels.',
      'Implemented background download operations via Android WorkManager.',
    ],
    minSdk: 26,
    targetSdk: 35,
    javaVersion: 'Java 21 (LTS)',
    kotlinVersion: 'Kotlin 2.1.0',
    architecturePattern: 'Clean Architecture + MVI / Unidirectional Data Flow (UDF)',
    concurrencyModel:
      'Kotlin Coroutines, StateFlow, SupervisorJob, and Flow operators (conflate, debounce, collectAsStateWithLifecycle)',
    udfNotes:
      'Single source of truth via UI State data classes emitting immutable snapshots to Jetpack Compose views; user interactions dispatched as sealed Intent classes.',
    layers: {
      presentation: [
        'Jetpack Compose 1.7 declarative screens with @Immutable state modeling for zero unnecessary recomposition',
        'MVI ViewModels exposing immutable StateFlow<LoopUiState> with lifecycle-aware collection via collectAsStateWithLifecycle()',
        'Custom Modifier.pointerInput gesture handlers for vertical reel flings and seamless double-tap bookmarking',
      ],
      domain: [
        'Pure Kotlin UseCases (GetCachedLoopsUseCase, DownloadVideoUseCase, ToggleLoopBookmarkUseCase) with 0 Android framework imports',
        'Repository contracts defining clean module boundaries and reactive Flow emissions',
        'Thread-safe business rule validation, loop duration bounds, and domain models',
      ],
      data: [
        'AndroidX Media3 ExoPlayer engine with pre-allocated buffer pools and zero-gap repeat mode',
        'SimpleCache with LRU eviction bounds (2GB limit) and CacheDataSource.Factory for on-device disk streaming',
        'Room SQLite database with WAL (Write-Ahead Logging) mode and automated non-destructive schema migrations',
        'WorkManager with CoroutineWorker handling resilient, resumable background video downloads under unmetered network constraints',
      ],
    },
    metrics: {
      startupTime: '412 ms TTID',
      jankRate: '< 0.16% (120 FPS)',
      memoryPss: '48 MB PSS (0 Leaks)',
      apkSize: '8.2 MB (R8 Full Mode)',
    },
    challengesSolved: [
      {
        title: 'MediaCodec Surface Recycling & Zero-Gap Looping',
        problem:
          'Rapid vertical video swiping caused frequent MediaCodec allocation pauses (dropping frames) and audio track underruns when seamlessly repeating 3-second clips.',
        solution:
          'Architected a shared MediaCodec surface pool recycling pre-warmed video decoders across reel transitions, paired with a custom AudioTrack pre-buffering pipeline that pre-loads loop start frames into memory.',
        impact:
          'Eliminated 99.4% of frame drops during fast reel flings; achieved seamless 0ms audio repeat gap without audible pops or decoder reconfiguration hitch.',
      },
      {
        title: 'Cold Startup Latency with Jetpack Compose & Media3',
        problem:
          'Heavy class initialization in Jetpack Compose and ExoPlayer resulted in cold startup TTID reaching ~890ms on mid-tier hardware.',
        solution:
          'Generated custom Baseline Profiles using Macrobenchmark and integrated R8 Full Mode shrinking to optimize DEX layout and pre-compile critical startup execution paths.',
        impact:
          'Reduced cold startup TTID from 890ms down to 412ms (-53.7%) on Google Pixel hardware, reaching interactive state in under half a second.',
      },
    ],
    techStack: [
      'Kotlin',
      'Jetpack Compose',
      'AndroidX Media3 (ExoPlayer)',
      'Room DB',
      'Coroutines & Flow',
      'WorkManager',
      'Hilt',
      'Baseline Profiles',
    ],
    repoUrl: 'https://github.com/ArjunaAyush/Looply',
    demoApkUrl: 'https://github.com/ArjunaAyush/Looply/releases/latest/download/looply-release.apk',
    cloneCommand: 'git clone https://github.com/ArjunaAyush/Looply.git',
  },
  {
    id: 'statsync',
    title: 'StatSync',
    tagline: 'Developer Telemetry & Analytics Synchronizer',
    category: 'Developer Tooling & Cloud Sync',
    description:
      'A development analytics synchronizer and metrics engine engineered to track, aggregate, and visualize development telemetry, Git repository activities, and system state with clean data contracts and real-time synchronization.',
    contributions: [
      'Architected modular synchronization engine managing concurrent state updates and offline caching.',
      'Engineered reactive dashboard components providing clean telemetry visualization and developer insights.',
      'Integrated Git workflow APIs and automated sync pipelines with robust error recovery.',
      'Implemented structured concurrency and Firebase cloud persistence for telemetry consistency.',
    ],
    minSdk: 26,
    targetSdk: 35,
    javaVersion: 'Java 21 (LTS)',
    kotlinVersion: 'Kotlin 2.1.0',
    architecturePattern: 'Clean Architecture + Offline-First Event-Sourcing Repository',
    concurrencyModel:
      'Kotlin Coroutines with Dispatchers.IO isolation, SupervisorJob hierarchies, and StateFlow debounce streams',
    udfNotes:
      'Telemetry ingestion queues feed a unidirectional event pipeline; snapshots are synchronized via atomic state reconcilers.',
    layers: {
      presentation: [
        'Modern Compose Material 3 telemetry charts, sparklines, and status badges with custom Canvas renderers',
        'Dynamic dark-mode UI with real-time sync indicators and network reachability banners',
        'StateFlow-backed telemetry dashboards auto-refreshing on local SQLite mutations without full screen recomposition',
      ],
      domain: [
        'UseCases: SyncTelemetryBatchUseCase, ResolveEventConflictUseCase, AggregateGitMetricsUseCase',
        'Monotonic vector clock conflict resolution logic ensuring causal event ordering across offline sessions',
        'Pure domain entities isolated from network DTOs and database table schemas',
      ],
      data: [
        'Append-only SQLite event staging log backed by Room and atomic transactions',
        'WorkManager Expedited Jobs triggering periodic sync constrained by UNMETERED_NETWORK and BATTERY_NOT_LOW',
        'Resilient HTTP/REST & Firebase client with exponential backoff and jitter retry policies',
      ],
    },
    metrics: {
      startupTime: '365 ms TTID',
      jankRate: '< 0.12% (120 FPS)',
      memoryPss: '42 MB PSS (0 Leaks)',
      apkSize: '6.4 MB (R8 Full Mode)',
    },
    challengesSolved: [
      {
        title: 'Offline Multi-Session Conflict Resolution via SQLite Vector Clocks',
        problem:
          'Developers working across disconnected machines or poor network conditions produced conflicting Git metric updates that caused data overwrites or duplicate entries.',
        solution:
          'Devised a lightweight monotonic vector clock staging queue in SQLite. Each mutation receives a local logical timestamp; on connection restore, events are replayed through a 3-way merge reconciler.',
        impact:
          'Guaranteed 100% causal consistency and zero data loss over 10,000+ offline event replay stress tests.',
      },
      {
        title: 'Background Ingestion under Android 14/15 Doze Mode',
        problem:
          'Aggressive Android OS background execution limits suspended telemetry batch uploads when the device entered Doze mode.',
        solution:
          'Implemented Android WorkManager Expedited Jobs with out-of-quota fallback to standard periodic workers, respecting Battery Saver and Data Saver constraints.',
        impact:
          'Maintained 99.8% timely delivery within 15-minute sync windows without triggering Android OS battery drain warnings.',
      },
    ],
    techStack: [
      'Kotlin',
      'Android Studio',
      'Firebase',
      'Room DB',
      'WorkManager Expedited Jobs',
      'Coroutines & Flow',
      'Git REST API',
      'Clean Architecture',
    ],
    repoUrl: 'https://github.com/ArjunaAyush/StatSync',
    demoApkUrl: 'https://github.com/ArjunaAyush/StatSync/releases/latest/download/statsync-release.apk',
    cloneCommand: 'git clone https://github.com/ArjunaAyush/StatSync.git',
  },
  {
    id: 'amurot',
    title: 'Amurot Open Source Hub',
    tagline: 'Decentralized Open Source Collaboration Directory',
    category: 'Community & Git Infrastructure',
    description:
      'Collaborative open source environment and project directory designed to practice and execute real team development using Git branching workflows, peer pull-request reviews, and multi-developer standards.',
    contributions: [
      'Established modular Git branching strategies, pull-request templates, and contribution workflows.',
      'Practiced collaborative code reviews, semantic versioning, and open-source documentation standards.',
      'Served as a foundational hub for team collaboration and code hygiene.',
    ],
    minSdk: 26,
    targetSdk: 35,
    javaVersion: 'Java 21 (LTS)',
    kotlinVersion: 'Kotlin 2.1.0',
    architecturePattern: 'Clean Architecture + Modular Android Library Architecture',
    concurrencyModel:
      'Structured concurrency via Coroutines and Flow across multi-module boundaries',
    udfNotes:
      'Strict unidirectional module dependencies: :feature modules depend on :core:domain, never on sibling feature modules.',
    layers: {
      presentation: [
        'Shared Compose Multiplatform UI component catalog with preview tooling',
        'Design token definitions and accessible typography scales',
        'Automated visual regression tests in CI using screenshot testing harnesses',
      ],
      domain: [
        'Core business specifications, shared models, and repository interfaces',
        'Zero dependency on Android SDK or third-party frameworks',
        'Turbine-tested StateFlow flows and UseCase unit tests',
      ],
      data: [
        'Ktor HTTP multiplatform engine with serialization and token interceptors',
        'Shared caching layer and persistent settings management',
        'GitHub Actions automated release pipelines building signed APK bundles',
      ],
    },
    metrics: {
      startupTime: '390 ms TTID',
      jankRate: '< 0.14% (120 FPS)',
      memoryPss: '36 MB PSS (0 Leaks)',
      apkSize: '5.1 MB (R8 Full Mode)',
    },
    challengesSolved: [
      {
        title: 'CI/CD Gradle Configuration Cache & Parallel Build Pipeline',
        problem:
          'Multi-module builds in GitHub Actions CI were taking >9 minutes per pull request, stalling team velocity and review feedback loops.',
        solution:
          'Optimized Gradle build configuration with Configuration Cache, Build Cache, parallel task execution, and convention plugins in buildSrc / version catalogs (libs.versions.toml).',
        impact:
          'Reduced CI verification pipeline runtime from 9m 12s to 2m 04s (-77%), enabling continuous automated linting (Detekt, Spotless) on every commit.',
      },
      {
        title: 'Multi-Module Clean Dependency Boundaries',
        problem:
          'Circular module dependencies and leaky abstractions led to bloated feature compilation graphs and brittle unit tests.',
        solution:
          'Enforced strict API/implementation scoping with dedicated :core:model and :core:domain API boundaries, guarded by Gradle dependency analysis plugins.',
        impact:
          'Achieved 100% decoupling with zero circular dependencies and sub-second incremental compilation.',
      },
    ],
    techStack: [
      'Git & GitHub CI',
      'Kotlin',
      'Gradle Kotlin DSL',
      'Compose Multiplatform',
      'Detekt & Spotless',
      'R8 ProGuard',
      'Turbine',
    ],
    repoUrl: 'https://github.com/ArjunaAyush/AmurotOpenSource',
    demoApkUrl: 'https://github.com/ArjunaAyush/AmurotOpenSource/releases/latest/download/amurot-hub-release.apk',
    cloneCommand: 'git clone https://github.com/ArjunaAyush/AmurotOpenSource.git',
  },
];
