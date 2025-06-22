import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertUserSchema, insertMessageSchema } from "@shared/schema";
import { z } from "zod";

interface ConnectedClient {
  ws: WebSocket;
  username: string;
  userId: number;
}

const clients = new Map<string, ConnectedClient>();

export async function registerRoutes(app: Express): Promise<Server> {
  // REST API endpoints
  app.get("/api/messages", async (req, res) => {
    try {
      const messages = await storage.getRecentMessages(50);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      let user = await storage.getUserByUsername(userData.username);
      
      if (!user) {
        user = await storage.createUser(userData);
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid user data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create user" });
      }
    }
  });

  const httpServer = createServer(app);

  // WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on("connection", (ws) => {
    const clientId = generateClientId();
    console.log("Client connected:", clientId);

    ws.on("message", async (data) => {
      try {
        const message = JSON.parse(data.toString());

        switch (message.type) {
          case "join":
            await handleUserJoin(ws, clientId, message.username);
            break;

          case "send_message":
            await handleSendMessage(clientId, message.content);
            break;

          default:
            console.log("Unknown message type:", message.type);
        }
      } catch (error) {
        console.error("Error handling WebSocket message:", error);
        ws.send(JSON.stringify({
          type: "error",
          message: "Failed to process message"
        }));
      }
    });

    ws.on("close", () => {
      handleUserLeave(clientId);
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      handleUserLeave(clientId);
    });
  });

  async function handleUserJoin(ws: WebSocket, clientId: string, username: string) {
    try {
      // Get or create user
      let user = await storage.getUserByUsername(username);
      if (!user) {
        user = await storage.createUser({ username });
      }

      // Store client connection
      clients.set(clientId, {
        ws,
        username,
        userId: user.id,
      });

      // Send current online users to the new client
      const onlineUsers = Array.from(clients.values())
        .map(client => client.username)
        .filter(name => name !== username);

      ws.send(JSON.stringify({
        type: "online_users",
        users: onlineUsers,
      }));

      // Broadcast user joined to other clients
      broadcastToOthers(clientId, {
        type: "user_joined",
        username,
      });

      console.log(`User ${username} joined the chat`);
    } catch (error) {
      console.error("Error handling user join:", error);
      ws.send(JSON.stringify({
        type: "error",
        message: "Failed to join chat"
      }));
    }
  }

  async function handleSendMessage(clientId: string, content: string) {
    const client = clients.get(clientId);
    if (!client) {
      console.error("Client not found for message:", clientId);
      return;
    }

    try {
      // Save message to database
      const messageWithUser = await storage.createMessage({
        content,
        userId: client.userId,
      });

      // Broadcast message to all clients
      broadcastToAll({
        type: "new_message",
        message: messageWithUser,
      });

      console.log(`Message from ${client.username}: ${content}`);
    } catch (error) {
      console.error("Error handling send message:", error);
      client.ws.send(JSON.stringify({
        type: "error",
        message: "Failed to send message"
      }));
    }
  }

  function handleUserLeave(clientId: string) {
    const client = clients.get(clientId);
    if (client) {
      // Broadcast user left to other clients
      broadcastToOthers(clientId, {
        type: "user_left",
        username: client.username,
      });

      clients.delete(clientId);
      console.log(`User ${client.username} left the chat`);
    }
  }

  function broadcastToAll(message: any) {
    const messageStr = JSON.stringify(message);
    clients.forEach((client) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(messageStr);
      }
    });
  }

  function broadcastToOthers(excludeClientId: string, message: any) {
    const messageStr = JSON.stringify(message);
    clients.forEach((client, clientId) => {
      if (clientId !== excludeClientId && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(messageStr);
      }
    });
  }

  function generateClientId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  return httpServer;
}
