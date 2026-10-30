"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function ShaderAnimation({ className }: { className?: string } = {}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    camera: THREE.Camera
    scene: THREE.Scene
    renderer: THREE.WebGLRenderer
    uniforms: {
      time: { type: string; value: number }
      resolution: { type: string; value: THREE.Vector2 }
    }
    animationId: number
  } | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    // Vertex shader
    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `

    // Fragment shader - continuously looping multi-phase waves with zero dark void
    const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359

      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        // Faster energetic loop frequency
        float t = time * 0.14;
        float lineWidth = 0.0024;

        vec3 color = vec3(0.0);
        
        // Continuous multi-phase wave loop (phase1 + phase2 interleaved)
        // Eliminates black dead gaps so active glowing waves are constantly on screen
        for(int j = 0; j < 3; j++){
          float chanOffset = 0.014 * float(j);
          for(int i = 0; i < 5; i++){
            float lineOffset = float(i) * 0.018;
            float weight = lineWidth * float(i * i + 1);

            // Wave phase 1
            float phase1 = fract(t - chanOffset + lineOffset) * 2.5;
            float d1 = abs(phase1 - length(uv) + mod(uv.x + uv.y, 0.22));
            color[j] += weight / (d1 + 0.0025);

            // Interleaved wave phase 2 (offset by 0.5 cycle so waves constantly flow)
            float phase2 = fract(t + 0.5 - chanOffset + lineOffset) * 2.5;
            float d2 = abs(phase2 - length(uv) + mod(uv.x + uv.y, 0.22));
            color[j] += weight / (d2 + 0.0025);
          }
        }
        
        // Prevent pixel blowout
        color = clamp(color, 0.0, 1.2);

        // Harmonize with warm Amber-Red / Gold and deep navy atmosphere
        vec3 finalColor = vec3(
          color.r * 1.2 + color.g * 0.15,
          color.g * 0.7 + color.b * 0.15,
          color.b * 0.95
        );
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `

    // Initialize Three.js scene
    const camera = new THREE.Camera()
    camera.position.z = 1

    const scene = new THREE.Scene()
    const geometry = new THREE.PlaneGeometry(2, 2)

    const uniforms = {
      time: { type: "f", value: 1.0 },
      resolution: { type: "v2", value: new THREE.Vector2() },
    }

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.25)
    renderer.setPixelRatio(pixelRatio)

    container.appendChild(renderer.domElement)

    // Handle window resize
    const onWindowResize = () => {
      if (!container) return
      const width = container.clientWidth || window.innerWidth
      const height = container.clientHeight || window.innerHeight
      renderer.setSize(width, height)
      uniforms.resolution.value.x = renderer.domElement.width
      uniforms.resolution.value.y = renderer.domElement.height
    }

    // Initial resize
    onWindowResize()
    window.addEventListener("resize", onWindowResize, false)

    let isVisible = true
    let animationId = 0

    // Animation loop - throttled to only execute when visible
    const animate = () => {
      if (!isVisible) return
      animationId = requestAnimationFrame(animate)
      uniforms.time.value += 0.05
      renderer.render(scene, camera)

      if (sceneRef.current) {
        sceneRef.current.animationId = animationId
      }
    }

    // IntersectionObserver to pause rendering when section is not in viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible
        isVisible = entry.isIntersecting
        if (isVisible && !wasVisible) {
          onWindowResize()
          animate()
        } else if (!isVisible && wasVisible) {
          cancelAnimationFrame(animationId)
        }
      },
      { threshold: 0.05 }
    )
    observer.observe(container)

    // Store scene references for cleanup
    sceneRef.current = {
      camera,
      scene,
      renderer,
      uniforms,
      animationId: 0,
    }

    // Start animation if visible
    animate()

    // Cleanup function
    return () => {
      window.removeEventListener("resize", onWindowResize)
      observer.disconnect()

      cancelAnimationFrame(animationId)
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId)

        if (container && sceneRef.current.renderer.domElement) {
          container.removeChild(sceneRef.current.renderer.domElement)
        }

        sceneRef.current.renderer.dispose()
        geometry.dispose()
        material.dispose()
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={className || "w-full h-full"}
      style={{
        background: "transparent",
        overflow: "hidden",
      }}
    />
  )
}
