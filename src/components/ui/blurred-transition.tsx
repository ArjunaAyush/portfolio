import React from 'react';

interface BlurredTransitionProps {
  className?: string;
  intensity?: 'subtle' | 'medium' | 'deep';
}

export const BlurredTransition: React.FC<BlurredTransitionProps> = ({
  className = '',
  intensity = 'medium',
}) => {
  const heightClass = {
    subtle: 'h-36 sm:h-44 -my-18 sm:-my-22',
    medium: 'h-48 sm:h-64 -my-24 sm:-my-32',
    deep: 'h-60 sm:h-80 -my-30 sm:-my-40',
  }[intensity];

  return (
    <div
      className={`relative w-full z-10 pointer-events-none select-none overflow-hidden flex items-center justify-center ${heightClass} ${className}`}
      aria-hidden="true"
    >
      {/* 
        Progressive Layered Blur Slices (True Feathered Blur):
        Eliminates constant blur boxes and hard edges by stepping blur density
        from 0px smoothly up to 48px in the center, and back down to 0px.
        No horizontal divider lines anywhere to preserve visual continuity.
      */}

      {/* Tier 1: Wide low-frequency blur (4px) */}
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
        }}
      />

      {/* Tier 2: Mid blur (12px) */}
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          maskImage: 'linear-gradient(to bottom, transparent 15%, black 35%, black 65%, transparent 85%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 15%, black 35%, black 65%, transparent 85%)',
        }}
      />

      {/* Tier 3: High blur (24px) */}
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          maskImage: 'linear-gradient(to bottom, transparent 25%, black 42%, black 58%, transparent 75%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 25%, black 42%, black 58%, transparent 75%)',
        }}
      />

      {/* Tier 4: Maximum focal diffusion (48px) at epicenter */}
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: 'blur(48px)',
          WebkitBackdropFilter: 'blur(48px)',
          maskImage: 'linear-gradient(to bottom, transparent 35%, black 50%, transparent 65%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 35%, black 50%, transparent 65%)',
        }}
      />

      {/* Seamless atmospheric black dissolution (Visually indistinguishable) */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.55) 50%, transparent 100%)',
        }}
      />

      {/* Very soft ambient amber dissipation aura (No lines or boundaries) */}
      <div
        className="absolute inset-x-1/4 h-24 rounded-full blur-3xl opacity-25 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255, 42, 0, 0.4) 0%, rgba(245, 158, 11, 0.2) 40%, transparent 80%)',
        }}
      />
    </div>
  );
};
