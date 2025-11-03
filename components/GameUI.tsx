
import React, { useRef, useEffect, useState } from 'react';
import { Character, Ally, Enemy } from '../types';
import { IconSoundOn, IconSoundOff } from './Icons';

// Sub-components are defined in this file to keep related UI logic together.
// They are defined outside the main component to prevent re-renders.

interface StoryLogProps {
  log: string[];
}
const StoryLog: React.FC<StoryLogProps> = ({ log }) => {
    const logEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [log]);
    return (
        <div className="h-full bg-gray-800/50 p-4 rounded-lg border border-yellow-400/20 overflow-y-auto custom-scrollbar">
            <div className="prose prose-invert prose-p:text-gray-300 prose-headings:text-yellow-400">
              {log.map((entry, index) => (
                <p key={index} className="mb-4" dangerouslySetInnerHTML={{ __html: entry.replace(/\n/g, '<br/>') }} />
              ))}
            </div>
            <div ref={logEndRef} />
        </div>
    );
};

interface StatBarProps {
  value: number;
  maxValue: number;
  color: string;
  label: string;
}
const StatBar: React.FC<StatBarProps> = ({ value, maxValue, color, label }) => (
    <div>
        <div className="flex justify-between text-sm font-semibold">
            <span>{label}</span>
            <span>{value} / {maxValue}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div className={`${color} h-2.5 rounded-full`} style={{ width: `${(value / maxValue) * 100}%` }}></div>
        </div>
    </div>
);


interface CharacterSheetProps {
    character: Character;
    isHit: boolean;
}
const CharacterSheet: React.FC<CharacterSheetProps> = ({ character, isHit }) => {
    return (
        <div className={`p-4 bg-gray-800/50 rounded-lg border border-yellow-400/20 ${isHit ? 'animate-shake border-red-500' : ''}`}>
            <h3 className="font-title text-2xl text-yellow-400">{character.name}</h3>
            <p className="text-sm text-gray-400 mb-2">{character.race} {character.characterClass} - Nivel {character.level}</p>
            <div className="space-y-3">
                <StatBar value={character.hp} maxValue={character.maxHp} color="bg-green-500" label="PS" />
                <StatBar value={character.mp} maxValue={character.maxMp} color="bg-blue-500" label="PM" />
            </div>
             <div className="mt-4 text-sm">
                <p>XP: {character.xp} / {character.xpToNextLevel}</p>
                <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                    <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${(character.xp / character.xpToNextLevel) * 100}%` }}></div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4 text-center">
                <div className="bg-gray-700/50 p-2 rounded">
                    <p className="text-xs text-gray-400">Bono Ataque</p>
                    <p className="font-bold text-lg text-red-400">+{character.attackBonus}</p>
                </div>
                <div className="bg-gray-700/50 p-2 rounded">
                    <p className="text-xs text-gray-400">Clase Armadura</p>
                    <p className="font-bold text-lg text-gray-300">{character.armorClass}</p>
                </div>
            </div>
        </div>
    );
};

interface PartySheetProps {
    party: Ally[];
}
const PartySheet: React.FC<PartySheetProps> = ({ party }) => {
    if (party.length === 0) return null;
    return (
        <div className="p-4 bg-gray-800/50 rounded-lg border border-yellow-400/20">
            <h3 className="font-title text-xl text-yellow-400 mb-2">Grupo</h3>
            <div className="space-y-2">
                {party.map(ally => (
                    <div key={ally.name}>
                        <p className="text-sm font-semibold">{ally.name}</p>
                        <StatBar value={ally.hp} maxValue={ally.maxHp} color="bg-green-500" label="PS" />
                    </div>
                ))}
            </div>
        </div>
    );
};

interface EnemySheetProps {
    enemy: Enemy;
    isHit: boolean;
}
const EnemySheet: React.FC<EnemySheetProps> = ({ enemy, isHit }) => (
    <div className={`p-4 bg-gray-800/50 rounded-lg border border-red-500/40 ${isHit ? 'animate-shake' : ''}`}>
        <h3 className="font-title text-2xl text-red-400">{enemy.name}</h3>
        <div className="space-y-3 mt-2">
            <StatBar value={enemy.hp} maxValue={enemy.maxHp} color="bg-red-600" label="PS" />
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4 text-center">
            <div className="bg-gray-700/50 p-2 rounded">
                <p className="text-xs text-gray-400">Bono Ataque</p>
                <p className="font-bold text-lg text-red-400">+{enemy.attackBonus}</p>
            </div>
            <div className="bg-gray-700/50 p-2 rounded">
                <p className="text-xs text-gray-400">Clase Armadura</p>
                <p className="font-bold text-lg text-gray-300">{enemy.armorClass}</p>
            </div>
        </div>
    </div>
);

interface PlayerActionsProps {
    onAction: (action: string) => void;
    isLoading: boolean;
}
const PlayerActions: React.FC<PlayerActionsProps> = ({ onAction, isLoading }) => {
    const [input, setInput] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        onAction(input.trim());
        setInput('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="¿Qué haces ahora?"
                disabled={isLoading}
                className="flex-grow p-3 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
            />
            <button type="submit" disabled={isLoading} className="px-6 py-3 bg-yellow-600 text-gray-900 font-bold rounded-lg shadow-md hover:bg-yellow-500 transition-colors duration-300 disabled:bg-gray-500">
                {isLoading ? "..." : "Enviar"}
            </button>
        </form>
    );
};

// ... other sub-components for combat actions, magic, etc. could go here ...
// For simplicity, they are integrated within the main GameUI component for now.

interface GameUIProps {
    character: Character;
    party: Ally[];
    enemy: Enemy | null;
    storyLog: string[];
    isInCombat: boolean;
    isLoading: boolean;
    isPlayerHit: boolean;
    isEnemyHit: boolean;
    isSpellCasting: boolean;
    diceRoll: { roll: number, bonus: number, total: number } | null;
    onAction: (action: string) => void;
    onCombatAction: (action: string, details?: any) => void;
    ttsEnabled: boolean;
    toggleTts: () => void;
}


const GameUI: React.FC<GameUIProps> = (props) => {
    const {
        character, party, enemy, storyLog, isInCombat, isLoading,
        isPlayerHit, isEnemyHit, isSpellCasting, diceRoll,
        onAction, onCombatAction, ttsEnabled, toggleTts
    } = props;
    
    const [activeCombatMenu, setActiveCombatMenu] = useState<'main' | 'magic' | 'skills' | 'items' | 'party'>('main');
    
    useEffect(() => {
        if (isInCombat) {
            setActiveCombatMenu('main');
        }
    }, [isInCombat]);

    const renderCombatActions = () => {
        switch(activeCombatMenu) {
            case 'magic':
                return (
                    <>
                        <div className="grid grid-cols-2 gap-2">
                         {character.spells.length > 0 ? character.spells.map(spell => (
                            <button key={spell.name} disabled={isLoading || character.mp < spell.cost} onClick={() => onCombatAction('magic', spell)}
                                className="p-2 bg-blue-800/80 rounded hover:bg-blue-700 disabled:bg-gray-600">
                                {spell.name} ({spell.cost} PM)
                            </button>
                         )) : <p className="col-span-2 text-center text-gray-400">No conoces hechizos.</p>}
                        </div>
                        <button onClick={() => setActiveCombatMenu('main')} className="mt-2 w-full p-2 bg-gray-600 rounded">Volver</button>
                    </>
                );
            case 'skills':
                 return (
                    <>
                        <div className="grid grid-cols-2 gap-2">
                         {character.skills.length > 0 ? character.skills.map(skill => (
                            <button key={skill.name} disabled={isLoading || skill.currentCooldown > 0} onClick={() => onCombatAction('skill', skill)}
                                className="p-2 bg-purple-800/80 rounded hover:bg-purple-700 disabled:bg-gray-600 flex flex-col items-center">
                                {skill.icon}
                                <span>{skill.name}</span>
                                <span className="text-xs">{skill.currentCooldown > 0 ? `Enfriamiento: ${skill.currentCooldown}` : 'Listo'}</span>
                            </button>
                         )) : <p className="col-span-2 text-center text-gray-400">No tienes habilidades.</p>}
                        </div>
                        <button onClick={() => setActiveCombatMenu('main')} className="mt-2 w-full p-2 bg-gray-600 rounded">Volver</button>
                    </>
                );
            // Cases for 'items' and 'party' would follow a similar structure
            default:
                return (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <button onClick={() => onCombatAction('attack')} disabled={isLoading} className="p-3 bg-red-800/80 rounded hover:bg-red-700 disabled:bg-gray-600">Atacar</button>
                        <button onClick={() => setActiveCombatMenu('magic')} disabled={isLoading} className="p-3 bg-blue-800/80 rounded hover:bg-blue-700 disabled:bg-gray-600">Magia</button>
                        <button onClick={() => setActiveCombatMenu('skills')} disabled={isLoading} className="p-3 bg-purple-800/80 rounded hover:bg-purple-700 disabled:bg-gray-600">Habilidades</button>
                        <button disabled={true} className="p-3 bg-yellow-800/80 rounded disabled:bg-gray-600/50 cursor-not-allowed">Objetos</button>
                        {/* Party button can be added here if party logic is expanded */}
                    </div>
                );
        }
    };

    return (
        <div className="h-screen w-screen bg-gray-900 text-white font-body flex flex-col p-4 gap-4" style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/dark-denim-3.png)' }}>
            
            {isSpellCasting && <div className="absolute inset-0 bg-blue-400/50 animate-flash z-50 pointer-events-none"></div>}
            
            {diceRoll && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-40 animate-fadeIn">
                    <div className="text-center text-white p-8 bg-gray-800 rounded-lg shadow-lg border border-yellow-500">
                        <p className="text-lg">Tirada de Ataque</p>
                        <p className="text-6xl font-bold my-4">
                            <span className="text-cyan-400">{diceRoll.roll}</span>
                            <span className="text-2xl mx-2">+</span>
                            <span className="text-red-400">{diceRoll.bonus}</span>
                            <span className="text-2xl mx-2">=</span>
                            <span className="text-yellow-400">{diceRoll.total}</span>
                        </p>
                    </div>
                </div>
            )}

            <header className="flex-shrink-0 flex justify-between items-center">
                <h1 className="font-title text-3xl text-yellow-400">Dungeon Master IA</h1>
                <button onClick={toggleTts} className="p-2 rounded-full bg-gray-800/50 hover:bg-yellow-600/50 transition-colors">
                    {ttsEnabled ? <IconSoundOn className="w-6 h-6 text-yellow-400"/> : <IconSoundOff className="w-6 h-6 text-gray-500"/>}
                </button>
            </header>
            
            <main className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden">
                {/* Main Column */}
                <section className="md:col-span-2 h-full flex flex-col">
                    <StoryLog log={storyLog} />
                </section>

                {/* Side Column */}
                <aside className="h-full flex flex-col gap-4 overflow-y-auto custom-scrollbar">
                    <CharacterSheet character={character} isHit={isPlayerHit} />
                    <PartySheet party={party} />
                    {enemy && <EnemySheet enemy={enemy} isHit={isEnemyHit} />}
                </aside>
            </main>

            <footer className="flex-shrink-0 h-24 flex items-center justify-center p-4 bg-black/30 rounded-lg border border-yellow-400/20">
                <div className="w-full max-w-2xl">
                    {isInCombat ? renderCombatActions() : <PlayerActions onAction={onAction} isLoading={isLoading} />}
                </div>
            </footer>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #1f2937;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #ca8a04;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #facc15;
                }
            `}</style>
        </div>
    );
};

export default GameUI;
