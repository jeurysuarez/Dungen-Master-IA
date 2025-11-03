import React, { useState, useRef, useEffect } from 'react';
import { Character, Enemy, Ally, Settings, Skill } from '../types';
import { useTypingEffect } from '../hooks/useTypingEffect';
import * as audioService from '../services/audioService';
import SettingsModal from './SettingsModal';
import Tooltip from './Tooltip';
import { IconSave, IconLoad, IconGear } from './Icons';

interface GameUIProps {
    character: Character;
    enemy: Enemy | null;
    party: Ally[];
    storyLog: string[];
    isLoading: boolean;
    isInCombat: boolean;
    onSendAction: (action: string) => void;
    settings: Settings;
    onSettingsChange: (newSettings: Partial<Settings>) => void;
    onManualSave: () => void;
    onManualLoad: () => void;
    toastMessage: string | null;
}

const StatBar: React.FC<{ value: number, maxValue: number, color: string, label: string }> = ({ value, maxValue, color, label }) => (
    <div>
        <div className="flex justify-between text-sm font-bold">
            <span>{label}</span>
            <span>{value} / {maxValue}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4 border border-black/50">
            <div className={`${color} h-full rounded-full transition-all duration-500`} style={{ width: `${(value / maxValue) * 100}%` }}></div>
        </div>
    </div>
);

const GameUI: React.FC<GameUIProps> = ({
    character,
    enemy,
    party,
    storyLog,
    isLoading,
    isInCombat,
    onSendAction,
    settings,
    onSettingsChange,
    onManualSave,
    onManualLoad,
    toastMessage,
}) => {
    const [input, setInput] = useState('');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const storyContainerRef = useRef<HTMLDivElement>(null);
    const latestStoryText = storyLog[storyLog.length - 1] || '';
    const { typedText } = useTypingEffect(latestStoryText, settings.textSpeed);

    useEffect(() => {
        if (storyContainerRef.current) {
            storyContainerRef.current.scrollTop = storyContainerRef.current.scrollHeight;
        }
    }, [typedText, storyLog]);

    const handleSend = () => {
        if (input.trim() && !isLoading) {
            onSendAction(input.trim());
            setInput('');
            audioService.playClick();
        }
    };
    
    const handleSkillClick = (skill: Skill) => {
        if (skill.currentCooldown > 0) return;
        const action = `Uso mi habilidad: "${skill.name}". ${skill.description}`;
        onSendAction(action);
        // Note: The game logic in App.tsx and geminiService will need to be updated to handle skill cooldowns.
        // For now, we just send the action.
    }

    const renderParty = () => (
        <div className="space-y-2">
            <h3 className="text-lg font-bold text-yellow-400 border-b border-yellow-400/30 mb-2">Grupo</h3>
            {party.map(ally => (
                <div key={ally.name} className="bg-gray-800/50 p-2 rounded">
                    <p className="font-bold">{ally.name}</p>
                    <StatBar value={ally.hp} maxValue={ally.maxHp} color="bg-green-500" label="PS" />
                </div>
            ))}
        </div>
    );
    
    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-gray-200 font-serif">
            {/* Left Panel - Character & Party */}
            <aside className="w-full md:w-1/4 bg-gray-900/80 backdrop-blur-sm p-4 border-r-2 border-yellow-500/30 flex flex-col space-y-4 overflow-y-auto">
                <div>
                    <h2 className="text-3xl font-bold text-yellow-400 font-title">{character.name}</h2>
                    <p className="text-gray-400">{character.race} {character.characterClass} - Nivel {character.level}</p>
                </div>
                <div className="space-y-3">
                    <StatBar value={character.hp} maxValue={character.maxHp} color="bg-red-600" label="PS" />
                    <StatBar value={character.mp} maxValue={character.maxMp} color="bg-blue-600" label="PM" />
                    <div>
                         <div className="flex justify-between text-sm font-bold">
                            <span>XP</span>
                            <span>{character.xp} / {character.xpToNextLevel}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(character.xp / character.xpToNextLevel) * 100}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-gray-800 p-2 rounded">
                        <p className="font-bold text-lg">{character.attackBonus}</p>
                        <p className="text-sm text-gray-400">Ataque</p>
                    </div>
                    <div className="bg-gray-800 p-2 rounded">
                        <p className="font-bold text-lg">{character.armorClass}</p>
                        <p className="text-sm text-gray-400">Armadura</p>
                    </div>
                </div>

                {/* Skills */}
                <div>
                    <h3 className="text-lg font-bold text-yellow-400 border-b border-yellow-400/30 mb-2">Habilidades</h3>
                    <div className="grid grid-cols-4 gap-2">
                        {character.skills.map(skill => (
                           <Tooltip key={skill.name} text={`${skill.name}: ${skill.description} (Enfriamiento: ${skill.cooldown})`}>
                                <button 
                                    onClick={() => handleSkillClick(skill)}
                                    disabled={skill.currentCooldown > 0}
                                    className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 transition-colors ${skill.currentCooldown > 0 ? 'bg-gray-700 border-gray-600 cursor-not-allowed' : 'bg-gray-800 border-gray-700 hover:border-yellow-500'}`}
                                >
                                    <div className="w-8 h-8">{skill.icon}</div>
                                    {skill.currentCooldown > 0 && <div className="absolute text-lg font-bold">{skill.currentCooldown}</div>}
                                </button>
                           </Tooltip>
                        ))}
                    </div>
                </div>

                {party.length > 0 && renderParty()}
                
                <div className="!mt-auto pt-4 space-y-2">
                    <div className="flex space-x-2">
                         <button onClick={() => setIsSettingsOpen(true)} className="w-full flex items-center justify-center py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"><IconGear className="w-6 h-6"/></button>
                         <button onClick={onManualSave} className="w-full flex items-center justify-center py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"><IconSave className="w-6 h-6"/></button>
                         <button onClick={onManualLoad} className="w-full flex items-center justify-center py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"><IconLoad className="w-6 h-6"/></button>
                    </div>
                </div>
            </aside>

            {/* Main Panel - Story & Input */}
            <main className="w-full md:w-3/4 flex flex-col p-4 relative">
                 {enemy && isInCombat && (
                    <div className="absolute top-4 right-4 w-64 bg-red-900/50 backdrop-blur-sm border-2 border-red-500/50 p-4 rounded-lg animate-fadeIn">
                        <h3 className="text-2xl font-bold text-red-400">{enemy.name}</h3>
                        <p className="text-sm italic mb-2">{enemy.description}</p>
                        <StatBar value={enemy.hp} maxValue={enemy.maxHp} color="bg-red-500" label="PS" />
                    </div>
                 )}

                <div ref={storyContainerRef} className="flex-grow overflow-y-auto mb-4 bg-black/30 p-4 rounded-lg border border-gray-700/50">
                     {storyLog.slice(0, -1).map((text, index) => (
                        <p key={index} className="mb-4 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: text.startsWith('>') ? `<em class="text-yellow-300">${text}</em>` : text }} />
                    ))}
                    {typedText && <p className="mb-4 whitespace-pre-wrap">{typedText}</p>}
                </div>
                
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={isLoading ? "El Dungeon Master está pensando..." : "Escribe tu acción..."}
                        className="flex-grow p-4 bg-gray-800 border-2 border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading}
                        className="px-8 py-4 bg-yellow-600 text-gray-900 font-bold rounded-lg hover:bg-yellow-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        {isLoading ? '...' : 'Enviar'}
                    </button>
                </div>
            </main>

            {isSettingsOpen && <SettingsModal settings={settings} onClose={() => setIsSettingsOpen(false)} onSettingsChange={onSettingsChange} />}

            {toastMessage && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white py-2 px-6 rounded-lg shadow-lg animate-fadeIn" >
                    {toastMessage}
                </div>
            )}
        </div>
    );
};

export default GameUI;
