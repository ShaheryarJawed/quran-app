/**
 * AI Islamic Scholar - DeenSphere
 * Gemini API Integration for Islamic Q&A
 */

// Login Protection - Check auth status
let isUserLoggedIn = false;

function checkAuthStatus() {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    isUserLoggedIn = !!user;
    return isUserLoggedIn;
}

// Initial auth check
checkAuthStatus();

// Show login required page if not logged in
function showLoginRequired() {
    const container = document.querySelector('.ai-chat-container');
    if (container) {
        container.innerHTML = `
            <div style="
                min-height: 60vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                padding: 2rem;
            ">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🔐</div>
                <h1 style="font-family: 'Amiri', serif; color: #fbbf24; font-size: 2rem; margin-bottom: 1rem;">
                    Login Required
                </h1>
                <p style="color: #94a3b8; font-size: 1.1rem; max-width: 400px; margin-bottom: 2rem;">
                    AI Islamic Scholar sirf logged-in users ke liye hai. Please sign in karein.
                </p>
                <a href="auth.html" style="
                    background: linear-gradient(135deg, #fbbf24, #f59e0b);
                    color: #0f172a;
                    padding: 1rem 2rem;
                    border-radius: 12px;
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 1.1rem;
                ">
                    Sign In to Continue
                </a>
                <a href="index.html" style="color: #64748b; margin-top: 1rem; text-decoration: none;">
                    ← Back to Dashboard
                </a>
            </div>
        `;
    }
}

// API Configuration - Hugging Face (Primary) + Gemini (Fallback)
// IMPORTANT: Replace these placeholder keys with your own API keys
// Get your FREE Hugging Face API key from: https://huggingface.co/settings/tokens
// Get your Gemini API key from: https://aistudio.google.com/apikey
const HUGGINGFACE_API_KEY = (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.HUGGINGFACE_API_KEY) || ''; // Add your Hugging Face API key here
const GEMINI_API_KEY = (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.GEMINI_API_KEY) || ''; // Add your Gemini API key here

// Hugging Face Models (in priority order)
const HF_MODELS = [
    {
        name: 'Llama 3.2 3B',
        id: 'meta-llama/Llama-3.2-3B-Instruct',
        limit: 1000, // requests per day
        quality: 'high'
    },
    {
        name: 'Gemma 2B',
        id: 'google/gemma-2b-it',
        limit: Infinity, // unlimited
        quality: 'good'
    }
];

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent';

// Track current model usage
let currentModelIndex = 0;

// Islamic Scholar System Prompt
const SYSTEM_PROMPT = `You are "DeenSphere AI Scholar" - a knowledgeable, respectful, and authentic Islamic scholar assistant. Your role is to provide accurate Islamic knowledge based on the Quran and authentic Hadith sources.

## Your Guidelines:

### 1. Language & Response Style:
- Respond in the SAME language the user asks in (Urdu, English, Roman Urdu, or Arabic)
- If the user writes in Roman Urdu, respond in Roman Urdu
- Be conversational, warm, and respectful
- Always start with "Bismillah" or "بسم اللہ الرحمٰن الرحیم" for detailed answers

### 2. Content Guidelines:
- ALWAYS provide references from Quran (Surah name and Ayah number) when citing Quranic verses
- ALWAYS cite Hadith from authentic sources (Bukhari, Muslim, Tirmidhi, Abu Dawud, Nasai, Ibn Majah, Muwatta Malik)
- Include the Arabic text when quoting Quran or Hadith
- Explain the meaning in simple terms
- If there are different scholarly opinions, mention them fairly

### 3. Topics You Cover:
- Quran explanation (Tafsir)
- Hadith and Sunnah
- Fiqh (Islamic Jurisprudence) - mention different madhabs when applicable
- Seerah (Life of Prophet Muhammad ﷺ)
- Islamic history
- Aqeedah (Islamic beliefs)
- Duas and Adhkar
- Islamic ethics and manners
- Halal and Haram matters
- Prayer (Salah), Fasting, Zakat, Hajj
- Daily life guidance according to Islam

### 4. What to Avoid:
- Never give fatwas on complex matters - recommend consulting local scholars
- Don't engage in sectarian debates
- Don't discuss political matters
- Be humble and say "Allah knows best" when uncertain
- Don't make up information - admit if you don't know something

### 5. Format:
- Use clear formatting with proper paragraphs
- For Quranic verses: Show Arabic first, then translation
- For Hadith: Show source, Arabic if available, then translation
- Keep answers comprehensive but not overly long

### 6. Signature Elements:
- End with "والله اعلم بالصواب" (And Allah knows best) for religious rulings
- Use "ﷺ" after Prophet Muhammad's name
- Use "رضي الله عنه" or "(RA)" after companions' names
- Add relevant duas when appropriate

Remember: You are helping Muslims understand their beautiful religion. Be accurate, be kind, and always point them towards authentic sources.`;

// Chat state
let chatHistory = [];
let isProcessing = false;

// DOM Elements
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const chatMessages = document.getElementById('chat-messages');
const aiHero = document.getElementById('ai-hero');
const suggestions = document.getElementById('suggestions');
const clearChatBtn = document.getElementById('clear-chat-btn');

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check auth first
    if (!checkAuthStatus()) {
        showLoginRequired();
        return;
    }
    loadChatHistory();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Send on Enter key - use keydown for better responsiveness
    if (chatInput) {
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Auto-resize input (if using textarea in future)
        chatInput.addEventListener('input', () => {
            sendBtn.disabled = chatInput.value.trim() === '';
        });
    }
}

// Send message function
async function sendMessage() {
    // Check auth first
    if (!checkAuthStatus()) {
        showLoginRequired();
        return;
    }

    const message = chatInput.value.trim();
    if (!message || isProcessing) return;

    // Hide hero and suggestions on first message
    if (chatHistory.length === 0) {
        aiHero.style.display = 'none';
        suggestions.style.display = 'none';
        clearChatBtn.style.display = 'flex';
    }

    // Add user message
    addMessage(message, 'user');
    chatInput.value = '';
    sendBtn.disabled = true;

    // Add to history
    chatHistory.push({ role: 'user', content: message });

    // Show loading
    const loadingId = showLoading();

    isProcessing = true;

    try {
        const response = await callAI(message);
        removeLoading(loadingId);
        addMessage(response, 'ai');
        chatHistory.push({ role: 'assistant', content: response });
        saveChatHistory();
    } catch (error) {
        removeLoading(loadingId);
        console.error('API Error:', error);
        addMessage('معذرت! کچھ تکنیکی مسئلہ ہے۔ براہ کرم دوبارہ کوشش کریں۔\n\nSorry! There was a technical issue. Please try again.', 'ai');
    }

    isProcessing = false;
}

// Main AI API caller with fallback logic
async function callAI(userMessage) {
    // Try Hugging Face first (if API key is set)
    if (HUGGINGFACE_API_KEY && HUGGINGFACE_API_KEY !== 'YOUR_HUGGINGFACE_API_KEY_HERE') {
        try {
            return await callHuggingFaceAPI(userMessage);
        } catch (error) {
            console.warn('Hugging Face failed, trying Gemini fallback:', error.message);
            // Fall through to Gemini
        }
    }

    // Fallback to Gemini
    return await callGeminiAPI(userMessage);
}

// Call Hugging Face API with model fallback
async function callHuggingFaceAPI(userMessage) {
    // Build conversation context for Hugging Face
    const recentHistory = chatHistory.slice(-10);

    // Format conversation for Hugging Face (uses chat template)
    let conversationText = SYSTEM_PROMPT + '\n\n---\n\n';

    // Add history
    for (const msg of recentHistory) {
        const role = msg.role === 'user' ? 'User' : 'Assistant';
        conversationText += `${role}: ${msg.content}\n\n`;
    }

    // Add current question
    conversationText += `User: ${userMessage}\n\nAssistant:`;

    // Try models in order
    for (let i = currentModelIndex; i < HF_MODELS.length; i++) {
        const model = HF_MODELS[i];

        try {
            console.log(`Trying ${model.name}...`);

            const response = await fetch(
                `https://api-inference.huggingface.co/models/${model.id}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        inputs: conversationText,
                        parameters: {
                            max_new_tokens: 2048,
                            temperature: 0.7,
                            top_p: 0.95,
                            return_full_text: false,
                            do_sample: true,
                        },
                        options: {
                            wait_for_model: true,
                            use_cache: false
                        }
                    })
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`${model.name} error:`, errorText);

                // If rate limited, try next model
                if (response.status === 429) {
                    console.log(`${model.name} rate limited, trying next model...`);
                    continue;
                }
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();

            // Handle different response formats
            let generatedText = '';
            if (Array.isArray(data) && data[0]?.generated_text) {
                generatedText = data[0].generated_text;
            } else if (data.generated_text) {
                generatedText = data.generated_text;
            } else {
                throw new Error('Invalid response format');
            }

            // Clean up the response
            generatedText = generatedText.trim();

            // Success! Update current model index for next time
            currentModelIndex = i;
            console.log(`✓ Success with ${model.name}`);

            return generatedText;

        } catch (error) {
            console.error(`${model.name} failed:`, error);
            // Continue to next model
        }
    }

    // All Hugging Face models failed
    throw new Error('All Hugging Face models failed');
}

// Call Gemini API (kept as fallback)
async function callGeminiAPI(userMessage) {
    console.log('Using Gemini API (fallback)...');

    // Build conversation context
    const contents = [];

    // Add system prompt as first user message (Gemini doesn't have system role in same way)
    contents.push({
        role: 'user',
        parts: [{ text: SYSTEM_PROMPT + '\n\nPlease acknowledge that you understand these guidelines and are ready to help.' }]
    });
    contents.push({
        role: 'model',
        parts: [{ text: 'بسم اللہ الرحمٰن الرحیم\n\nJee, main DeenSphere AI Scholar hoon. Main Quran, Hadith, aur authentic Islamic sources se aapki madad karne ke liye tayyar hoon. Aap apna sawal puchiye! 🌙' }]
    });

    // Add chat history (last 10 messages for context)
    const recentHistory = chatHistory.slice(-10);
    for (const msg of recentHistory) {
        contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        });
    }

    // Add current message if not already in history
    if (recentHistory.length === 0 || recentHistory[recentHistory.length - 1].content !== userMessage) {
        contents.push({
            role: 'user',
            parts: [{ text: userMessage }]
        });
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: contents,
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 2048,
            },
            safetySettings: [
                { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            ]
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
    } else {
        throw new Error('Invalid response format');
    }
}

// Add message to chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;

    // Format the text (handle Arabic, Urdu, sources, etc.)
    messageDiv.innerHTML = formatMessage(text, sender);

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Format message content
function formatMessage(text, sender) {
    if (sender === 'user') {
        return escapeHtml(text);
    }

    // Process AI response
    let formatted = escapeHtml(text);

    // Convert markdown-style formatting
    // Bold: **text** or __text__
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/__(.+?)__/g, '<strong>$1</strong>');

    // Italic: *text* or _text_
    formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Detect and style Arabic text
    formatted = formatted.replace(/([\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+(?:\s+[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+)*)/g,
        '<span class="arabic-text">$1</span>');

    // Style Quranic references like (Surah Al-Baqarah: 255) or [Quran 2:255]
    formatted = formatted.replace(/\((Surah [^)]+)\)/gi, '<span class="source-tag">📖 $1</span>');
    formatted = formatted.replace(/\[Quran ([^\]]+)\]/gi, '<span class="source-tag">📖 Quran $1</span>');

    // Style Hadith references
    formatted = formatted.replace(/\((Sahih Bukhari[^)]*)\)/gi, '<span class="source-tag">📚 $1</span>');
    formatted = formatted.replace(/\((Sahih Muslim[^)]*)\)/gi, '<span class="source-tag">📚 $1</span>');
    formatted = formatted.replace(/\((Tirmidhi[^)]*)\)/gi, '<span class="source-tag">📚 $1</span>');
    formatted = formatted.replace(/\((Abu Dawud[^)]*)\)/gi, '<span class="source-tag">📚 $1</span>');
    formatted = formatted.replace(/\((Nasai[^)]*)\)/gi, '<span class="source-tag">📚 $1</span>');
    formatted = formatted.replace(/\((Ibn Majah[^)]*)\)/gi, '<span class="source-tag">📚 $1</span>');

    // Convert newlines to <br>
    formatted = formatted.replace(/\n/g, '<br>');

    return formatted;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show loading animation
function showLoading() {
    const loadingDiv = document.createElement('div');
    const loadingId = 'loading-' + Date.now();
    loadingDiv.id = loadingId;
    loadingDiv.className = 'message ai loading';
    loadingDiv.innerHTML = `
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
    `;
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return loadingId;
}

// Remove loading animation
function removeLoading(loadingId) {
    const loadingDiv = document.getElementById(loadingId);
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

// Ask suggestion
function askSuggestion(btn) {
    const question = btn.textContent;
    chatInput.value = question;
    sendBtn.disabled = false;
    sendMessage();
}

// Save chat history to localStorage
function saveChatHistory() {
    try {
        localStorage.setItem('deensphere_ai_chat', JSON.stringify(chatHistory));
    } catch (e) {
        console.warn('Could not save chat history:', e);
    }
}

// Load chat history from localStorage
function loadChatHistory() {
    try {
        const saved = localStorage.getItem('deensphere_ai_chat');
        if (saved) {
            chatHistory = JSON.parse(saved);
            if (chatHistory.length > 0) {
                // Hide hero and suggestions
                aiHero.style.display = 'none';
                suggestions.style.display = 'none';
                clearChatBtn.style.display = 'flex';

                // Render saved messages
                chatHistory.forEach(msg => {
                    addMessage(msg.content, msg.role === 'user' ? 'user' : 'ai');
                });
            }
        }
    } catch (e) {
        console.warn('Could not load chat history:', e);
        chatHistory = [];
    }
}

// Clear chat
function clearChat() {
    if (confirm('Kya aap sari chat delete karna chahte hain?\nDo you want to clear all chat history?')) {
        chatHistory = [];
        localStorage.removeItem('deensphere_ai_chat');
        chatMessages.innerHTML = '';
        aiHero.style.display = 'block';
        suggestions.style.display = 'flex';
        clearChatBtn.style.display = 'none';
    }
}

// Export for debugging
window.aiChat = {
    chatHistory,
    sendMessage,
    clearChat
};
