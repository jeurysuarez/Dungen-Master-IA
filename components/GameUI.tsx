import React, { useState, useEffect, useRef } from 'react';
import { GameState, Item, Settings, Skill, Spell } from '../types';
import { sendMessageToDM, generateSpeech } from '../services/geminiService';
import { useTypingEffect } from '../hooks/useTypingEffect';
import { decode, decodeAudioData } from '../utils/audioUtils';
import Tooltip from './Tooltip';
import { SKILL_ICON_MAP, IconSpinner } from './Icons';
import SettingsModal from './SettingsModal';
import LootNotification from './LootNotification';
import MapModal from './MapModal';
import * as audioService from '../services/audioService';


interface GameUIProps {
    gameState: GameState;
    setGameState: React.Dispatch<React.SetStateAction<GameState | null>>;
    settings: Settings;
    onSettingsChange: (newSettings: Partial<Settings>) => void;
}

const AMBIENCE_CLASSES = ['ambience-cave', 'ambience-forest', 'ambience-battle', 'ambience-tavern'];

const GameUI: React.FC<GameUIProps> = ({ gameState, setGameState, settings, onSettingsChange }) => {
    const { character, enemy, storyLog } = gameState;
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const storyLogRef = useRef<HTMLDivElement>(null);
    const currentStoryText = storyLog[storyLog.length - 1] || '';
    
    const isLastError = currentStoryText.startsWith('[ERROR]');
    const textToType = isLastError ? currentStoryText.substring(7) : currentStoryText;
    const { typedText } = useTypingEffect(textToType, settings.textSpeed);

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [lootToShow, setLootToShow] = useState<Item[]>([]);
    const [animatedAction, setAnimatedAction] = useState<string | null>(null);
    const [isEnemyHit, setIsEnemyHit] = useState(false);
    
    // Audio state
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
    const prevEnemyHpRef = useRef<number | undefined>();

    useEffect(() => {
        if (storyLogRef.current) {
            storyLogRef.current.scrollTop = storyLogRef.current.scrollHeight;
        }
    }, [typedText]);

    // Dynamic Ambiance Effect
    useEffect(() => {
        // Remove any other ambiance classes before adding the new one
        AMBIENCE_CLASSES.forEach(c => document.body.classList.remove(c));
        if (gameState.ambience) {
            document.body.classList.add(`ambience-${gameState.ambience}`);
        }
    }, [gameState.ambience]);

    // Enemy hit animation effect
    useEffect(() => {
        if (enemy && prevEnemyHpRef.current !== undefined && enemy.hp < prevEnemyHpRef.current) {
            setIsEnemyHit(true);
            const timer = setTimeout(() => setIsEnemyHit(false), 300); // Duration matches animation
            return () => clearTimeout(timer);
        }
        prevEnemyHpRef.current = enemy?.hp;
    }, [enemy]);


    // TTS effect
    useEffect(() => {
        if (settings.ttsEnabled && textToType && !isLoading) {
            const playNarration = async () => {
                if (audioSourceRef.current) {
                    audioSourceRef.current.stop();
                }
                const audioContent = await generateSpeech(textToType);
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

    }, [textToType, settings.ttsEnabled, settings.volume, isLoading]);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const playerAction = input;
        setInput('');
        setIsLoading(true);
        audioService.playClick();

        const newStoryLog = [...storyLog, `> ${playerAction}`];
        setGameState(prev => prev ? { ...prev, storyLog: newStoryLog } : null);
        
        const response = await sendMessageToDM(playerAction, character, gameState.party, enemy, storyLog);

        setGameState(prev => {
            if (!prev) return null;
            
            let newCharacter = { ...prev.character };
            if (response.characterUpdate) {
                // By destructuring, we prevent accidental overwrites of complex arrays
                // like skills, spells, and inventory from the AI response.
                // We only apply the scalar updates that we expect from the schema.
                const { skills, spells, inventory, ...scalarUpdates } = response.characterUpdate;
                newCharacter = { ...newCharacter, ...scalarUpdates };
            }

            let newEnemy = prev.enemy;
            if (response.newEnemy) {
                newEnemy = response.newEnemy;
                audioService.playPlayerHit();
            } else if (response.removeEnemy) {
                newEnemy = null;
            }
            
            let newParty = prev.party;
            if (response.newPartyMembers && response.newPartyMembers.length > 0) {
                newParty = [...newParty, ...response.newPartyMembers];
            }

            if(response.loot && response.loot.length > 0) {
                setLootToShow(response.loot);
                audioService.playHeal();
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
            
            if (response.event === 'player-dead') {
                audioService.playPlayerHit();
            }
            if (response.event === 'level-up') {
                audioService.playHeal();
            }

            return {
                ...prev,
                character: newCharacter,
                enemy: newEnemy,
                party: newParty,
                ambience: response.ambience || prev.ambience,
                storyLog: [...newStoryLog, response.storyText],
            };
        });

        setIsLoading(false);
    };

    const handleAbilityClick = (ability: Skill | Spell, type: 'skill' | 'spell') => {
        if (isLoading) return;

        if (type === 'spell' && 'cost' in ability) {
            if (character.mp < ability.cost) return;
            audioService.playSpell();
        } else {
            audioService.playAttack();
        }

        setAnimatedAction(ability.name);
        setInput(`Uso ${type === 'skill' ? 'la habilidad' : 'el hechizo'}: ${ability.name}`);
        
        setTimeout(() => setAnimatedAction(null), 600);
    };

    const HealthBar = ({ current, max, colorClass }: { current: number; max: number; colorClass: string; }) => (
        <div className="w-full bg-slate-700 rounded-full h-2.5">
            <div className={`${colorClass} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${(current / max) * 100}%` }}></div>
        </div>
    );

    const renderStoryLog = (log: string[]) => {
        return log.map((text, index) => {
            const isPlayer = text.startsWith('>');
            const isError = text.startsWith('[ERROR]');
            const content = isError ? text.substring(7) : text;
            
            return (
                <p key={index} className={`mb-4 ${isPlayer ? 'text-purple-400 italic' : ''} ${isError ? 'text-red-400 font-semibold' : ''}`} dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }} />
            );
        });
    };

    return (
        <main className="min-h-screen bg-slate-950 text-stone-300 font-body p-2 sm:p-4 md:p-6 lg:p-8 flex flex-col md:flex-row gap-6">
            {isSettingsOpen && <SettingsModal settings={settings} onClose={() => setIsSettingsOpen(false)} onSettingsChange={onSettingsChange} />}
            {isMapOpen && gameState.map && <MapModal mapData={gameState.map} onClose={() => setIsMapOpen(false)} />}
            <LootNotification loot={lootToShow} onDismiss={() => setLootToShow([])} />
            
            {/* Left Column: Story & Input */}
            <div className="flex-1 flex flex-col h-[95vh] md:h-auto">
                <div ref={storyLogRef} className="flex-1 bg-slate-900/80 p-4 sm:p-6 rounded-t-lg overflow-y-auto story-scrollbar border-2 border-b-0 border-slate-800">
                    {renderStoryLog(storyLog.slice(0, -1))}
                    <p className={`animate-fadeIn ${isLastError ? 'text-red-400 font-semibold' : ''}`} dangerouslySetInnerHTML={{ __html: typedText.replace(/\n/g, '<br/>') }} />
                </div>
                <form onSubmit={handleSubmit} className="flex items-center bg-slate-800 p-2 rounded-b-lg border-2 border-t-0 border-slate-700">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isLoading ? "El DM está pensando..." : "¿Qué haces ahora?"}
                        className="flex-1 bg-transparent text-stone-100 p-2 focus:outline-none placeholder-stone-500"
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !input.trim()} className="w-24 h-11 flex items-center justify-center px-6 py-2 bg-purple-700 text-stone-100 font-bold rounded-lg hover:bg-purple-600 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
                        {isLoading ? <IconSpinner className="w-6 h-6" /> : 'Enviar'}
                    </button>
                </form>
            </div>

            {/* Right Column: Character Stats, Inventory, etc. */}
            <div className="w-full md:w-1/3 lg:w-1/4 space-y-4">
                 {/* Character Info */}
                <div className={`bg-slate-800/50 p-4 rounded-lg border-2 border-transparent transition-colors ${character.hp / character.maxHp < 0.25 ? 'animate-pulse-border' : ''}`}>
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="font-title text-2xl text-amber-400">{character.name}</h2>
                            <p className="text-stone-400">Nivel {character.level} {character.characterClass} {character.race}</p>
                        </div>
                        <div className="flex gap-1">
                            {gameState.map && (<button onClick={() => setIsMapOpen(true)} className="p-2 rounded-full hover:bg-slate-700/50 transition-colors">🗺️</button>)}
                            <button onClick={() => setIsSettingsOpen(true)} className="p-2 rounded-full hover:bg-slate-700/50 transition-colors">⚙️</button>
                        </div>
                    </div>
                    <div className="mt-4 space-y-3">
                        <div>
                            <div className="flex justify-between text-sm mb-1"><span>HP</span><span>{character.hp} / {character.maxHp}</span></div>
                            <HealthBar current={character.hp} max={character.maxHp} colorClass="bg-red-500" />
                        </div>
                        {character.maxMp > 0 && (
                            <div>
                                <div className="flex justify-between text-sm mb-1"><span>MP</span><span>{character.mp} / {character.maxMp}</span></div>
                                <HealthBar current={character.mp} max={character.maxMp} colorClass="bg-blue-500" />
                            </div>
                        )}
                        <div>
                            <div className="flex justify-between text-sm mb-1"><span>XP</span><span>{character.xp} / {character.xpToNextLevel}</span></div>
                            <HealthBar current={character.xp} max={character.xpToNextLevel} colorClass="bg-yellow-500" />
                        </div>
                    </div>
                </div>

                {/* Enemy Info */}
                {enemy && (
                    <div className={`bg-slate-800/50 p-4 rounded-lg border-2 border-red-500/30 animate-pulse-border ${isEnemyHit ? 'animate-enemy-hit' : ''}`}>
                        <h3 className="font-title text-xl text-red-400">{enemy.name}</h3>
                        <p className="text-stone-400 text-sm italic mb-2">{enemy.description}</p>
                        <div className="flex justify-between text-sm mb-1"><span>HP</span><span>{enemy.hp} / {enemy.maxHp}</span></div>
                        <HealthBar current={enemy.hp} max={enemy.maxHp} colorClass="bg-red-500" />
                    </div>
                )}
                
                {/* Party Info */}
                {gameState.party.length > 0 && (
                    <div className="bg-slate-800/50 p-4 rounded-lg">
                        <h3 className="font-title text-xl text-amber-400 mb-3">Grupo</h3>
                        <div className="space-y-3">
                            {gameState.party.map(ally => (
                                <div key={ally.name}>
                                    <p className="font-bold text-stone-300">{ally.name} <span className="text-sm font-normal text-stone-400">({ally.characterClass})</span></p>
                                    <div className="flex justify-between text-sm mb-1"><span>HP</span><span>{ally.hp} / {ally.maxHp}</span></div>
                                    <HealthBar current={ally.hp} max={ally.maxHp} colorClass="bg-green-500" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Inventory */}
                <div className="bg-slate-800/50 p-4 rounded-lg">
                    <h3 className="font-title text-xl text-amber-400 mb-2">Inventario</h3>
                    {character.inventory.length > 0 ? (
                        <div className="space-y-1">
                            {character.inventory.map((item) => (
                                <Tooltip key={item.name} text={
                                    <div className="text-left">
                                        <h4 className="font-bold text-stone-100">{item.name}</h4>
                                        <p className="text-sm text-stone-300">{item.description}</p>
                                    </div>
                                }>
                                    <button onClick={() => setInput(`Uso ${item.name}`)} className="flex justify-between w-full p-1 text-left rounded hover:bg-slate-700/50 transition-colors">
                                        <span className="text-stone-300">{item.name}</span>
                                        <span className="text-stone-400 font-mono">x{item.quantity}</span>
                                    </button>
                                </Tooltip>
                            ))}
                        </div>
                    ) : (
                        <p className="text-stone-500 italic">Vacío</p>
                    )}
                </div>

                {/* Skills & Spells */}
                <div className="bg-slate-800/50 p-4 rounded-lg">
                    <h3 className="font-title text-xl text-amber-400 mb-3">Habilidades y Hechizos</h3>
                    <div className="grid grid-cols-3 gap-2">
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
                                    <button onClick={() => handleAbilityClick(skill, 'skill')} disabled={isLoading} className={`relative p-3 rounded-lg border-2 border-slate-700 hover:bg-slate-700/50 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isAnimating ? 'animate-skill-cast' : ''}`}>
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
                                    <button onClick={() => handleAbilityClick(spell, 'spell')} disabled={isLoading || !hasEnoughMana} className={`relative p-3 rounded-lg border-2 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isAnimating ? 'animate-skill-cast' : ''} ${hasEnoughMana ? 'border-purple-700 hover:bg-purple-900/50' : 'border-slate-700'}`}>
                                        <span className={`text-3xl font-bold ${hasEnoughMana ? 'text-purple-400' : 'text-slate-500'}`}>✨</span>
                                    </button>
                                </Tooltip>
                            );
                        })}
                    </div>
                </div>

            </div>
        </main>
    );
};

export default GameUI;