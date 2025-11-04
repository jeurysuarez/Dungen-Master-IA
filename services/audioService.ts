let audioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;

const getAudioContext = () => {
    if (typeof window !== 'undefined' && !audioContext) {
        try {
            audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            masterGain = audioContext.createGain();
            masterGain.connect(audioContext.destination);
        } catch (e) {
            console.error("Web Audio API is not supported in this browser.");
        }
    }
    return { audioContext, masterGain };
};

export const setVolume = (volume: number) => {
    const { masterGain, audioContext } = getAudioContext();
    if (masterGain && audioContext) {
        masterGain.gain.setValueAtTime(volume, audioContext.currentTime);
    }
};

// Fix: Removed the unused 'decay' parameter to resolve a type error in a function call on line 89.
const playSound = (type: OscillatorType, frequency: number, duration: number, attack: number = 0.01, addVariation: boolean = false) => {
    const { audioContext: ctx, masterGain } = getAudioContext();
    if (!ctx || !masterGain) return;
    
    if (ctx.state === 'suspended') {
        ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    const freqVariation = addVariation ? (Math.random() - 0.5) * 20 : 0;

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency + freqVariation, ctx.currentTime);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.7, ctx.currentTime + attack);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(masterGain);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
};

const playNoise = (duration: number) => {
    const { audioContext: ctx, masterGain } = getAudioContext();
    if (!ctx || !masterGain) return;

    if (ctx.state === 'suspended') {
        ctx.resume();
    }

    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    const freqVariation = (Math.random() - 0.5) * 400;
    bandpass.frequency.value = 1000 + freqVariation;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    
    noise.connect(bandpass);
    bandpass.connect(gainNode);
    gainNode.connect(masterGain);

    noise.start();
    noise.stop(ctx.currentTime + duration);
};


export const playClick = () => playSound('sine', 440, 0.1, 0.01, true);
export const playAttack = () => playNoise(0.3);
export const playSpell = () => playSound('triangle', 880, 0.4, 0.02);
export const playHeal = () => playSound('sine', 660, 0.5, 0.1);
export const playPlayerHit = () => playSound('square', 110, 0.2);