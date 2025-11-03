
import React from 'react';

interface TooltipProps {
  text: React.ReactNode;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  return (
    <div className="relative group flex justify-center">
      {children}
      <div className="absolute bottom-full mb-2 w-64 bg-slate-900 text-stone-200 text-center text-sm rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 shadow-lg border border-purple-500/30">
        {text}
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-slate-900"></div>
      </div>
    </div>
  );
};

export default Tooltip;
