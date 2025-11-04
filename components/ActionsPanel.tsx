import React, { useState, memo } from 'react';
import { useGame } from '../context/GameContext';
import { Skill, Spell } from '../types';
import Tooltip from './Tooltip';
import { SKILL_ICON_MAP } from './Icons';
import * as audioService from '../services/audioService';
import AbilityEffect from './AbilityEffect';

interface ActionsPanelProps {
    setPlayerInput: (input: string) => void;
    isLoading: boolean;
}

const ABILITY_EFFECT_MAP: Record<string, 'powerful-strike' | 'frostbolt' | 'sneak-attack' | 'healing-light'> = {
  "Ataque Poderoso": "powerful-strike",
  "Rayo de Escarcha": "frostbolt",
  "Ataque Furtivo": "sneak-attack",
  "Curar Heridas Leves": "healing-light",
};

const ActionsPanel: React.FC<ActionsPanelProps> = ({ setPlayerInput, isLoading }) => {
    const { gameState } = useGame();
    const { character } = gameState!;
    const [activeEffect, setActiveEffect] = useState<{ name: string; type: 'powerful-strike' | 'frostbolt' | 'sneak-attack' | 'healing-light' } | null>(null);

    const handleAbilityClick = (ability: Skill | Spell, type: 'skill' | 'spell') => {
        if (isLoading || activeEffect) return;

        if (type === 'spell' && 'cost' in ability) {
            if (character.mp < ability.cost) return;
            audioService.playSpell();
        } else {
            audioService.playAttack();
        }

        const effectType = ABILITY_EFFECT_MAP[ability.name];
        if (effectType) {
          setActiveEffect({ name: ability.name, type: effectType });
        }
        
        setPlayerInput(`Uso ${type === 'skill' ? 'la habilidad' : 'el hechizo'}: ${ability.name}`);
    };

    return (
         <div className="bg-slate-800/50 p-4 rounded-lg">
            <h3 className="font-title text-xl text-amber-400 mb-3">Habilidades y Hechizos</h3>
            <div className="grid grid-cols-3 gap-3">
                 {character.skills.map((skill) => {
                    const IconComponent = SKILL_ICON_MAP[skill.iconName];
                    const isAnimating = activeEffect?.name === skill.name;
                    return (
                        <Tooltip key={skill.name} text={
                            <div className="text-left">
                                <h4 className="font-bold text-stone-100">{skill.name}</h4>
                                <p className="text-sm text-stone-300">{skill.description}</p>
                            </div>
                        }>
                            <button onClick={() => handleAbilityClick(skill, 'skill')} disabled={isLoading || !!activeEffect} className={`relative p-4 rounded-lg border-2 border-slate-700 hover:bg-slate-700/50 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}>
                                {IconComponent && <IconComponent className="w-8 h-8 text-stone-300" />}
                                {isAnimating && <AbilityEffect effectType={activeEffect!.type} onAnimationEnd={() => setActiveEffect(null)} />}
                            </button>
                        </Tooltip>
                    );
                })}
                {character.spells.map((spell) => {
                    const hasEnoughMana = character.mp >= spell.cost;
                    const isAnimating = activeEffect?.name === spell.name;
                    return (
                        <Tooltip key={spell.name} text={
                            <div className="text-left">
                                <h4 className="font-bold text-stone-100">{spell.name} ({spell.cost} MP)</h4>
                                <p className="text-sm text-stone-300">{spell.description}</p>
                            </div>
                        }>
                            <button onClick={() => handleAbilityClick(spell, 'spell')} disabled={isLoading || !hasEnoughMana || !!activeEffect} className={`relative p-4 rounded-lg border-2 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${hasEnoughMana ? 'border-purple-700 hover:bg-purple-900/50' : 'border-slate-700'}`}>
                                <span className={`text-3xl font-bold ${hasEnoughMana ? 'text-purple-400' : 'text-slate-500'}`}>✨</span>
                                {isAnimating && <AbilityEffect effectType={activeEffect!.type} onAnimationEnd={() => setActiveEffect(null)} />}
                            </button>
                        </Tooltip>
                    );
                })}
            </div>
        </div>
    );
};

export default memo(ActionsPanel);