import React, { useState, useEffect, useRef } from 'react';
import { GameState, Item, Settings } from '../types';
import { sendMessageToDM, generateSpeech } from '../services/geminiService';
import { useTypingEffect } from '../hooks/useTypingEffect';
import { decode, decodeAudioData } from '../utils/audioUtils';
import Tooltip from './Tooltip';
import { SKILL_ICON_MAP } from './Icons';
import SettingsModal from './SettingsModal';
import LootNotification from './LootNotification';
import MapModal from './MapModal';


interface GameUIProps {
    gameState: GameState;
    setGameState: React.Dispatch<React.SetStateAction<GameState | null>>;
    settings: Settings;
    onSettingsChange: (newSettings: Partial<Settings>) => void;
}

const GameUI: React.FC<GameUIProps> = ({ gameState, setGameState, settings, onSettingsChange }) => {
    const { character, enemy, storyLog } = gameState;
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const storyLogRef = useRef<HTMLDivElement>(null);
    const currentStoryText = storyLog[storyLog.length - 1] || '';
    const { typedText } = useTypingEffect(currentStoryText, settings.textSpeed);

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [lootToShow, setLootToShow] = useState<Item[]>([]);
    
    // Audio state
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

    useEffect(() => {
        if (storyLogRef.current) {
            storyLogRef.current.scrollTop = storyLogRef.current.scrollHeight;
        }
    }, [typedText]);

    // TTS effect
    useEffect(() => {
        if (settings.ttsEnabled && currentStoryText && !isLoading) {
            const playNarration = async () => {
                if (audioSourceRef.current) {
                    audioSourceRef.current.stop();
                }
                const audioContent = await generateSpeech(currentStoryText);
                if (audioContent) {
                    if (!audioContextRef.current) {
                        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
                    }
                    const ctx = audioContextRef.current;
                    if (ctx.state === 'suspended') {
                        ctx.resume();
                    }
                    const decodedData = decode(audioContent);
                    const audioBuffer = await decodeAudioData(decodedData, ctx, 24000, 1);
                    const source = ctx.createBufferSource();
                    source.buffer = audioBuffer;
                    
                    const gainNode = ctx.createGain();
                    gainNode.gain.setValueAtTime(settings.volume, ctx.currentTime);
                    source.connect(gainNode);
                    gainNode.connect(ctx.destination);
                    
                    source.start();
                    audioSourceRef.current = source;
                }
            };
            playNarration();
        } else {
             if (audioSourceRef.current) {
                audioSourceRef.current.stop();
             }
        }

        return () => {
            if (audioSourceRef.current) {
                audioSourceRef.current.stop();
            }
        };

    }, [currentStoryText, settings.ttsEnabled, settings.volume, isLoading]);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const playerAction = input;
        setInput('');
        setIsLoading(true);

        const newStoryLog = [...storyLog, `> ${playerAction}`];
        setGameState(prev => prev ? { ...prev, storyLog: newStoryLog } : null);
        
        const response = await sendMessageToDM(playerAction, character, gameState.party, enemy, storyLog);

        setGameState(prev => {
            if (!prev) return null;
            
            let newCharacter = { ...prev.character };
            if (response.characterUpdate) {
                newCharacter = { ...newCharacter, ...response.characterUpdate };
            }

            let newEnemy = prev.enemy;
            if (response.newEnemy) {
                newEnemy = response.newEnemy;
            } else if (response.removeEnemy) {
                newEnemy = null;
            }
            
            // Handle loot
            if(response.loot && response.loot.length > 0) {
                setLootToShow(response.loot);
                // Add loot to inventory
                const updatedInventory = [...newCharacter.inventory];
                response.loot.forEach(lootItem => {
                    const existingItem = updatedInventory.find(i => i.name === lootItem.name);
                    if (existingItem) {
                        existingItem.quantity += lootItem.quantity;
                    } else {
                        updatedInventory.push(lootItem);
                    }
                });
                newCharacter.inventory = updatedInventory;
            }

            return {
                ...prev,
                character: newCharacter,
                enemy: newEnemy,
                storyLog: [...newStoryLog, response.storyText],
            };
        });

        setIsLoading(false);
    };

    const handleActionClick = (action: string) => {
        setInput(action);
        // Maybe submit form right away?
    };

    const StatBar = ({ value, maxValue, colorClass, label }: { value: number, maxValue: number, colorClass: string, label: string }) => (
        <div className="w-full bg-slate-700 rounded-full h-6 overflow-hidden border-2 border-slate-900 relative">
            <div className={`${colorClass} h-full transition-all duration-500`} style={{ width: `${(value / maxValue) * 100}%` }}></div>
            <span className="absolute inset-0 w-full text-center font-bold text-sm text-white flex items-center justify-center" style={{textShadow: '1px 1px 2px black'}}>
                {label}: {value} / {maxValue}
            </span>
        </div>
    );
    
    return (
        <div className="flex flex-col h-screen bg-slate-900 text-stone-200 font-body">
            {isSettingsOpen && <SettingsModal settings={settings} onClose={() => setIsSettingsOpen(false)} onSettingsChange={onSettingsChange} />}
            {isMapOpen && <MapModal mapData={gameState.map || "El Dungeon Master no te ha proporcionado un mapa aún."} onClose={() => setIsMapOpen(false)} />}
            <LootNotification loot={lootToShow} onDismiss={() => setLootToShow([])} />

            <header className="bg-slate-900/80 backdrop-blur-sm p-2 md:p-4 border-b-2 border-purple-500/30 flex flex-col sm:flex-row justify-between items-center z-10 gap-2 sm:gap-0">
                <div className="flex items-center gap-2 md:gap-4">
                    <h1 className="text-xl md:text-2xl font-bold text-amber-400 font-title">{character.name}</h1>
                    <span className="text-stone-400 text-sm md:text-base">Nivel {character.level} {character.characterClass}</span>
                </div>
                <div>
                     <button onClick={() => setIsMapOpen(true)} className="px-3 py-1 md:px-4 md:py-2 bg-slate-700 hover:bg-slate-600 rounded-md mr-2 text-sm md:text-base">Mapa</button>
                     <button onClick={() => setIsSettingsOpen(true)} className="px-3 py-1 md:px-4 md:py-2 bg-slate-700 hover:bg-slate-600 rounded-md text-sm md:text-base">Ajustes</button>
                </div>
            </header>

            <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Left Panel - Story */}
                <div className="h-3/5 md:h-auto flex flex-col p-2 md:p-4 md:flex-1 overflow-hidden">
                    <div ref={storyLogRef} className="flex-1 bg-slate-800/50 rounded-lg p-4 overflow-y-auto mb-4 border border-slate-700 shadow-inner story-scrollbar">
                        {storyLog.slice(0, -1).map((line, index) => (
                             <p key={index} className={`mb-2 ${line.startsWith('>') ? 'text-amber-300 italic' : 'text-stone-300'}`}>{line}</p>
                        ))}
                         <p className="text-stone-200">{typedText}</p>
                    </div>
                    <form onSubmit={handleSubmit} className="flex gap-2 md:gap-4">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isLoading ? "El Dungeon Master está pensando..." : "¿Qué haces?"}
                            className="flex-1 bg-slate-800 text-stone-100 p-3 rounded-lg border-2 border-slate-700 focus:outline-none focus:border-purple-500"
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading || !input.trim()} className="px-6 py-3 bg-purple-700 text-stone-100 font-bold rounded-lg hover:bg-purple-600 disabled:bg-slate-600 disabled:cursor-not-allowed">Enviar</button>
                    </form>
                </div>

                {/* Right Panel - Stats & Actions */}
                <div className="h-2/5 md:h-auto w-full md:w-1/3 md:max-w-sm bg-slate-800/50 p-2 md:p-4 border-t-2 md:border-t-0 md:border-l-2 border-purple-500/30 overflow-y-auto flex flex-col gap-6 story-scrollbar">
                    <div>
                        <h2 className="text-xl font-bold text-amber-400 mb-3 font-title">Estadísticas</h2>
                        <div className="space-y-2">
                             <StatBar value={character.hp} maxValue={character.maxHp} colorClass="bg-red-600" label="HP" />
                             <StatBar value={character.mp} maxValue={character.maxMp} colorClass="bg-blue-600" label="MP" />
                        </div>
                    </div>
                    
                    {enemy && (
                        <div>
                            <h2 className="text-xl font-bold text-rose-500 mb-3 font-title animate-pulse">En Combate</h2>
                            <div className="bg-slate-900/50 p-3 rounded-lg">
                                <h3 className="font-bold text-lg">{enemy.name}</h3>
                                <p className="text-sm text-stone-400 mb-2">{enemy.description}</p>
                                <StatBar value={enemy.hp} maxValue={enemy.maxHp} colorClass="bg-rose-700" label="HP Enemigo"/>
                            </div>
                        </div>
                    )}

                    <div>
                        <h2 className="text-xl font-bold text-amber-400 mb-3 font-title">Habilidades</h2>
                        <div className="grid grid-cols-4 gap-2">
                            {character.skills.map((skill) => {
                                const Icon = SKILL_ICON_MAP[skill.iconName];
                                return (
                                <Tooltip key={skill.name} text={<><span className="font-bold">{skill.name}</span><br/>{skill.description}</>}>
                                    <button onClick={() => handleActionClick(`Uso la habilidad: ${skill.name}`)} className="p-2 aspect-square bg-slate-700 rounded-md hover:bg-purple-600 flex items-center justify-center">
                                        {Icon && <Icon className="w-8 h-8" />}
                                    </button>
                                </Tooltip>
                            )})}
                        </div>
                    </div>

                    {character.spells.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold text-amber-400 mb-3 font-title">Hechizos</h2>
                            <div className="flex flex-col gap-2">
                               {character.spells.map(spell => (
                                   <button key={spell.name} onClick={() => handleActionClick(`Lanzo el hechizo: ${spell.name}`)} className="text-left p-2 bg-slate-700 rounded-md hover:bg-purple-600">
                                       {spell.name} <span className="text-xs text-blue-400">({spell.cost} MP)</span>
                                    </button>
                               ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <h2 className="text-xl font-bold text-amber-400 mb-3 font-title">Inventario</h2>
                        <ul className="space-y-1 text-sm">
                            {character.inventory.map(item => (
                                <li key={item.name} className="flex justify-between p-1 bg-slate-900/50 rounded">
                                    <span>{item.name}</span>
                                    <span>x{item.quantity}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default GameUI;