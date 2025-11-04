import React, { useState, useEffect, useCallback, useRef } from 'react';
import TitleScreen from './components/TitleScreen';
import CharacterCreation from './components/CharacterCreation';
import GameUI from './components/GameUI';
import { GameState, Character, Settings } from './types';
import { sendMessageToDM } from './services/geminiService';
import * as audioService from './services/audioService';

const SAVE_GAME_KEY = 'dungeonMasterIASaveGame';
const AUTO_SAVE_INTERVAL = 2 * 60 * 1000; // 2 minutos

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [appState, setAppState] = useState<'title' | 'character-creation' | 'in-game'>('title');
    const [hasSavedGame, setHasSavedGame] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const [settings, setSettings] = useState<Settings>(() => {
        const savedSettings = localStorage.getItem('dungeonMasterIASettings');
        return savedSettings ? JSON.parse(savedSettings) : {
            ttsEnabled: true,
            volume: 0.7,
            textSpeed: 50,
        };
    });

    // Ref to hold the latest game state for the auto-save interval
    const gameStateRef = useRef(gameState);
    useEffect(() => {
        gameStateRef.current = gameState;
    }, [gameState]);

    useEffect(() => {
        const savedGame = localStorage.getItem(SAVE_GAME_KEY);
        setHasSavedGame(!!savedGame);
    }, []);

    useEffect(() => {
        localStorage.setItem('dungeonMasterIASettings', JSON.stringify(settings));
        audioService.setVolume(settings.volume);
    }, [settings]);

    const handleSettingsChange = (newSettings: Partial<Settings>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const saveGame = useCallback((currentGameState: GameState | null) => {
        if (currentGameState) {
            localStorage.setItem(SAVE_GAME_KEY, JSON.stringify(currentGameState));
            setHasSavedGame(true);
        }
    }, []);

    // Periodic auto-save effect
    useEffect(() => {
        if (appState !== 'in-game') {
            return; // Don't run the timer if not in game
        }

        const intervalId = setInterval(() => {
            // Use the ref to get the latest state without creating a stale closure
            if (gameStateRef.current) {
                saveGame(gameStateRef.current);
            }
        }, AUTO_SAVE_INTERVAL);

        // Cleanup function to clear the interval when the component unmounts or appState changes
        return () => {
            clearInterval(intervalId);
        };
    }, [appState, saveGame]);
    
    const handleStartNew = () => {
        setAppState('character-creation');
    };

    const hydrateGameState = (savedData: any): GameState | null => {
        if (!savedData || typeof savedData !== 'object' || !savedData.character || !Array.isArray(savedData.storyLog)) {
            console.warn("Invalid save data structure.", savedData);
            return null; // Invalid save
        }
        // This ensures that if the GameState interface changes, old saves won't break the app.
        const hydratedState: GameState = {
            character: savedData.character,
            party: savedData.party || [],
            enemy: savedData.enemy || null,
            storyLog: savedData.storyLog,
            location: savedData.location || "Ubicación desconocida",
            map: savedData.map, // can be undefined
            ambience: savedData.ambience || 'tavern',
        };
        return hydratedState;
    };


    const handleContinue = () => {
        try {
            const savedGame = localStorage.getItem(SAVE_GAME_KEY);
            if (savedGame) {
                const parsedGame = JSON.parse(savedGame);
                const hydratedGame = hydrateGameState(parsedGame);

                if (hydratedGame) {
                    setGameState(hydratedGame);
                    setAppState('in-game');
                } else {
                    console.error("Save game data is corrupted or invalid.");
                    localStorage.removeItem(SAVE_GAME_KEY);
                    setHasSavedGame(false);
                    alert("Tu partida guardada parece estar corrupta y ha sido eliminada. Por favor, comienza una nueva aventura.");
                }
            }
        } catch (error) {
            console.error("Failed to parse or load saved game:", error);
            localStorage.removeItem(SAVE_GAME_KEY);
            setHasSavedGame(false);
            alert("Error al cargar la partida. Tu archivo de guardado podría estar dañado y ha sido eliminado.");
        }
    };

    const handleCharacterCreate = async (character: Character) => {
        setIsLoading(true);
        const initialLog = "Tu aventura comienza...";
        const newGameState: GameState = {
            character,
            party: [],
            enemy: null,
            storyLog: [initialLog],
            location: "Una posada con poca luz",
            ambience: 'tavern', // Starting ambiance
        };

        const response = await sendMessageToDM(
            "Acabo de crear mi personaje. ¿Dónde estoy y qué veo?",
            character,
            [],
            null,
            [initialLog]
        );

        setGameState({
            ...newGameState,
            ambience: response.ambience || newGameState.ambience,
            storyLog: [initialLog, response.storyText],
        });
        
        setAppState('in-game');
        setIsLoading(false);
    };
    
    // Save game on every state change (for immediate persistence after actions)
    useEffect(() => {
        if (appState === 'in-game' && gameState) {
            saveGame(gameState);
        }
    }, [gameState, appState, saveGame]);


    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-stone-200">
                    <h1 className="text-4xl font-title text-amber-400">Forjando tu destino...</h1>
                </div>
            );
        }

        switch (appState) {
            case 'title':
                return <TitleScreen onStartNew={handleStartNew} onContinue={handleContinue} hasSavedGame={hasSavedGame} />;
            case 'character-creation':
                return <CharacterCreation onCharacterCreate={handleCharacterCreate} />;
            case 'in-game':
                if (gameState) {
                    return <GameUI 
                        gameState={gameState} 
                        setGameState={setGameState} 
                        settings={settings}
                        onSettingsChange={handleSettingsChange}
                    />;
                }
                // Fallback in case gameState is null
                setAppState('title');
                return null;
            default:
                return <TitleScreen onStartNew={handleStartNew} onContinue={handleContinue} hasSavedGame={hasSavedGame} />;
        }
    };

    return <div className="App">{renderContent()}</div>;
};

export default App;