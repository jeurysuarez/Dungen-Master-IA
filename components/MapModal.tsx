import React, { useState, useRef, WheelEvent, MouseEvent, useEffect } from 'react';

interface MapModalProps {
    mapData: string;
    onClose: () => void;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 4;

const MapModal: React.FC<MapModalProps> = ({ mapData, onClose }) => {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // Escape key to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const zoomFactor = 1.1;
        const newScale = e.deltaY < 0 ? scale * zoomFactor : scale / zoomFactor;
        const clampedScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

        // Pan to zoom towards the cursor
        const worldX = (mouseX - position.x) / scale;
        const worldY = (mouseY - position.y) / scale;
        
        const newX = mouseX - worldX * clampedScale;
        const newY = mouseY - worldY * clampedScale;

        setScale(clampedScale);
        setPosition({ x: newX, y: newY });
    };

    const handleMouseDown = (e: MouseEvent) => {
        setIsDragging(true);
        setStartDrag({ x: e.clientX, y: e.clientY });
        if(containerRef.current) containerRef.current.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        
        const dx = e.clientX - startDrag.x;
        const dy = e.clientY - startDrag.y;
        
        setPosition({ x: position.x + dx, y: position.y + dy });
        setStartDrag({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        if(containerRef.current) containerRef.current.style.cursor = 'grab';
    };

    const handleMouseLeave = () => {
        if (isDragging) {
            setIsDragging(false);
            if(containerRef.current) containerRef.current.style.cursor = 'grab';
        }
    };

    const zoomWithClamping = (newScale: number) => {
        return Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
    }
    
    // Zooms towards the center of the container
    const applyZoom = (zoomFactor: number) => {
        if (!containerRef.current) return;
        const newScale = zoomWithClamping(scale * zoomFactor);
        
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const worldX = (centerX - position.x) / scale;
        const worldY = (centerY - position.y) / scale;
    
        const newX = centerX - worldX * newScale;
        const newY = centerY - worldY * newScale;

        setScale(newScale);
        setPosition({ x: newX, y: newY });
    }

    const zoomIn = () => applyZoom(1.25);
    const zoomOut = () => applyZoom(0.8);
    
    const resetView = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn" onClick={onClose}>
            <div className="w-full max-w-3xl h-[80vh] bg-slate-900 rounded-xl shadow-2xl border-2 border-purple-500/50 p-6 m-4 text-stone-200 font-body flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-4 flex-shrink-0">
                    <h2 className="font-title text-4xl text-amber-400">Mapa</h2>
                    <button onClick={onClose} className="text-stone-400 hover:text-white text-3xl font-bold">&times;</button>
                </div>
                
                <div 
                    ref={containerRef}
                    className="flex-grow relative bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden cursor-grab"
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                >
                    <div 
                        style={{
                            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                            transformOrigin: '0 0',
                        }}
                        className="whitespace-pre-wrap p-4 transition-transform duration-100 ease-out"
                    >
                        <p className="font-mono">{mapData}</p>
                    </div>
                    
                    <div className="absolute bottom-2 right-2 flex flex-col gap-1 z-10">
                        <button onClick={zoomIn} className="w-10 h-10 bg-slate-900/80 rounded-full text-xl font-bold text-stone-300 hover:bg-purple-700 transition-colors flex items-center justify-center" aria-label="Acercar">+</button>
                        <button onClick={zoomOut} className="w-10 h-10 bg-slate-900/80 rounded-full text-xl font-bold text-stone-300 hover:bg-purple-700 transition-colors flex items-center justify-center" aria-label="Alejar">-</button>
                        <button onClick={resetView} className="w-10 h-10 bg-slate-900/80 rounded-full text-xs font-bold text-stone-300 hover:bg-purple-700 transition-colors flex items-center justify-center" aria-label="Restablecer vista">Reset</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapModal;
