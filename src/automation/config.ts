import { AutomationConfig } from './types';

export const getAutomationConfig = (): AutomationConfig => ({
  targetUrl: import.meta.env.VITE_TARGET_URL || 'https://chat.openai.com',
  typingDelay: parseInt(import.meta.env.VITE_TYPING_DELAY || '1000'),
  humanLikeTyping: import.meta.env.VITE_HUMAN_LIKE_TYPING === 'true',
  messageCheckInterval: parseInt(import.meta.env.VITE_MESSAGE_CHECK_INTERVAL || '2000'),
  autoRespond: import.meta.env.VITE_AUTO_RESPOND === 'true'
});

export const SELECTORS = {
  // ChatGPT selectors
  messages: '[data-testid^="conversation-turn-"]',
  messageContent: '[data-message-author-role]',
  sendButton: '[data-testid="send-button"]',
  textInput: '#prompt-textarea',
  
  // WhatsApp Web selectors (alternative)
  whatsappMessages: '[data-testid="msg-container"]',
  whatsappInput: '[data-testid="conversation-compose-box-input"]',
  whatsappSend: '[data-testid="send"]',
  
  // Telegram Web selectors (alternative)
  telegramMessages: '.message',
  telegramInput: '.input-message-input',
  telegramSend: '.btn-send',
  
  // Discord selectors (alternative)
  discordMessages: '[id^="chat-messages-"] [class*="messageContent"]',
  discordInput: '[data-slate-editor="true"]',
  discordSend: '[aria-label="Send Message"]',
  
  // Generic fallback selectors
  genericMessages: '.message, [role="message"], [aria-label*="message"], [class*="message"]',
  genericInput: 'textarea, input[type="text"], [contenteditable="true"]',
  genericSendButton: 'button[type="submit"], [aria-label*="send"], [title*="send"], button:contains("Send")'
};

// Platform-specific configurations
export const PLATFORM_CONFIGS = {
  chatgpt: {
    name: 'ChatGPT',
    url: 'https://chat.openai.com',
    selectors: {
      messages: SELECTORS.messages,
      input: SELECTORS.textInput,
      sendButton: SELECTORS.sendButton
    }
  },
  whatsapp: {
    name: 'WhatsApp Web',
    url: 'https://web.whatsapp.com',
    selectors: {
      messages: SELECTORS.whatsappMessages,
      input: SELECTORS.whatsappInput,
      sendButton: SELECTORS.whatsappSend
    }
  },
  telegram: {
    name: 'Telegram Web',
    url: 'https://web.telegram.org',
    selectors: {
      messages: SELECTORS.telegramMessages,
      input: SELECTORS.telegramInput,
      sendButton: SELECTORS.telegramSend
    }
  },
  discord: {
    name: 'Discord',
    url: 'https://discord.com/channels',
    selectors: {
      messages: SELECTORS.discordMessages,
      input: SELECTORS.discordInput,
      sendButton: SELECTORS.discordSend
    }
  }
};

export const DEFAULT_CONFIG = {
  TYPING_SPEED: {
    MIN: 20, // Minimum typing delay in ms
    MAX: 80, // Maximum typing delay in ms
    PAUSE_CHANCE: 0.05, // Chance of longer pause (thinking)
    PAUSE_DURATION: { MIN: 200, MAX: 500 } // Pause duration range in ms
  },
  
  MESSAGE_DETECTION: {
    MIN_LENGTH: 3, // Minimum message length to process
    CHECK_INTERVAL: 2000, // How often to check for new messages (ms)
    RETRY_DELAY: 5000 // Delay after error before retrying (ms)
  },
  
  BROWSER_OPTIONS: {
    headless: false,
    defaultViewport: null,
    args: [
      '--start-maximized',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor'
    ]
  },
  
  USER_AGENTS: [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  ],
  
  RESPONSE_TEMPLATES: {
    greeting: [
      "Hello! How can I help you today?",
      "Hi there! What can I assist you with?",
      "Hey! Thanks for reaching out. How may I help?"
    ],
    acknowledgment: [
      "I understand what you're saying. Could you tell me more about that?",
      "That's an interesting point. Let me think about that for a moment.",
      "Thanks for sharing that perspective. Here's what I think...",
      "I appreciate you bringing that up. Let me provide some insight on that topic."
    ],
    question: [
      "That's a great question. Let me provide you with some information on that topic.",
      "I'm glad you asked about that. Here's what I can tell you...",
      "That's something I can definitely help you with. Let me explain..."
    ],
    thanks: [
      "You're welcome! Is there anything else I can assist you with?",
      "Happy to help! Let me know if you need anything else.",
      "My pleasure! Feel free to ask if you have any other questions."
    ]
  }
};

// Helper function to get random user agent
export const getRandomUserAgent = (): string => {
  const agents = DEFAULT_CONFIG.USER_AGENTS;
  return agents[Math.floor(Math.random() * agents.length)];
};

// Helper function to get response template
export const getResponseTemplate = (type: keyof typeof DEFAULT_CONFIG.RESPONSE_TEMPLATES): string => {
  const templates = DEFAULT_CONFIG.RESPONSE_TEMPLATES[type];
  return templates[Math.floor(Math.random() * templates.length)];
};

// Environment validation
export const validateConfig = (): boolean => {
  const config = getAutomationConfig();
  
  if (!config.targetUrl || !config.targetUrl.startsWith('http')) {
    console.error('❌ Invalid target URL in configuration');
    return false;
  }
  
  if (config.typingDelay < 0 || config.messageCheckInterval < 1000) {
    console.error('❌ Invalid timing configuration');
    return false;
  }
  
  return true;
};