import React, { useEffect, useRef, useState } from 'react';
import { CHARACTER_FRAME_FILES } from '../data/characterFrameManifest';
import { HalftoneMatrix } from './ui/halftone-matrix';

export const BackgroundVideo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);

  // Preloaded image bitmaps / images
  const framesRef = useRef<(ImageBitmap | HTMLImageElement)[]>([]);
  const isLoadedRef = useRef<boolean>(false);
  const [isReady, setIsReady] = useState(false);

  // Cursor & smoothing state
  const targetNormXRef = useRef<number>(0.5);
  const currentNormXRef = useRef<number>(0.5);
  const lastDrawnFrameRef = useRef<number>(-1);
  const lastTimeRef = useRef<number>(0);

  // Helper to determine if current viewport is a normal mobile viewport (<768px)
  const checkIsMobile = (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  };

  // 1. Preload & hardware-decode all frames in parallel using ImageBitmap
  useEffect(() => {
    let cancelled = false;
    const isMobile = checkIsMobile();
    const totalFrames = CHARACTER_FRAME_FILES.length;
    const loadedBitmaps: (ImageBitmap | HTMLImageElement)[] = new Array(totalFrames);
    let loadedCount = 0;

    // Neutral / center frame index (0.5 * 95 = 48)
    const neutralIndex = Math.floor(totalFrames / 2);

    const drawFrameToCanvas = (image: ImageBitmap | HTMLImageElement) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { alpha: true });
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      }
    };

    const loadFrame = async (src: string, index: number) => {
      try {
        const response = await fetch(src);
        const blob = await response.blob();
        if (cancelled) return;

        let frameItem: ImageBitmap | HTMLImageElement;
        if (typeof window !== 'undefined' && 'createImageBitmap' in window) {
          const bitmap = await createImageBitmap(blob);
          if (cancelled) {
            bitmap.close();
            return;
          }
          frameItem = bitmap;
        } else {
          const img = new Image();
          img.src = URL.createObjectURL(blob);
          await img.decode();
          if (cancelled) return;
          frameItem = img;
        }

        loadedBitmaps[index] = frameItem;
        loadedCount++;

        // On mobile, draw the neutral frame as static appearance
        if (isMobile && index === neutralIndex) {
          drawFrameToCanvas(frameItem);
          lastDrawnFrameRef.current = neutralIndex;
          setIsReady(true);
        } else if (!isMobile && index === 0 && lastDrawnFrameRef.current === -1) {
          drawFrameToCanvas(frameItem);
          lastDrawnFrameRef.current = 0;
          setIsReady(true);
        }

        if (loadedCount === totalFrames && !cancelled) {
          framesRef.current = loadedBitmaps;
          isLoadedRef.current = true;
          setIsReady(true);
          // If on mobile and neutral frame was loaded, ensure it is drawn
          if (isMobile && loadedBitmaps[neutralIndex]) {
            drawFrameToCanvas(loadedBitmaps[neutralIndex]);
            lastDrawnFrameRef.current = neutralIndex;
          }
        }
      } catch (err) {
        console.warn(`Failed loading character frame ${index}:`, err);
      }
    };

    // On mobile, load the neutral center frame first
    if (isMobile) {
      loadFrame(CHARACTER_FRAME_FILES[neutralIndex], neutralIndex);
    } else {
      loadFrame(CHARACTER_FRAME_FILES[0], 0);
    }

    for (let i = 0; i < totalFrames; i++) {
      if (isMobile && i === neutralIndex) continue;
      if (!isMobile && i === 0) continue;
      loadFrame(CHARACTER_FRAME_FILES[i], i);
    }

    return () => {
      cancelled = true;
      loadedBitmaps.forEach((item) => {
        if (item && 'close' in item && typeof item.close === 'function') {
          item.close();
        }
      });
    };
  }, []);

  // 2. High-performance Event-Driven Gaze Animation Loop (Desktop Only)
  useEffect(() => {
    let animId = 0;
    let isRunning = false;

    const tick = (now: number) => {
      if (checkIsMobile()) {
        isRunning = false;
        return;
      }

      if (!lastTimeRef.current) lastTimeRef.current = now;
      const dt = Math.min(0.05, (now - lastTimeRef.current) / 1000);
      lastTimeRef.current = now;

      // Delta-time based smooth tracking
      const diff = targetNormXRef.current - currentNormXRef.current;
      if (Math.abs(diff) > 0.0005) {
        const factor = 1 - Math.exp(-18 * dt);
        currentNormXRef.current += diff * factor;
      } else {
        currentNormXRef.current = targetNormXRef.current;
      }

      // Map progress [0..1] to frame index [0..totalFrames - 1]
      const totalFrames = CHARACTER_FRAME_FILES.length;
      const targetFrameIdx = Math.max(
        0,
        Math.min(totalFrames - 1, Math.round(currentNormXRef.current * (totalFrames - 1)))
      );

      // Only draw if frame index changed
      if (targetFrameIdx !== lastDrawnFrameRef.current) {
        const frame = framesRef.current[targetFrameIdx];
        const canvas = canvasRef.current;
        if (frame && canvas) {
          const ctx = canvas.getContext('2d', { alpha: true });
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
            lastDrawnFrameRef.current = targetFrameIdx;
          }
        }
      }

      // If settled and drawn, sleep the loop to consume 0% idle CPU
      if (
        Math.abs(targetNormXRef.current - currentNormXRef.current) < 0.0005 &&
        targetFrameIdx === lastDrawnFrameRef.current
      ) {
        isRunning = false;
        return;
      }

      animId = requestAnimationFrame(tick);
    };

    const wakeGaze = () => {
      if (checkIsMobile()) return;
      if (!isRunning) {
        isRunning = true;
        lastTimeRef.current = performance.now();
        animId = requestAnimationFrame(tick);
      }
    };

    const handlePointerMove = (e: MouseEvent) => {
      if (checkIsMobile()) return;
      const x = e.clientX / window.innerWidth;
      const normX = Math.max(0, Math.min(1, (x - 0.4) / (0.9 - 0.2)));
      targetNormXRef.current = normX;
      wakeGaze();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (checkIsMobile()) return;
      if (e.touches.length > 0) {
        const normX = Math.max(0, Math.min(1, e.touches[0].clientX / window.innerWidth));
        targetNormXRef.current = normX;
        wakeGaze();
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // 3. Scroll-Linked Travel with Smooth Docking at Footer & Zoom Compensation (Reflow-Free)
  useEffect(() => {
    // Detect desktop browser zoom level reliably across Chrome, Safari, Firefox & Edge
    const getZoomFactor = (): number => {
      if (typeof window === 'undefined') return 1.0;

      if (window.visualViewport && window.visualViewport.scale && window.visualViewport.scale !== 1) {
        return window.visualViewport.scale;
      }

      const currentDpr = window.devicePixelRatio || 1.0;

      try {
        const saved = sessionStorage.getItem('portfolio_baseline_dpr');
        if (saved) {
          const baseline = parseFloat(saved);
          if (baseline > 0) {
            const z = currentDpr / baseline;
            if (z >= 0.4 && z <= 3.0) return z;
          }
        }
      } catch {
        // sessionStorage unavailable
      }

      const isMac =
        typeof navigator !== 'undefined' &&
        /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);
      let native = isMac ? 2.0 : 1.0;
      if (!isMac) {
        if (currentDpr >= 1.75) {
          native = 2.0;
        } else if (currentDpr >= 1.2 && currentDpr < 1.75) {
          native = currentDpr >= 1.4 ? 1.5 : 1.25;
        } else {
          native = 1.0;
        }
      }

      return currentDpr / native;
    };

    const getZoomScaleMultiplier = (): number => {
      const zoom = getZoomFactor();
      if (zoom <= 1.0) {
        return 1.0;
      }
      const zoomReduction = zoom - 1.0;
      return Math.max(0.5, 1.0 - zoomReduction);
    };

    // Cached layout metrics to completely eliminate layout thrashing during scroll
    let cachedTravelRange = window.innerHeight * 1.5;
    let cachedFooterAbsoluteTop = 999999;

    const measureLayout = () => {
      const winHeight = window.innerHeight;
      const scrollY = window.scrollY;

      const projectsEl = document.getElementById('projects');
      if (projectsEl) {
        const rect = projectsEl.getBoundingClientRect();
        const elementAbsoluteTop = rect.top + scrollY;
        cachedTravelRange = Math.max(winHeight * 0.5, elementAbsoluteTop - winHeight * 0.3);
      } else {
        cachedTravelRange = winHeight * 1.5;
      }

      const footerEl = document.querySelector('footer');
      if (footerEl) {
        const fRect = footerEl.getBoundingClientRect();
        cachedFooterAbsoluteTop = fRect.top + scrollY;
      } else {
        cachedFooterAbsoluteTop = 999999;
      }
    };

    const renderTransform = (progress: number, scrollY: number) => {
      const el = containerRef.current;
      if (!el) return;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;

      if (isMobile) {
        el.style.transform = 'translate3d(0px, 0px, 0) scale(0.85)';
        el.style.opacity = '1';
        return;
      }

      const zoomMultiplier = getZoomScaleMultiplier();
      const scaleDelta = isTablet ? 0.35 : 0.32;
      const baseScale = 0.96 - progress * scaleDelta;
      const scale = baseScale * zoomMultiplier;

      // Zero-reflow docking calculation using cachedFooterAbsoluteTop
      let ty = 0;
      const footerScreenTop = cachedFooterAbsoluteTop - scrollY;
      if (footerScreenTop < height) {
        ty = footerScreenTop - height;
      }

      const maxTx = 24;
      const tx = progress * maxTx;

      el.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`;
      el.style.opacity = '1';
    };

    const updateScrollProgress = () => {
      const scrollY = window.scrollY;
      const normalized = Math.min(1, Math.max(0, scrollY / cachedTravelRange));
      const eased =
        normalized < 0.5
          ? 4 * normalized * normalized * normalized
          : 1 - Math.pow(-2 * normalized + 2, 3) / 2;

      renderTransform(eased, scrollY);
    };

    // Scheduled frame-locked scroll handler: runs only on active scroll, zero idle RAF
    let scrollRafId = 0;
    const scheduleScrollUpdate = () => {
      if (!scrollRafId) {
        scrollRafId = requestAnimationFrame(() => {
          scrollRafId = 0;
          updateScrollProgress();
        });
      }
    };

    // Initial measurement
    measureLayout();
    updateScrollProgress();

    const handleResize = () => {
      measureLayout();
      updateScrollProgress();
    };

    window.addEventListener('scroll', scheduleScrollUpdate, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }

    // Connect Lenis smooth scroll listener if available
    const lenis = (
      window as unknown as {
        __lenis?: {
          on: (event: string, cb: () => void) => void;
          off: (event: string, cb: () => void) => void;
        };
      }
    ).__lenis;

    if (lenis && typeof lenis.on === 'function') {
      lenis.on('scroll', scheduleScrollUpdate);
    }

    let mq: MediaQueryList | null = null;
    const updateMq = () => {
      handleResize();
      if (typeof window !== 'undefined' && window.matchMedia) {
        if (mq) mq.removeEventListener('change', updateMq);
        mq = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
        mq.addEventListener('change', updateMq);
      }
    };
    updateMq();

    return () => {
      if (scrollRafId) cancelAnimationFrame(scrollRafId);
      window.removeEventListener('scroll', scheduleScrollUpdate);
      window.removeEventListener('resize', handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
      if (mq) {
        mq.removeEventListener('change', updateMq);
      }
      if (lenis && typeof lenis.off === 'function') {
        lenis.off('scroll', scheduleScrollUpdate);
      }
    };
  }, []);

  return (
    <>
      {/* 1. Atmospheric Pure Black + Amber Red Background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none select-none bg-[#000000]"
        style={{
          background: `
            radial-gradient(circle at 76% 36%, rgba(255, 42, 0, 0.45) 0%, rgba(91, 0, 0, 0.15) 44%, transparent 65%),
            radial-gradient(circle at 74% 50%, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.05) 28%, transparent 60%),
            radial-gradient(circle at 20% 75%, rgba(8, 22, 56, 0.5) 0%, rgba(5, 5, 8, 0.4) 45%, transparent 75%),
            radial-gradient(circle at 50% 15%, rgba(10, 15, 30, 0.4) 0%, #000000 60%, #000000 100%)
          `,
        }}
        aria-hidden="true"
      />

      {/* Dotted Halftone Moving Resizing Matrix Overlay */}
      <HalftoneMatrix className="fixed inset-0 z-0 opacity-40 mix-blend-screen" />

      {/* 
        2. Character Layer:
        - Scaled down so it gracefully complements without clashing with content.
        - Mobile: static neutral appearance.
        - Desktop: smooth head-turn animation with scroll-docking.
      */}
      <div
        ref={containerRef}
        className="fixed bottom-0 z-[35] pointer-events-none select-none will-change-transform"
        style={{
          right: 'clamp(16px, 3.5vw, 64px)',
          width: 'clamp(260px, 28vw, 500px)',
          aspectRatio: '1000 / 1030',
          transformOrigin: 'bottom right',
          transform: 'translate3d(0px, 0px, 0) scale(0.96)',
          opacity: 1,
        }}
        aria-hidden="true"
      >
        {/* Luminous Warm Gradient Glow behind Avatar */}
        <div
          className="absolute -inset-10 -z-10 rounded-full blur-3xl pointer-events-none transition-opacity duration-500"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(255, 42, 0, 0.45) 0%, rgba(245, 158, 11, 0.3) 35%, rgba(8, 22, 56, 0.2) 65%, transparent 80%)',
            transform: 'scale(1.2) translate3d(0, 3%, 0)',
            opacity: 0.9,
          }}
          aria-hidden="true"
        />

        {/* Instant fallback poster while GPU decodes frames */}
        <img
          ref={posterRef}
          src="/character_poster.webp"
          alt=""
          className={`absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-300 ${
            isReady ? 'opacity-0' : 'opacity-100'
          }`}
          aria-hidden="true"
        />

        {/* 60fps Hardware-Accelerated Canvas */}
        <canvas
          ref={canvasRef}
          width={1000}
          height={1030}
          className={`w-full h-full object-contain pointer-events-none transition-opacity duration-300 ${
            isReady ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        />
      </div>

      {/* Subtle ambient vignette overlay */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none select-none opacity-20 mix-blend-overlay"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, transparent 60%, rgba(255, 22, 22, 0.89) 100%)',
        }}
        aria-hidden="true"
      />
    </>
  );
};
