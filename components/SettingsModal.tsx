import React, { useEffect } from 'react';
import { Settings } from '../types';
import { IconSoundOn, IconSoundOff } from './Icons';

interface SettingsModalProps {
    settings: Settings;
    onClose: () => void;
    onSettingsChange: (newSettings: Partial<Settings>) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onClose, onSettingsChange }) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const textSpeedLabel = (speed: number) => {
        if (speed === 0) return 'Instantáneo';
        if (speed <= 50) return 'Normal';
        return 'Lento';
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn" onClick={onClose}>
            <div className="w-full max-w-md bg-gray-900 rounded-xl shadow-2xl border-2 border-yellow-500/50 p-6 m-4 text-white" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-6">
                    <h2 className="font-title text-4xl text-yellow-400">Ajustes</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-bold">&times;</button>
                </div>
                
                <div className="space-y-6">
                    {/* TTS Toggle */}
                    <div className="flex justify-between items-center">
                        <label className="text-lg text-gray-300">Narración por Voz (TTS)</label>
                        <button onClick={() => onSettingsChange({ ttsEnabled: !settings.ttsEnabled })} className="p-2 rounded-full bg-gray-800/50 hover:bg-yellow-600/50 transition-colors">
                            {settings.ttsEnabled ? <IconSoundOn className="w-8 h-8 text-yellow-400"/> : <IconSoundOff className="w-8 h-8 text-gray-500"/>}
                        </button>
                    </div>

                    {/* Volume Slider */}
                    <div>
                        <label htmlFor="volume" className="block text-lg font-semibold mb-2 text-gray-300">Volumen: {Math.round(settings.volume * 100)}%</label>
                        <input
                            id="volume"
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={settings.volume}
                            onChange={(e) => onSettingsChange({ volume: parseFloat(e.target.value) })}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    {/* Text Speed Slider */}
                    <div>
                        <label htmlFor="text-speed" className="block text-lg font-semibold mb-2 text-gray-300">Velocidad del Texto: {textSpeedLabel(settings.textSpeed)}</label>
                         <input
                            id="text-speed"
                            type="range"
                            min="0"
                            max="100"
                            step="50"
                            value={settings.textSpeed}
                            onChange={(e) => onSettingsChange({ textSpeed: parseInt(e.target.value, 10) })}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>

                <button onClick={onClose} className="w-full mt-8 py-3 bg-yellow-600 text-gray-900 font-bold rounded-lg hover:bg-yellow-500 transition-colors text-xl">
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default SettingsModal;