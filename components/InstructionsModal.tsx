import React, { useEffect } from 'react';

interface InstructionsModalProps {
    onClose: () => void;
}

const InstructionsModal: React.FC<InstructionsModalProps> = ({ onClose }) => {
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
            <div 
                className="w-full max-w-2xl bg-slate-900 rounded-xl shadow-2xl border-2 border-purple-500/50 p-6 m-4 text-stone-200 font-body max-h-[90vh] overflow-y-auto story-scrollbar" 
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-6">
                    <h2 className="font-title text-4xl text-amber-400">Cómo Jugar</h2>
                    <button onClick={onClose} className="text-stone-400 hover:text-white text-3xl font-bold">&times;</button>
                </div>
                
                <div className="space-y-4 text-stone-300">
                    <div>
                        <h3 className="font-bold text-xl text-purple-400 mb-1">Tu Misión</h3>
                        <p>
                            Tu objetivo es sumergirte en una aventura de fantasía. Eres el protagonista de una historia dirigida por un Dungeon Master (DM) de inteligencia artificial. No hay un camino correcto o incorrecto, solo tus decisiones y sus consecuencias.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold text-xl text-purple-400 mb-1">Interactuar con el Mundo</h3>
                        <p>
                            Usa la caja de texto en la parte inferior para decirle al DM qué quieres hacer. Describe tus acciones con naturalidad, como si estuvieras hablando con una persona.
                        </p>
                        <ul className="list-disc list-inside mt-2 pl-4 bg-slate-800/50 p-3 rounded-md">
                            <li><span className="italic">"Miro alrededor de la posada."</span></li>
                            <li><span className="italic">"Le pregunto al posadero si ha oído algún rumor."</span></li>
                            <li><span className="italic">"Intento abrir el cofre con sigilo."</span></li>
                            <li><span className="italic">"Ataco al goblin con mi espada."</span></li>
                        </ul>
                    </div>
                     <div>
                        <h3 className="font-bold text-xl text-purple-400 mb-1">Usa tu Interfaz</h3>
                        <p>
                           Los paneles a la derecha (o en pestañas en el móvil) son tu centro de mando. Desde ahí puedes:
                        </p>
                        <ul className="list-disc list-inside mt-2 pl-4">
                           <li><strong>Usar Habilidades y Hechizos:</strong> Simplemente haz clic en el icono de una habilidad para usarla.</li>
                           <li><strong>Gestionar tu Inventario:</strong> Haz clic en un objeto para ver opciones como "Usar", "Usar en..." o "Examinar".</li>
                           <li><strong>Consultar el Mapa:</strong> Si el DM te da un mapa, aparecerá un icono (🗺️) en tu panel de personaje.</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-xl text-purple-400 mb-1">Consejos para el Éxito</h3>
                        <p>
                           <strong>Sé creativo:</strong> ¡La IA puede reaccionar a ideas inesperadas! Intenta usar objetos de formas creativas o hablar con cualquier personaje.
                        </p>
                        <p className="mt-2">
                           <strong>Presta atención:</strong> Las descripciones del DM a menudo contienen pistas importantes sobre tu entorno, tesoros ocultos o la debilidad de un enemigo.
                        </p>
                    </div>
                </div>

                <button onClick={onClose} className="w-full mt-8 py-3 bg-purple-700 text-stone-100 font-bold rounded-lg hover:bg-purple-600 transition-colors text-xl">
                    ¡A la Aventura!
                </button>
            </div>
        </div>
    );
};

export default InstructionsModal;