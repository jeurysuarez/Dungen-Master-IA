import React, { useState, useEffect, useRef, memo } from 'react';
import { useGame } from '../context/GameContext';
import { Ally } from '../types';

const usePrevious = <T,>(value: T) => {
    const ref = useRef<T[]>();
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
};


const PartyPanel: React.FC = () => {
    const { gameState } = useGame();
    const { party } = gameState!;
    const [healingTargets, setHealingTargets] = useState<string[]>([]);
    const prevParty = usePrevious<Ally[]>(party);

     useEffect(() => {
        if (prevParty && party.length > 0) {
            const healed: string[] = [];
            party.forEach(ally => {
                const prevAlly = prevParty.find(p => p.name === ally.name);
                if (prevAlly && ally.hp > prevAlly.hp) {
                    healed.push(ally.name);
                }
            });
            if (healed.length > 0) {
                setHealingTargets(healed);
                const timer = setTimeout(() => setHealingTargets([]), 1000);
                return () => clearTimeout(timer);
            }
        }
    }, [party, prevParty]);

    const HealthBar = ({ current, max, colorClass }: { current: number; max: number; colorClass: string; }) => (
        <div className="w-full bg-slate-700 rounded-full h-2.5">
            <div className={`${colorClass} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${(current / max) * 100}%` }}></div>
        </div>
    );

    if (party.length === 0) return null;

    return (
        <div className="bg-slate-800/50 p-4 rounded-lg">
            <h3 className="font-title text-xl text-amber-400 mb-3">Grupo</h3>
            <div className="space-y-3">
                {party.map(ally => (
                    <div key={ally.name} className={`rounded-md p-2 -m-2 transition-all ${healingTargets.includes(ally.name) ? 'animate-healing-aura' : ''}`}>
                        <p className="font-bold text-stone-300">{ally.name} <span className="text-sm font-normal text-stone-400">({ally.characterClass})</span></p>
                        <div className="flex justify-between text-sm mb-1"><span>HP</span><span>{ally.hp} / {ally.maxHp}</span></div>
                        <HealthBar current={ally.hp} max={ally.maxHp} colorClass="bg-green-500" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default memo(PartyPanel);
