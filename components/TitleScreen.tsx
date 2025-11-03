
import React from 'react';
import { Race } from '../types';
import { RACE_DESCRIPTIONS, RACE_IMAGES } from '../constants';
import Tooltip from './Tooltip';

interface TitleScreenProps {
  onStartNew: () => void;
  onContinue: () => void;
  hasSavedGame: boolean;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ onStartNew, onContinue, hasSavedGame }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 font-body" style={{backgroundImage: 'url(https://www.transparenttextures.com/patterns/dark-denim-3.png)'}}>
      <div className="w-full max-w-4xl text-center bg-black/50 p-8 rounded-xl shadow-2xl border border-yellow-400/20 animate-fadeIn">
        <h1 className="text-6xl md:text-8xl font-title text-yellow-400 mb-4 tracking-wider" style={{ textShadow: '0 0 10px #facc15' }}>
          Dungeon Master IA
        </h1>
        <p className="text-gray-300 mb-8 text-lg">Elige tu linaje y forja tu leyenda.</p>

        <div className="grid grid-cols-3 md:grid-cols-9 gap-4 mb-12">
          {Object.values(Race).map((race) => (
            <Tooltip key={race} text={RACE_DESCRIPTIONS[race]}>
              <div className="cursor-pointer transition-transform duration-300 hover:scale-110 animate-bobble" style={{animationDelay: `${Math.random() * 2}s`}}>
                <img
                  src={RACE_IMAGES[race]}
                  alt={race}
                  className="w-24 h-24 object-cover rounded-full border-2 border-yellow-600/50 hover:border-yellow-400 shadow-lg"
                />
                <p className="mt-2 text-sm font-semibold">{race}</p>
              </div>
            </Tooltip>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {hasSavedGame && (
            <button
              onClick={onContinue}
              className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-500 transition-colors duration-300 text-xl"
            >
              Continuar Aventura
            </button>
          )}
          <button
            onClick={onStartNew}
            className="px-8 py-3 bg-yellow-600 text-gray-900 font-bold rounded-lg shadow-lg hover:bg-yellow-500 transition-colors duration-300 text-xl"
          >
            {hasSavedGame ? "Nueva Partida" : "Empezar Aventura"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TitleScreen;
