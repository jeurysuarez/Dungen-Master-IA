// Fix: Implemented the serverless API route for the Dungeon Master AI.
import { GoogleGenAI, Type } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Character, Ally, Enemy, Race, CharacterClass, Spell, Skill } from '../types';
import { DM_SYSTEM_PROMPT } from '../prompts';

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
            contents: prompt,
            config: {
                systemInstruction: DM_SYSTEM_PROMPT,
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
                        newPartyMembers: {
                            type: Type.ARRAY,
                            description: "Nuevos aliados que se unen al grupo. Nulo si no se une nadie.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    race: { type: Type.STRING, enum: Object.values(Race) },
                                    characterClass: { type: Type.STRING, enum: Object.values(CharacterClass) },
                                    level: { type: Type.NUMBER },
                                    hp: { type: Type.NUMBER },
                                    maxHp: { type: Type.NUMBER },
                                    mp: { type: Type.NUMBER },
                                    maxMp: { type: Type.NUMBER },
                                    attackBonus: { type: Type.NUMBER },
                                    armorClass: { type: Type.NUMBER },
                                    spells: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: {type: Type.STRING}, cost: {type: Type.NUMBER}, description: {type: Type.STRING}}}},
                                    skills: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: {type: Type.STRING}, description: {type: Type.STRING}, iconName: {type: Type.STRING}}}},
                                    isPlayer: {type: Type.BOOLEAN, description: "Siempre debe ser 'false' para los aliados."},
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
                        event: { type: Type.STRING, description: "Eventos especiales como 'battle-won', 'player-dead', 'level-up'." },
                        ambience: { type: Type.STRING, description: "Una sola palabra clave en inglés (snake_case) que describa el ambiente. Ej: 'dark_cave', 'sunny_forest', 'tense_battle', 'cozy_tavern'." },
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
        res.status(500).json({ storyText: "[ERROR] Una niebla arcana interfiere con la mente del Dungeon Master. No puede procesar tu petición en este momento. Inténtalo de nuevo." });
    }
}
