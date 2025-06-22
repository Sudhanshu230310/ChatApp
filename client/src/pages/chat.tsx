import { useState, useEffect, useRef } from "react";
import LoginScreen from "@/components/chat/LoginScreen";
import ChatInterface from "@/components/chat/ChatInterface";
import type { MessageWithUser } from "@shared/schema";

export default function Chat() {
  const [username, setUsername] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected" | "error">("disconnected");
  const [messages, setMessages] = useState<MessageWithUser[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  const connectWebSocket = () => {
    setConnectionStatus("connecting");
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
      setConnectionStatus("connected");
      wsRef.current = ws;
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleWebSocketMessage(data);
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket server");
      setConnectionStatus("disconnected");
      wsRef.current = null;

      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
          connectWebSocket();
        }
      }, 3000);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnectionStatus("error");
    };
  };

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case "new_message":
        setMessages(prev => [...prev, data.message]);
        break;
      case "user_joined":
        setOnlineUsers(prev => [...prev, data.username]);
        break;
      case "user_left":
        setOnlineUsers(prev => prev.filter(user => user !== data.username));
        break;
      case "online_users":
        setOnlineUsers(data.users);
        break;
      case "error":
        console.error("WebSocket error:", data.message);
        break;
      default:
        console.log("Unknown message type:", data.type);
    }
  };

  useEffect(() => {
    connectWebSocket();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Load initial messages when connected
  useEffect(() => {
    if (connectionStatus === "connected" && !isConnected) {
      fetch("/api/messages")
        .then(res => res.json())
        .then(data => {
          setMessages(data);
        })
        .catch(error => {
          console.error("Error loading messages:", error);
        });
    }
  }, [connectionStatus, isConnected]);

  const handleJoinChat = (username: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "join",
        username,
      }));
      setUsername(username);
      setIsConnected(true);
    }
  };

  const handleSendMessage = (content: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "send_message",
        content,
      }));
    }
  };

  if (!isConnected) {
    return (
      <LoginScreen
        connectionStatus={connectionStatus}
        onJoinChat={handleJoinChat}
      />
    );
  }

  return (
    <ChatInterface
      username={username}
      connectionStatus={connectionStatus}
      messages={messages}
      onlineUsers={onlineUsers}
      onSendMessage={handleSendMessage}
    />
  );
}
