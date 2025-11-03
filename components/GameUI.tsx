import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Character, Enemy, Ally, Item, Skill, Spell, DMResponse, Settings } from '../types';
import { sendMessageToDM, generateSpeech } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils/audioUtils';
import { IconSettings, IconUser, IconTarget, IconBackpack, IconSword, IconSparkles, IconScroll, SKILL_ICON_MAP } from './Icons';
import Tooltip from './Tooltip';
import SettingsModal from './SettingsModal';
import LootNotification from './LootNotification';
import { useTypingEffect } from '../hooks/useTypingEffect';

interface GameUIProps {
    character: Character;
    setCharacter: React.Dispatch<React.SetStateAction<Character | null>>;
    storyLog: string[];
    setStoryLog: React.Dispatch<React.SetStateAction<string[]>>;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    isInCombat: boolean;
    setIsInCombat: React.Dispatch<React.SetStateAction<boolean>>;
    enemy: Enemy | null;
    setEnemy: React.Dispatch<React.SetStateAction<Enemy | null>>;
    party: Ally[];
    setParty: React.Dispatch<React.SetStateAction<Ally[]>>;
    loot: Item[];
    setLoot: React.Dispatch<React.SetStateAction<Item[]>>;
    settings: Settings;
    onSettingsChange: (newSettings: Partial<Settings>) => void;
    saveGame: () => void;
}

const GameUI: React.FC<GameUIProps> = ({
    character, setCharacter, storyLog, setStoryLog, isLoading, setIsLoading,
    isInCombat, setIsInCombat, enemy, setEnemy, party, setParty, loot, setLoot,
    settings, onSettingsChange, saveGame
}) => {
    const [input, setInput] = useState('');
    const [activeTab, setActiveTab] = useState<'skills' | 'inventory' | 'spells'>('skills');
    const [showSettings, setShowSettings] = useState(false);
    const storyEndRef = useRef<HTMLDivElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const currentAudioSource = useRef<AudioBufferSourceNode | null>(null);

    const latestStoryText = storyLog[storyLog.length - 1] || '';
    const { typedText } = useTypingEffect(latestStoryText, settings.textSpeed);
    
    useEffect(() => {
        if (!audioContextRef.current && typeof window !== 'undefined') {
            try {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            } catch (e) {
                console.error("Web Audio API is not supported in this browser.");
            }
        }
    }, []);

    const playAudio = useCallback(async (base64Audio: string) => {
        if (!audioContextRef.current || !base64Audio) return;

        if (currentAudioSource.current) {
            currentAudioSource.current.stop();
        }

        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') {
            await ctx.resume();
        }

        try {
            const audioBytes = decode(base64Audio);
            const audioBuffer = await decodeAudioData(audioBytes, ctx, 24000, 1);
            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(ctx.destination);
            source.start();
            currentAudioSource.current = source;
        } catch (error) {
            console.error("Error playing TTS audio:", error);
        }
    }, []);

    const processResponse = useCallback((res: DMResponse) => {
        if (!character) return;

        let newStory = res.storyText || "El Dungeon Master se queda en silencio...";
        setStoryLog(prev => [...prev.slice(0, -1), prev[prev.length - 1] + `\n\n${newStory}`]);
        
        if (settings.ttsEnabled && newStory) {
            generateSpeech(newStory).then(audio => {
                if (audio) playAudio(audio);
            });
        }

        let newChar = { ...character };
        if (res.playerUpdate) {
            newChar.hp = res.playerUpdate.hp ?? newChar.hp;
            newChar.mp = res.playerUpdate.mp ?? newChar.mp;
        }
        if (res.encounter) {
            setEnemy(res.encounter);
            setIsInCombat(true);
        }
        if (res.enemyUpdate && enemy) {
            setEnemy(prev => prev ? { ...prev, hp: res.enemyUpdate!.hp! } : null);
        }
        if(res.combatOver) {
            setIsInCombat(false);
            setEnemy(null);
        }
        if (res.xpAward) {
            newChar.xp += res.xpAward;
             // Handle level up
            if (newChar.xp >= newChar.xpToNextLevel) {
                 newChar.level += 1;
                 newChar.xp = newChar.xp - newChar.xpToNextLevel;
                 // xpToNextLevel should be updated based on a curve
            }
        }
        if(res.loot && res.loot.length > 0) {
            setLoot(res.loot);
            const newInventory = [...newChar.inventory];
            res.loot.forEach(newItem => {
                const existingItem = newInventory.find(i => i.name === newItem.name);
                if (existingItem) {
                    existingItem.quantity += newItem.quantity;
                } else {
                    newInventory.push(newItem);
                }
            });
            newChar.inventory = newInventory;
        }
        if (res.newAlly) {
            setParty(prev => [...prev, res.newAlly!]);
        }
        
        setCharacter(newChar);

    }, [character, setCharacter, setStoryLog, settings.ttsEnabled, playAudio, setIsInCombat, setEnemy, setParty, setLoot, enemy]);
    
    useEffect(() => {
        // Initial message from DM
        if (storyLog.length === 1 && character?.name) {
            handleSend(`Soy ${character.name}. ¿Dónde estoy y qué veo a mi alrededor?`);
        }
    }, [character?.name]);

    useEffect(() => {
        storyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        saveGame();
    }, [storyLog, typedText, saveGame]);

    const handleSend = async (message: string) => {
        if (!message.trim() || isLoading || !character) return;
        
        const userMessage = `> ${message}`;
        setStoryLog(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await sendMessageToDM(message, character, party, enemy, storyLog);
            processResponse(res);
        } catch (error) {
            console.error(error);
            setStoryLog(prev => [...prev, "Hubo un error de conexión con el Dungeon Master."]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSend(input);
    };

    if (!character) return <div>Cargando personaje...</div>;

    const renderStatBar = (value: number, maxValue: number, color: string, label: string) => (
        <div className="w-full bg-slate-700 rounded-full h-5 relative overflow-hidden border border-slate-600">
            <div className={`h-full rounded-full ${color}`} style={{ width: `${(value / maxValue) * 100}%` }}></div>
            <span className="absolute inset-0 w-full h-full text-center text-xs font-bold text-white flex items-center justify-center">{label}: {value}/{maxValue}</span>
        </div>
    );
    
    const renderContent = () => {
        switch (activeTab) {
            case 'inventory':
                return character.inventory.map((item, i) => (
                    <Tooltip key={i} text={<div><p className="font-bold">{item.name}</p><p>{item.description}</p></div>}>
                        <div className="p-2 bg-slate-800 rounded text-sm cursor-default">{item.name} (x{item.quantity})</div>
                    </Tooltip>
                ));
            case 'spells':
                 return character.spells.map((spell, i) => (
                    <Tooltip key={i} text={<div><p className="font-bold">{spell.name}</p><p>Coste: {spell.cost} PM</p><p>{spell.description}</p></div>}>
                        <button onClick={() => handleSend(`Uso el hechizo ${spell.name}.`)} className="p-2 bg-slate-800 hover:bg-purple-800 rounded text-sm w-full text-left">{spell.name}</button>
                    </Tooltip>
                ));
            case 'skills':
            default:
                return character.skills.map((skill, i) => {
                    const IconComponent = SKILL_ICON_MAP[skill.iconName];
                    return (
                        <Tooltip key={i} text={<div><p className="font-bold">{skill.name}</p><p>Enfriamiento: {skill.cooldown} turnos</p><p>{skill.description}</p></div>}>
                            <button onClick={() => handleSend(`Uso mi habilidad ${skill.name}.`)} className="p-2 bg-slate-800 hover:bg-purple-800 rounded text-sm w-full text-left flex items-center gap-2">
                               <span className="w-5 h-5 text-amber-400">{IconComponent && <IconComponent />}</span> {skill.name}
                            </button>
                        </Tooltip>
                    );
                });
        }
    };
    
    return (
        <div className="flex flex-col md:flex-row h-screen bg-slate-900 text-stone-200 font-body">
            {showSettings && <SettingsModal settings={settings} onClose={() => setShowSettings(false)} onSettingsChange={onSettingsChange} />}
            <LootNotification loot={loot} onDismiss={() => setLoot([])} />
            
            {/* Left Panel - Player & Party */}
            <div className="w-full md:w-1/4 bg-slate-950 p-4 flex flex-col space-y-4 overflow-y-auto border-r-2 border-slate-800">
                 {/* Character Info */}
                <div className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/30">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-2xl font-bold text-amber-400 font-title">{character.name}</h2>
                        <button onClick={() => setShowSettings(true)} className="text-slate-400 hover:text-white"><IconSettings className="w-6 h-6"/></button>
                    </div>
                    <p className="text-stone-400">{character.race} {character.characterClass} - Nivel {character.level}</p>
                    <div className="space-y-2 mt-3">
                        {renderStatBar(character.hp, character.maxHp, 'bg-red-600', 'PS')}
                        {renderStatBar(character.mp, character.maxMp, 'bg-blue-600', 'PM')}
                    </div>
                </div>

                {/* Enemy Info */}
                {isInCombat && enemy && (
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-red-500/30 animate-pulse-border">
                        <h3 className="text-xl font-bold text-red-400 font-title flex items-center gap-2"><IconTarget/> Enemigo: {enemy.name}</h3>
                         <p className="text-stone-400 text-sm mt-2 italic">{enemy.description}</p>
                        <div className="mt-3">
                            {renderStatBar(enemy.hp, enemy.maxHp, 'bg-red-700', 'PS')}
                        </div>
                    </div>
                )}

                 {/* Actions / Inventory */}
                <div className="bg-slate-800/50 p-4 rounded-lg flex-grow flex flex-col">
                    <div className="flex border-b border-slate-700 mb-2">
                        <button onClick={() => setActiveTab('skills')} className={`flex-1 p-2 font-bold ${activeTab === 'skills' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-stone-400'}`}><IconSparkles className="inline w-5 h-5 mr-1"/></button>
                        <button onClick={() => setActiveTab('inventory')} className={`flex-1 p-2 font-bold ${activeTab === 'inventory' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-stone-400'}`}><IconBackpack className="inline w-5 h-5 mr-1"/></button>
                        <button onClick={() => setActiveTab('spells')} className={`flex-1 p-2 font-bold ${activeTab === 'spells' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-stone-400'}`}><IconScroll className="inline w-5 h-5 mr-1"/></button>
                    </div>
                    <div className="flex-grow overflow-y-auto space-y-2 pr-2">
                        {renderContent()}
                    </div>
                </div>
            </div>

            {/* Right Panel - Story & Input */}
            <div className="w-full md:w-3/4 flex flex-col h-full p-4">
                <div id="story-log" className="flex-grow bg-slate-800/30 rounded-lg p-6 mb-4 overflow-y-auto font-serif text-lg leading-relaxed story-scrollbar">
                    {storyLog.slice(0, -1).map((text, i) => (
                        <p key={i} className="whitespace-pre-wrap mb-4" dangerouslySetInnerHTML={{ __html: text.startsWith('>') ? `<i class="text-stone-400">${text}</i>` : text }}></p>
                    ))}
                    <p className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: typedText.startsWith('>') ? `<i class="text-stone-400">${typedText}</i>` : typedText }}></p>
                    <div ref={storyEndRef} />
                </div>
                <form onSubmit={handleSubmit} className="flex space-x-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isLoading ? "El Dungeon Master está pensando..." : "¿Qué haces ahora?"}
                        disabled={isLoading}
                        className="flex-grow bg-slate-800 text-stone-100 p-4 rounded-lg border-2 border-slate-700 focus:outline-none focus:border-purple-500 text-lg"
                        autoFocus
                    />
                    <button type="submit" disabled={isLoading} className="px-8 py-4 bg-purple-700 text-stone-100 font-bold rounded-lg hover:bg-purple-600 disabled:bg-slate-600 disabled:cursor-wait">
                        Enviar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GameUI;