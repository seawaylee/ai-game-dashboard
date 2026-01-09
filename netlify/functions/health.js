// Simple health check endpoint
exports.handler = async (event, context) => {
    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            status: 'ok',
            message: 'Netlify Functions are working',
            env: {
                hasApiKey: !!process.env.API_KEY,
                hasBaseUrl: !!process.env.TARGET_BASE_URL
            }
        })
    };
};
