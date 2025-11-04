// Fix: Imported 'useRef' from React to resolve 'Cannot find name' error on line 12.
import React, { useState, useEffect, memo, useRef } from 'react';
import { useGame } from '../context/GameContext';
import PlayerCastEffect from './PlayerCastEffect';
import { useApiStatus } from '../hooks/useApiStatus';
import Tooltip from './Tooltip';

interface CharacterPanelProps {
    onOpenMap: () => void;
    onOpenSettings: () => void;
}

// Using a custom hook to track previous values for animations
const usePrevious = <T,>(value: T) => {
    const ref = useRef<T>();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};

const CharacterPanel: React.FC<CharacterPanelProps> = ({ onOpenMap, onOpenSettings }) => {
    const { gameState } = useGame();
    const { character, map } = gameState!;
    const [isCastingSpell, setIsCastingSpell] = useState(false); // This state could be lifted or managed via context if needed elsewhere
    const [isHealing, setIsHealing] = useState(false);
    const { apiStatus } = useApiStatus();

    const prevHp = usePrevious(character.hp);

    useEffect(() => {
        if (prevHp !== undefined && character.hp > prevHp) {
            setIsHealing(true);
            const timer = setTimeout(() => setIsHealing(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [character.hp, prevHp]);


    // Placeholder for triggering spell cast effect. In a real scenario, an event bus or context update would be better.
    // For now, we can listen to MP changes as a proxy for spell casting.
    const prevMp = usePrevious(character.mp);
    useEffect(() => {
        if (prevMp !== undefined && character.mp < prevMp) {
            setIsCastingSpell(true);
            const timer = setTimeout(() => setIsCastingSpell(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [character.mp, prevMp]);

    const HealthBar = ({ current, max, colorClass }: { current: number; max: number; colorClass: string; }) => (
        <div className="w-full bg-slate-700 rounded-full h-2.5">
            <div className={`${colorClass} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${(current / max) * 100}%` }}></div>
        </div>
    );

    const getStatusIndicator = () => {
        let bgColor = 'bg-yellow-500';
        let text = 'Verificando conexión...';

        switch (apiStatus) {
            case 'ok':
                bgColor = 'bg-green-500';
                text = 'Conexión Establecida';
                break;
            case 'error':
                bgColor = 'bg-red-500';
                text = 'Servicio No Disponible';
                break;
        }

        return (
            <Tooltip text={text}>
                <div className="flex items-center justify-center">
                    <span className={`w-3 h-3 rounded-full ${bgColor} ${apiStatus === 'checking' || apiStatus === 'idle' ? 'animate-pulse' : ''}`}></span>
                </div>
            </Tooltip>
        );
    };

    return (
        <div className={`relative bg-slate-800/50 p-4 rounded-lg border-2 border-transparent transition-all ${character.hp / character.maxHp < 0.25 ? 'animate-pulse-border' : ''} ${isHealing ? 'animate-healing-aura' : ''}`}>
            <PlayerCastEffect isActive={isCastingSpell} />
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="font-title text-2xl text-amber-400">{character.name}</h2>
                    <p className="text-stone-400">Nivel {character.level} {character.characterClass} {character.race}</p>
                </div>
                <div className="flex items-center gap-2">
                    {getStatusIndicator()}
                    {map && (<button onClick={onOpenMap} className="p-2 rounded-full hover:bg-slate-700/50 transition-colors">🗺️</button>)}
                    <button onClick={onOpenSettings} className="p-2 rounded-full hover:bg-slate-700/50 transition-colors">⚙️</button>
                </div>
            </div>
            <div className="mt-4 space-y-3">
                <div>
                    <div className="flex justify-between text-sm mb-1"><span>HP</span><span>{character.hp} / {character.maxHp}</span></div>
                    <HealthBar current={character.hp} max={character.maxHp} colorClass="bg-red-500" />
                </div>
                {character.maxMp > 0 && (
                    <div>
                        <div className="flex justify-between text-sm mb-1"><span>MP</span><span>{character.mp} / {character.maxMp}</span></div>
                        <HealthBar current={character.mp} max={character.maxMp} colorClass="bg-blue-500" />
                    </div>
                )}
                <div>
                    <div className="flex justify-between text-sm mb-1"><span>XP</span><span>{character.xp} / {character.xpToNextLevel}</span></div>
                    <HealthBar current={character.xp} max={character.xpToNextLevel} colorClass="bg-yellow-500" />
                </div>
            </div>
        </div>
    );
};

export default memo(CharacterPanel);