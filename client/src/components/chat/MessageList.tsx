import { useEffect, useRef } from "react";
import { formatTime } from "@/lib/utils";
import type { MessageWithUser } from "@shared/schema";
import { Info } from "lucide-react";
import MessageReactions from "./MessageReactions";

interface MessageListProps {
  username: string;
  messages: MessageWithUser[];
  onAddReaction: (messageId: number, emoji: string) => void;
  onRemoveReaction: (messageId: number, emoji: string) => void;
}

export default function MessageList({ username, messages, onAddReaction, onRemoveReaction }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-4">
      {/* Welcome Message */}
      <div className="flex justify-center">
        <div className="bg-slate-100 px-4 py-2 rounded-full text-sm text-slate-600">
          <Info className="inline mr-1" size={14} />
          You joined the chat room
        </div>
      </div>

      {/* Messages */}
      {messages.map((message) => {
        const isCurrentUser = message.user.username === username;
        
        return (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              isCurrentUser ? "flex-row-reverse space-x-reverse" : ""
            }`}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
              <span className={`text-xs text-white font-medium w-8 h-8 rounded-full flex items-center justify-center ${
                isCurrentUser ? "bg-blue-500" : "bg-slate-400"
              }`}>
                {message.user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className={`flex items-center space-x-2 mb-1 ${
                isCurrentUser ? "justify-end" : ""
              }`}>
                {!isCurrentUser && (
                  <span className="text-sm font-medium text-slate-800">
                    {message.user.username}
                  </span>
                )}
                <span className="text-xs text-slate-500">
                  {formatTime(message.createdAt)}
                </span>
                {isCurrentUser && (
                  <span className="text-sm font-medium text-slate-800">You</span>
                )}
              </div>
              <div>
                <div className={`p-3 rounded-2xl shadow-sm max-w-xs lg:max-w-md xl:max-w-lg ${
                  isCurrentUser
                    ? "bg-blue-500 text-white rounded-tr-md"
                    : "bg-white border border-slate-200 rounded-tl-md"
                }`}>
                  <p className={isCurrentUser ? "text-white" : "text-slate-700"}>
                    {message.content}
                  </p>
                </div>
                {message.parsedReactions && Object.keys(message.parsedReactions).length > 0 && (
                  <MessageReactions
                    messageId={message.id}
                    reactions={Object.entries(message.parsedReactions).map(([emoji, data]) => ({
                      emoji,
                      count: data.count,
                      users: data.users,
                    }))}
                    currentUser={username}
                    onAddReaction={onAddReaction}
                    onRemoveReaction={onRemoveReaction}
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
      
      <div ref={messagesEndRef} />
    </div>
  );
}
