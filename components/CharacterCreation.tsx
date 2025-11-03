
import React, { useState, useMemo } from 'react';
import { Race, CharacterClass, Character, Skill } from '../types';
import { CLASS_DEFAULTS } from '../constants';

interface CharacterCreationProps {
  onCharacterCreate: (character: Character) => void;
}

const CharacterCreation: React.FC<CharacterCreationProps> = ({ onCharacterCreate }) => {
  const [name, setName] = useState('');
  const [race, setRace] = useState<Race>(Race.Humano);
  const [characterClass, setCharacterClass] = useState<CharacterClass>(CharacterClass.Guerrero);
  
  const initialSkills = useMemo(() => CLASS_DEFAULTS[characterClass].skills, [characterClass]);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);

  const handleSkillCooldownChange = (skillName: string, cooldown: number) => {
    setSkills(currentSkills =>
      currentSkills.map(skill =>
        skill.name === skillName ? { ...skill, cooldown: Math.max(2, Math.min(5, cooldown)) } : skill
      )
    );
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Por favor, introduce un nombre para tu personaje.");
      return;
    }
    const defaults = CLASS_DEFAULTS[characterClass];
    const finalCharacter: Character = {
      ...defaults,
      name: name.trim(),
      race,
      characterClass,
      skills,
      level: 1,
      xp: 0,
    };
    onCharacterCreate(finalCharacter);
  };

  const classDefaults = CLASS_DEFAULTS[characterClass];

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
              <select id="class" value={characterClass} onChange={(e) => {
                const newClass = e.target.value as CharacterClass;
                setCharacterClass(newClass);
                setSkills(CLASS_DEFAULTS[newClass].skills);
              }} className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500">
                {Object.values(CharacterClass).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          
          <div className="bg-gray-800/50 p-4 rounded-md border border-gray-700">
            <h4 className="text-lg font-semibold text-yellow-500 mb-2">Estadísticas de Clase</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
                <p>PS: <span className="font-bold text-green-400">{classDefaults.maxHp}</span></p>
                <p>PM: <span className="font-bold text-blue-400">{classDefaults.maxMp}</span></p>
                <p>Bono Ataque: <span className="font-bold text-red-400">+{classDefaults.attackBonus}</span></p>
                <p>Clase Armadura: <span className="font-bold text-gray-400">{classDefaults.armorClass}</span></p>
            </div>
             {skills.length > 0 && <h4 className="text-lg font-semibold text-yellow-500 mt-4 mb-2">Habilidades</h4>}
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
