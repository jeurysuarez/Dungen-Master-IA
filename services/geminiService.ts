
import { GoogleGenAI, Chat, GenerateContentResponse, Modality } from "@google/genai";
import { Character, Ally, Enemy, DMResponse } from '../types';

let ai: GoogleGenAI;
let chat: Chat | null = null;

function getAI() {
    if (!ai) {
        if (!process.env.API_KEY) {
            throw new Error("API key not found. Please set the API_KEY environment variable.");
        }
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
}

const getSystemInstruction = (character: Character, party: Ally[], enemy: Enemy | null, storyLog: string[]): string => {
    const partyStatus = party.map(p => `${p.name} (PS: ${p.hp}/${p.maxHp})`).join(', ') || "Ninguno";
    const enemyStatus = enemy ? `${enemy.name} (PS: ${enemy.hp}/${enemy.maxHp}, CA: ${enemy.armorClass}, Bono de Ataque: ${enemy.attackBonus})` : "Ninguno";
    const last5turns = storyLog.slice(-10).join('\n');

    // Fix: Corrected the malformed JSON example within the template literal, which was causing TypeScript parsing errors.
    // A misleading comment inside the string was removed and the code fence now correctly specifies 'json'.
    return `
Eres un Dungeon Master experto para un juego de Dungeons & Dragons de un solo jugador, en español. Tu objetivo es crear una aventura de fantasía épica, emocionante y coherente.
El jugador te enviará sus acciones y tú debes responder con la progresión de la historia.

**REGLAS CRÍTICAS:**
1.  **Idioma:** TODA tu comunicación debe ser en español.
2.  **Formato de Respuesta:** SIEMPRE debes responder con un objeto JSON válido, sin excepciones. No incluyas "'''json" o "'''" en tu respuesta. La respuesta debe ser únicamente el objeto JSON.
3.  **Flujo del Juego:** Controlas la narrativa, los NPCs, los enemigos y el mundo. Describe el entorno, los resultados de las acciones del jugador y los eventos que ocurren.
4.  **Combate:**
    *   Cuando introduces un enemigo, debes rellenar el campo \`encounter\`, incluyendo una descripción.
    *   El jugador te informará del resultado de su tirada de ataque (d20 + bono de ataque). Tú debes comparar ese total con la Clase de Armadura (CA) del enemigo. Si el total es igual o mayor, el ataque acierta.
    *   Tú simulas el daño del jugador y el tuyo propio. Describe el resultado del ataque en \`storyText\`.
    *   Actualiza los puntos de salud (PS) usando los campos \`playerUpdate\`, \`enemyUpdate\` y \`partyUpdate\`.
    *   Cuando el PS de un enemigo llega a 0, está derrotado. Finaliza el combate con \`combatOver: true\` y otorga experiencia con \`xpAward\`.
5.  **Progresión:** Otorga objetos (\`loot\`), introduce nuevos aliados (\`newAlly\`) y da puntos de experiencia (\`xpAward\`) cuando sea apropiado.

**ESTADO ACTUAL DEL JUEGO:**
*   **Personaje del Jugador:**
    *   Nombre: ${character.name}, Raza: ${character.race}, Clase: ${character.characterClass}
    *   Nivel: ${character.level}, XP: ${character.xp}/${character.xpToNextLevel}
    *   Salud: ${character.hp}/${character.maxHp} PS, Maná: ${character.mp}/${character.maxMp} PM
    *   Estadísticas de Combate: Bono de Ataque: ${character.attackBonus}, Clase de Armadura: ${character.armorClass}
    *   Habilidades: ${character.skills.map(s => `${s.name} (Enfriamiento: ${s.cooldown} turnos)`).join(', ') || "Ninguna"}
    *   Hechizos: ${character.spells.map(s => `${s.name} (Coste: ${s.cost} PM)`).join(', ') || "Ninguno"}
*   **Grupo de Aliados:** ${partyStatus}
*   **Enemigo Actual:** ${enemyStatus}
*   **Últimos Eventos:**
${last5turns}

**ESTRUCTURA JSON DE RESPUESTA OBLIGATORIA:**
\`\`\`json
{
  "storyText": "La narrativa principal. Describe lo que sucede.",
  "encounter": { "name": "...", "hp": 0, "maxHp": 0, "attackBonus": 0, "armorClass": 0, "description": "Una descripción detallada del enemigo, incluyendo posibles pistas sobre sus fortalezas o debilidades." },
  "playerUpdate": { "hp": 0, "mp": 0 },
  "enemyUpdate": { "hp": 0 },
  "partyUpdate": [{ "name": "...", "hp": 0 }],
  "loot": [{ "name": "...", "quantity": 0 }],
  "newAlly": { "name": "...", "race": "...", "characterClass": "...", "hp": 0, "maxHp": 0, "attackBonus": 0, "armorClass": 0 },
  "combatOver": false,
  "xpAward": 0
}
\`\`\`
Ahora, continúa la aventura basándote en la siguiente acción del jugador.
`;
};


export const startNewAdventure = (character: Character, party: Ally[], enemy: Enemy | null, storyLog: string[]) => {
    const ai = getAI();
    chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: getSystemInstruction(character, party, enemy, storyLog)
        }
    });
};

export const sendMessageToDM = async (
    message: string,
    character: Character,
    party: Ally[],
    enemy: Enemy | null,
    storyLog: string[]
): Promise<DMResponse> => {
    if (!chat) {
        throw new Error("Chat not initialized. Call startNewAdventure first.");
    }

    // This is not a standard Gemini API feature, but for our game logic, we'll update the context.
    // In a real scenario, you'd manage history differently or use models with longer context windows.
    // For this implementation, we will start a new chat with updated system instruction to keep context fresh.
    const ai = getAI();
    chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: getSystemInstruction(character, party, enemy, storyLog)
        }
    });

    try {
        const response: GenerateContentResponse = await chat.sendMessage({ message });
        const text = response.text.trim();
        // Clean the response in case it includes markdown ticks
        const cleanedText = text.replace(/^```json\s*|```$/g, '');
        const parsedResponse: DMResponse = JSON.parse(cleanedText);
        return parsedResponse;
    } catch (error) {
        console.error("Error parsing Gemini response:", error);
        if (error instanceof Error) {
          console.error("Raw response text:", (error as any)?.response?.text);
        }
        return {
            storyText: "El Dungeon Master parece confundido por un momento (hubo un error al procesar la respuesta). Por favor, intenta tu acción de nuevo.",
        };
    }
};

export const generateSpeech = async (text: string): Promise<string | null> => {
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            // Fix: Updated deprecated TTS model name to the recommended one.
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Puck' },
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        return base64Audio || null;
    } catch (error) {
        console.error("Error generating speech:", error);
        return null;
    }
};
