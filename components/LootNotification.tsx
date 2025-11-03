

import React, { useEffect, useState } from 'react';
// Fix: Corrected import paths for types and icons.
import { Item } from '../types';
import { IconTreasureChest, IconX } from './Icons';

interface LootNotificationProps {
  loot: Item[];
  onDismiss: () => void;
}

const LootNotification: React.FC<LootNotificationProps> = ({ loot, onDismiss }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (loot.length > 0) {
            setVisible(true);
            const timer = setTimeout(() => {
                handleDismiss();
            }, 5000); // Auto-dismiss after 5 seconds
            return () => clearTimeout(timer);
        }
    }, [loot]);

    const handleDismiss = () => {
        setVisible(false);
        // Allow fade-out animation to complete before calling parent onDismiss
        setTimeout(onDismiss, 300);
    };

    if (!visible || loot.length === 0) {
        return null;
    }

    return (
        <div className={`fixed bottom-4 right-4 w-full max-w-sm bg-slate-800 border-2 border-amber-500/50 rounded-lg shadow-2xl text-stone-200 p-4 z-50 transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex items-start">
                <div className="flex-shrink-0 pt-1">
                    <IconTreasureChest className="w-8 h-8 text-amber-400" />
                </div>
                <div className="ml-4 flex-1">
                    <h3 className="text-xl font-bold text-amber-400 font-title">¡Botín Obtenido!</h3>
                    <ul className="mt-2 list-disc list-inside">
                        {loot.map((item, index) => (
                            <li key={index} className="text-stone-300">
                                {item.name} {item.quantity > 1 && `(x${item.quantity})`}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="ml-4 flex-shrink-0">
                    <button onClick={handleDismiss} className="p-1 rounded-full text-stone-400 hover:bg-slate-700 hover:text-white">
                        <IconX className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LootNotification;
