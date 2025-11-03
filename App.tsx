import React, { useState, useEffect, useCallback } from 'react';
import TitleScreen from './components/TitleScreen';
import CharacterCreation from './components/CharacterCreation';
import GameUI from './components/GameUI';
import { GameState, Character, Settings } from './types';
import { sendMessageToDM } from './services/geminiService';
import * as audioService from './services/audioService';

const SAVE_GAME_KEY = 'dungeonMasterIASaveGame';

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
    
    const handleStartNew = () => {
        setAppState('character-creation');
    };

    const handleContinue = () => {
        const savedGame = localStorage.getItem(SAVE_GAME_KEY);
        if (savedGame) {
            setGameState(JSON.parse(savedGame));
            setAppState('in-game');
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
            storyLog: [initialLog, response.storyText],
        });
        
        setAppState('in-game');
        setIsLoading(false);
    };
    
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
