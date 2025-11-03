import React from 'react';

interface TitleScreenProps {
  onStartNew: () => void;
  onContinue: () => void;
  hasSavedGame: boolean;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ onStartNew, onContinue, hasSavedGame }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white font-serif p-4">
      <div className="text-center mb-12 animate-fadeIn">
        <h1 className="text-6xl md:text-8xl font-bold text-yellow-400 font-title tracking-wider" style={{ textShadow: '0 0 10px #f59e0b, 0 0 20px #f59e0b' }}>
          Dungeon Master IA
        </h1>
        <p className="text-gray-300 text-lg md:text-xl mt-4">Una Aventura Generada por IA</p>
      </div>
      <div className="flex flex-col space-y-4 w-full max-w-xs animate-slideInUp">
        <button
          onClick={onStartNew}
          className="px-8 py-4 bg-yellow-600 text-gray-900 font-bold rounded-lg hover:bg-yellow-500 transition-transform transform hover:scale-105 shadow-lg border-2 border-yellow-700 text-xl"
        >
          {hasSavedGame ? 'Nueva Partida' : 'Comenzar Aventura'}
        </button>
        {hasSavedGame && (
          <button
            onClick={onContinue}
            className="px-8 py-4 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-transform transform hover:scale-105 shadow-lg border-2 border-gray-800 text-xl"
          >
            Continuar Partida
          </button>
        )}
      </div>
       <footer className="absolute bottom-4 text-gray-500 text-sm">
        <p>Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default TitleScreen;
