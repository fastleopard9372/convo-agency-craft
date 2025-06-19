# FreelanceAI Platform

A comprehensive AI-powered freelance management platform that helps freelancers discover opportunities, generate proposals, and manage conversations with clients.

## 🚀 Features

- **Job Discovery**: Automated job scraping and management
- **AI Proposal Generation**: Generate customized proposals for job opportunities
- **Conversation Management**: Track and manage client conversations
- **Memory System**: Persistent conversation history and context
- **Authentication**: Secure user authentication with Supabase
- **Modern UI**: Clean, responsive interface built with React and shadcn/ui

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Redux Toolkit** for state management
- **React Router** for navigation
- **shadcn/ui** for UI components
- **Tailwind CSS** for styling
- **React Hook Form** for form management

### Backend
- **Supabase** for authentication and database
- **PostgreSQL** database with Prisma-like schema
- **RESTful API** design

### Browser Automation
- **Puppeteer** for web automation
- **Stealth Plugin** for detection avoidance
- **Consolidated listener system** for chat monitoring

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd convo-agency-craft
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_API_BASE_URL=your_api_base_url
   TARGET_URL=your_target_chat_url
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🤖 Browser Automation - New Consolidated System

### Phase 1 Fix/Improvement

We've consolidated the previous two separate scripts (`listener.ts` and `responder.ts`) into a single, more robust `listener.ts` script. This addresses the architectural issues identified in the previous implementation.

#### Key Improvements:

1. **Single File Architecture**: All browser interactions now happen within one `page` object, solving the main issue of separate browser instances.

2. **Stable Selectors**: Uses `aria-label` and `title` attributes instead of easily-breakable class names for more reliable element targeting.

3. **Stateful Message Handling**: Keeps track of messages it has already seen using a `Set`, preventing duplicate responses to the same message.

4. **Correct Reply Logic**: The `replyToSender` function correctly finds the chat based on the sender's name and responds appropriately.

5. **Error Handling**: Comprehensive error handling with try-catch blocks to prevent script crashes.

6. **Clear Structure**: The logic is broken down into smaller, more readable functions for better maintainability.

### Usage

#### As a Standalone Script
```bash
# Set your target URL
export TARGET_URL="https://your-chat-platform.com"

# Run the listener
npm run listener
```

#### As a Module
```typescript
import { ConversationListener } from './listener';

const listener = new ConversationListener();

// Initialize with target URL
await listener.initialize('https://chat.example.com');

// Start listening for messages
await listener.startListening();

// Send a reply
await listener.sendReply('Hello! How can I help you?', {
  typing: true,
  humanLike: true
});

// Reply to specific sender
await listener.replyToSender('John Doe', 'Thanks for your message!');

// Get current status
const status = listener.getStatus();
console.log(status);

// Clean shutdown
await listener.shutdown();
```

### Features

- **Message Detection**: Automatically detects new messages in chat interfaces
- **Human-like Typing**: Simulates realistic typing patterns with variable delays
- **Stealth Mode**: Uses stealth plugin to avoid detection by anti-bot systems
- **Graceful Error Handling**: Continues operation even when individual operations fail
- **Memory Management**: Tracks seen messages to avoid duplicate responses
- **Flexible Response System**: Configurable reply options for different interaction styles

### Configuration

The listener can be configured through environment variables:

```env
TARGET_URL=https://your-chat-platform.com
TYPING_DELAY=1000
HUMAN_LIKE_TYPING=true
MESSAGE_CHECK_INTERVAL=2000
```

## 📱 Application Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── jobs/           # Job-related components
│   ├── layout/         # Layout components
│   ├── proposals/      # Proposal components
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
│   └── supabase/       # Supabase configuration
├── lib/                # Utility functions
├── pages/              # Page components
├── services/           # API services
├── store/              # Redux store and slices
└── types/              # TypeScript type definitions
```

## 🗄 Database Schema

The application uses a comprehensive database schema with the following main entities:

- **Profile**: User profile information and settings
- **Conversation**: Chat conversations with metadata
- **Message**: Individual messages within conversations
- **AgentJob**: Job opportunities and details
- **Proposal**: Generated proposals for jobs
- **NasFile**: File storage and management
- **Tag**: Categorization system
- **MemoryRule**: AI memory management rules

## 🚦 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks

# Browser Automation
npm run listener     # Run the consolidated listener script
```

## 🔐 Authentication

The application uses Supabase Auth for user management:

- Email/password authentication
- Password reset functionality
- Protected routes with automatic redirects
- Persistent authentication state

## 🎨 UI Components

Built with shadcn/ui components including:

- Forms with validation
- Data tables with sorting/filtering
- Modals and dialogs
- Navigation components
- Theme switching (light/dark mode)

## 📊 State Management

Redux Toolkit is used for global state management with slices for:

- **Auth**: User authentication state
- **Jobs**: Job listings and management
- **Conversations**: Chat history and active conversations
- **Proposals**: Generated proposals
- **Theme**: UI theme preferences

## 🔄 API Integration

The application integrates with a RESTful API for:

- User authentication and management
- Job creation and retrieval
- Conversation management
- Proposal generation
- File handling

## 🛡 Security Features

- Protected API routes with JWT authentication
- Input validation and sanitization
- CORS configuration
- Secure password handling
- Environment variable protection

## 📈 Performance

- Code splitting with React.lazy
- Optimized bundle size with Vite
- Efficient state updates with Redux Toolkit
- Responsive design for all devices
- Progressive loading states

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Commit your changes: `git commit -am 'Add some feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

1. Check the documentation
2. Create an issue on GitHub
3. Contact the development team

## 🔮 Roadmap

- [ ] Advanced AI integration for better proposal generation
- [ ] Real-time notifications
- [ ] Mobile application
- [ ] Advanced analytics dashboard
- [ ] Integration with more job platforms
- [ ] Enhanced browser automation features
- [ ] Multi-language support