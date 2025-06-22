import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Smile } from "lucide-react";

interface MessageInputProps {
  connectionStatus: "disconnected" | "connecting" | "connected" | "error";
  onSendMessage: (content: string) => void;
}

export default function MessageInput({ connectionStatus, onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && connectionStatus === "connected") {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "Connected to server";
      case "error":
        return "Connection failed";
      case "connecting":
        return "Connecting...";
      default:
        return "Disconnected";
    }
  };

  return (
    <div className="p-4 bg-white border-t border-slate-200">
      <form onSubmit={handleSubmit} className="flex space-x-3">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-slate-800 placeholder-slate-400"
            disabled={connectionStatus !== "connected"}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition duration-150"
          >
            <Smile size={18} />
          </button>
        </div>
        <Button
          type="submit"
          disabled={!message.trim() || connectionStatus !== "connected"}
          className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-medium disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          <Send size={16} />
        </Button>
      </form>
      
      {/* Connection Status in Input Area */}
      <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor()}`}></div>
          <span>{getStatusText()}</span>
        </div>
        <span>Press Enter to send</span>
      </div>
    </div>
  );
}
