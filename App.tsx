// Fix: Added content for the main App component to manage game state and UI flow.
import React, { useState, useEffect } from 'react';
import TitleScreen from './components/TitleScreen';
import CharacterCreation from './components/CharacterCreation';
import GameUI from './components/GameUI';
import { GameState, Character, Enemy, Ally, DMResponse, SavedGame, Settings } from './types';
import { sendMessageToDM, generateSpeech } from './services/geminiService';
import { decode, decodeAudioData } from './utils/audioUtils';
import { setVolume } from './services/audioService';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>(GameState.TITLE);
    const [character, setCharacter] = useState<Character | null>(null);
    const [enemy, setEnemy] = useState<Enemy | null>(null);
    const [party, setParty] = useState<Ally[]>([]);
    const [storyLog, setStoryLog] = useState<string[]>([]);
    const [isDMThinking, setIsDMThinking] = useState(false);
    const [isInCombat, setIsInCombat] = useState(false);
    const [hasSavedGame, setHasSavedGame] = useState(false);
    const [audioQueue, setAudioQueue] = useState<string[]>([]);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

    const [settings, setSettings] = useState<Settings>({
        ttsEnabled: false,
        volume: 0.7,
        textSpeed: 50,
    });

    useEffect(() => {
        const savedGame = localStorage.getItem('dungeon-master-ia-save');
        setHasSavedGame(!!savedGame);
    }, []);

    useEffect(() => {
        setVolume(settings.volume);
    }, [settings.volume]);

     useEffect(() => {
        if (!audioContext) {
             try {
                const context = new (window.AudioContext || (window as any).webkitAudioContext)();
                setAudioContext(context);
            } catch (e) {
                console.error("Web Audio API is not supported in this browser.");
            }
        }
    }, [audioContext]);
    
    useEffect(() => {
        if (audioQueue.length > 0 && !isPlayingAudio && settings.ttsEnabled && audioContext) {
            playNextInQueue();
        }
    }, [audioQueue, isPlayingAudio, settings.ttsEnabled, audioContext]);

    const playNextInQueue = async () => {
        if (audioQueue.length === 0 || !audioContext) return;

        setIsPlayingAudio(true);
        const base64Audio = audioQueue[0];
        
        try {
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }
            const audioBuffer = await decodeAudioData(decode(base64Audio), audioContext, 24000, 1);
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            source.start();
            source.onended = () => {
                setAudioQueue(prev => prev.slice(1));
                setIsPlayingAudio(false);
            };
        } catch (error) {
            console.error("Error playing audio:", error);
            setAudioQueue(prev => prev.slice(1)); // Skip corrupted audio data
            setIsPlayingAudio(false);
        }
    };
    
    const saveGame = (char: Character, log: string[], combat: boolean, enmy: Enemy | null, pty: Ally[]) => {
        const gameToSave: SavedGame = {
            character: char,
            storyLog: log,
            isInCombat: combat,
            enemy: enmy,
            party: pty,
            settings: settings
        };
        localStorage.setItem('dungeon-master-ia-save', JSON.stringify(gameToSave));
        setHasSavedGame(true);
    };

    const loadGame = () => {
        const savedGameJSON = localStorage.getItem('dungeon-master-ia-save');
        if (savedGameJSON) {
            const savedGame: SavedGame = JSON.parse(savedGameJSON);
            setCharacter(savedGame.character);
            setStoryLog(savedGame.storyLog);
            setIsInCombat(savedGame.isInCombat);
            setEnemy(savedGame.enemy);
            setParty(savedGame.party);
            if(savedGame.settings) setSettings(savedGame.settings);
            setGameState(GameState.PLAYING);
        }
    };
    
    const startNewGame = () => {
        localStorage.removeItem('dungeon-master-ia-save');
        setGameState(GameState.CHARACTER_CREATION);
        setCharacter(null);
        setEnemy(null);
        setParty([]);
        setStoryLog([]);
        setIsDMThinking(false);
        setIsInCombat(false);
    };

    const handleCharacterCreation = async (newCharacter: Character) => {
        setCharacter(newCharacter);
        setGameState(GameState.PLAYING);
        setStoryLog([]);
        const initialPrompt = `Comienza la aventura para ${newCharacter.name}, el ${newCharacter.race} ${newCharacter.characterClass}. Describe la escena inicial de forma evocadora.`;
        await handlePlayerAction(initialPrompt, newCharacter, [], null, []);
    };
    
    const processDMResponse = async (response: DMResponse, currentCharacter: Character, currentParty: Ally[], currentEnemy: Enemy | null, currentLog: string[]) => {
        let newCharacterState = { ...currentCharacter };
        let newPartyState = [...currentParty];
        let newEnemyState = currentEnemy ? { ...currentEnemy } : null;
        let combatOver = response.combatOver || false;
        let newLog = [...currentLog];
        
        if (response.storyText) {
            newLog.push(response.storyText);
            setStoryLog(newLog);
            if (settings.ttsEnabled) {
                const audioData = await generateSpeech(response.storyText.replace(/<[^>]*>?/gm, '')); // Strip HTML for TTS
                if (audioData) {
                    setAudioQueue(prev => [...prev, audioData]);
                }
            }
        }
        
        if (response.encounter) {
            newEnemyState = response.encounter;
            setIsInCombat(true);
        }

        if (response.playerUpdate) {
            newCharacterState.hp = response.playerUpdate.hp ?? newCharacterState.hp;
            newCharacterState.mp = response.playerUpdate.mp ?? newCharacterState.mp;
        }

        if (response.enemyUpdate && newEnemyState) {
            newEnemyState.hp = response.enemyUpdate.hp ?? newEnemyState.hp;
        }
        
        if (combatOver && newEnemyState?.hp <= 0) {
            newEnemyState = null;
            setIsInCombat(false);
        }
        
        if (response.xpAward) {
            newCharacterState.xp += response.xpAward;
            // TODO: Add level up logic
        }

        setCharacter(newCharacterState);
        setParty(newPartyState);
        setEnemy(newEnemyState);

        return { finalChar: newCharacterState, finalParty: newPartyState, finalEnemy: newEnemyState, finalCombat: !combatOver && isInCombat, finalLog: newLog };
    };

    const handlePlayerAction = async (action: string, char?: Character, pty?: Ally[], enmy?: Enemy | null, log?: string[]) => {
        const currentCharacter = char || character;
        const currentParty = pty || party;
        const currentEnemy = enmy || enemy;
        const currentLog = log || storyLog;

        if (!currentCharacter) return;

        const actionLog = [...currentLog, `<i class="text-amber-300">> ${action}</i>`];
        setStoryLog(actionLog);
        setIsDMThinking(true);

        const response = await sendMessageToDM(action, currentCharacter, currentParty, currentEnemy, actionLog);
        
        const { finalChar, finalParty, finalEnemy, finalCombat, finalLog } = await processDMResponse(response, currentCharacter, currentParty, currentEnemy, actionLog);

        setIsDMThinking(false);
        saveGame(finalChar, finalLog, finalCombat, finalEnemy, finalParty);
    };

    const handleSettingsChange = (newSettings: Partial<Settings>) => {
        setSettings(prev => ({...prev, ...newSettings}));
    }

    const renderGame = () => {
        switch (gameState) {
            case GameState.TITLE:
                return <TitleScreen onStartNew={startNewGame} onContinue={loadGame} hasSavedGame={hasSavedGame} />;
            case GameState.CHARACTER_CREATION:
                return <CharacterCreation onCharacterCreate={handleCharacterCreation} />;
            case GameState.PLAYING:
                if (!character) return <div className="flex items-center justify-center min-h-screen bg-slate-900 text-stone-200">Cargando personaje...</div>;
                return <GameUI 
                    character={character}
                    enemy={enemy}
                    party={party}
                    storyLog={storyLog}
                    isDMThinking={isDMThinking}
                    onPlayerAction={(action) => handlePlayerAction(action)}
                    settings={settings}
                    onSettingsChange={handleSettingsChange}
                />;
            default:
                return <div className="flex items-center justify-center min-h-screen bg-slate-900 text-stone-200">Estado de juego desconocido</div>;
        }
    };

    return <div className="App">{renderGame()}</div>;
};

export default App;