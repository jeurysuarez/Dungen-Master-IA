import React, { useState, useEffect, useRef } from 'react';
import { Item, Settings, Skill, Spell } from '../types';
import { sendMessageToDM, generateSpeech } from '../services/geminiService';
import { useTypingEffect } from '../hooks/useTypingEffect';
import { decode, decodeAudioData } from '../utils/audioUtils';
import { IconSpinner, IconUsers, IconSparkles, IconTreasureChest } from './Icons';
import SettingsModal from './SettingsModal';
import LootNotification from './LootNotification';
import MapModal from './MapModal';
import * as audioService from '../services/audioService';
import { useGame } from '../context/GameContext';
import CharacterPanel from './CharacterPanel';
import EnemyPanel from './EnemyPanel';
import PartyPanel from './PartyPanel';
import InventoryPanel from './InventoryPanel';
import ActionsPanel from './ActionsPanel';

interface GameUIProps {
    settings: Settings;
    onSettingsChange: (newSettings: Partial<Settings>) => void;
}

const AMBIENCE_CLASSES = ['ambience-cave', 'ambience-forest', 'ambience-battle', 'ambience-tavern'];

const GameUI: React.FC<GameUIProps> = ({ settings, onSettingsChange }) => {
    const { gameState, dispatch } = useGame();
    const { character, enemy, storyLog, map, party, ambience } = gameState!;
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
    const [activeMobileTab, setActiveMobileTab] = useState('estado');
    
    // Audio state
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

    useEffect(() => {
        const logEl = storyLogRef.current;
        if (logEl) {
            // Smart scroll: only scroll to bottom if user is already near the bottom
            const isScrolledNearBottom = logEl.scrollHeight - logEl.scrollTop <= logEl.clientHeight + 150;
            if (isScrolledNearBottom) {
                logEl.scrollTop = logEl.scrollHeight;
            }
        }
    }, [typedText]);

    useEffect(() => {
        AMBIENCE_CLASSES.forEach(c => document.body.classList.remove(c));
        if (ambience) {
            document.body.classList.add(`ambience-${ambience}`);
        }
    }, [ambience]);

    // TTS effect
    useEffect(() => {
        if (settings.ttsEnabled && textToType && !isLoading) {
            const playNarration = async () => {
                if (audioSourceRef.current) audioSourceRef.current.stop();
                const audioContent = await generateSpeech(textToType);
                if (audioContent) {
                    if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
                    const ctx = audioContextRef.current;
                    if (ctx.state === 'suspended') ctx.resume();
                    
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
        } else if (audioSourceRef.current) {
            audioSourceRef.current.stop();
        }
        return () => { if (audioSourceRef.current) audioSourceRef.current.stop(); };
    }, [textToType, settings.ttsEnabled, settings.volume, isLoading]);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const playerAction = input;
        setInput('');
        setIsLoading(true);
        audioService.playClick();

        const response = await sendMessageToDM(playerAction, character, party, enemy, storyLog);
        
        if (response.loot && response.loot.length > 0) {
            setLootToShow(response.loot);
            audioService.playHeal();
        }
        if (response.event === 'player-dead') audioService.playPlayerHit();
        if (response.event === 'level-up') audioService.playHeal();
        
        dispatch({ type: 'APPEND_STORY', payload: { playerAction, dmResponse: response }});
        setIsLoading(false);
    };
    
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
        <main className="min-h-screen bg-slate-950 text-stone-300 font-body p-2 sm:p-4 md:p-6 lg:p-8 flex flex-col md:flex-row gap-6 md:h-screen md:overflow-y-hidden">
            {isSettingsOpen && <SettingsModal settings={settings} onClose={() => setIsSettingsOpen(false)} onSettingsChange={onSettingsChange} />}
            {isMapOpen && map && <MapModal mapData={map} onClose={() => setIsMapOpen(false)} />}
            <LootNotification loot={lootToShow} onDismiss={() => setLootToShow([])} />
            
            <div className="flex-1 flex flex-col h-[95vh] md:h-full">
                <div ref={storyLogRef} className="flex-1 bg-slate-900/80 p-4 sm:p-6 rounded-t-lg overflow-y-auto story-scrollbar border-2 border-b-0 border-slate-800">
                    {renderStoryLog(storyLog.slice(0, -1))}
                    <p className={`animate-fadeIn ${isLastError ? 'text-red-400 font-semibold' : ''}`} dangerouslySetInnerHTML={{ __html: typedText.replace(/\n/g, '<br/>') }} />
                </div>
                <form onSubmit={handleSubmit} className="flex items-center bg-slate-800 p-2 rounded-b-lg border-2 border-t-0 border-slate-700">
                    <input
                        type="text" value={input} onChange={(e) => setInput(e.target.value)}
                        placeholder={isLoading ? "El DM está pensando..." : "¿Qué haces ahora?"}
                        className="flex-1 bg-transparent text-stone-100 p-2 focus:outline-none placeholder-stone-500"
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !input.trim()} className="w-24 h-11 flex items-center justify-center px-6 py-2 bg-purple-700 text-stone-100 font-bold rounded-lg hover:bg-purple-600 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
                        {isLoading ? <IconSpinner className="w-6 h-6" /> : 'Enviar'}
                    </button>
                </form>
            </div>

            <div className="w-full md:w-1/3 lg:w-1/4 md:h-full md:overflow-y-auto story-scrollbar">
                <div className="md:hidden flex justify-around p-1 mb-4 bg-slate-900 rounded-lg border border-slate-700 sticky top-2 z-10">
                    <button onClick={() => setActiveMobileTab('estado')} className={`flex-1 flex flex-col items-center p-2 rounded-md border border-transparent ${activeMobileTab === 'estado' ? 'mobile-tab-active' : ''}`}>
                        <IconUsers className="w-6 h-6 mb-1"/> <span className="text-xs">Estado</span>
                    </button>
                    <button onClick={() => setActiveMobileTab('acciones')} className={`flex-1 flex flex-col items-center p-2 rounded-md border border-transparent ${activeMobileTab === 'acciones' ? 'mobile-tab-active' : ''}`}>
                        <IconSparkles className="w-6 h-6 mb-1"/> <span className="text-xs">Acciones</span>
                    </button>
                     <button onClick={() => setActiveMobileTab('inventario')} className={`flex-1 flex flex-col items-center p-2 rounded-md border border-transparent ${activeMobileTab === 'inventario' ? 'mobile-tab-active' : ''}`}>
                        <IconTreasureChest className="w-6 h-6 mb-1"/> <span className="text-xs">Inventario</span>
                    </button>
                </div>
                
                <div className="hidden md:flex flex-col space-y-4">
                    <CharacterPanel onOpenMap={() => setIsMapOpen(true)} onOpenSettings={() => setIsSettingsOpen(true)} />
                    <EnemyPanel />
                    <PartyPanel />
                    <InventoryPanel setPlayerInput={setInput} />
                    <ActionsPanel setPlayerInput={setInput} isLoading={isLoading} />
                </div>

                <div className="md:hidden space-y-4">
                    {activeMobileTab === 'estado' && (
                        <div className="animate-fadeIn space-y-4">
                            <CharacterPanel onOpenMap={() => setIsMapOpen(true)} onOpenSettings={() => setIsSettingsOpen(true)} />
                            <EnemyPanel />
                            <PartyPanel />
                        </div>
                    )}
                     {activeMobileTab === 'acciones' && <div className="animate-fadeIn"><ActionsPanel setPlayerInput={setInput} isLoading={isLoading} /></div>}
                    {activeMobileTab === 'inventario' && <div className="animate-fadeIn"><InventoryPanel setPlayerInput={setInput} /></div>}
                </div>
            </div>
        </main>
    );
};

export default GameUI;
