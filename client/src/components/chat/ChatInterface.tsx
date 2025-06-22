import ChatHeader from "./ChatHeader";
import OnlineUsers from "./OnlineUsers";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import type { MessageWithUser } from "@shared/schema";

interface ChatInterfaceProps {
  username: string;
  connectionStatus: "disconnected" | "connecting" | "connected" | "error";
  messages: MessageWithUser[];
  onlineUsers: string[];
  onSendMessage: (content: string) => void;
}

export default function ChatInterface({
  username,
  connectionStatus,
  messages,
  onlineUsers,
  onSendMessage,
}: ChatInterfaceProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <ChatHeader username={username} connectionStatus={connectionStatus} />
      
      <div className="flex h-[calc(100vh-80px)]">
        <OnlineUsers username={username} onlineUsers={onlineUsers} />
        
        <main className="flex-1 flex flex-col">
          <MessageList username={username} messages={messages} />
          <MessageInput connectionStatus={connectionStatus} onSendMessage={onSendMessage} />
        </main>
      </div>
    </div>
  );
}
