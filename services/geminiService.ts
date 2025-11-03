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
            console.error("Error from /api/dm:", errorData.error);
            return {
                storyText: `El Dungeon Master parece confundido por un momento (Error del servidor: ${response.statusText}). Por favor, intenta tu acción de nuevo.`,
            };
        }

        const parsedResponse: DMResponse = await response.json();
        return parsedResponse;
    } catch (error) {
        console.error("Error fetching from /api/dm:", error);
        return {
            storyText: "El Dungeon Master parece confundido por un momento (hubo un error de conexión con el servidor). Por favor, intenta tu acción de nuevo.",
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
            console.error("Error from /api/tts:", await response.text());
            return null;
        }

        const data = await response.json();
        return data.audioContent || null;

    } catch (error) {
        console.error("Error fetching from /api/tts:", error);
        return null;
    }
};
