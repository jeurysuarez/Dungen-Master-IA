import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { CLASS_SKILL_POOLS } from '../constants';
import { SKILL_ICON_MAP } from './Icons';
import { Skill } from '../types';

const LevelUpModal: React.FC = () => {
    const { gameState, dispatch } = useGame();
    const { character } = gameState!;
    
    const availableSkills = CLASS_SKILL_POOLS[character.characterClass].filter(
        poolSkill => !character.skills.some(charSkill => charSkill.name === poolSkill.name)
    );

    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

    const handleConfirm = () => {
        if (selectedSkill) {
            dispatch({ type: 'COMPLETE_LEVEL_UP', payload: { newSkill: selectedSkill } });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fadeIn">
            <div className="w-full max-w-lg bg-slate-900 rounded-xl shadow-2xl border-2 border-amber-500/50 p-6 m-4 text-stone-200 font-body text-center">
                <h2 className="font-title text-4xl text-amber-400" style={{ textShadow: '0 0 10px #f59e0b' }}>
                    ¡Has Subido de Nivel!
                </h2>
                <p className="mt-2 text-stone-300">Has alcanzado el nivel {character.level}. Tu poder aumenta. Elige una nueva habilidad para dominar.</p>

                <div className="mt-6 space-y-3 text-left">
                    {availableSkills.length > 0 ? (
                        availableSkills.map(skill => {
                            const IconComponent = SKILL_ICON_MAP[skill.iconName];
                            const isSelected = selectedSkill?.name === skill.name;
                            return (
                                <button
                                    key={skill.name}
                                    onClick={() => setSelectedSkill(skill)}
                                    className={`w-full p-4 rounded-lg border-2 text-left transition-colors flex items-center gap-4 ${isSelected ? 'bg-purple-700 border-purple-500' : 'bg-slate-800 border-slate-700 hover:border-purple-500'}`}
                                >
                                    <div className="w-10 h-10 flex-shrink-0">{IconComponent && <IconComponent className="w-full h-full" />}</div>
                                    <div>
                                        <h3 className="font-bold text-stone-100">{skill.name}</h3>
                                        <p className="text-sm text-stone-300">{skill.description}</p>
                                    </div>
                                </button>
                            );
                        })
                    ) : (
                        <p className="text-center text-stone-400">¡Ya has dominado todas las habilidades de tu clase!</p>
                    )}
                </div>

                <button 
                    onClick={handleConfirm} 
                    disabled={!selectedSkill && availableSkills.length > 0}
                    className="w-full mt-8 py-3 bg-emerald-700 text-white font-bold rounded-lg hover:bg-emerald-600 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors text-xl"
                >
                    Confirmar
                </button>
            </div>
        </div>
    );
};

export default LevelUpModal;