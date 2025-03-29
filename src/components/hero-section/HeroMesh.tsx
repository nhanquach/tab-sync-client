import React, { useEffect, useRef } from 'react';

interface GradientMeshProps {
  className?: string;
}

const GradientMesh: React.FC<GradientMeshProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      mousePosition.current = {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: ((e.clientY - rect.top) / rect.height) * 2 - 1
      };
    };

    const animateDots = () => {
      if (!containerRef.current) return;
      
      const dots = containerRef.current.querySelectorAll('.dot');
      const time = Date.now() * 0.001;
      
      dots.forEach((dot, index) => {
        const dotEl = dot as HTMLElement;
        const dotRect = dotEl.getBoundingClientRect();
        
        // Calculate position based on mouse and time
        const mouseInfluenceX = mousePosition.current.x * 15;
        const mouseInfluenceY = mousePosition.current.y * 15;
        
        // Create wave-like motion using sine waves with varying frequencies
        const waveX = Math.sin(time * 0.5 + index * 0.05) * 8;
        const waveY = Math.cos(time * 0.3 + index * 0.04) * 8;
        
        // Add pulse effect based on distance from center
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const dx = dotRect.left - centerX;
        const dy = dotRect.top - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const pulseIntensity = Math.sin(time - distance * 0.01) * 5;
        
        // Combine all effects
        const totalX = waveX + mouseInfluenceX + (pulseIntensity * dx / distance) || 0;
        const totalY = waveY + mouseInfluenceY + (pulseIntensity * dy / distance) || 0;
        
        dotEl.style.transform = `translate(${totalX}px, ${totalY}px)`;
        
        // Dynamic opacity based on position
        const opacity = 0.3 + 0.5 * Math.abs(Math.sin(time + index * 0.1));
        dotEl.style.opacity = opacity.toString();
        
        // Dynamic size based on mouse proximity
        const size = 1 + Math.abs(Math.sin(time + index * 0.05)) * 2;
        dotEl.querySelector('div')!.style.width = `${size}px`;
        dotEl.querySelector('div')!.style.height = `${size}px`;
      });
      
      rafRef.current = requestAnimationFrame(animateDots);
    };

    document.addEventListener('mousemove', handleMouseMove);
    rafRef.current = requestAnimationFrame(animateDots);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
    >
      {/* Multiple overlapping gradient layers for richer color */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-blue-800/30 to-cyan-700/30 opacity-80 mix-blend-multiply animate-rotate-slow"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-700/30 via-indigo-600/30 to-blue-500/30 opacity-80 mix-blend-screen animate-rotate-slow" style={{ animationDirection: 'reverse', animationDuration: '25s' }}></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-pink-500/20 via-violet-800/20 to-blue-600/20 opacity-70 mix-blend-color-dodge animate-rotate-slow" style={{ animationDuration: '35s' }}></div>
      
      {/* Starfield effect */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div 
            key={`star-${i}`} 
            className="absolute rounded-full bg-white animate-pulse-slow"
            style={{ 
              width: `${Math.random() * 2 + 1}px`, 
              height: `${Math.random() * 2 + 1}px`,
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.8 + 0.2,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 4 + 2}s`,
            }}
          />
        ))}
      </div>
      
      {/* Grid of dots with dynamic animation */}
      <div className="absolute inset-0 grid grid-cols-12 md:grid-cols-24 grid-rows-12 md:grid-rows-24">
        {Array.from({ length: 288 }).map((_, i) => (
          <div 
            key={i} 
            className="dot relative flex items-center justify-center transition-all duration-300"
          >
            <div 
              className="bg-white rounded-full opacity-40 animate-pulse-slow"
              style={{ 
                width: '1px',
                height: '1px',
                animationDelay: `${(i % 10) * 0.1}s`,
                animationDuration: `${3 + (i % 4)}s` 
              }}
            ></div>
          </div>
        ))}
      </div>
      
      {/* Enhanced floating elements with more vibrant gradients */}
      <div className="absolute opacity-30 w-64 h-64 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 blur-3xl animate-float top-1/4 -left-20" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute opacity-30 w-72 h-72 rounded-full bg-gradient-to-r from-fuchsia-600 to-indigo-600 blur-3xl animate-float bottom-1/4 -right-20" style={{ animationDelay: '1.2s', animationDuration: '7s' }}></div>
      <div className="absolute opacity-40 w-48 h-48 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 blur-3xl animate-float top-3/4 left-1/3" style={{ animationDelay: '0.8s', animationDuration: '5s' }}></div>
      <div className="absolute opacity-30 w-56 h-56 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 blur-3xl animate-float bottom-1/3 right-1/3" style={{ animationDelay: '1.5s', animationDuration: '6s' }}></div>
      <div className="absolute opacity-20 w-80 h-80 rounded-full bg-gradient-to-r from-amber-500 to-pink-500 blur-3xl animate-float top-1/2 left-1/2" style={{ animationDelay: '0.3s', animationDuration: '8s' }}></div>
      
      {/* Enhanced mesh lines with animation */}
      <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5">
              <animate attributeName="stroke-opacity" values="0.3;0.8;0.3" dur="5s" repeatCount="indefinite" />
            </path>
          </pattern>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            <animate attributeName="fx" values="30%;70%;30%" dur="20s" repeatCount="indefinite" />
            <animate attributeName="fy" values="30%;70%;30%" dur="25s" repeatCount="indefinite" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="url(#glow)" />
      </svg>
    </div>
  );
};

export default GradientMesh;