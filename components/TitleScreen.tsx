import React from 'react';

interface TitleScreenProps {
  onStartNew: () => void;
  onContinue: () => void;
  hasSavedGame: boolean;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ onStartNew, onContinue, hasSavedGame }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-stone-200 font-body p-4">
      <div className="text-center mb-12 animate-fadeIn">
        <h1 className="text-5xl sm:text-7xl font-bold text-amber-400 font-title tracking-wider" style={{ textShadow: '0 0 15px #f59e0b' }}>
          Dungeon Master IA
        </h1>
        <p className="text-stone-300 text-lg md:text-xl mt-4">Una Aventura Generada por IA</p>
      </div>
      <div className="flex flex-col space-y-4 w-full max-w-xs animate-fadeIn" style={{ animationDelay: '0.5s' }}>
        <button
          onClick={onStartNew}
          className="px-8 py-4 bg-purple-700 text-stone-100 font-bold rounded-lg hover:bg-purple-600 transition-transform transform hover:scale-105 shadow-lg border-2 border-purple-900 text-xl"
        >
          {hasSavedGame ? 'Nueva Partida' : 'Comenzar Aventura'}
        </button>
        {hasSavedGame && (
          <button
            onClick={onContinue}
            className="px-8 py-4 bg-slate-700 text-stone-200 font-bold rounded-lg hover:bg-slate-600 transition-transform transform hover:scale-105 shadow-lg border-2 border-slate-800 text-xl"
          >
            Continuar Partida
          </button>
        )}
      </div>
    </div>
  );
};

export default TitleScreen;