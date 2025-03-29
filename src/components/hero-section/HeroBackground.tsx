import React from 'react';
import GradientMesh from './HeroMesh';

interface HeroBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

const HeroBackground: React.FC<HeroBackgroundProps> = ({ 
  className,
  children
}) => {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <div className="absolute inset-0 z-0">
        <GradientMesh />
      </div>
      
      {/* Enhanced overlay with multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80 z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-background/30 z-10 opacity-50"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-background/20 via-transparent to-background/20 z-10 opacity-30"></div>
      
      {/* Light flare effects */}
      <div className="absolute top-0 left-1/4 w-1/2 h-1/3 bg-gradient-to-b from-primary/10 to-transparent rounded-full blur-3xl opacity-30 z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-1/2 h-1/3 bg-gradient-to-t from-primary/10 to-transparent rounded-full blur-3xl opacity-20 z-10"></div>
      
      {/* Content container with enhanced backdrop filter */}
      <div className="relative z-20 backdrop-blur-[1px]">
        {children}
      </div>
    </div>
  );
};

export default HeroBackground;