"use client";

import React, { useEffect, useRef } from 'react';

interface HalftoneMatrixProps {
  className?: string;
  dotSpacing?: number;
  baseRadius?: number;
}

export const HalftoneMatrix: React.FC<HalftoneMatrixProps> = ({
  className = '',
  dotSpacing = 32,
  baseRadius = 1.4,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId = 0;
    let isVisible = true;
    let time = 0;

    // Mouse tracking for subtle tactile interaction
    let mouseX = -1000;
    let mouseY = -1000;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handlePointerLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('mouseleave', handlePointerLeave, { passive: true });

    const handleResize = () => {
      if (!canvas || !container) return;
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    // Render loop
    const render = () => {
      if (!isVisible) return;
      time += 0.025;

      const width = container.clientWidth;
      const height = container.clientHeight;
      ctx.clearRect(0, 0, width, height);

      const cols = Math.ceil(width / dotSpacing) + 1;
      const rows = Math.ceil(height / dotSpacing) + 1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * dotSpacing;
          const y = r * dotSpacing;

          // Traveling wave equation that dynamically resizes dots
          const wave1 = Math.sin(x * 0.012 + y * 0.008 - time * 1.5);
          const wave2 = Math.cos(x * 0.008 - y * 0.014 + time * 1.1);
          const waveFactor = (wave1 + wave2) * 0.5; // -1 to 1

          // Proximity to mouse cursor
          const dx = x - mouseX;
          const dy = y - mouseY;
          const distSq = dx * dx + dy * dy;
          const maxDistSq = 180 * 180;
          let mouseInfluence = 0;
          if (distSq < maxDistSq) {
            mouseInfluence = (1 - Math.sqrt(distSq) / 180);
          }

          // Size modulation: from tiny pinpoints to larger halftone dots
          const radius = Math.max(
            0.6,
            baseRadius + waveFactor * 1.1 + mouseInfluence * 2.2
          );

          // Alpha modulation: pulsating opacity
          const alpha = Math.min(
            0.45,
            Math.max(0.06, 0.12 + waveFactor * 0.08 + mouseInfluence * 0.25)
          );

          // Color blending: warm amber close to cursor, subtle milk elsewhere
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);

          if (mouseInfluence > 0.15) {
            ctx.fillStyle = `rgba(245, 158, 11, ${alpha})`;
          } else {
            ctx.fillStyle = `rgba(250, 248, 245, ${alpha})`;
          }
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Pause when offscreen
    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (isVisible && !wasVisible) {
          handleResize();
          render();
        } else if (!isVisible && wasVisible) {
          cancelAnimationFrame(animationFrameId);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, [dotSpacing, baseRadius]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
