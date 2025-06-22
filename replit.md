# Real-time Chat Application

## Overview

This is a full-stack real-time chat application built with React, Express, and WebSockets. The application allows users to join chat rooms, send messages in real-time, and see who's currently online. It features a modern UI with shadcn/ui components and Tailwind CSS styling.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React hooks with TanStack React Query for server state
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **WebSocket Server**: Built-in WebSocket support using the `ws` library
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon serverless PostgreSQL
- **Session Management**: Connect-pg-simple for PostgreSQL session storage

## Key Components

### Database Schema
Located in `shared/schema.ts`:
- **Users table**: Stores user information (id, username, created_at)
- **Messages table**: Stores chat messages with user references
- **Relations**: One-to-many relationship between users and messages

### Real-time Communication
- WebSocket server handles real-time messaging
- Client connection management with automatic reconnection
- User presence tracking for online status
- Message broadcasting to all connected clients

### Frontend Components
- **LoginScreen**: User authentication interface
- **ChatInterface**: Main chat application layout
- **MessageList**: Displays chat history with scroll management
- **MessageInput**: Message composition with real-time status
- **OnlineUsers**: Sidebar showing currently connected users
- **ChatHeader**: Application header with connection status

### Backend Services
- **Storage Layer**: Database abstraction with Drizzle ORM
- **WebSocket Management**: Connection handling and message routing
- **REST API**: User creation and message history endpoints

## Data Flow

1. **User Authentication**: Users enter username through LoginScreen
2. **WebSocket Connection**: Establishes real-time connection to server
3. **Message Flow**: 
   - User types message in MessageInput
   - Message sent via WebSocket to server
   - Server stores message in database
   - Server broadcasts message to all connected clients
   - Clients update MessageList in real-time
4. **Presence Management**: Server tracks connected users and broadcasts updates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver
- **drizzle-orm**: Type-safe ORM for database operations
- **ws**: WebSocket server implementation
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React router

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives (30+ components)
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **clsx**: Conditional class name utility

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **drizzle-kit**: Database migration and introspection tools

## Deployment Strategy

### Development Environment
- Vite development server with HMR for frontend
- Express server with WebSocket support
- PostgreSQL database connection via Neon

### Production Build
- Frontend: Vite builds optimized static assets
- Backend: esbuild bundles server code for Node.js
- Database: Drizzle migrations ensure schema consistency

### Replit Configuration
- Auto-scaling deployment target
- PostgreSQL module for database provisioning
- Port 5000 exposed for application access
- Parallel workflow execution for development

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Environment mode (development/production)

Changelog:
- June 22, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.