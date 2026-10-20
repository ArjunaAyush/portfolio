import React, { useEffect, useRef } from 'react';

export const BackgroundVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const targetTimeRef = useRef<number>(0);
  const lastSoughtTimeRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);



  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      if (videoRef.current.currentTime === 0) {
        videoRef.current.currentTime = 0.01;
      }
      targetTimeRef.current = videoRef.current.currentTime || 0;
      lastSoughtTimeRef.current = videoRef.current.currentTime || 0;
    }
  };

  const handleSeeked = () => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) {
      isSeekingRef.current = false;
      return;
    }

    // Queue the next seek if targetTime has moved while seeking
    if (Math.abs(targetTimeRef.current - lastSoughtTimeRef.current) > 0.01) {
      lastSoughtTimeRef.current = targetTimeRef.current;
      video.currentTime = targetTimeRef.current;
    } else {
      isSeekingRef.current = false;
    }
  };

  // 1. Natural Gaze & Eye/Head Tracking with RAF
  useEffect(() => {
    let animId: number;

    const tick = () => {
      const video = videoRef.current;
      if (video && Number.isFinite(video.duration) && video.duration > 0) {
        if (!isSeekingRef.current && Math.abs(targetTimeRef.current - lastSoughtTimeRef.current) > 0.01) {
          isSeekingRef.current = true;
          lastSoughtTimeRef.current = targetTimeRef.current;
          if ('fastSeek' in video && typeof (video as any).fastSeek === 'function') {
            (video as any).fastSeek(targetTimeRef.current);
          } else {
            video.currentTime = targetTimeRef.current;
          }
        }
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    const updateGazePosition = (clientX: number) => {
      const video = videoRef.current;
      if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;

      const normX = Math.max(0, Math.min(1, clientX / window.innerWidth));
      // Video spans from t=0 (looking left/cursor left) to t=duration (looking right/cursor right)
      targetTimeRef.current = normX * video.duration;
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateGazePosition(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updateGazePosition(e.touches[0].clientX);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // 2. Scroll-Linked Character Travel with Ease-in / Ease-out Resizing
  useEffect(() => {
    const renderTransform = (progress: number) => {
      const el = containerRef.current;
      if (!el) return;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;

      // Scale factors: smooth reduction from 1.0 (hero) down to ~0.38 (desktop) and ~0.28 (mobile)
      // When user reaches Section 02, progress is 1.0, reaching its final small size.
      const scaleDelta = isMobile ? 0.72 : isTablet ? 0.64 : 0.62;
      const scale = 1.0 - progress * scaleDelta;

      // Video native resolution: 1920x1080. Non-zero alpha right edge: x=1827.
      const videoWidth = 1920;
      const videoHeight = 1080;
      const charRightNative = 1827;
      const objectPosX = 0.75;

      const coverScale = Math.max(width / videoWidth, height / videoHeight);
      const renderedVideoWidth = videoWidth * coverScale;
      const videoOffsetX = (width - renderedVideoWidth) * objectPosX;
      const charRightUnscaled = videoOffsetX + charRightNative * coverScale;

      const originX = width * 0.75;
      const scaledRight = originX + (charRightUnscaled - originX) * scale;

      // Safe viewport margin: ensure the character always remains comfortably inside the viewport
      const margin = isMobile ? 12 : isTablet ? 20 : 28;

      // Maximum translation allowed before right edge reaches (width - margin)
      const maxAllowedTx = Math.max(0, (width - margin) - scaledRight);

      // Smooth travel toward bottom-right, strictly bounded within the visible screen
      const tx = progress * maxAllowedTx;
      const ty = 0;

      el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
      el.style.opacity = isMobile ? (0.42 - progress * 0.12).toFixed(3) : '1';
    };

    const updateScrollProgress = () => {
      const scrollY = window.scrollY;
      const winHeight = window.innerHeight;

      // Calculate travel range dynamically to Section 02 (#projects)
      // The side character finishes resizing to its final small size right when Section 02 is reached
      const projectsEl = document.getElementById('projects');
      let travelRange = winHeight * 1.5;
      if (projectsEl) {
        const rect = projectsEl.getBoundingClientRect();
        const elementAbsoluteTop = rect.top + scrollY;
        travelRange = Math.max(winHeight * 0.5, elementAbsoluteTop - winHeight * 0.3);
      }

      const normalized = Math.min(1, Math.max(0, scrollY / travelRange));

      // Ease-in / ease-out cubic curve (smooth acceleration then deceleration)
      const eased =
        normalized < 0.5
          ? 4 * normalized * normalized * normalized
          : 1 - Math.pow(-2 * normalized + 2, 3) / 2;

      renderTransform(eased);
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress);

    // Initial positioning
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('resize', updateScrollProgress);
    };
  }, []);

  return (
    <>
      {/* 
        1. Regal Tri-Color Atmospheric Background:
        Deep royal navy canvas with royal red (primary accent) and royal gold (secondary) illumination.
      */}
      <div
        className="fixed inset-0 z-0 pointer-events-none select-none bg-[#060913]"
        style={{
          background: `
            radial-gradient(circle at 74% 36%, rgba(225, 29, 72, 0.28) 0%, rgba(159, 18, 57, 0.16) 32%, transparent 65%),
            radial-gradient(circle at 70% 50%, rgba(245, 158, 11, 0.18) 0%, rgba(217, 119, 6, 0.08) 28%, transparent 60%),
            radial-gradient(circle at 20% 75%, rgba(11, 19, 41, 0.85) 0%, rgba(6, 9, 19, 0.6) 45%, transparent 75%),
            radial-gradient(circle at 50% 15%, rgba(11, 19, 41, 0.7) 0%, #060913 60%, #03060f 100%)
          `,
        }}
        aria-hidden="true"
      />

      {/* 
        2. Character Layer:
        Big in Hero without overlapping left-aligned hero content.
        Smoothly completes resize by Section 02.
      */}
      <div
        ref={containerRef}
        className="fixed inset-0 z-0 w-full h-full pointer-events-none select-none will-change-transform transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
        style={{
          transformOrigin: '75% 100%',
        }}
        aria-hidden="true"
      >
        <video
          ref={videoRef}
          src="/character_alpha.webm"
          poster="/character_poster.webp"
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={handleLoadedMetadata}
          onLoadedData={handleLoadedMetadata}
          onCanPlay={handleLoadedMetadata}
          onSeeked={handleSeeked}
          className="w-full h-full object-cover pointer-events-none select-none"
          style={{
            objectPosition: '75% bottom',
          }}
          aria-hidden="true"
        >
          <source src="/character_alpha.webm" type="video/webm" />
          <source src="/character_alpha.mov" type='video/mp4; codecs="hvc1"' />
          <source src="/character_alpha.mov" type="video/quicktime" />
        </video>
      </div>

      {/* Subtle ambient vignette overlay */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none select-none opacity-20 mix-blend-overlay"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, transparent 60%, rgba(0,0,0,0.6) 100%)',
        }}
        aria-hidden="true"
      />
    </>
  );
};
