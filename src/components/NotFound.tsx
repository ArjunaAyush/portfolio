import React from 'react';

export const NotFound: React.FC<{ onNavigateHome?: () => void }> = ({ onNavigateHome }) => {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/404';

  const handleGoHome = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/');
      if (onNavigateHome) {
        onNavigateHome();
      } else {
        window.location.href = '/';
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#060913] text-slate-100 flex flex-col justify-between px-5 sm:px-8 py-10 relative overflow-hidden select-none">
      {/* Background Gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 50% 30%, rgba(255, 42, 0, 0.18) 0%, rgba(8, 22, 56, 0.4) 45%, transparent 70%),
            radial-gradient(circle at 80% 80%, rgba(245, 158, 11, 0.08) 0%, transparent 50%),
            #060913
          `,
        }}
      />

      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-between max-w-5xl mx-auto w-full">
        <a
          href="/"
          onClick={handleGoHome}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-rose-500/25 bg-[#0b1329]/80 backdrop-blur-md text-xs font-mono font-medium text-slate-200 hover:text-white transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span>ArjunaAyush</span>
        </a>

        <div className="text-xs font-mono text-slate-400">
          STATUS: <span className="text-rose-400 font-semibold">404_NOT_FOUND</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-2xl mx-auto w-full text-center py-12 flex flex-col items-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs font-mono font-medium mb-6">
          <span>ActivityNotFoundException</span>
        </div>

        {/* 404 Headline */}
        <h1
          className="text-7xl sm:text-9xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-600 mb-4"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          404
        </h1>

        <h2 className="text-2xl sm:text-3xl font-medium text-white mb-4">
          Destination Activity Unresolved
        </h2>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg mb-8">
          The requested route <code className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 font-mono text-xs">{currentPath}</code> could not be located in the Android Package Manifest.
        </p>

        {/* Mock Android Stack Trace Terminal */}
        <div className="w-full text-left p-4 sm:p-5 rounded-2xl bg-[#081026]/90 border border-rose-500/20 backdrop-blur-xl font-mono text-xs text-slate-400 mb-8 overflow-x-auto shadow-2xl">
          <div className="flex items-center gap-2 pb-3 mb-3 border-b border-white/10 text-[11px] text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="ml-2 text-slate-400">Logcat // Fatal Error</span>
          </div>
          <p className="text-rose-400 font-medium">E/AndroidRuntime: FATAL EXCEPTION: main</p>
          <p className="text-slate-400">Process: com.arjunaayush.portfolio, PID: 4040</p>
          <p className="text-amber-300/90 mt-1">android.content.ActivityNotFoundException: No Activity found to handle Intent {'{'}</p>
          <p className="pl-4 text-slate-300">action="android.intent.action.VIEW"</p>
          <p className="pl-4 text-slate-300">data="{currentPath}"</p>
          <p className="text-amber-300/90">{'}'}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="/"
            onClick={handleGoHome}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white text-sm font-semibold hover:brightness-110 shadow-lg shadow-rose-600/30 transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <span>Back to Portfolio</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>

          <a
            href="https://github.com/arjunaayush"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-rose-500/20 bg-[#0b1329]/70 text-slate-200 hover:text-white text-sm font-medium transition-all duration-200 active:scale-95"
          >
            <span>View GitHub Repositories</span>
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-xs text-slate-400 font-mono py-4">
        &copy; 2026 Ayush Kumar (ArjunaAyush) · All Systems Operational
      </footer>
    </div>
  );
};
