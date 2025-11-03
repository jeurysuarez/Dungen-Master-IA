import React, { useState, useEffect, useRef } from 'react';
import { Character, Enemy, Ally, Settings } from '../types';
import { useTypingEffect } from '../hooks/useTypingEffect';
import Tooltip from './Tooltip';
import SettingsModal from './SettingsModal';
import { generateSpeech } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils/audioUtils';
import * as sound from '../services/audioService';
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

const GameUI: React.FC<GameUIProps> = ({ character, enemy, party, storyLog, isLoading, isInCombat, onSendAction, settings, onSettingsChange, onManualSave, onManualLoad, toastMessage }) => {
    const [input, setInput] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const storyLogRef = useRef<HTMLDivElement>(null);
    const lastStoryText = storyLog[storyLog.length - 1] || '';
    const { typedText } = useTypingEffect(lastStoryText.startsWith('>') ? '' : lastStoryText, settings.textSpeed);

    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

    useEffect(() => {
        if (storyLogRef.current) {
            storyLogRef.current.scrollTop = storyLogRef.current.scrollHeight;
        }
    }, [typedText, storyLog]);

    useEffect(() => {
        if (settings.ttsEnabled && lastStoryText && !lastStoryText.startsWith('>') && !isLoading) {
            const playNarration = async () => {
                if (audioSourceRef.current) {
                    audioSourceRef.current.stop();
                }
                const audioData = await generateSpeech(lastStoryText);
                if (audioData) {
                    if (!audioContextRef.current) {
                        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                    }
                    const ctx = audioContextRef.current;
                    if (ctx.state === 'suspended') {
                       await ctx.resume();
                    }
                    const decoded = decode(audioData);
                    const buffer = await decodeAudioData(decoded, ctx, 24000, 1);
                    const source = ctx.createBufferSource();
                    source.buffer = buffer;
                    source.connect(ctx.destination);
                    source.start();
                    audioSourceRef.current = source;
                }
            };
            playNarration();
        }

        return () => {
            if (audioSourceRef.current) {
                try {
                   audioSourceRef.current.stop();
                } catch(e) {}
            }
        };

    }, [lastStoryText, settings.ttsEnabled, isLoading]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSendAction(input.trim());
            setInput('');
        }
    };
    
    const handleActionClick = (action: string) => {
        if (!isLoading) {
           onSendAction(action);
        }
    };
    
    const getHealthColor = (hp: number, maxHp: number) => {
        const percentage = (hp / maxHp) * 100;
        if (percentage > 60) return 'bg-green-600';
        if (percentage > 30) return 'bg-yellow-600';
        return 'bg-red-600';
    };

    const renderBar = (value: number, maxValue: number, colorClass: string) => (
        <div className="w-full bg-gray-700 rounded-full h-4 border border-black/20 overflow-hidden relative">
            <div className={`${colorClass} h-full rounded-full transition-all duration-500`} style={{ width: `${Math.max(0, (value / maxValue)) * 100}%` }}></div>
             <span className="absolute inset-0 text-center text-xs font-bold text-white leading-4" style={{textShadow: '1px 1px 2px black'}}>{value} / {maxValue}</span>
        </div>
    );
    
    const ActionButton: React.FC<{action: () => void, text: string, tooltip: string, soundEffect: () => void, disabled?: boolean}> = ({action, text, tooltip, soundEffect, disabled=false}) => (
        <Tooltip text={tooltip}>
            <button
                onClick={() => { action(); soundEffect(); }}
                disabled={isLoading || disabled}
                className="flex-1 py-2 px-4 bg-gray-700 hover:bg-yellow-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed rounded-md transition-colors text-white font-semibold"
            >
                {text}
            </button>
        </Tooltip>
    );

    return (
        <div className="relative flex flex-col h-screen bg-gray-900 text-white font-body" style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/dark-denim-3.png)' }}>
            {toastMessage && (
                <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-yellow-500 text-gray-900 font-bold px-6 py-2 rounded-lg shadow-lg z-50 animate-fadeIn">
                    {toastMessage}
                </div>
            )}

            {showSettings && <SettingsModal settings={settings} onClose={() => setShowSettings(false)} onSettingsChange={onSettingsChange} />}
            
            <header className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-black/30 shadow-lg border-b border-yellow-400/20">
                <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                    <h3 className="text-xl font-bold text-yellow-400">{character.name} <span className="text-sm text-gray-400">Nvl {character.level} ({character.xp}/{character.xpToNextLevel} XP)</span></h3>
                    <p className="text-sm text-gray-300">{character.race} {character.characterClass}</p>
                    <div className="mt-2">{renderBar(character.hp, character.maxHp, getHealthColor(character.hp, character.maxHp))}</div>
                    <div className="mt-1">{renderBar(character.mp, character.maxMp, 'bg-blue-600')}</div>
                </div>

                <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                     <h3 className="text-xl font-bold text-center text-yellow-400 mb-2">Grupo</h3>
                     {party.length > 0 ? party.map(ally => (
                         <div key={ally.name} className="mt-1">
                             <span className="text-sm">{ally.name} ({ally.characterClass})</span>
                              <div className="">{renderBar(ally.hp, ally.maxHp, getHealthColor(ally.hp, ally.maxHp))}</div>
                         </div>
                     )) : <p className="text-center text-gray-500">Estás solo.</p>}
                </div>

                <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                    {enemy && isInCombat ? (
                        <>
                           <h3 className="text-xl font-bold text-red-500">{enemy.name}</h3>
                           <p className="text-sm text-gray-400 italic h-10 overflow-y-auto">{enemy.description}</p>
                           <div className="mt-2">{renderBar(enemy.hp, enemy.maxHp, getHealthColor(enemy.hp, enemy.maxHp))}</div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                           <p className="text-gray-500">Todo tranquilo...</p>
                        </div>
                    )}
                </div>

                 <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 flex items-center justify-center gap-4">
                    <Tooltip text="Guardar Partida">
                        <button onClick={() => { onManualSave(); sound.playClick(); }} className="p-3 bg-gray-700 rounded-full hover:bg-yellow-600 transition-colors">
                            <IconSave className="w-6 h-6" />
                        </button>
                    </Tooltip>
                     <Tooltip text="Cargar Partida">
                        <button onClick={() => { onManualLoad(); sound.playClick(); }} className="p-3 bg-gray-700 rounded-full hover:bg-yellow-600 transition-colors">
                            <IconLoad className="w-6 h-6" />
                        </button>
                    </Tooltip>
                     <Tooltip text="Ajustes">
                        <button onClick={() => { setShowSettings(true); sound.playClick(); }} className="p-3 bg-gray-700 rounded-full hover:bg-yellow-600 transition-colors">
                            <IconGear className="w-6 h-6" />
                        </button>
                    </Tooltip>
                </div>
            </header>

            <main className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 overflow-hidden">
                <div ref={storyLogRef} className="lg:col-span-3 bg-black/50 p-4 rounded-lg border border-gray-700 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                    {storyLog.slice(0, -1).map((text, index) => (
                         <p key={index} className={`mb-4 ${text.startsWith('>') ? 'text-yellow-300 italic' : 'text-gray-300'}`}>{text.startsWith('>') ? text : <span dangerouslySetInnerHTML={{__html: text.replace(/\n/g, '<br />')}} />}</p>
                    ))}
                     <p className={`mb-4 ${lastStoryText.startsWith('>') ? 'text-yellow-300 italic' : 'text-gray-300'}`}>{lastStoryText.startsWith('>') ? typedText : <span dangerouslySetInnerHTML={{__html: typedText.replace(/\n/g, '<br />')}} />}</p>
                    {isLoading && <div className="animate-pulse text-yellow-400">El Dungeon Master está pensando...</div>}
                </div>

                <div className="flex flex-col gap-4 bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h3 className="text-xl font-bold text-center text-yellow-400">Acciones de Combate</h3>
                     <div className="flex flex-col gap-2">
                         <ActionButton action={() => handleActionClick(`Ataco a ${enemy?.name} con mi arma.`)} text="Atacar" tooltip={`Descripción: Un ataque básico con tu arma. | Tirada de Ataque: 1d20 + ${character.attackBonus}`} soundEffect={sound.playAttack} disabled={!isInCombat}/>
                        
                        {character.spells.map(spell => (
                            <ActionButton key={spell.name} action={() => handleActionClick(`Lanzo ${spell.name} a ${enemy?.name || 'un objetivo'}.`)} text={spell.name} tooltip={`Descripción: ${spell.description} | Coste: ${spell.cost} PM`} soundEffect={sound.playSpell} disabled={!isInCombat || character.mp < spell.cost}/>
                        ))}
                         {character.skills.map(skill => (
                            <ActionButton key={skill.name} action={() => handleActionClick(`Uso mi habilidad ${skill.name}.`)} text={skill.name} tooltip={`Descripción: ${skill.description} | Enfriamiento: ${skill.cooldown} turnos`} soundEffect={sound.playHeal} disabled={!isInCombat}/>
                        ))}
                     </div>
                </div>
            </main>

            <footer className="p-4 bg-black/30 shadow-inner border-t border-yellow-400/20">
                <form onSubmit={handleSubmit} className="flex gap-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="¿Qué haces?"
                        disabled={isLoading}
                        className="flex-1 p-3 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-900"
                    />
                    <button type="submit" disabled={isLoading} className="px-6 py-3 bg-yellow-600 text-gray-900 font-bold rounded-lg shadow-lg hover:bg-yellow-500 transition-colors disabled:bg-yellow-800 disabled:text-gray-500">
                        Enviar
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default GameUI;