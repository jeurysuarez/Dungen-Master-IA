// Fix: Added content for the Character Creation screen component.
import React, { useState } from 'react';
import { Character, Race, CharacterClass } from '../types';
import { CLASS_DESCRIPTIONS, RACE_DESCRIPTIONS, INITIAL_SKILLS } from '../constants';

interface CharacterCreationProps {
  onCharacterCreate: (character: Character) => void;
}

const CharacterCreation: React.FC<CharacterCreationProps> = ({ onCharacterCreate }) => {
  const [name, setName] = useState('');
  const [race, setRace] = useState<Race>(Race.Humano);
  const [characterClass, setCharacterClass] = useState<CharacterClass>(CharacterClass.Guerrero);
  const [step, setStep] = useState(1);

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("Por favor, introduce un nombre para tu personaje.");
      return;
    }

    const newCharacter: Character = {
      name: name.trim(),
      race,
      characterClass,
      level: 1,
      xp: 0,
      xpToNextLevel: 300,
      hp: 10 + (characterClass === CharacterClass.Guerrero ? 2 : 0),
      maxHp: 10 + (characterClass === CharacterClass.Guerrero ? 2 : 0),
      mp: 5 + (characterClass === CharacterClass.Mago ? 2 : 0),
      maxMp: 5 + (characterClass === CharacterClass.Mago ? 2 : 0),
      attackBonus: 2,
      armorClass: 10,
      inventory: [{ name: "Raciones", quantity: 3, description: "Comida para un día." }],
      spells: characterClass === CharacterClass.Mago ? [{name: "Bola de Fuego", cost: 3, description: "Lanza una pequeña bola de fuego."}] : [],
      skills: INITIAL_SKILLS[characterClass],
    };
    onCharacterCreate(newCharacter);
  };

  const renderStep = () => {
    switch(step) {
      case 1: // Name
        return (
          <>
            <h2 className="text-3xl font-bold text-amber-400 mb-6 font-title">¿Cuál es tu nombre, aventurero?</h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Escribe tu nombre"
              className="w-full max-w-md bg-slate-800 text-stone-100 p-3 rounded-lg border-2 border-slate-700 focus:outline-none focus:border-purple-500 text-center text-xl"
              autoFocus
            />
            <button onClick={() => name.trim() && setStep(2)} className="mt-6 px-8 py-3 bg-purple-700 text-stone-100 font-bold rounded-lg hover:bg-purple-600 disabled:bg-slate-600 disabled:cursor-not-allowed" disabled={!name.trim()}>Siguiente</button>
          </>
        );
      case 2: // Race
        return (
          <>
            <h2 className="text-3xl font-bold text-amber-400 mb-2 font-title">Elige tu Raza</h2>
            <p className="text-stone-400 mb-6 max-w-md text-center">{RACE_DESCRIPTIONS[race]}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl">
              {Object.values(Race).map((r) => (
                <button key={r} onClick={() => setRace(r)} className={`p-4 rounded-lg border-2 transition-colors ${race === r ? 'bg-purple-700 border-purple-500 text-stone-100 font-bold' : 'bg-slate-800 border-slate-700 hover:border-purple-500'}`}>{r}</button>
              ))}
            </div>
            <div className="flex space-x-4 mt-6">
                <button onClick={() => setStep(1)} className="px-8 py-3 bg-slate-700 text-stone-200 font-bold rounded-lg hover:bg-slate-600">Atrás</button>
                <button onClick={() => setStep(3)} className="px-8 py-3 bg-purple-700 text-stone-100 font-bold rounded-lg hover:bg-purple-600">Siguiente</button>
            </div>
          </>
        );
      case 3: // Class
        return (
          <>
            <h2 className="text-3xl font-bold text-amber-400 mb-2 font-title">Elige tu Clase</h2>
            <p className="text-stone-400 mb-6 max-w-md text-center">{CLASS_DESCRIPTIONS[characterClass]}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
              {Object.values(CharacterClass).map((c) => (
                <button key={c} onClick={() => setCharacterClass(c)} className={`p-4 rounded-lg border-2 transition-colors ${characterClass === c ? 'bg-purple-700 border-purple-500 text-stone-100 font-bold' : 'bg-slate-800 border-slate-700 hover:border-purple-500'}`}>{c}</button>
              ))}
            </div>
             <div className="flex space-x-4 mt-6">
                <button onClick={() => setStep(2)} className="px-8 py-3 bg-slate-700 text-stone-200 font-bold rounded-lg hover:bg-slate-600">Atrás</button>
                <button onClick={handleSubmit} className="px-8 py-3 bg-emerald-700 text-white font-bold rounded-lg hover:bg-emerald-600">Comenzar Aventura</button>
            </div>
          </>
        );
      default:
        return null;
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-stone-200 font-body p-4 animate-fadeIn">
      {renderStep()}
    </div>
  );
};

export default CharacterCreation;