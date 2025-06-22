import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Shield, LogIn } from "lucide-react";

interface LoginScreenProps {
  connectionStatus: "disconnected" | "connecting" | "connected" | "error";
  onJoinChat: (username: string) => void;
}

export default function LoginScreen({ connectionStatus, onJoinChat }: LoginScreenProps) {
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && connectionStatus === "connected") {
      onJoinChat(username.trim());
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-green-100 text-green-800 border-green-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-slate-200 shadow-xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
              <MessageCircle className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Join Chat</h1>
            <p className="text-slate-600">Connect with others in real-time</p>
          </div>

          {/* Connection Status */}
          <div className="mb-6 text-center">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm border ${getStatusColor()}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                connectionStatus === "connected" ? "bg-green-500 animate-pulse" :
                connectionStatus === "error" ? "bg-red-500" :
                "bg-yellow-500"
              }`}></div>
              <span>{getStatusText()}</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-slate-800 placeholder-slate-400"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={connectionStatus !== "connected" || !username.trim()}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-medium disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              <LogIn className="mr-2" size={16} />
              Join Chat Room
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-500">
              <Shield className="inline mr-1" size={14} />
              Secure real-time messaging
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
