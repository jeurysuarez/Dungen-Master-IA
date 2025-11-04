import React, { useState, useEffect, useRef, memo } from 'react';
import { useGame } from '../context/GameContext';
import { Enemy } from '../types';

const usePrevious = <T,>(value: T) => {
    const ref = useRef<T>();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};

const EnemyPanel: React.FC = () => {
    const { gameState } = useGame();
    const { enemy } = gameState!;
    const [isEnemyHit, setIsEnemyHit] = useState(false);

    const prevEnemy = usePrevious<Enemy | null>(enemy);

    useEffect(() => {
        // Enemy hit animation
        if (enemy && prevEnemy && enemy.hp < prevEnemy.hp) {
            setIsEnemyHit(true);
            const timer = setTimeout(() => setIsEnemyHit(false), 300);
            return () => clearTimeout(timer);
        }
    }, [enemy, prevEnemy]);


    const HealthBar = ({ current, max, colorClass }: { current: number; max: number; colorClass: string; }) => (
        <div className="w-full bg-slate-700 rounded-full h-2.5">
            <div className={`${colorClass} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${(current / max) * 100}%` }}></div>
        </div>
    );

    if (!enemy) return null;

    return (
        <div className={`bg-slate-800/50 p-4 rounded-lg border-2 border-red-500/30 animate-pulse-border ${isEnemyHit ? 'animate-enemy-hit' : ''}`}>
            <h3 className="font-title text-xl text-red-400">{enemy.name}</h3>
            <p className="text-stone-400 text-sm italic mb-2">{enemy.description}</p>
            <div className="flex justify-between text-sm mb-1"><span>HP</span><span>{enemy.hp} / {enemy.maxHp}</span></div>
            <HealthBar current={enemy.hp} max={enemy.maxHp} colorClass="bg-red-500" />
        </div>
    );
};

export default memo(EnemyPanel);