// Fix: Added content for the MapModal component.
import React, { useEffect } from 'react';

interface MapModalProps {
    mapData: string;
    onClose: () => void;
}

const MapModal: React.FC<MapModalProps> = ({ mapData, onClose }) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn" onClick={onClose}>
            <div className="w-full max-w-lg bg-slate-900 rounded-xl shadow-2xl border-2 border-purple-500/50 p-6 m-4 text-stone-200 font-body" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-4">
                    <h2 className="font-title text-4xl text-amber-400">Mapa</h2>
                    <button onClick={onClose} className="text-stone-400 hover:text-white text-3xl font-bold">&times;</button>
                </div>
                
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 whitespace-pre-wrap">
                    <p>{mapData}</p>
                </div>
            </div>
        </div>
    );
};

export default MapModal;
