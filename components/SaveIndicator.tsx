import React from 'react';

interface SaveIndicatorProps {
  isVisible: boolean;
}

const SaveIndicator: React.FC<SaveIndicatorProps> = ({ isVisible }) => {
  return (
    <div
      className={`fixed bottom-4 left-4 bg-slate-800/80 text-stone-200 px-4 py-2 rounded-lg shadow-lg border border-purple-500/30 transition-all duration-300 z-50 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
      }`}
    >
      <p>Partida guardada...</p>
    </div>
  );
};

export default SaveIndicator;
