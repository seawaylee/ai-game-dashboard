// Netlify Serverless Function: TTS API Proxy
// Path: /.netlify/functions/tts-proxy

exports.handler = async (event, context) => {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        // Get credentials from environment
        const API_KEY = process.env.API_KEY;
        const TARGET_BASE_URL = process.env.TARGET_BASE_URL || 'https://api.34ku.com';

        if (!API_KEY) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'API_KEY not configured' })
            };
        }

        // Build upstream URL for TTS
        const upstreamUrl = `${TARGET_BASE_URL}/v1/audio/speech`;

        console.log('[TTS Proxy] Request received');

        // Forward request to upstream API
        const response = await fetch(upstreamUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: event.body
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[TTS Proxy] Upstream error:', errorText);
            return {
                statusCode: response.status,
                body: errorText
            };
        }

        // Get audio buffer
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Audio = buffer.toString('base64');

        // Return as base64 to work with Netlify Functions
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'audio/mpeg'
            },
            body: base64Audio,
            isBase64Encoded: true
        };

    } catch (error) {
        console.error('[TTS Proxy] Error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: error.message })
        };
    }
};
