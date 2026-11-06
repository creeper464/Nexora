import React from 'react';

interface NexoraLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSlogan?: boolean;
  showText?: boolean;
  className?: string;
}

export const NexoraLogo: React.FC<NexoraLogoProps> = ({
  size = 'md',
  showSlogan = false,
  showText = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Blue and White X Symbol Logo */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center shrink-0`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(56,189,248,0.7)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle glowing halo */}
          <circle cx="50" cy="50" r="42" fill="url(#xGlow)" opacity="0.25" />

          {/* Diagonal blade 1: Electric Blue to Cyan */}
          <path
            d="M20 18L36 12L80 82L64 88L20 18Z"
            fill="url(#blueBlade)"
          />

          {/* Diagonal blade 2: Crisp Bright White with Cyan border */}
          <path
            d="M80 18L64 12L20 82L36 88L80 18Z"
            fill="url(#whiteBlade)"
          />

          {/* Center intersecting nexus gem */}
          <path
            d="M50 38L62 50L50 62L38 50Z"
            fill="#FFFFFF"
            className="drop-shadow-[0_0_8px_#38BDF8]"
          />

          {/* Accent light sparks */}
          <circle cx="28" cy="15" r="2.5" fill="#38BDF8" />
          <circle cx="72" cy="85" r="2.5" fill="#38BDF8" />

          <defs>
            <radialGradient id="xGlow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="blueBlade" x1="20" y1="12" x2="80" y2="88" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>
            <linearGradient id="whiteBlade" x1="80" y1="12" x2="20" y2="88" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#F0F9FF" />
              <stop offset="100%" stopColor="#BAE6FD" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`${textSizes[size]} font-black italic tracking-wider text-white uppercase drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]`}
            >
              NEXORA
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
          </div>
          {showSlogan && (
            <span className="text-[10px] font-bold italic tracking-widest text-zinc-400 uppercase mt-0.5">
              Connect • Create • Discover
            </span>
          )}
        </div>
      )}
    </div>
  );
};
