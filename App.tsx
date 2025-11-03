
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Character, Ally, Enemy, SavedGame, Item, Spell, Skill } from './types';
import { startNewAdventure, sendMessageToDM, generateSpeech } from './services/geminiService';
import { decode, decodeAudioData } from './utils/audioUtils';

import TitleScreen from './components/TitleScreen';
import CharacterCreation from './components/CharacterCreation';
import GameUI from './components/GameUI';

const SAVE_GAME_KEY = 'dnd-ia-savegame';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>(GameState.TITLE);
    const [character, setCharacter] = useState<Character | null>(null);
    const [party, setParty] = useState<Ally[]>([]);
    const [enemy, setEnemy] = useState<Enemy | null>(null);
    const [storyLog, setStoryLog] = useState<string[]>([]);
    const [isInCombat, setIsInCombat] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSavedGame, setHasSavedGame] = useState(false);

    // Visual effects state
    const [isPlayerHit, setPlayerHit] = useState(false);
    const [isEnemyHit, setEnemyHit] = useState(false);
    const [isSpellCasting, setSpellCasting] = useState(false);
    const [diceRoll, setDiceRoll] = useState<{ roll: number, bonus: number, total: number } | null>(null);
    
    // TTS state
    const [ttsEnabled, setTtsEnabled] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);


    // Check for saved game on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(SAVE_GAME_KEY);
            setHasSavedGame(!!saved);
        } catch (error) {
            console.error("Could not access local storage:", error);
            setHasSavedGame(false);
        }
    }, []);

    // Game save logic
    useEffect(() => {
        if (gameState === GameState.PLAYING && character) {
            try {
                const gameToSave: SavedGame = {
                    character,
                    storyLog,
                    isInCombat,
                    enemy,
                    party,
                };
                localStorage.setItem(SAVE_GAME_KEY, JSON.stringify(gameToSave));
            } catch (error) {
                console.error("Failed to save game:", error);
            }
        }
    }, [character, storyLog, isInCombat, enemy, party, gameState]);


    const playAudio = useCallback(async (base64Audio: string) => {
        if (!audioContextRef.current) {
            try {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            } catch (e) {
                console.error("Web Audio API is not supported in this browser.", e);
                setTtsEnabled(false);
                return;
            }
        }
        const ctx = audioContextRef.current;
        const decodedBytes = decode(base64Audio);
        const audioBuffer = await decodeAudioData(decodedBytes, ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start();
    }, []);

    const processDMResponse = useCallback(async (response: Awaited<ReturnType<typeof sendMessageToDM>>) => {
        if (response.storyText) {
            setStoryLog(prev => [...prev, `<strong>DM:</strong> ${response.storyText}`]);
            if (ttsEnabled) {
                const audio = await generateSpeech(response.storyText);
                if (audio) playAudio(audio);
            }
        }

        if (response.encounter) {
            setEnemy(response.encounter);
            setIsInCombat(true);
        }
        
        if (response.playerUpdate && character) {
            const newCharacter = { ...character };
            if (response.playerUpdate.hp !== undefined) {
                 if(response.playerUpdate.hp < character.hp) { setPlayerHit(true); setTimeout(() => setPlayerHit(false), 300); }
                 newCharacter.hp = Math.max(0, response.playerUpdate.hp);
            }
            if (response.playerUpdate.mp !== undefined) newCharacter.mp = Math.max(0, response.playerUpdate.mp);
            setCharacter(newCharacter);
        }

        if (response.enemyUpdate && enemy) {
            if(response.enemyUpdate.hp !== undefined && response.enemyUpdate.hp < enemy.hp) { setEnemyHit(true); setTimeout(() => setEnemyHit(false), 300); }
            setEnemy(prev => prev ? { ...prev, hp: Math.max(0, response.enemyUpdate!.hp!) } : null);
        }
        
        if (response.partyUpdate) {
            setParty(currentParty => currentParty.map(ally => {
                const update = response.partyUpdate?.find(u => u.name === ally.name);
                return update ? { ...ally, hp: Math.max(0, update.hp) } : ally;
            }));
        }

        if (response.loot && character) {
            // Complex merge logic could be added here
            const newItems = response.loot.map(item => `${item.quantity}x ${item.name}`).join(', ');
            setStoryLog(prev => [...prev, `<em class="text-yellow-400">Recibes: ${newItems}</em>`]);
            // TODO: Actually add items to inventory
        }

        if (response.newAlly) {
            setParty(prev => [...prev, response.newAlly!]);
        }
        
        if (response.xpAward && character) {
            const newXp = character.xp + response.xpAward;
            setStoryLog(prev => [...prev, `<em class="text-purple-400">Ganas ${response.xpAward} puntos de experiencia.</em>`]);
            if (newXp >= character.xpToNextLevel) {
                // Level up logic
                const newCharacter = { ...character, level: character.level + 1, xp: 0, xpToNextLevel: character.xpToNextLevel * 2, maxHp: character.maxHp + 5, hp: character.maxHp + 5 }; // Simple level up
                setCharacter(newCharacter);
                setStoryLog(prev => [...prev, `<strong class="text-green-400">¡Subes de nivel! Nivel ${newCharacter.level}.</strong>`]);
            } else {
                setCharacter({ ...character, xp: newXp });
            }
        }

        if (response.combatOver) {
            setIsInCombat(false);
            setEnemy(null);
            setCharacter(c => c ? {...c, skills: c.skills.map(s => ({...s, currentCooldown: Math.max(0, s.currentCooldown - 1)}))} : null);
        }


    }, [character, enemy, ttsEnabled, playAudio]);


    const handlePlayerAction = async (action: string) => {
        if (!character) return;
        setIsLoading(true);
        setStoryLog(prev => [...prev, `<strong>${character.name}:</strong> ${action}`]);
        const response = await sendMessageToDM(action, character, party, enemy, storyLog);
        await processDMResponse(response);
        setIsLoading(false);
    };

    const handleCombatAction = async (action: string, details?: any) => {
        if (!character) return;
        setIsLoading(true);
        let actionDescription = "";
        
        if (action === 'attack') {
            const roll = Math.floor(Math.random() * 20) + 1;
            const total = roll + character.attackBonus;
            setDiceRoll({ roll, bonus: character.attackBonus, total });
            setTimeout(() => setDiceRoll(null), 1500);
            actionDescription = `Ataca al ${enemy?.name}. Resultado de la tirada: ${total} (Dado: ${roll} + Bono: ${character.attackBonus}).`;
        } else if (action === 'magic') {
            const spell = details as Spell;
            setSpellCasting(true);
            setTimeout(() => setSpellCasting(false), 500);
            setCharacter({...character, mp: character.mp - spell.cost });
            actionDescription = `Lanza el hechizo '${spell.name}' contra el ${enemy?.name}.`;
        } else if (action === 'skill') {
            const skill = details as Skill;
             setCharacter({
                ...character,
                skills: character.skills.map(s => s.name === skill.name ? { ...s, currentCooldown: s.cooldown } : s)
            });
            actionDescription = `Usa la habilidad '${skill.name}'.`;
        }

        setStoryLog(prev => [...prev, `<strong>${character.name}:</strong> ${actionDescription}`]);
        const response = await sendMessageToDM(actionDescription, character, party, enemy, storyLog);
        await processDMResponse(response);
        setIsLoading(false);
    };


    const handleCharacterCreation = (createdCharacter: Character) => {
        const firstLog = `La aventura de ${createdCharacter.name}, el ${createdCharacter.race} ${createdCharacter.characterClass}, comienza...`;
        setCharacter(createdCharacter);
        setStoryLog([`<strong>DM:</strong> ${firstLog}`]);
        setParty([]);
        setEnemy(null);
        setIsInCombat(false);
        setGameState(GameState.PLAYING);
        
        startNewAdventure(createdCharacter, [], null, [firstLog]);
        
        // Initial DM turn
        (async () => {
            setIsLoading(true);
            const response = await sendMessageToDM("El personaje aparece en el mundo. Describe la escena inicial.", createdCharacter, [], null, [firstLog]);
            await processDMResponse(response);
            setIsLoading(false);
        })();
    };

    const handleStartNew = () => {
        if (hasSavedGame && !window.confirm("¿Seguro que quieres empezar una nueva partida? Se borrará tu progreso guardado.")) {
            return;
        }
        localStorage.removeItem(SAVE_GAME_KEY);
        setHasSavedGame(false);
        setGameState(GameState.CHARACTER_CREATION);
    };

    const handleContinue = () => {
        try {
            const saved = localStorage.getItem(SAVE_GAME_KEY);
            if (saved) {
                const savedGame: SavedGame = JSON.parse(saved);
                setCharacter(savedGame.character);
                setStoryLog(savedGame.storyLog);
                setIsInCombat(savedGame.isInCombat);
                setEnemy(savedGame.enemy);
                setParty(savedGame.party);
                setGameState(GameState.PLAYING);
                startNewAdventure(savedGame.character, savedGame.party, savedGame.enemy, savedGame.storyLog);
            }
        } catch (error) {
            console.error("Failed to load game:", error);
            alert("No se pudo cargar la partida guardada. Puede que esté corrupta.");
            localStorage.removeItem(SAVE_GAME_KEY);
            setHasSavedGame(false);
            setGameState(GameState.TITLE);
        }
    };
    
    const toggleTts = () => {
        setTtsEnabled(prev => !prev);
        if (!ttsEnabled && !audioContextRef.current) {
             try {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            } catch (e) {
                console.error("Web Audio API is not supported in this browser.", e);
                setTtsEnabled(false);
            }
        }
    };

    switch (gameState) {
        case GameState.CHARACTER_CREATION:
            return <CharacterCreation onCharacterCreate={handleCharacterCreation} />;
        case GameState.PLAYING:
            if (!character) return <div>Cargando personaje...</div>; // Should not happen
            return (
                <GameUI 
                    character={character}
                    party={party}
                    enemy={enemy}
                    storyLog={storyLog}
                    isInCombat={isInCombat}
                    isLoading={isLoading}
                    isPlayerHit={isPlayerHit}
                    isEnemyHit={isEnemyHit}
                    isSpellCasting={isSpellCasting}
                    diceRoll={diceRoll}
                    onAction={handlePlayerAction}
                    onCombatAction={handleCombatAction}
                    ttsEnabled={ttsEnabled}
                    toggleTts={toggleTts}
                />
            );
        case GameState.TITLE:
        default:
            return <TitleScreen onStartNew={handleStartNew} onContinue={handleContinue} hasSavedGame={hasSavedGame} />;
    }
};

export default App;
