import React, { useState, useMemo, useEffect } from 'react';
import { Race, CharacterClass, Character, Skill } from '../types';
import { CLASS_DEFAULTS } from '../constants';

interface CharacterCreationProps {
  onCharacterCreate: (character: Character) => void;
}

const ATTRIBUTE_POINTS_POOL = 8;

const CharacterCreation: React.FC<CharacterCreationProps> = ({ onCharacterCreate }) => {
  const [name, setName] = useState('');
  const [race, setRace] = useState<Race>(Race.Humano);
  const [characterClass, setCharacterClass] = useState<CharacterClass>(CharacterClass.Guerrero);
  
  // State for customizable stats
  const [characterStats, setCharacterStats] = useState(CLASS_DEFAULTS[characterClass]);
  const [attributePoints, setAttributePoints] = useState(ATTRIBUTE_POINTS_POOL);

  const initialSkills = useMemo(() => CLASS_DEFAULTS[characterClass].skills, [characterClass]);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);

  // Reset stats when class changes
  useEffect(() => {
    setCharacterStats(CLASS_DEFAULTS[characterClass]);
    setSkills(CLASS_DEFAULTS[characterClass].skills);
    setAttributePoints(ATTRIBUTE_POINTS_POOL);
  }, [characterClass]);


  const handleSkillCooldownChange = (skillName: string, cooldown: number) => {
    setSkills(currentSkills =>
      currentSkills.map(skill =>
        skill.name === skillName ? { ...skill, cooldown: Math.max(2, Math.min(5, cooldown)) } : skill
      )
    );
  };
  
  const handleStatChange = (stat: keyof typeof characterStats, change: number) => {
    const baseStatValue = CLASS_DEFAULTS[characterClass][stat] as number;
    const currentStatValue = characterStats[stat] as number;

    let cost = 1;
    if (stat === 'attackBonus' || stat === 'armorClass') {
      cost = 2;
    }
    
    // Increase stat
    if (change > 0 && attributePoints >= cost) {
      setAttributePoints(prev => prev - cost);
      setCharacterStats(prev => ({...prev, [stat]: currentStatValue + change}));
    }
    
    // Decrease stat
    if (change < 0 && currentStatValue > baseStatValue) {
       setAttributePoints(prev => prev + cost);
       setCharacterStats(prev => ({...prev, [stat]: currentStatValue + change}));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Por favor, introduce un nombre para tu personaje.");
      return;
    }
    const finalCharacter: Character = {
      ...characterStats,
      name: name.trim(),
      race,
      characterClass,
      skills,
      level: 1,
      xp: 0,
    };
    onCharacterCreate(finalCharacter);
  };

  const StatEditor: React.FC<{label: string, value: number, onIncrease: () => void, onDecrease: () => void, canIncrease: boolean, canDecrease: boolean}> = ({ label, value, onIncrease, onDecrease, canIncrease, canDecrease }) => (
    <div className="flex justify-between items-center">
        <span className="text-gray-300">{label}: <span className="font-bold text-white">{value}</span></span>
        <div className="flex items-center gap-2">
            <button type="button" onClick={onDecrease} disabled={!canDecrease} className="w-8 h-8 bg-red-800 rounded-full disabled:bg-gray-600 hover:bg-red-700 transition-colors">-</button>
            <button type="button" onClick={onIncrease} disabled={!canIncrease} className="w-8 h-8 bg-green-800 rounded-full disabled:bg-gray-600 hover:bg-green-700 transition-colors">+</button>
        </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 font-body" style={{backgroundImage: 'url(https://www.transparenttextures.com/patterns/dark-denim-3.png)'}}>
      <div className="w-full max-w-2xl bg-black/50 p-8 rounded-xl shadow-2xl border border-yellow-400/20 animate-fadeIn">
        <h2 className="text-4xl font-title text-yellow-400 mb-6 text-center">Crea tu Héroe</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-lg font-semibold mb-2 text-gray-300">Nombre:</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Escribe el nombre de tu aventurero"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="race" className="block text-lg font-semibold mb-2 text-gray-300">Raza:</label>
              <select id="race" value={race} onChange={(e) => setRace(e.target.value as Race)} className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500">
                {Object.values(Race).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="class" className="block text-lg font-semibold mb-2 text-gray-300">Clase:</label>
              <select id="class" value={characterClass} onChange={(e) => setCharacterClass(e.target.value as CharacterClass)} className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500">
                {Object.values(CharacterClass).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          
          <div className="bg-gray-800/50 p-4 rounded-md border border-gray-700 space-y-3">
            <h4 className="text-lg font-semibold text-yellow-500 text-center mb-2">Asigna tus Puntos de Atributo</h4>
            <p className="text-center font-bold text-xl mb-3">Puntos restantes: {attributePoints}</p>
            
            <StatEditor 
                label="Puntos de Salud" 
                value={characterStats.maxHp}
                onIncrease={() => handleStatChange('maxHp', 2)}
                onDecrease={() => handleStatChange('maxHp', -2)}
                canIncrease={attributePoints >= 1}
                canDecrease={characterStats.maxHp > CLASS_DEFAULTS[characterClass].maxHp}
            />
             <StatEditor 
                label="Puntos de Maná" 
                value={characterStats.maxMp}
                onIncrease={() => handleStatChange('maxMp', 2)}
                onDecrease={() => handleStatChange('maxMp', -2)}
                canIncrease={attributePoints >= 1}
                canDecrease={characterStats.maxMp > CLASS_DEFAULTS[characterClass].maxMp}
            />
             <StatEditor 
                label="Bono de Ataque" 
                value={characterStats.attackBonus}
                onIncrease={() => handleStatChange('attackBonus', 1)}
                onDecrease={() => handleStatChange('attackBonus', -1)}
                canIncrease={attributePoints >= 2}
                canDecrease={characterStats.attackBonus > CLASS_DEFAULTS[characterClass].attackBonus}
            />
             <StatEditor 
                label="Clase de Armadura" 
                value={characterStats.armorClass}
                onIncrease={() => handleStatChange('armorClass', 1)}
                onDecrease={() => handleStatChange('armorClass', -1)}
                canIncrease={attributePoints >= 2}
                canDecrease={characterStats.armorClass > CLASS_DEFAULTS[characterClass].armorClass}
            />
             <p className="text-xs text-gray-400 text-center pt-2">PS/PM cuestan 1 punto (+2). Ataque/Armadura cuestan 2 puntos (+1).</p>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-md border border-gray-700">
             {skills.length > 0 && <h4 className="text-lg font-semibold text-yellow-500 mb-2">Ajustar Habilidad de Clase</h4>}
             {skills.map((skill, index) => (
                <div key={index} className="mt-2">
                    <label htmlFor={`skill-${index}`} className="block text-sm font-semibold text-gray-300">{skill.name} - Enfriamiento: {skill.cooldown} turnos</label>
                    <input
                        id={`skill-${index}`}
                        type="range"
                        min="2"
                        max="5"
                        value={skill.cooldown}
                        onChange={(e) => handleSkillCooldownChange(skill.name, parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
             ))}
          </div>

          <button type="submit" className="w-full py-3 mt-4 bg-yellow-600 text-gray-900 font-bold rounded-lg shadow-lg hover:bg-yellow-500 transition-colors duration-300 text-xl">
            Comenzar Aventura
          </button>
        </form>
      </div>
    </div>
  );
};

export default CharacterCreation;