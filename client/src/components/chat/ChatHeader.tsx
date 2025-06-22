import { MessageCircle } from "lucide-react";

interface ChatHeaderProps {
  username: string;
  connectionStatus: "disconnected" | "connecting" | "connected" | "error";
}

export default function ChatHeader({ username, connectionStatus }: ChatHeaderProps) {
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
        return "Connected";
      case "error":
        return "Connection Error";
      case "connecting":
        return "Connecting...";
      default:
        return "Disconnected";
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <MessageCircle className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-800">Chat Room</h1>
            <p className="text-sm text-slate-500">Real-time messaging</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor()} ${
              connectionStatus === "connected" ? "animate-pulse" : ""
            }`}></div>
            <span className="text-sm text-slate-600">{getStatusText()}</span>
          </div>
          
          {/* Current User */}
          <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-full">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">
                {username.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm font-medium text-slate-700">{username}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
