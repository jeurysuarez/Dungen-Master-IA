// This file should be placed in /api/health.ts
import { GoogleGenAI } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    if (!process.env.API_KEY) {
        return res.status(503).json({ status: 'unavailable', error: "API key not configured on the server." });
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Using `listModels` is a lightweight, non-billable way to check API connectivity.
        await ai.models.list();
        
        res.status(200).json({ status: 'ok', message: 'API connection is healthy.' });

    } catch (error) {
        console.error('API health check failed:', error);
        res.status(503).json({ 
            status: 'unavailable', 
            error: 'Failed to connect to the generative AI service.' 
        });
    }
}