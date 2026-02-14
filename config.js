/**
 * Configuration file for API keys
 * 
 * DEPLOYMENT INSTRUCTIONS:
 * 1. For Vercel: Set these as Environment Variables in Vercel Dashboard
 *    - Go to Project Settings > Environment Variables
 *    - Add HUGGINGFACE_API_KEY and GEMINI_API_KEY
 * 
 * 2. For local development: Create a config.local.js file (gitignored)
 *    with your actual API keys
 * 
 * This file should only contain placeholder/empty values
 */

// Try to load from config.local.js first (for local development)
let localConfig = {};
try {
    if (typeof configLocal !== 'undefined') {
        localConfig = configLocal;
    }
} catch (e) {
    // config.local.js not found, which is fine for production
}

// Export configuration
const CONFIG = {
    // Hugging Face API Key
    // Get your FREE key from: https://huggingface.co/settings/tokens
    HUGGINGFACE_API_KEY: localConfig.HUGGINGFACE_API_KEY || '',

    // Gemini API Key (fallback)
    // Get your key from: https://aistudio.google.com/apikey
    GEMINI_API_KEY: localConfig.GEMINI_API_KEY || '',
};

// Make available globally
if (typeof window !== 'undefined') {
    window.APP_CONFIG = CONFIG;
}
