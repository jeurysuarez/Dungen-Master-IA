// This file should be placed in /api/tts.ts
import { GoogleGenAI, Modality } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        if (!process.env.API_KEY) {
            return res.status(500).json({ error: "API key not found on server." });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

        if (base64Audio) {
            res.status(200).json({ audioContent: base64Audio });
        } else {
            res.status(500).json({ error: 'Failed to generate audio' });
        }

    } catch (error) {
        console.error('Error in /api/tts:', error);
        res.status(500).json({ error: 'Failed to generate audio.' });
    }
}
