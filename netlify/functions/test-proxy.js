// Test endpoint - mirrors gemini-proxy logic for debugging
exports.handler = async (event, context) => {
    const info = {
        status: 'test-endpoint',
        receivedParams: event.queryStringParameters,
        receivedMethod: event.httpMethod,
        receivedPath: event.path,
        env: {
            hasApiKey: !!process.env.API_KEY,
            hasBaseUrl: !!process.env.TARGET_BASE_URL,
            apiKeyPreview: process.env.API_KEY ? process.env.API_KEY.substring(0, 10) + '...' : null
        },
        proxyWouldCallUrl: process.env.TARGET_BASE_URL
            ? `${process.env.TARGET_BASE_URL}/v1beta/models/${event.queryStringParameters?.model || 'MISSING'}:${event.queryStringParameters?.action || 'generateContent'}?key=***`
            : 'TARGET_BASE_URL not set'
    };

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info, null, 2)
    };
};
