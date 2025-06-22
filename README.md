# Real-time Chat Application

A modern real-time chat application built with React, Express, and WebSockets. Features instant messaging, user presence tracking, and a beautiful UI.

## Features

- **Real-time messaging** - Messages appear instantly using WebSockets
- **User presence** - See who's online in the sidebar
- **Message history** - Previous messages load when you join
- **Emoji support** - Rich emoji picker with categories and quick reactions
- **Message reactions** - React to messages with emojis
- **Modern UI** - Built with shadcn/ui components and Tailwind CSS
- **PostgreSQL database** - Persistent message and user storage
- **Responsive design** - Works on desktop and mobile

## Tech Stack

### Frontend
- React 18 with TypeScript
- Wouter for routing
- TanStack React Query for state management
- shadcn/ui components with Radix UI
- Tailwind CSS for styling
- Vite for development and building

### Backend
- Node.js with Express
- WebSocket server using `ws` library
- PostgreSQL with Drizzle ORM
- TypeScript for type safety

## Setup Instructions

### Prerequisites
- Node.js 18 or higher
- PostgreSQL database

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file with:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/chatapp
```

3. Push database schema:
```bash
npm run db:push
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   └── lib/           # Utilities and query client
├── server/                # Backend Express server
│   ├── db.ts             # Database connection
│   ├── routes.ts         # API routes and WebSocket handling
│   ├── storage.ts        # Database operations
│   └── index.ts          # Server entry point
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema and types
└── package.json          # Dependencies and scripts
```

## Database Schema

- **Users**: Store user information (id, username, created_at)
- **Messages**: Store chat messages with user references

## API Endpoints

- `GET /api/messages` - Fetch recent messages
- `POST /api/users` - Create or get user

## WebSocket Events

- `join` - User joins the chat room
- `send_message` - Send a new message
- `new_message` - Receive a new message
- `add_reaction` - Add emoji reaction to a message
- `remove_reaction` - Remove emoji reaction from a message
- `reaction_updated` - Message reactions have been updated
- `user_joined` - Someone joined the chat
- `user_left` - Someone left the chat
- `online_users` - List of currently online users

## Deployment

The application is designed to run on Replit with auto-scaling deployments. For other platforms:

1. Build the frontend: `npm run build`
2. Start the production server: `npm start`
3. Ensure your PostgreSQL database is accessible

## Development

- `npm run dev` - Start development server
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio (if available)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

