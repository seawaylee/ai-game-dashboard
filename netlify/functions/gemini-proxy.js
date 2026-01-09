// Netlify Serverless Function: Gemini API Proxy
// Path: /.netlify/functions/gemini-proxy

exports.handler = async (event, context) => {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        // Parse path parameters from URL
        // URL format: /.netlify/functions/gemini-proxy?model=xxx&action=yyy
        const params = event.queryStringParameters || {};
        const model = params.model;
        const action = params.action || 'generateContent';

        if (!model) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing model parameter' })
            };
        }

        // Get credentials from environment
        const API_KEY = process.env.API_KEY;
        const TARGET_BASE_URL = process.env.TARGET_BASE_URL || 'https://api.34ku.com';

        if (!API_KEY) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'API_KEY not configured' })
            };
        }

        // Build upstream URL
        const upstreamUrl = `${TARGET_BASE_URL}/v1beta/models/${model}:${action}?key=${API_KEY}`;

        console.log(`[Gemini Proxy] ${model}:${action}`);

        // Forward request to upstream API
        const response = await fetch(upstreamUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: event.body
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('[Gemini Proxy] Upstream error:', data);
            return {
                statusCode: response.status,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            };
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error('[Gemini Proxy] Error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: error.message })
        };
    }
};
