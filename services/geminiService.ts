import { GoogleGenAI, Modality, Chat } from "@google/genai";
import { Character, Ally, Enemy, DMResponse } from '../types';
import { API_KEY } from '../apiKey'; // Importamos la clave desde el nuevo archivo

// Advertencia si la clave no ha sido reemplazada
if (API_KEY === "PEGA_AQUÍ_TU_CLAVE_DE_API_DE_GEMINI") {
    alert("ADVERTENCIA: Debes añadir tu clave de API en el archivo 'apiKey.ts' para que la aplicación funcione.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getSystemInstruction = (character: Character, party: Ally[], enemy: Enemy | null, storyLog: string[]): string => {
    const partyStatus = party.map(p => `${p.name} (PS: ${p.hp}/${p.maxHp})`).join(', ') || "Ninguno";
    const enemyStatus = enemy ? `${enemy.name} (PS: ${enemy.hp}/${enemy.maxHp}, CA: ${enemy.armorClass}, Bono de Ataque: ${enemy.attackBonus})` : "Ninguno";
    const last5turns = storyLog.slice(-10).join('\n');

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

export const sendMessageToDM = async (
    message: string,
    character: Character,
    party: Ally[],
    enemy: Enemy | null,
    storyLog: string[]
): Promise<DMResponse> => {
    try {
        const systemInstruction = getSystemInstruction(character, party, enemy, storyLog);
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: { systemInstruction }
        });
        
        const response = await chat.sendMessage({ message });
        const text = response.text.trim();
        const cleanedText = text.replace(/^```json\s*|```$/g, '');
        
        return JSON.parse(cleanedText) as DMResponse;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return {
            storyText: "El Dungeon Master parece confundido por un momento (hubo un error con la API de Gemini). Por favor, intenta tu acción de nuevo.",
        };
    }
};

export const generateSpeech = async (text: string): Promise<string | null> => {
    try {
        const response = await ai.models.generateContent({
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

        return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;

    } catch (error) {
        console.error("Error generating speech:", error);
        return null;
    }
};
