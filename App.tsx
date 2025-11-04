import React, { useState, useEffect, useCallback, useRef } from 'react';
import TitleScreen from './components/TitleScreen';
import CharacterCreation from './components/CharacterCreation';
import GameUI from './components/GameUI';
import { GameState, Character, Settings } from './types';
import { sendMessageToDM } from './services/geminiService';
import * as audioService from './services/audioService';
import { GameProvider, useGame } from './context/GameContext';
import SaveIndicator from './components/SaveIndicator';

const SAVE_GAME_KEY = 'dungeonMasterIASaveGame';
const AUTO_SAVE_INTERVAL = 2 * 60 * 1000; // 2 minutos

const AppContent: React.FC = () => {
    const { gameState, dispatch } = useGame();
    const [appState, setAppState] = useState<'title' | 'character-creation' | 'in-game'>('title');
    const [hasSavedGame, setHasSavedGame] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showSaveIndicator, setShowSaveIndicator] = useState(false);
    
    const [settings, setSettings] = useState<Settings>(() => {
        const savedSettings = localStorage.getItem('dungeonMasterIASettings');
        return savedSettings ? JSON.parse(savedSettings) : {
            ttsEnabled: true,
            volume: 0.7,
            textSpeed: 50,
        };
    });
    
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
            setShowSaveIndicator(true);
        }
    }, []);
    
    useEffect(() => {
        if (showSaveIndicator) {
            const timer = setTimeout(() => setShowSaveIndicator(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [showSaveIndicator]);

    useEffect(() => {
        if (appState !== 'in-game') return;
        const intervalId = setInterval(() => {
            if (gameStateRef.current) {
                saveGame(gameStateRef.current);
            }
        }, AUTO_SAVE_INTERVAL);
        return () => clearInterval(intervalId);
    }, [appState, saveGame]);
    
    const handleStartNew = () => setAppState('character-creation');

    const hydrateGameState = (savedData: any): GameState | null => {
        if (!savedData || typeof savedData !== 'object' || !savedData.character || !Array.isArray(savedData.storyLog)) {
            return null;
        }
        return {
            character: savedData.character,
            party: savedData.party || [],
            enemy: savedData.enemy || null,
            storyLog: savedData.storyLog,
            location: savedData.location || "Ubicación desconocida",
            map: savedData.map,
            ambience: savedData.ambience || 'tavern',
        };
    };

    const handleContinue = () => {
        try {
            const savedGame = localStorage.getItem(SAVE_GAME_KEY);
            if (savedGame) {
                const hydratedGame = hydrateGameState(JSON.parse(savedGame));
                if (hydratedGame) {
                    dispatch({ type: 'SET_GAME_STATE', payload: hydratedGame });
                    setAppState('in-game');
                } else {
                    localStorage.removeItem(SAVE_GAME_KEY);
                    setHasSavedGame(false);
                    alert("Tu partida guardada parece estar corrupta y ha sido eliminada.");
                }
            }
        } catch (error) {
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
            ambience: 'tavern',
        };

        const response = await sendMessageToDM(
            "Acabo de crear mi personaje. ¿Dónde estoy y qué veo?",
            character, [], null, [initialLog]
        );

        dispatch({
            type: 'SET_GAME_STATE',
            payload: {
                ...newGameState,
                ambience: response.ambience || newGameState.ambience,
                storyLog: [initialLog, response.storyText],
            }
        });
        
        setAppState('in-game');
        setIsLoading(false);
    };
    
    useEffect(() => {
        if (appState === 'in-game' && gameState) {
            saveGame(gameState);
        }
    }, [gameState, appState, saveGame]);

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
                return (
                    <>
                        <GameUI settings={settings} onSettingsChange={handleSettingsChange} />
                        <SaveIndicator isVisible={showSaveIndicator} />
                    </>
                );
            }
            setAppState('title');
            return null;
        default:
            return <TitleScreen onStartNew={handleStartNew} onContinue={handleContinue} hasSavedGame={hasSavedGame} />;
    }
};

const App: React.FC = () => (
    <GameProvider>
        <AppContent />
    </GameProvider>
);

export default App;
