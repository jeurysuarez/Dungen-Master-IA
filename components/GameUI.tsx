
// Fix: Added content for the main Game UI component.
import React, { useState, useRef, useEffect } from 'react';
import { Character, Enemy, Ally, Item, Skill, Spell, Settings } from '../types';
import { useTypingEffect } from '../hooks/useTypingEffect';
import Tooltip from './Tooltip';
import SettingsModal from './SettingsModal';
import { IconSettings, IconUser, IconBag, IconBook } from './Icons';

interface GameUIProps {
    character: Character;
    enemy: Enemy | null;
    party: Ally[];
    storyLog: string[];
    isDMThinking: boolean;
    onPlayerAction: (action: string) => void;
    settings: Settings;
    onSettingsChange: (newSettings: Partial<Settings>) => void;
}

const StatBar: React.FC<{ value: number; maxValue: number; color: string; label: string }> = ({ value, maxValue, color, label }) => (
    <div>
        <div className="flex justify-between text-sm font-bold text-stone-300">
            <span>{label}</span>
            <span>{value} / {maxValue}</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-4">
            <div className={`${color} h-4 rounded-full`} style={{ width: `${(value / maxValue) * 100}%` }}></div>
        </div>
    </div>
);

const GameUI: React.FC<GameUIProps> = ({ character, enemy, party, storyLog, isDMThinking, onPlayerAction, settings, onSettingsChange }) => {
    const [inputValue, setInputValue] = useState('');
    const [activeTab, setActiveTab] = useState('skills');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const logEndRef = useRef<HTMLDivElement>(null);

    const lastStoryText = storyLog[storyLog.length - 1] || "La aventura comienza...";
    const { typedText } = useTypingEffect(lastStoryText, settings.textSpeed);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [typedText]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() && !isDMThinking) {
            onPlayerAction(inputValue.trim());
            setInputValue('');
        }
    };
    
    // Fix: Refactored to return JSX for better type safety and to avoid dangerouslySetInnerHTML.
    const renderSkillTooltip = (skill: Skill) => (
        <>
            <h4 className="font-bold text-amber-400 text-lg">{skill.name}</h4>
            <p className="text-sm text-stone-300">{skill.description}</p>
            <p className="text-xs text-stone-400 mt-2">Enfriamiento: {skill.cooldown} turnos</p>
        </>
    );

    return (
        <div className="flex flex-col md:flex-row h-screen bg-slate-900 text-stone-200 font-body">
             {isSettingsOpen && <SettingsModal settings={settings} onClose={() => setIsSettingsOpen(false)} onSettingsChange={onSettingsChange} />}
            {/* Main Content: Story & Input */}
            <main className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden">
                <div ref={logEndRef} className="flex-1 overflow-y-auto bg-black/30 rounded-lg p-4 mb-4 custom-scrollbar">
                    {storyLog.slice(0, -1).map((text, index) => (
                        <p key={index} className="mb-4 text-stone-300 prose prose-invert" dangerouslySetInnerHTML={{ __html: text }} />
                    ))}
                    <p className="text-stone-100 prose prose-invert" dangerouslySetInnerHTML={{ __html: typedText }} />
                </div>
                <form onSubmit={handleSubmit} className="flex space-x-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={isDMThinking ? "El DM está pensando..." : "Escribe tu acción..."}
                        className="flex-1 bg-slate-800 border-2 border-slate-700 rounded-lg p-3 focus:outline-none focus:border-purple-500"
                        disabled={isDMThinking}
                    />
                    <button type="submit" className="bg-purple-700 text-stone-100 font-bold px-6 py-3 rounded-lg hover:bg-purple-600 disabled:bg-slate-600" disabled={isDMThinking}>
                        Enviar
                    </button>
                </form>
            </main>

            {/* Side Panel: Stats, Enemy, Actions */}
            <aside className="w-full md:w-96 bg-slate-900/50 border-t-2 md:border-t-0 md:border-l-2 border-purple-600/30 p-4 flex flex-col space-y-4 overflow-y-auto">
                {/* Character Stats */}
                <div className="bg-slate-800/50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-amber-400 font-title">{character.name}</h2>
                        <button onClick={() => setIsSettingsOpen(true)} className="text-stone-400 hover:text-amber-400"><IconSettings /></button>
                    </div>
                    <p className="text-stone-400">{character.race} {character.characterClass} - Nivel {character.level}</p>
                    <div className="space-y-2 mt-4">
                        <StatBar value={character.hp} maxValue={character.maxHp} color="bg-red-600" label="PS" />
                        <StatBar value={character.mp} maxValue={character.maxMp} color="bg-blue-600" label="PM" />
                    </div>
                </div>

                {/* Enemy Info */}
                {enemy && (
                    <div className="bg-red-900/30 p-4 rounded-lg border border-red-500/50 animate-fadeIn">
                        <h3 className="text-xl font-bold text-red-400">{enemy.name}</h3>
                        <p className="text-stone-300 text-sm mb-2">{enemy.description}</p>
                         <StatBar value={enemy.hp} maxValue={enemy.maxHp} color="bg-red-600" label="PS" />
                    </div>
                )}
                
                {/* Action Tabs */}
                <div className="flex-1 bg-slate-800/50 p-2 rounded-lg flex flex-col">
                   <div className="flex border-b border-slate-700">
                       <button onClick={() => setActiveTab('skills')} className={`flex-1 p-2 font-bold flex items-center justify-center gap-2 ${activeTab === 'skills' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-stone-400'}`}><IconBook /> Habilidades</button>
                       <button onClick={() => setActiveTab('inventory')} className={`flex-1 p-2 font-bold flex items-center justify-center gap-2 ${activeTab === 'inventory' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-stone-400'}`}><IconBag/> Inventario</button>
                       <button onClick={() => setActiveTab('party')} className={`flex-1 p-2 font-bold flex items-center justify-center gap-2 ${activeTab === 'party' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-stone-400'}`}><IconUser/> Grupo</button>
                   </div>
                   <div className="flex-1 overflow-y-auto pt-2">
                       {activeTab === 'skills' && (
                           <div className="grid grid-cols-3 gap-2">
                               {character.skills.map(skill => (
                                   <Tooltip key={skill.name} text={renderSkillTooltip(skill)}>
                                       <button onClick={() => onPlayerAction(`Uso la habilidad: ${skill.name}`)} className="aspect-square flex flex-col items-center justify-center bg-slate-900/70 rounded-lg p-2 hover:bg-purple-600/30 border border-transparent hover:border-purple-500">
                                            <div className="w-8 h-8">{skill.icon}</div>
                                            <span className="text-xs text-center truncate w-full">{skill.name}</span>
                                       </button>
                                   </Tooltip>
                               ))}
                           </div>
                       )}
                       {activeTab === 'inventory' && (
                           <ul>{character.inventory.map(item => <li key={item.name}>{item.name} (x{item.quantity})</li>)}</ul>
                       )}
                        {activeTab === 'party' && (
                           <ul>
                               {party.length > 0 ? party.map(p => (
                                   <li key={p.name}>{p.name} - {p.hp}/{p.maxHp} PS</li>
                               )) : <p className="text-slate-500">Estás solo.</p>}
                           </ul>
                       )}
                   </div>
                </div>
            </aside>
        </div>
    );
};

export default GameUI;
