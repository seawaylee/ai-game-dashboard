import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Configure dotenv to read from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.API_KEY;
const TARGET_BASE_URL = process.env.TARGET_BASE_URL || 'https://api.34ku.com';

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'lingocard-backend' });
});

// Proxy for Gemini Generate Content
app.post('/api/gemini/:model/:action', async (req, res) => {
    try {
        const { model, action } = req.params;
        // Construct upstream URL
        // Example: https://api.34ku.com/v1beta/models/gemini-2.0-flash:generateContent?key=...
        const upstreamUrl = `${TARGET_BASE_URL}/v1beta/models/${model}:${action}?key=${API_KEY}`;

        console.log(`Proxying Gemini Request: ${model}:${action}`);

        const response = await fetch(upstreamUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Upstream API Error:', data);
            return res.status(response.status).json(data);
        }

        res.json(data);
    } catch (error) {
        console.error('Proxy Server Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Proxy for OpenAI TTS
app.post('/api/openai/speech', async (req, res) => {
    try {
        const upstreamUrl = `${TARGET_BASE_URL}/v1/audio/speech`;
        console.log(`Proxying TTS Request to ${upstreamUrl}`);

        const response = await fetch(upstreamUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify(req.body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Upstream TTS Error:', errorText);
            return res.status(response.status).send(errorText);
        }

        // Get audio buffer and send back
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        res.setHeader('Content-Type', 'audio/mpeg');
        res.send(buffer);

    } catch (error) {
        console.error('TTS Proxy Server Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`LingoCard Backend running on http://localhost:${PORT}`);
    console.log(`Target API: ${TARGET_BASE_URL}`);
});
