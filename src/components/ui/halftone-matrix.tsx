"use client";

import React, { useEffect, useRef } from 'react';

interface HalftoneMatrixProps {
  className?: string;
  dotSpacing?: number;
  baseRadius?: number;
}

const VERTEX_SHADER_SRC = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SRC = `
  precision mediump float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform float u_dotSpacing;
  uniform float u_baseRadius;
  uniform float u_dpr;

  void main() {
    // DOM coordinates with (0,0) at top-left
    vec2 fragCoord = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y);

    // Grid cell center in device pixels
    vec2 cellCenter = (floor(fragCoord / u_dotSpacing) + 0.5) * u_dotSpacing;
    float dist = length(fragCoord - cellCenter);

    // Normalized CSS space coordinates for smooth wave calculation
    vec2 cssPos = cellCenter / u_dpr;
    float wave1 = sin(cssPos.x * 0.012 + cssPos.y * 0.008 - u_time * 1.5);
    float wave2 = cos(cssPos.x * 0.008 - cssPos.y * 0.014 + u_time * 1.1);
    float waveFactor = (wave1 + wave2) * 0.5;

    // Mouse proximity influence
    float mouseDist = length(cellCenter - u_mouse);
    float mouseReach = 180.0 * u_dpr;
    float mouseInfluence = clamp(1.0 - mouseDist / mouseReach, 0.0, 1.0);

    // Dynamic radius scaled by device pixel ratio
    float radius = max(0.6 * u_dpr, (u_baseRadius + waveFactor * 1.1 + mouseInfluence * 2.2) * u_dpr);

    // Subtle pulsating opacity
    float alpha = clamp(0.12 + waveFactor * 0.08 + mouseInfluence * 0.25, 0.06, 0.45);

    // Subpixel-smooth anti-aliased dot edge
    float edge = smoothstep(radius + 0.75, radius - 0.75, dist);
    if (edge <= 0.0) {
      discard;
    }

    // Color: warm amber near cursor, subtle milk elsewhere
    vec3 amber = vec3(0.961, 0.620, 0.043); // #F59E0B
    vec3 milk = vec3(0.980, 0.973, 0.961);  // #FAF8F5
    vec3 color = mix(milk, amber, step(0.15, mouseInfluence));

    gl_FragColor = vec4(color, alpha * edge);
  }
`;

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

    // Check for WebGL support
    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
      preserveDrawingBuffer: false,
    });

    let animationFrameId = 0;
    let isVisible = true;
    let startTime = performance.now();
    let mouseX = -10000;
    let mouseY = -10000;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      mouseX = (e.clientX - rect.left) * dpr;
      mouseY = (e.clientY - rect.top) * dpr;
    };

    const handlePointerLeave = () => {
      mouseX = -10000;
      mouseY = -10000;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('mouseleave', handlePointerLeave, { passive: true });

    // --- WebGL Hardware Acceleration Branch ---
    if (gl) {
      const createShader = (type: number, source: string) => {
        const shader = gl.createShader(type);
        if (!shader) return null;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          console.warn('Halftone shader compile failed:', gl.getShaderInfoLog(shader));
          gl.deleteShader(shader);
          return null;
        }
        return shader;
      };

      const vs = createShader(gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
      const fs = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
      if (!vs || !fs) return;

      const program = gl.createProgram();
      if (!program) return;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.warn('Halftone program link failed:', gl.getProgramInfoLog(program));
        return;
      }

      gl.useProgram(program);

      // Fullscreen quad buffer
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW
      );

      const posAttr = gl.getAttribLocation(program, 'a_position');
      gl.enableVertexAttribArray(posAttr);
      gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

      const uRes = gl.getUniformLocation(program, 'u_resolution');
      const uTime = gl.getUniformLocation(program, 'u_time');
      const uMouse = gl.getUniformLocation(program, 'u_mouse');
      const uSpacing = gl.getUniformLocation(program, 'u_dotSpacing');
      const uRadius = gl.getUniformLocation(program, 'u_baseRadius');
      const uDpr = gl.getUniformLocation(program, 'u_dpr');

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      let currentWidth = 0;
      let currentHeight = 0;
      let currentDpr = 1;

      const handleResize = () => {
        if (!canvas || !container) return;
        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight;
        currentDpr = Math.min(window.devicePixelRatio || 1, 1.25);
        currentWidth = Math.round(width * currentDpr);
        currentHeight = Math.round(height * currentDpr);

        if (canvas.width !== currentWidth || canvas.height !== currentHeight) {
          canvas.width = currentWidth;
          canvas.height = currentHeight;
          canvas.style.width = `${width}px`;
          canvas.style.height = `${height}px`;
          gl.viewport(0, 0, currentWidth, currentHeight);
        }
      };

      handleResize();
      window.addEventListener('resize', handleResize, { passive: true });

      const renderGL = (time: number) => {
        if (!isVisible) return;
        const elapsed = (time - startTime) * 0.001;

        gl.useProgram(program);
        gl.uniform2f(uRes, currentWidth, currentHeight);
        gl.uniform1f(uTime, elapsed);
        gl.uniform2f(uMouse, mouseX, mouseY);
        gl.uniform1f(uSpacing, dotSpacing * currentDpr);
        gl.uniform1f(uRadius, baseRadius * currentDpr);
        gl.uniform1f(uDpr, currentDpr);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        animationFrameId = requestAnimationFrame(renderGL);
      };

      const observer = new IntersectionObserver(
        ([entry]) => {
          const wasVisible = isVisible;
          isVisible = entry.isIntersecting;
          if (isVisible && !wasVisible) {
            handleResize();
            animationFrameId = requestAnimationFrame(renderGL);
          } else if (!isVisible && wasVisible) {
            cancelAnimationFrame(animationFrameId);
          }
        },
        { threshold: 0.05 }
      );
      observer.observe(container);

      animationFrameId = requestAnimationFrame(renderGL);

      return () => {
        cancelAnimationFrame(animationFrameId);
        observer.disconnect();
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handlePointerMove);
        window.removeEventListener('mouseleave', handlePointerLeave);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteBuffer(positionBuffer);
      };
    }

    // --- Canvas 2D Graceful Fallback (if WebGL is unavailable) ---
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let time = 0;
    const handleResize2D = () => {
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize2D();
    window.addEventListener('resize', handleResize2D, { passive: true });

    const render2D = () => {
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
          const wave1 = Math.sin(x * 0.012 + y * 0.008 - time * 1.5);
          const wave2 = Math.cos(x * 0.008 - y * 0.014 + time * 1.1);
          const waveFactor = (wave1 + wave2) * 0.5;

          const dx = x - mouseX;
          const dy = y - mouseY;
          const distSq = dx * dx + dy * dy;
          let mouseInfluence = 0;
          if (distSq < 180 * 180) {
            mouseInfluence = 1 - Math.sqrt(distSq) / 180;
          }

          const radius = Math.max(0.6, baseRadius + waveFactor * 1.1 + mouseInfluence * 2.2);
          const alpha = Math.min(0.45, Math.max(0.06, 0.12 + waveFactor * 0.08 + mouseInfluence * 0.25));

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = mouseInfluence > 0.15 ? `rgba(245, 158, 11, ${alpha})` : `rgba(250, 248, 245, ${alpha})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render2D);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (isVisible && !wasVisible) {
          handleResize2D();
          render2D();
        } else if (!isVisible && wasVisible) {
          cancelAnimationFrame(animationFrameId);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    render2D();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize2D);
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
      <canvas ref={canvasRef} className="block w-full h-full will-change-transform" />
    </div>
  );
};
