import React, { useEffect, useRef, useState } from 'react';
import { CHARACTER_FRAME_FILES } from '../data/characterFrameManifest';

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

  // 1. Preload & hardware-decode all frames in parallel using ImageBitmap
  useEffect(() => {
    let cancelled = false;
    const totalFrames = CHARACTER_FRAME_FILES.length;
    const loadedBitmaps: (ImageBitmap | HTMLImageElement)[] = new Array(totalFrames);
    let loadedCount = 0;

    const loadFrame = async (src: string, index: number) => {
      try {
        const response = await fetch(src);
        const blob = await response.blob();
        if (cancelled) return;

        if (typeof window !== 'undefined' && 'createImageBitmap' in window) {
          const bitmap = await createImageBitmap(blob);
          if (cancelled) {
            bitmap.close();
            return;
          }
          loadedBitmaps[index] = bitmap;
        } else {
          // Fallback to standard Image
          const img = new Image();
          img.src = URL.createObjectURL(blob);
          await img.decode();
          if (cancelled) return;
          loadedBitmaps[index] = img;
        }

        loadedCount++;

        // Draw initial frame as soon as frame 0 is decoded
        if (index === 0 && canvasRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d', { alpha: true });
          if (ctx && loadedBitmaps[0]) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(loadedBitmaps[0], 0, 0, canvas.width, canvas.height);
            lastDrawnFrameRef.current = 0;
            setIsReady(true);
          }
        }

        if (loadedCount === totalFrames && !cancelled) {
          framesRef.current = loadedBitmaps;
          isLoadedRef.current = true;
          setIsReady(true);
        }
      } catch (err) {
        console.warn(`Failed loading character frame ${index}:`, err);
      }
    };

    // Load first frame immediately for instant rendering, then batch the rest
    loadFrame(CHARACTER_FRAME_FILES[0], 0);
    for (let i = 1; i < totalFrames; i++) {
      loadFrame(CHARACTER_FRAME_FILES[i], i);
    }

    return () => {
      cancelled = true;
      // Close bitmaps to free GPU memory
      loadedBitmaps.forEach((item) => {
        if (item && 'close' in item && typeof item.close === 'function') {
          item.close();
        }
      });
    };
  }, []);

  // 2. High-performance Delta-Time RAF Gaze Animation Loop
  useEffect(() => {
    let animId: number;

    const tick = (now: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = now;
      const dt = Math.min(0.05, (now - lastTimeRef.current) / 1000);
      lastTimeRef.current = now;

      // Delta-time based smooth tracking (decay rate = 18 for instant responsiveness without lag)
      const diff = targetNormXRef.current - currentNormXRef.current;
      if (Math.abs(diff) > 0.0005) {
        // Continuous, frame-rate independent exponential smoothing
        const factor = 1 - Math.exp(-18 * dt);
        currentNormXRef.current += diff * factor;
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

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    const handlePointerMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const normX = Math.max(0, Math.min(1, (x - 0.4) / (0.9 - 0.2)));
      targetNormXRef.current = normX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const normX = Math.max(0, Math.min(1, e.touches[0].clientX / window.innerWidth));
        targetNormXRef.current = normX;
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // 3. Scroll-Linked Travel with Smooth Docking at Footer
  useEffect(() => {
    const renderTransform = (progress: number) => {
      const el = containerRef.current;
      if (!el) return;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;

      // Scale factor reduction from 1.0 down to ~0.42 on desktop, ~0.30 on mobile
      const scaleDelta = isMobile ? 0.70 : isTablet ? 0.62 : 0.58;
      const scale = 1.3 - progress * scaleDelta;

      // Vertical translation to anchor above footer on scroll
      let ty = 0;
      const footerEl = document.querySelector('footer');
      if (footerEl) {
        const footerRect = footerEl.getBoundingClientRect();
        if (footerRect.top < height) {
          ty = footerRect.top - height;
        }
      }

      // Horizontal slight docking drift to stay snugly in the bottom-right
      const maxTx = isMobile ? 8 : 24;
      const tx = progress * maxTx;

      el.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`;
      el.style.opacity = isMobile ? (0.42 - progress * 0.12).toFixed(3) : '1';
    };

    const updateScrollProgress = () => {
      const scrollY = window.scrollY;
      const winHeight = window.innerHeight;

      const projectsEl = document.getElementById('projects');
      let travelRange = winHeight * 1.5;
      if (projectsEl) {
        const rect = projectsEl.getBoundingClientRect();
        const elementAbsoluteTop = rect.top + scrollY;
        travelRange = Math.max(winHeight * 0.5, elementAbsoluteTop - winHeight * 0.3);
      }

      const normalized = Math.min(1, Math.max(0, scrollY / travelRange));
      const eased =
        normalized < 0.5
          ? 4 * normalized * normalized * normalized
          : 1 - Math.pow(-2 * normalized + 2, 3) / 2;

      renderTransform(eased);
    };

    let rafId: number;
    const tickScroll = () => {
      updateScrollProgress();
      rafId = requestAnimationFrame(tickScroll);
    };
    rafId = requestAnimationFrame(tickScroll);

    window.addEventListener('resize', updateScrollProgress);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateScrollProgress);
    };
  }, []);

  return (
    <>
      {/* 1. Regal Tri-Color Atmospheric Background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none select-none bg-[#060913]"
        style={{
          background: `
            radial-gradient(circle at 76% 36%, rgba(255, 42, 0, 0.79) 0%, rgba(91, 0, 0, 0.32) 44%, transparent 65%),
            radial-gradient(circle at 74% 50%, rgba(245, 158, 11, 0.18) 0%, rgba(217, 119, 6, 0.08) 28%, transparent 60%),
            radial-gradient(circle at 20% 75%, rgba(8, 37, 117, 0.85) 0%, rgba(6, 9, 19, 0.6) 45%, transparent 75%),
            radial-gradient(circle at 50% 15%, rgba(11, 19, 41, 0.7) 0%, #060913 60%, #03060f 100%)
          `,
        }}
        aria-hidden="true"
      />

      {/* 
        2. Character Layer:
        Strictly anchored to the RIGHT third of the viewport.
        Desktop bounds: x=1102..1850px on 1920px screen (~15% size increase). Zero overlap with left headline/buttons.
      */}
      <div
        ref={containerRef}
        className="fixed bottom-0 z-0 pointer-events-none select-none will-change-transform"
        style={{
          right: 'clamp(24px, 4vw, 70px)',
          width: 'clamp(368px, 39vw, 748px)',
          aspectRatio: '1000 / 1030',
          transformOrigin: 'bottom right',
        }}
        aria-hidden="true"
      >
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
