import React from 'react';

interface BlurredTransitionProps {
  className?: string;
  intensity?: 'subtle' | 'medium' | 'deep';
}

export const BlurredTransition: React.FC<BlurredTransitionProps> = ({
  className = '',
  intensity = 'medium',
}) => {
  const blurClasses = {
    subtle: 'backdrop-blur-md h-20 sm:h-24 -my-10 sm:-my-12',
    medium: 'backdrop-blur-xl h-28 sm:h-36 -my-14 sm:-my-18',
    deep: 'backdrop-blur-2xl h-36 sm:h-44 -my-18 sm:-my-22',
  }[intensity];

  return (
    <div
      className={`relative w-full z-20 pointer-events-none select-none overflow-hidden flex items-center justify-center ${blurClasses} ${className}`}
      aria-hidden="true"
    >
      {/* Translucent material diffusion mask */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-transparent" />
      
      {/* Light-catching subtle divider line */}
      <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />

      {/* Atmospheric ambient glow sweep */}
      <div className="absolute inset-x-1/4 h-10 bg-gradient-to-r from-transparent via-[#FF2A00]/15 to-transparent blur-2xl" />
    </div>
  );
};
