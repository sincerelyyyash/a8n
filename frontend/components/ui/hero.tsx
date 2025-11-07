"use client";

import React from "react";

type HeroProps = {
  children?: React.ReactNode;
  className?: string;
};

const Hero: React.FC<HeroProps> = ({ children, className }) => {
  return (
    <div className={`min-h-screen w-full relative bg-sidebar ${className ?? ""}`}>
      {/* Horizontal dashed lines - full width, positioned towards center */}
      <div className="absolute top-[15%] left-0 right-0 w-full border-t border-dashed border-border z-0" />
      <div className="absolute top-[85%] left-0 right-0 w-full border-t border-dashed border-border z-0" />
      
      {/* Your Content/Components */}
      <div className="relative z-10 text-foreground min-h-screen">
        <div className="mx-auto max-w-6xl h-full border-x border-dashed border-border">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Hero;


