// Fix: Added content for the Character Creation screen component.
import React, { useState, useEffect } from 'react';
import { Character, Race, CharacterClass, Skill } from '../types';
import { CLASS_DESCRIPTIONS, RACE_DESCRIPTIONS, CLASS_SKILL_POOLS, RACE_SKILL_POOLS } from '../constants';
import { SKILL_ICON_MAP } from './Icons';

interface CharacterCreationProps {
  onCharacterCreate: (character: Character) => void;
}

const CharacterCreation: React.FC<CharacterCreationProps> = ({ onCharacterCreate }) => {
  const [name, setName] = useState('');
  const [race, setRace] = useState<Race>(Race.Humano);
  const [characterClass, setCharacterClass] = useState<CharacterClass>(CharacterClass.Guerrero);
  const [racialSkill, setRacialSkill] = useState<Skill>(RACE_SKILL_POOLS[race][0]);
  const [classSkill, setClassSkill] = useState<Skill>(CLASS_SKILL_POOLS[characterClass][0]);
  const [step, setStep] = useState(1);
  
  useEffect(() => {
    setRacialSkill(RACE_SKILL_POOLS[race][0]);
  }, [race]);

  useEffect(() => {
    setClassSkill(CLASS_SKILL_POOLS[characterClass][0]);
  }, [characterClass]);

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
      skills: [classSkill, racialSkill],
    };
    onCharacterCreate(newCharacter);
  };

  const renderSkillSelection = (
    title: string,
    description: string,
    skills: Skill[],
    selectedSkill: Skill,
    onSelect: (skill: Skill) => void,
    onBack: () => void,
    onNext: () => void
  ) => (
    <>
      <h2 className="text-3xl font-bold text-amber-400 mb-2 font-title">{title}</h2>
      <p className="text-stone-400 mb-6 max-w-lg text-center">{description}</p>
      <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl">
        {skills.map((skill) => {
          const IconComponent = SKILL_ICON_MAP[skill.iconName];
          return (
            <button
              key={skill.name}
              onClick={() => onSelect(skill)}
              className={`flex-1 p-4 rounded-lg border-2 text-left transition-colors flex items-center gap-4 ${selectedSkill.name === skill.name ? 'bg-purple-700 border-purple-500' : 'bg-slate-800 border-slate-700 hover:border-purple-500'}`}
            >
              <div className="w-10 h-10 flex-shrink-0">{IconComponent && <IconComponent className="w-full h-full" />}</div>
              <div>
                <h3 className="font-bold text-stone-100">{skill.name}</h3>
                <p className="text-sm text-stone-300">{skill.description}</p>
              </div>
            </button>
          )
        })}
      </div>
      <div className="flex space-x-4 mt-6">
        <button onClick={onBack} className="px-8 py-3 bg-slate-700 text-stone-200 font-bold rounded-lg hover:bg-slate-600">Atrás</button>
        <button onClick={onNext} className="px-8 py-3 bg-purple-700 text-stone-100 font-bold rounded-lg hover:bg-purple-600">Siguiente</button>
      </div>
    </>
  );

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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
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
      case 3: // Racial Skill
        return renderSkillSelection(
            "Habilidad Racial",
            `Como ${race}, tienes acceso a habilidades únicas. Elige una.`,
            RACE_SKILL_POOLS[race],
            racialSkill,
            setRacialSkill,
            () => setStep(2),
            () => setStep(4)
        );
      case 4: // Class
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
                <button onClick={() => setStep(3)} className="px-8 py-3 bg-slate-700 text-stone-200 font-bold rounded-lg hover:bg-slate-600">Atrás</button>
                <button onClick={() => setStep(5)} className="px-8 py-3 bg-purple-700 text-stone-100 font-bold rounded-lg hover:bg-purple-600">Siguiente</button>
            </div>
          </>
        );
       case 5: // Class Skill
        return renderSkillSelection(
            "Habilidad de Clase Inicial",
            `Como ${characterClass}, comienzas con una técnica especial. Elige tu habilidad inicial.`,
            CLASS_SKILL_POOLS[characterClass],
            classSkill,
            setClassSkill,
            () => setStep(4),
            handleSubmit
        );
      default:
        return null;
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-stone-200 font-body p-2 sm:p-4 animate-fadeIn">
      {renderStep()}
    </div>
  );
};

export default CharacterCreation;