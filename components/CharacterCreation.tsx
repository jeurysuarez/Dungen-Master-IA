import React, { useState, useMemo } from 'react';
import { Character, Race, CharacterClass } from '../types';
import { RACE_DESCRIPTIONS, CLASS_DESCRIPTIONS, RACE_IMAGES, CLASS_ICONS, RACE_SKILL_POOLS } from '../constants';

interface CharacterCreationProps {
  onCharacterCreate: (character: Character) => void;
}

const CharacterCreation: React.FC<CharacterCreationProps> = ({ onCharacterCreate }) => {
    const [name, setName] = useState('');
    const [selectedRace, setSelectedRace] = useState<Race>(Race.Humano);
    const [selectedClass, setSelectedClass] = useState<CharacterClass>(CharacterClass.Guerrero);
    const [step, setStep] = useState(1);

    const selectedSkills = useMemo(() => RACE_SKILL_POOLS[selectedRace], [selectedRace]);

    const handleCreateCharacter = () => {
        if (!name.trim()) {
            alert('Por favor, introduce un nombre para tu personaje.');
            return;
        }

        const newCharacter: Character = {
            name: name.trim(),
            race: selectedRace,
            characterClass: selectedClass,
            level: 1,
            xp: 0,
            xpToNextLevel: 100,
            hp: 100,
            maxHp: 100,
            mp: 50,
            maxMp: 50,
            attackBonus: 5,
            armorClass: 15,
            inventory: [{ name: 'Poción de Vida', quantity: 2, description: 'Restaura 20 PS.' }],
            spells: [],
            skills: selectedSkills,
        };

        onCharacterCreate(newCharacter);
    };

    const renderStep = () => {
        switch (step) {
            case 1: // Race selection
                return (
                    <div className="animate-fadeIn">
                        <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">Elige tu Raza</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Object.values(Race).map((race) => (
                                <button
                                    key={race}
                                    onClick={() => setSelectedRace(race)}
                                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${selectedRace === race ? 'bg-yellow-600/30 border-yellow-500' : 'bg-gray-800 border-gray-700 hover:border-yellow-500'}`}
                                >
                                    <h3 className="text-xl font-bold">{race}</h3>
                                </button>
                            ))}
                        </div>
                         <div className="mt-6 p-4 bg-gray-800 rounded-lg text-center">
                            <img src={RACE_IMAGES[selectedRace]} alt={selectedRace} className="w-24 h-24 mx-auto rounded-full mb-4 border-2 border-gray-600"/>
                            <p>{RACE_DESCRIPTIONS[selectedRace]}</p>
                        </div>
                        <button onClick={() => setStep(2)} className="w-full mt-6 py-3 bg-yellow-600 text-gray-900 font-bold rounded-lg hover:bg-yellow-500 transition-colors text-xl">Siguiente</button>
                    </div>
                );
            case 2: // Class selection
                return (
                    <div className="animate-fadeIn">
                        <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">Elige tu Clase</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.values(CharacterClass).map((charClass) => (
                                <button
                                    key={charClass}
                                    onClick={() => setSelectedClass(charClass)}
                                    className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center transition-all duration-200 ${selectedClass === charClass ? 'bg-yellow-600/30 border-yellow-500' : 'bg-gray-800 border-gray-700 hover:border-yellow-500'}`}
                                >
                                    <div className="w-12 h-12 mb-2">{CLASS_ICONS[charClass]}</div>
                                    <h3 className="text-lg font-bold">{charClass}</h3>
                                </button>
                            ))}
                        </div>
                        <div className="mt-6 p-4 bg-gray-800 rounded-lg text-center">
                            <p>{CLASS_DESCRIPTIONS[selectedClass]}</p>
                        </div>
                        <div className="flex justify-between mt-6">
                            <button onClick={() => setStep(1)} className="w-1/2 mr-2 py-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-colors text-xl">Anterior</button>
                            <button onClick={() => setStep(3)} className="w-1/2 ml-2 py-3 bg-yellow-600 text-gray-900 font-bold rounded-lg hover:bg-yellow-500 transition-colors text-xl">Siguiente</button>
                        </div>
                    </div>
                );
            case 3: // Name and finalization
                return (
                    <div className="animate-fadeIn">
                        <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">Nombra a tu Héroe</h2>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Escribe el nombre de tu personaje"
                            className="w-full p-4 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 text-center text-xl"
                        />
                         <div className="mt-6 p-4 bg-gray-800 rounded-lg text-center text-gray-300">
                           <p>Has elegido ser un <span className="font-bold text-white">{selectedRace}</span> <span className="font-bold text-white">{selectedClass}</span>.</p>
                           <p className="mt-2">Tus habilidades raciales son: {selectedSkills.map(s => s.name).join(', ')}.</p>
                        </div>
                        <div className="flex justify-between mt-6">
                            <button onClick={() => setStep(2)} className="w-1/2 mr-2 py-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-colors text-xl">Anterior</button>
                            <button onClick={handleCreateCharacter} className="w-1/2 ml-2 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition-colors text-xl">Comenzar Aventura</button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 font-serif">
            <div className="w-full max-w-2xl bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-2xl border-2 border-yellow-500/50 p-8">
                 <h1 className="text-4xl font-bold text-center text-yellow-400 mb-2 font-title">Creación de Personaje</h1>
                 <div className="w-full bg-gray-700 rounded-full h-1.5 mb-6">
                    <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: `${(step / 3) * 100}%` }}></div>
                </div>
                {renderStep()}
            </div>
        </div>
    );
};

export default CharacterCreation;
