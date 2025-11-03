import React, { useState, useEffect, useCallback } from 'react';
import TitleScreen from './components/TitleScreen';
import CharacterCreation from './components/CharacterCreation';
import GameUI from './components/GameUI';
import { GameState, Character, SavedGame, Settings, DMResponse, Enemy, Ally, Item } from './types';
import { startNewAdventure, sendMessageToDM } from './services/geminiService';
import * as audioService from './services/audioService';

const SAVE_GAME_KEY = 'dungeon-master-ia-savegame';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>(GameState.TITLE);
    const [character, setCharacter] = useState<Character | null>(null);
    const [storyLog, setStoryLog] = useState<string[]>([]);
    const [isInCombat, setIsInCombat] = useState(false);
    const [enemy, setEnemy] = useState<Enemy | null>(null);
    const [party, setParty] = useState<Ally[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSavedGame, setHasSavedGame] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [justFinishedCombat, setJustFinishedCombat] = useState(false);
    const [settings, setSettings] = useState<Settings>({
        ttsEnabled: false,
        volume: 0.5,
        textSpeed: 50,
    });

    const showToast = useCallback((message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    }, []);

    // Check for saved game on mount
    useEffect(() => {
        const savedData = localStorage.getItem(SAVE_GAME_KEY);
        if (savedData) {
            setHasSavedGame(true);
        }
        audioService.setVolume(settings.volume);
    }, [settings.volume]);

    const saveGame = useCallback((isManualSave = false) => {
        if (character) {
            const gameData: SavedGame = {
                character,
                storyLog,
                isInCombat,
                enemy,
                party,
                settings,
            };
            localStorage.setItem(SAVE_GAME_KEY, JSON.stringify(gameData));
            setHasSavedGame(true);
            if (isManualSave) {
                showToast("Partida guardada.");
            } else {
                showToast("Progreso guardado automáticamente.");
            }
        }
    }, [character, storyLog, isInCombat, enemy, party, settings, showToast]);

    const loadGame = (fromMenu = false) => {
        if (!fromMenu && !window.confirm("¿Seguro que quieres cargar la última partida guardada? Perderás el progreso no guardado.")) {
            return;
        }

        const savedData = localStorage.getItem(SAVE_GAME_KEY);
        if (savedData) {
            const gameData: SavedGame = JSON.parse(savedData);
            setCharacter(gameData.character);
            setStoryLog(gameData.storyLog);
            setIsInCombat(gameData.isInCombat);
            setEnemy(gameData.enemy);
            setParty(gameData.party);
            setSettings(gameData.settings);
            startNewAdventure(gameData.character, gameData.party, gameData.enemy, gameData.storyLog);
            setGameState(GameState.PLAYING);
            showToast("Partida cargada.");
        } else {
            showToast("No se encontró ninguna partida guardada.");
        }
    };

    const handleSettingsChange = (newSettings: Partial<Settings>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const handleStartNew = () => {
         if (hasSavedGame && !window.confirm("¿Empezar una nueva partida? Se borrará tu progreso guardado.")) {
            return;
        }
        localStorage.removeItem(SAVE_GAME_KEY);
        setHasSavedGame(false);
        setGameState(GameState.CHARACTER_CREATION);
    };

    const handleContinue = () => {
        loadGame(true);
    };

    const handleCharacterCreate = (newCharacter: Character) => {
        setCharacter(newCharacter);
        const initialLog = [`${newCharacter.name} el ${newCharacter.race} ${newCharacter.characterClass} comienza su aventura.`];
        setStoryLog(initialLog);
        setIsInCombat(false);
        setEnemy(null);
        setParty([]);
        setGameState(GameState.PLAYING);
        
        startNewAdventure(newCharacter, [], null, initialLog);
        
        handleSendAction("Comienza la aventura. Describe la escena inicial.");
    };

    const processDMResponse = (response: DMResponse) => {
        if (response.storyText) {
            setStoryLog(prev => [...prev, response.storyText]);
        }
        if (response.encounter) {
            setEnemy(response.encounter);
            setIsInCombat(true);
        }
        if (response.playerUpdate && character) {
            setCharacter(prev => prev ? { ...prev, hp: response.playerUpdate?.hp ?? prev.hp, mp: response.playerUpdate?.mp ?? prev.mp } : null);
        }
        if (response.enemyUpdate && enemy) {
            setEnemy(prev => prev ? { ...prev, hp: response.enemyUpdate?.hp ?? prev.hp } : null);
        }
        if (response.partyUpdate) {
            setParty(prevParty => prevParty.map(ally => {
                const update = response.partyUpdate?.find(p => p.name === ally.name);
                return update ? { ...ally, hp: update.hp } : ally;
            }));
        }
        if (response.loot && character) {
            setCharacter(prev => {
                if (!prev) return null;
                const newInventory = [...prev.inventory];
                response.loot?.forEach((item: Item) => {
                    const existingItem = newInventory.find(i => i.name === item.name);
                    if (existingItem) {
                        existingItem.quantity += item.quantity;
                    } else {
                        newInventory.push(item);
                    }
                });
                return { ...prev, inventory: newInventory };
            });
        }
        if (response.newAlly) {
            setParty(prev => [...prev, response.newAlly!]);
        }
        if (response.combatOver) {
            setIsInCombat(false);
            setEnemy(null);
            setJustFinishedCombat(true);
        }
        if (response.xpAward && character) {
            setCharacter(prev => {
                if (!prev) return null;
                const newXp = prev.xp + response.xpAward!;
                if (newXp >= prev.xpToNextLevel) {
                    setStoryLog(prevLog => [...prevLog, `¡${character.name} ha subido de nivel!`]);
                    return { ...prev, level: prev.level + 1, xp: newXp - prev.xpToNextLevel, xpToNextLevel: prev.xpToNextLevel * 2 };
                }
                return { ...prev, xp: newXp };
            });
        }
    };

    const handleSendAction = async (action: string) => {
        if (!character) return;
        setIsLoading(true);
        const currentStory = [...storyLog, `> ${action}`];
        setStoryLog(currentStory);
        const response = await sendMessageToDM(action, character, party, enemy, currentStory);
        processDMResponse(response);
        setIsLoading(false);
    };
    
    // Autosave after combat ends
    useEffect(() => {
        if (justFinishedCombat) {
            saveGame(false);
            setJustFinishedCombat(false);
        }
    }, [justFinishedCombat, saveGame]);

    // Timed autosave
    useEffect(() => {
        let intervalId: number | null = null;
        if (gameState === GameState.PLAYING) {
            intervalId = window.setInterval(() => {
                saveGame(false);
            }, 5 * 60 * 1000); // 5 minutes
        }
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [gameState, saveGame]);

    const renderGameState = () => {
        switch (gameState) {
            case GameState.TITLE:
                return <TitleScreen onStartNew={handleStartNew} onContinue={handleContinue} hasSavedGame={hasSavedGame} />;
            case GameState.CHARACTER_CREATION:
                return <CharacterCreation onCharacterCreate={handleCharacterCreate} />;
            case GameState.PLAYING:
                if (!character) return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Loading character...</div>;
                return (
                    <GameUI
                        character={character}
                        enemy={enemy}
                        party={party}
                        storyLog={storyLog}
                        isLoading={isLoading}
                        isInCombat={isInCombat}
                        onSendAction={handleSendAction}
                        settings={settings}
                        onSettingsChange={handleSettingsChange}
                        onManualSave={() => saveGame(true)}
                        onManualLoad={() => loadGame(false)}
                        toastMessage={toastMessage}
                    />
                );
            default:
                return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Unknown game state</div>;
        }
    };

    return <div className="App">{renderGameState()}</div>;
};

export default App;