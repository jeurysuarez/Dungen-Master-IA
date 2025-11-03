
import React, { useState, useEffect, useCallback } from 'react';
import { GameState, Character, SavedGame, Settings, DMResponse, Item, Ally, Enemy } from './types';
import TitleScreen from './components/TitleScreen';
import CharacterCreation from './components/CharacterCreation';
import GameUI from './components/GameUI';
import { setVolume } from './services/audioService';

const SAVE_GAME_KEY = 'dungeon-master-ia-save';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>(GameState.TITLE);
    const [savedGame, setSavedGame] = useState<SavedGame | null>(null);
    const [character, setCharacter] = useState<Character | null>(null);
    const [storyLog, setStoryLog] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [settings, setSettings] = useState<Settings>({
        ttsEnabled: false,
        volume: 0.7,
        textSpeed: 50,
    });
    
    // Derived state for GameUI
    const [isInCombat, setIsInCombat] = useState(false);
    const [enemy, setEnemy] = useState<Enemy | null>(null);
    const [party, setParty] = useState<Ally[]>([]);
    const [loot, setLoot] = useState<Item[]>([]);

    useEffect(() => {
        try {
            const savedData = localStorage.getItem(SAVE_GAME_KEY);
            if (savedData) {
                setSavedGame(JSON.parse(savedData));
            }
        } catch (error) {
            console.error("Failed to load saved game:", error);
            localStorage.removeItem(SAVE_GAME_KEY);
        }
    }, []);
    
    useEffect(() => {
        setVolume(settings.volume);
    }, [settings.volume]);

    const saveGame = useCallback(() => {
        if (character) {
            const gameToSave: SavedGame = {
                character,
                storyLog,
                isInCombat,
                enemy: enemy || null,
                party: party || [],
                settings,
            };
            try {
                localStorage.setItem(SAVE_GAME_KEY, JSON.stringify(gameToSave));
                setSavedGame(gameToSave);
            } catch (error) {
                console.error("Failed to save game:", error);
            }
        }
    }, [character, storyLog, isInCombat, enemy, party, settings]);

    const handleStartNew = () => {
        if (savedGame) {
            if (window.confirm("¿Seguro que quieres empezar una nueva partida? Se borrará tu progreso guardado.")) {
                localStorage.removeItem(SAVE_GAME_KEY);
                setSavedGame(null);
                setCharacter(null);
                setStoryLog([]);
                setEnemy(null);
                setParty([]);
                setLoot([]);
                setGameState(GameState.CHARACTER_CREATION);
            }
        } else {
            setGameState(GameState.CHARACTER_CREATION);
        }
    };
    
    const handleContinue = () => {
        if (savedGame) {
            setCharacter(savedGame.character);
            setStoryLog(savedGame.storyLog);
            setIsInCombat(savedGame.isInCombat);
            setEnemy(savedGame.enemy);
            setParty(savedGame.party);
            setSettings(savedGame.settings);
            setGameState(GameState.PLAYING);
        }
    };

    const handleCharacterCreate = (newCharacter: Character) => {
        setCharacter(newCharacter);
        setStoryLog([`Te llamas ${newCharacter.name}, un ${newCharacter.race} ${newCharacter.characterClass}. La aventura comienza...`]);
        setIsInCombat(false);
        setEnemy(null);
        setParty([]);
        setGameState(GameState.PLAYING);
        setIsLoading(true); // Initial loading for the first story bit
    };
    
    const handleSettingsChange = (newSettings: Partial<Settings>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    }

    const renderContent = () => {
        switch (gameState) {
            case GameState.CHARACTER_CREATION:
                return <CharacterCreation onCharacterCreate={handleCharacterCreate} />;
            case GameState.PLAYING:
                if (!character) return null; // Should not happen
                return (
                    <GameUI
                        character={character}
                        setCharacter={setCharacter}
                        storyLog={storyLog}
                        setStoryLog={setStoryLog}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                        isInCombat={isInCombat}
                        setIsInCombat={setIsInCombat}
                        enemy={enemy}
                        setEnemy={setEnemy}
                        party={party}
                        setParty={setParty}
                        loot={loot}
                        setLoot={setLoot}
                        settings={settings}
                        onSettingsChange={handleSettingsChange}
                        saveGame={saveGame}
                    />
                );
            case GameState.TITLE:
            default:
                return (
                    <TitleScreen
                        onStartNew={handleStartNew}
                        onContinue={handleContinue}
                        hasSavedGame={!!savedGame}
                    />
                );
        }
    };

    return <div className="bg-slate-900 min-h-screen">{renderContent()}</div>;
};

export default App;
