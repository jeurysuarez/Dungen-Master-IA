import React, { useState } from 'react';
import { Race, CharacterClass, Character, Spell, Skill } from '../types';
import { RACE_DESCRIPTIONS, RACE_IMAGES, CLASS_DESCRIPTIONS, CLASS_ICONS } from '../constants';
import Tooltip from './Tooltip';
import { IconSword, IconDagger } from './Icons';

interface CharacterCreationProps {
  onCharacterCreate: (character: Character) => void;
}

const CharacterCreation: React.FC<CharacterCreationProps> = ({ onCharacterCreate }) => {
  const [name, setName] = useState('');
  const [selectedRace, setSelectedRace] = useState<Race>(Race.Humano);
  const [selectedClass, setSelectedClass] = useState<CharacterClass>(CharacterClass.Guerrero);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, introduce un nombre para tu personaje.');
      return;
    }
    setError('');

    // Define base stats and items/skills/spells based on class
    let newCharacter: Character;
    const baseSkills: Skill[] = [];
    const baseSpells: Spell[] = [];

    switch (selectedClass) {
        case CharacterClass.Guerrero:
            baseSkills.push({ name: 'Ataque Poderoso', description: 'Un ataque cuerpo a cuerpo que inflige daño adicional.', cooldown: 3, currentCooldown: 0, icon: <IconSword /> });
            newCharacter = {
                name,
                race: selectedRace,
                characterClass: selectedClass,
                level: 1,
                xp: 0,
                xpToNextLevel: 100,
                hp: 12, maxHp: 12,
                mp: 0, maxMp: 0,
                attackBonus: 3,
                armorClass: 14,
                inventory: [{ name: 'Espada Larga', quantity: 1 }, { name: 'Poción de Curación', quantity: 1 }],
                spells: baseSpells,
                skills: baseSkills,
            };
            break;
        case CharacterClass.Mago:
            baseSpells.push({ name: 'Bola de Fuego', cost: 5, description: 'Lanza una bola de fuego que explota al impactar.' });
            newCharacter = {
                name,
                race: selectedRace,
                characterClass: selectedClass,
                level: 1,
                xp: 0,
                xpToNextLevel: 100,
                hp: 6, maxHp: 6,
                mp: 15, maxMp: 15,
                attackBonus: 1,
                armorClass: 10,
                inventory: [{ name: 'Báculo de Mago', quantity: 1 }, { name: 'Poción de Maná', quantity: 1 }],
                spells: baseSpells,
                skills: baseSkills,
            };
            break;
        case CharacterClass.Picaro:
            baseSkills.push({ name: 'Ataque Furtivo', description: 'Un ataque preciso desde las sombras que ignora parte de la armadura del enemigo.', cooldown: 2, currentCooldown: 0, icon: <IconDagger /> });
            newCharacter = {
                name,
                race: selectedRace,
                characterClass: selectedClass,
                level: 1,
                xp: 0,
                xpToNextLevel: 100,
                hp: 8, maxHp: 8,
                mp: 5, maxMp: 5,
                attackBonus: 2,
                armorClass: 12,
                inventory: [{ name: 'Daga', quantity: 2 }, { name: 'Herramientas de Ladrón', quantity: 1 }],
                spells: baseSpells,
                skills: baseSkills,
            };
            break;
        case CharacterClass.Clerigo:
             baseSpells.push({ name: 'Curar Heridas Leves', cost: 4, description: 'Restaura una pequeña cantidad de puntos de salud.' });
             newCharacter = {
                name,
                race: selectedRace,
                characterClass: selectedClass,
                level: 1,
                xp: 0,
                xpToNextLevel: 100,
                hp: 10, maxHp: 10,
                mp: 10, maxMp: 10,
                attackBonus: 2,
                armorClass: 13,
                inventory: [{ name: 'Maza', quantity: 1 }, { name: 'Símbolo Sagrado', quantity: 1 }],
                spells: baseSpells,
                skills: baseSkills,
            };
            break;
        default:
            throw new Error('Clase de personaje no válida');
    }
    
    onCharacterCreate(newCharacter);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 font-body" style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/dark-denim-3.png)' }}>
      <div className="w-full max-w-4xl bg-black/50 p-8 rounded-xl shadow-2xl border border-yellow-400/20 animate-fadeIn">
        <h1 className="text-5xl font-title text-yellow-400 mb-6 text-center">Crea tu Héroe</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-xl mb-2 font-semibold text-gray-300">Nombre</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Escribe el nombre de tu personaje"
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-lg"
            />
             {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>

          {/* Race Selection */}
          <div>
            <h2 className="text-xl mb-4 font-semibold text-gray-300">Raza: <span className="text-yellow-400">{selectedRace}</span></h2>
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-4">
              {Object.values(Race).map((race) => (
                <Tooltip key={race} text={RACE_DESCRIPTIONS[race]}>
                  <div
                    onClick={() => setSelectedRace(race)}
                    className={`cursor-pointer transition-all duration-300 transform hover:scale-105 rounded-lg overflow-hidden border-2 bg-gray-800/50 p-2 flex items-center justify-center
                      ${selectedRace === race ? 'border-yellow-400 shadow-lg shadow-yellow-400/30' : 'border-gray-700 hover:border-yellow-600'}`}
                  >
                    <img src={RACE_IMAGES[race]} alt={race} className="w-20 h-24 object-contain" />
                  </div>
                </Tooltip>
              ))}
            </div>
          </div>

          {/* Class Selection */}
          <div>
            <h2 className="text-xl mb-4 font-semibold text-gray-300">Clase: <span className="text-yellow-400">{selectedClass}</span></h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.values(CharacterClass).map((charClass) => (
                 <div
                    key={charClass}
                    onClick={() => setSelectedClass(charClass)}
                    className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-300 flex flex-col items-center gap-2
                      ${selectedClass === charClass ? 'bg-yellow-600/20 border-yellow-500' : 'bg-gray-800/50 border-gray-700 hover:border-yellow-600'}`}
                  >
                    <div className="text-yellow-400">{CLASS_ICONS[charClass]}</div>
                    <h3 className="font-bold text-lg">{charClass}</h3>
                    <p className="text-xs text-center text-gray-400">{CLASS_DESCRIPTIONS[charClass]}</p>
                  </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-8 py-4 bg-yellow-600 text-gray-900 font-bold rounded-lg shadow-lg hover:bg-yellow-500 transition-colors duration-300 text-2xl"
          >
            Comenzar Aventura
          </button>
        </form>
      </div>
    </div>
  );
};

export default CharacterCreation;
