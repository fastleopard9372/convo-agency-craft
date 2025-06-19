import { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { ChatMessage, ReplyOptions, AutomationStatus } from './types';
import { getAutomationConfig, SELECTORS } from './config';
import { conversationsApi } from '../services/api';

// Add stealth plugin
puppeteer.use(StealthPlugin());

export class ConversationListener {
  private pageState: {
    browser: Browser;
    page: Page;
    isListening: boolean;
    messagesSeen: Set<string>;
    lastActivity: Date;
  } | null = null;

  private config = getAutomationConfig();
  private onMessageCallback?: (message: ChatMessage) => Promise<void>;

  constructor() {
    this.handleExit = this.handleExit.bind(this);
    process.on('SIGINT', this.handleExit);
    process.on('SIGTERM', this.handleExit);
  }

  /**
   * Set callback for new messages
   */
  setMessageCallback(callback: (message: ChatMessage) => Promise<void>): void {
    this.onMessageCallback = callback;
  }

  /**
   * Initialize browser and navigate to page
   */
  async initialize(url?: string): Promise<void> {
    const targetUrl = url || this.config.targetUrl;
    
    try {
      console.log('🚀 Initializing browser...');
      
      const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: [
          '--start-maximized',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage'
        ]
      });

      const page = await browser.newPage();
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      );

      console.log('🌐 Navigating to page...');
      await page.goto(targetUrl, { waitUntil: 'networkidle0' });

      this.pageState = {
        browser,
        page,
        isListening: false,
        messagesSeen: new Set<string>(),
        lastActivity: new Date()
      };

      console.log('✅ Browser initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize browser:', error);
      throw error;
    }
  }

  /**
   * Start listening for new messages
   */
  async startListening(): Promise<void> {
    if (!this.pageState) {
      throw new Error('Browser not initialized. Call initialize() first.');
    }

    if (this.pageState.isListening) {
      console.log('⚠️ Already listening for messages');
      return;
    }

    console.log('👂 Starting message listener...');
    this.pageState.isListening = true;

    try {
      await this.populateSeenMessages();
      await this.messageListeningLoop();
    } catch (error) {
      console.error('❌ Error in listening loop:', error);
      this.pageState.isListening = false;
      throw error;
    }
  }

  /**
   * Populate the seen messages set with existing messages
   */
  private async populateSeenMessages(): Promise<void> {
    if (!this.pageState) return;

    try {
      const existingMessages = await this.getCurrentMessages();
      for (const message of existingMessages) {
        this.pageState.messagesSeen.add(message.messageId);
      }
      console.log(`📝 Initialized with ${existingMessages.length} existing messages`);
    } catch (error) {
      console.error('⚠️ Could not populate existing messages:', error);
    }
  }

  /**
   * Main message listening loop
   */
  private async messageListeningLoop(): Promise<void> {
    if (!this.pageState) return;

    while (this.pageState.isListening) {
      try {
        const messages = await this.getCurrentMessages();
        const newMessages = messages.filter(msg => !this.pageState!.messagesSeen.has(msg.messageId));

        if (newMessages.length > 0) {
          console.log(`📨 Found ${newMessages.length} new message(s)`);
          
          for (const message of newMessages) {
            this.pageState.messagesSeen.add(message.messageId);
            await this.handleNewMessage(message);
          }
          
          this.pageState.lastActivity = new Date();
        }

        // Wait before checking again
        await this.sleep(this.config.messageCheckInterval);
      } catch (error) {
        console.error('❌ Error in message loop:', error);
        await this.sleep(5000); // Wait longer on error
      }
    }
  }

  /**
   * Get current messages from the page
   */
  private async getCurrentMessages(): Promise<ChatMessage[]> {
    if (!this.pageState) return [];

    try {
      return await this.pageState.page.evaluate((selectors) => {
        // Try primary selectors first
        let messageElements = document.querySelectorAll(selectors.messages);
        
        // Fallback to generic selectors if primary ones don't work
        if (messageElements.length === 0) {
          messageElements = document.querySelectorAll(selectors.genericMessages);
        }

        const messages: ChatMessage[] = [];

        messageElements.forEach((element, index) => {
          const content = element.textContent?.trim() || '';
          if (content && content.length > 3) { // Filter out very short messages
            // Try to determine sender based on element attributes or classes
            const isUser = element.getAttribute('data-message-author-role') === 'user' ||
                          element.classList.contains('user-message') ||
                          element.closest('[data-message-author-role="user"]');
            
            const messageId = `msg_${Date.now()}_${index}_${content.substring(0, 20).replace(/\s/g, '_')}`;
            
            messages.push({
              sender: isUser ? 'user' : 'assistant',
              content,
              timestamp: new Date(),
              messageId
            });
          }
        });

        return messages;
      }, SELECTORS);
    } catch (error) {
      console.error('❌ Error getting messages:', error);
      return [];
    }
  }

  /**
   * Handle new message - integrate with your app
   */
  private async handleNewMessage(message: ChatMessage): Promise<void> {
    console.log(`📩 New message from ${message.sender}: ${message.content.substring(0, 100)}...`);

    // Save message to your database via API
    try {
      await this.saveMessageToDatabase(message);
    } catch (error) {
      console.error('Failed to save message to database:', error);
    }

    // Call the callback if set
    if (this.onMessageCallback) {
      await this.onMessageCallback(message);
    }

    // Auto-respond if enabled
    if (this.config.autoRespond && await this.shouldRespondToMessage(message)) {
      const response = await this.generateResponse(message);
      await this.sendReply(response, { typing: true, humanLike: true });
    }
  }

  /**
   * Save message to database via your API
   */
  private async saveMessageToDatabase(message: ChatMessage): Promise<void> {
    try {
      // Create or get conversation
      const conversation = await conversationsApi.createConversation({
        summary: `Chat with ${message.sender}`,
        messageCount: 1,
        totalTokens: message.content.length,
        status: 'active',
        metadata: { 
          platform: 'automation',
          sender: message.sender 
        }
      });

      // Save the message
      const messageData = {
        conversationId: conversation.data.id,
        role: message.sender === 'user' ? 'user' : 'assistant',
        content: message.content,
        timestamp: message.timestamp.toISOString(),
        metadata: {
          messageId: message.messageId,
          platform: 'automation'
        }
      };

      // You'll need to create this endpoint in your API
      // await messagesApi.createMessage(messageData);
      
    } catch (error) {
      console.error('Error saving message to database:', error);
    }
  }

  /**
   * Determine if we should respond to a message
   */
  private async shouldRespondToMessage(message: ChatMessage): Promise<boolean> {
    // Skip if it's our own message (assistant)
    if (message.sender === 'assistant' || message.sender === 'bot') {
      return false;
    }

    // Skip empty or very short messages
    if (message.content.length < 3) {
      return false;
    }

    // Skip system messages or automated messages
    if (message.content.includes('[System]') || message.content.includes('[Bot]')) {
      return false;
    }

    return true;
  }

  /**
   * Generate a response to a message
   */
  private async generateResponse(message: ChatMessage): Promise<string> {
    // This is where you'd integrate with your AI service
    // For now, return a contextual response based on message content
    const content = message.content.toLowerCase();
    
    if (content.includes('hello') || content.includes('hi')) {
      return "Hello! How can I help you today?";
    } else if (content.includes('thank')) {
      return "You're welcome! Is there anything else I can assist you with?";
    } else if (content.includes('?')) {
      return "That's an interesting question. Let me provide you with some information on that.";
    } else {
      const responses = [
        "I understand what you're saying. Could you tell me more about that?",
        "That's a great point. Let me think about that for a moment.",
        "Thanks for sharing that perspective. Here's what I think...",
        "I appreciate you bringing that up. Let me provide some insight on that topic."
      ];
      
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  /**
   * Send a reply to the chat
   */
  async sendReply(message: string, options: ReplyOptions = {}): Promise<void> {
    if (!this.pageState) {
      throw new Error('Browser not initialized');
    }

    const { typing = false, delay = this.config.typingDelay, humanLike = this.config.humanLikeTyping } = options;

    try {
      console.log(`💬 Sending reply: ${message.substring(0, 100)}...`);

      // Find and click the text input
      let textInput = await this.pageState.page.$(SELECTORS.textInput);
      
      // Fallback to generic input selector
      if (!textInput) {
        textInput = await this.pageState.page.$(SELECTORS.genericInput);
      }

      if (!textInput) {
        throw new Error('Could not find text input element');
      }

      await textInput.click();
      
      if (humanLike) {
        // Simulate human-like typing
        await this.typeHumanLike(message);
      } else {
        // Clear existing text and type new message
        await this.pageState.page.keyboard.down('Control');
        await this.pageState.page.keyboard.press('a');
        await this.pageState.page.keyboard.up('Control');
        await textInput.type(message);
      }

      // Wait a bit before sending
      if (delay > 0) {
        await this.sleep(delay);
      }

      // Find and click send button
      let sendButton = await this.pageState.page.$(SELECTORS.sendButton);
      
      // Fallback to generic send button
      if (!sendButton) {
        sendButton = await this.pageState.page.$(SELECTORS.genericSendButton);
      }

      if (sendButton) {
        await sendButton.click();
        console.log('✅ Message sent successfully');
      } else {
        // Fallback: try pressing Enter
        await this.pageState.page.keyboard.press('Enter');
        console.log('✅ Message sent using Enter key');
      }

      // Add small delay after sending
      await this.sleep(500);
    } catch (error) {
      console.error('❌ Failed to send reply:', error);
      throw error;
    }
  }

  /**
   * Type message with human-like characteristics
   */
  private async typeHumanLike(message: string): Promise<void> {
    if (!this.pageState) return;

    // Clear existing text first
    await this.pageState.page.keyboard.down('Control');
    await this.pageState.page.keyboard.press('a');
    await this.pageState.page.keyboard.up('Control');

    for (const char of message) {
      await this.pageState.page.keyboard.type(char);
      
      // Random delay between characters (20-80ms)
      const delay = Math.random() * 60 + 20;
      await this.sleep(delay);

      // Occasional longer pauses (simulate thinking)
      if (Math.random() < 0.05) {
        await this.sleep(200 + Math.random() * 300);
      }
    }
  }

  /**
   * Find chat by sender name and send message
   */
  async replyToSender(senderName: string, message: string): Promise<boolean> {
    if (!this.pageState) {
      throw new Error('Browser not initialized');
    }

    try {
      console.log(`🔍 Looking for chat with: ${senderName}`);

      // This would need to be customized based on the specific chat platform
      // For now, we'll use the current active chat
      await this.sendReply(message, { humanLike: true });
      return true;
    } catch (error) {
      console.error(`❌ Failed to reply to ${senderName}:`, error);
      return false;
    }
  }

  /**
   * Stop listening for messages
   */
  stopListening(): void {
    if (this.pageState) {
      console.log('🛑 Stopping message listener...');
      this.pageState.isListening = false;
    }
  }

  /**
   * Clean shutdown
   */
  async shutdown(): Promise<void> {
    if (this.pageState) {
      this.stopListening();
      
      try {
        await this.pageState.browser.close();
        console.log('🔒 Browser closed successfully');
      } catch (error) {
        console.error('❌ Error closing browser:', error);
      }
      
      this.pageState = null;
    }
  }

  /**
   * Handle process exit
   */
  private async handleExit(): Promise<void> {
    console.log('\n🚪 Received exit signal, cleaning up...');
    await this.shutdown();
    process.exit(0);
  }

  /**
   * Utility function for delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get current status
   */
  getStatus(): AutomationStatus {
    return {
      isInitialized: !!this.pageState,
      isListening: this.pageState?.isListening || false,
      messagesSeen: this.pageState?.messagesSeen.size || 0,
      lastActivity: this.pageState?.lastActivity || null,
      currentUrl: this.config.targetUrl
    };
  }
}