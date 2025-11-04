import React, { useState, memo } from 'react';
import { useGame } from '../context/GameContext';
import { Skill, Spell } from '../types';
import Tooltip from './Tooltip';
import { SKILL_ICON_MAP } from './Icons';
import * as audioService from '../services/audioService';

interface ActionsPanelProps {
    setPlayerInput: (input: string) => void;
    isLoading: boolean;
}

const ActionsPanel: React.FC<ActionsPanelProps> = ({ setPlayerInput, isLoading }) => {
    const { gameState } = useGame();
    const { character } = gameState!;
    const [animatedAction, setAnimatedAction] = useState<string | null>(null);

    const handleAbilityClick = (ability: Skill | Spell, type: 'skill' | 'spell') => {
        if (isLoading) return;

        if (type === 'spell' && 'cost' in ability) {
            if (character.mp < ability.cost) return;
            audioService.playSpell();
        } else {
            audioService.playAttack();
        }

        setAnimatedAction(ability.name);
        setPlayerInput(`Uso ${type === 'skill' ? 'la habilidad' : 'el hechizo'}: ${ability.name}`);
        
        setTimeout(() => setAnimatedAction(null), 600);
    };

    return (
         <div className="bg-slate-800/50 p-4 rounded-lg">
            <h3 className="font-title text-xl text-amber-400 mb-3">Habilidades y Hechizos</h3>
            <div className="grid grid-cols-3 gap-3">
                 {character.skills.map((skill) => {
                    const IconComponent = SKILL_ICON_MAP[skill.iconName];
                    const isAnimating = animatedAction === skill.name;
                    return (
                        <Tooltip key={skill.name} text={
                            <div className="text-left">
                                <h4 className="font-bold text-stone-100">{skill.name}</h4>
                                <p className="text-sm text-stone-300">{skill.description}</p>
                            </div>
                        }>
                            <button onClick={() => handleAbilityClick(skill, 'skill')} disabled={isLoading} className={`relative p-4 rounded-lg border-2 border-slate-700 hover:bg-slate-700/50 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isAnimating ? 'animate-skill-cast' : ''}`}>
                                {IconComponent && <IconComponent className="w-8 h-8 text-stone-300" />}
                            </button>
                        </Tooltip>
                    );
                })}
                {character.spells.map((spell) => {
                    const hasEnoughMana = character.mp >= spell.cost;
                    const isAnimating = animatedAction === spell.name;
                    return (
                        <Tooltip key={spell.name} text={
                            <div className="text-left">
                                <h4 className="font-bold text-stone-100">{spell.name} ({spell.cost} MP)</h4>
                                <p className="text-sm text-stone-300">{spell.description}</p>
                            </div>
                        }>
                            <button onClick={() => handleAbilityClick(spell, 'spell')} disabled={isLoading || !hasEnoughMana} className={`relative p-4 rounded-lg border-2 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isAnimating ? 'animate-skill-cast' : ''} ${hasEnoughMana ? 'border-purple-700 hover:bg-purple-900/50' : 'border-slate-700'}`}>
                                <span className={`text-3xl font-bold ${hasEnoughMana ? 'text-purple-400' : 'text-slate-500'}`}>✨</span>
                            </button>
                        </Tooltip>
                    );
                })}
            </div>
        </div>
    );
};

export default memo(ActionsPanel);
