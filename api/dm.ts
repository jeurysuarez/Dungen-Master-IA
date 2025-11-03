// Fix: Implemented the serverless API route for the Dungeon Master AI.
import { GoogleGenAI, Type } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Character, Ally, Enemy } from '../types';

// Helper to construct the detailed prompt for the Gemini model
const buildPrompt = (
    message: string,
    character: Character,
    party: Ally[],
    enemy: Enemy | null,
    storyLog: string[]
): string => {
    // Character details
    const charDetails = `
Tu personaje:
- Nombre: ${character.name}
- Raza: ${character.race}
- Clase: ${character.characterClass}
- Nivel: ${character.level}
- HP: ${character.hp}/${character.maxHp}
- MP: ${character.mp}/${character.maxMp}
- Habilidades: ${character.skills.map(s => s.name).join(', ')}
- Hechizos: ${character.spells.map(s => s.name).join(', ') || 'Ninguno'}
- Inventario: ${character.inventory.map(i => `${i.name} (x${i.quantity})`).join(', ')}
    `.trim();

    // Party details
    const partyDetails = party.length > 0
        ? `Tus aliados: \n${party.map(p => `- ${p.name} (${p.characterClass}), HP: ${p.hp}/${p.maxHp}`).join('\n')}`
        : "Estás solo.";

    // Enemy details
    const enemyDetails = enemy
        ? `Enemigo actual: \n- ${enemy.name}, HP: ${enemy.hp}/${enemy.maxHp}. Descripción: ${enemy.description}`
        : "No hay enemigos presentes.";

    // Story context
    const storyContext = `
Resumen de la historia hasta ahora (lo más reciente al final):
${storyLog.slice(-5).join('\n')}
    `.trim();

    // The player's action
    const playerAction = `Acción del jugador: "${message}"`;

    return `
${charDetails}
${partyDetails}
${enemyDetails}
${storyContext}
${playerAction}
    `.trim();
};


export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    if (!process.env.API_KEY) {
        return res.status(500).json({ error: "API key not found on server." });
    }

    try {
        const { message, character, party, enemy, storyLog } = req.body;

        const prompt = buildPrompt(message, character, party, enemy, storyLog);

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro", // Using a more powerful model for complex state management
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                // System Instruction to guide the model's behavior
                systemInstruction: `
Eres un Dungeon Master de IA para un juego de rol de texto. Tu objetivo es crear una aventura de fantasía épica, interactiva y atractiva.
Reglas:
1. Responde en español.
2. Sé descriptivo y evocador. Pinta una imagen vívida del mundo.
3. Avanza la historia basándote en las acciones del jugador. Introduce nuevos desafíos, personajes (PNJs), y misterios.
4. Si hay un enemigo, narra el resultado del combate.
5. Gestiona las consecuencias. Las acciones del jugador deben tener un impacto en el mundo.
6. Si el jugador hace algo inteligente, recompénsalo. Si hace algo tonto, debe haber consecuencias.
7. Mantén el tono de fantasía épica, pero con momentos de humor o intriga si es apropiado.
8. Controla a los PNJs y enemigos de forma creíble.
9. Al final de tu narración, presenta siempre una situación o pregunta clara que invite al jugador a actuar. (Ej: "¿Qué haces?", "El camino se bifurca. ¿Vas a la izquierda o a la derecha?").
10. La respuesta SIEMPRE debe ser un único objeto JSON, sin ningún texto o formato adicional como \`\`\`json.
                `.trim(),
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        storyText: { type: Type.STRING, description: "La narración de lo que sucede a continuación en la historia, terminando con una pregunta para el jugador." },
                        characterUpdate: {
                            type: Type.OBJECT,
                            description: "Actualizaciones de estado para el personaje del jugador (HP, MP, XP, etc.). Solo incluye los campos que cambian.",
                            properties: {
                                hp: { type: Type.NUMBER },
                                mp: { type: Type.NUMBER },
                                xp: { type: Type.NUMBER },
                                level: { type: Type.NUMBER },
                                xpToNextLevel: { type: Type.NUMBER }
                            }
                        },
                        partyUpdate: {
                            type: Type.ARRAY,
                            description: "Actualizaciones de HP para los miembros del grupo. Solo incluye a los que cambian.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    hp: { type: Type.NUMBER },
                                    maxHp: { type: Type.NUMBER }
                                }
                            }
                        },
                        newEnemy: {
                            type: Type.OBJECT,
                            description: "Un nuevo enemigo que aparece. Nulo si no aparece ninguno.",
                            properties: {
                                name: { type: Type.STRING },
                                hp: { type: Type.NUMBER },
                                maxHp: { type: Type.NUMBER },
                                description: { type: Type.STRING },
                                attackBonus: { type: Type.NUMBER }
                            }
                        },
                        removeEnemy: { type: Type.BOOLEAN, description: "Establecer en verdadero si el enemigo actual es derrotado." },
                        loot: {
                            type: Type.ARRAY,
                            description: "Objetos que el jugador encuentra o recibe.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    quantity: { type: Type.NUMBER },
                                    description: { type: Type.STRING }
                                }
                            }
                        },
                        event: { type: Type.STRING, description: "Eventos especiales como 'battle-won', 'player-dead', 'level-up'." }
                    },
                    required: ["storyText"]
                }
            },
        });

        // The response text should be a JSON string.
        const jsonResponse = JSON.parse(response.text.trim());
        res.status(200).json(jsonResponse);

    } catch (error) {
        console.error('Error in /api/dm:', error);
        // Provide a more helpful in-game error message
        res.status(500).json({ storyText: "Una niebla arcana interfiere con la mente del Dungeon Master. No puede procesar tu petición en este momento. Inténtalo de nuevo." });
    }
}
