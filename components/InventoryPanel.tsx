import React, { useState, memo } from 'react';
import { useGame } from '../context/GameContext';
import { Item } from '../types';
import Tooltip from './Tooltip';

interface InventoryPanelProps {
    setPlayerInput: (input: string) => void;
}

const InventoryPanel: React.FC<InventoryPanelProps> = ({ setPlayerInput }) => {
    const { gameState } = useGame();
    const { character, party } = gameState!;
    const [activeItemMenu, setActiveItemMenu] = useState<{itemName: string; view: 'main' | 'targets'} | null>(null);

    const handleItemClick = (item: Item) => {
        if (activeItemMenu?.itemName === item.name) {
            setActiveItemMenu(null);
        } else {
            setActiveItemMenu({ itemName: item.name, view: 'main' });
        }
    };
    
    const handleItemAction = (action: 'use_self' | 'examine' | 'use_on_target', item: Item, target?: string) => {
        switch(action) {
            case 'use_self':
                setPlayerInput(`Uso ${item.name}`);
                break;
            case 'examine':
                setPlayerInput(`Examino ${item.name}`);
                break;
            case 'use_on_target':
                if (target) {
                    setPlayerInput(`Uso ${item.name} en ${target}`);
                }
                break;
        }
        setActiveItemMenu(null);
    };
    
    return (
         <div className="bg-slate-800/50 p-4 rounded-lg">
            <h3 className="font-title text-xl text-amber-400 mb-2">Inventario</h3>
            {character.inventory.length > 0 ? (
                <div className="space-y-1">
                    {character.inventory.map((item) => (
                        <React.Fragment key={item.name}>
                            <Tooltip text={
                                <div className="text-left">
                                    <h4 className="font-bold text-stone-100">{item.name}</h4>
                                    <p className="text-sm text-stone-300">{item.description}</p>
                                </div>
                            }>
                                <button onClick={() => handleItemClick(item)} className="flex justify-between w-full p-1 text-left rounded hover:bg-slate-700/50 transition-colors">
                                    <span className="text-stone-300">{item.name}</span>
                                    <span className="text-stone-400 font-mono">x{item.quantity}</span>
                                </button>
                            </Tooltip>
                             {activeItemMenu?.itemName === item.name && (
                                <div className="item-action-menu">
                                    {activeItemMenu.view === 'main' ? (
                                        <>
                                            <button onClick={() => handleItemAction('use_self', item)} className="item-action-button">Usar</button>
                                            <button onClick={() => setActiveItemMenu({ itemName: item.name, view: 'targets' })} className="item-action-button">Usar en...</button>
                                            <button onClick={() => handleItemAction('examine', item)} className="item-action-button">Examinar</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => handleItemAction('use_on_target', item, character.name)} className="item-action-button">{character.name} (Yo)</button>
                                            {party.map(ally => (
                                                <button key={ally.name} onClick={() => handleItemAction('use_on_target', item, ally.name)} className="item-action-button">{ally.name}</button>
                                            ))}
                                            <button onClick={() => handleItemAction('use_on_target', item, 'el entorno')} className="item-action-button">Entorno</button>
                                            <button onClick={() => setActiveItemMenu({ itemName: item.name, view: 'main' })} className="item-action-cancel-button">Atrás</button>
                                        </>
                                    )}
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            ) : (
                <p className="text-stone-500 italic">Vacío</p>
            )}
        </div>
    );
};

export default memo(InventoryPanel);
