export interface ChatMessage {
    id?: string;
    sender: string;
    content: string;
    timestamp: Date;
    messageId: string;
    conversationId?: string;
  }
  
  export interface ReplyOptions {
    typing?: boolean;
    delay?: number;
    humanLike?: boolean;
  }
  
  export interface AutomationConfig {
    targetUrl: string;
    typingDelay: number;
    humanLikeTyping: boolean;
    messageCheckInterval: number;
    autoRespond: boolean;
  }
  
  export interface AutomationStatus {
    isInitialized: boolean;
    isListening: boolean;
    messagesSeen: number;
    lastActivity: Date | null;
    currentUrl?: string;
  }
  
  export interface PageState {
    browser: any; // Browser type from puppeteer
    page: any;    // Page type from puppeteer
    isListening: boolean;
    messagesSeen: Set<string>;
    lastActivity: Date;
  }
  
  export interface MessageMetadata {
    messageId: string;
    platform: string;
    senderName?: string;
    chatId?: string;
    threadId?: string;
  }