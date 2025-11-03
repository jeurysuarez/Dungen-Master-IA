// Fix: Refactored to use server-side API routes for security.
import { Character, Ally, Enemy, DMResponse } from '../types';

export const sendMessageToDM = async (
    message: string,
    character: Character,
    party: Ally[],
    enemy: Enemy | null,
    storyLog: string[]
): Promise<DMResponse> => {
    try {
        const response = await fetch('/api/dm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, character, party, enemy, storyLog }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        
        return await response.json() as DMResponse;

    } catch (error) {
        console.error("Error calling DM API endpoint:", error);
        return {
            storyText: "El Dungeon Master parece confundido por un momento (hubo un error con el servidor). Por favor, intenta tu acción de nuevo.",
        };
    }
};

export const generateSpeech = async (text: string): Promise<string | null> => {
    try {
        const response = await fetch('/api/tts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.audioContent || null;

    } catch (error) {
        console.error("Error calling TTS API endpoint:", error);
        return null;
    }
};
