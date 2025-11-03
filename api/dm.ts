// Vercel Edge Functions are fast, but for Node.js specific APIs or longer timeouts,
// you might prefer a standard Serverless Function. For this API-heavy task,
// a standard serverless function is a better fit. This file should be placed in `/api/dm.ts`.
// It's not a default export, but a named export for the handler.
// The file needs to export a handler function.
import { GoogleGenAI, Chat } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Character, Ally, Enemy } from '../types';

// This function needs to be the default export to be recognized by Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { message, character, party, enemy, storyLog } = req.body;
        
        if (!process.env.API_KEY) {
            return res.status(500).json({ error: "API key not found on server." });
        }
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

        const systemInstruction = getSystemInstruction(character, party, enemy, storyLog);
        
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: { systemInstruction }
        });

        const response = await chat.sendMessage({ message });
        const text = response.text.trim();
        const cleanedText = text.replace(/^```json\s*|```$/g, '');
        
        // Vercel hobby plan has a 10s timeout, let's send response quickly
        res.status(200).json(JSON.parse(cleanedText));

    } catch (error) {
        console.error('Error in /api/dm:', error);
        res.status(500).json({ error: 'Failed to get response from AI.' });
    }
}
