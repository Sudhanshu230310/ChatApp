import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus } from "lucide-react";

interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

interface MessageReactionsProps {
  messageId: number;
  reactions: Reaction[];
  currentUser: string;
  onAddReaction: (messageId: number, emoji: string) => void;
  onRemoveReaction: (messageId: number, emoji: string) => void;
}

const QUICK_REACTIONS = ["❤️", "😂", "😮", "😢", "😡", "👍", "👎", "🎉"];

export default function MessageReactions({ 
  messageId, 
  reactions, 
  currentUser, 
  onAddReaction, 
  onRemoveReaction 
}: MessageReactionsProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleReactionClick = (emoji: string) => {
    const reaction = reactions.find(r => r.emoji === emoji);
    const userHasReacted = reaction?.users.includes(currentUser);

    if (userHasReacted) {
      onRemoveReaction(messageId, emoji);
    } else {
      onAddReaction(messageId, emoji);
    }
  };

  const handleQuickReaction = (emoji: string) => {
    handleReactionClick(emoji);
    setShowPicker(false);
  };

  return (
    <div className="flex items-center space-x-1 mt-1">
      {/* Existing Reactions */}
      {reactions.map((reaction) => {
        const userHasReacted = reaction.users.includes(currentUser);
        return (
          <Button
            key={reaction.emoji}
            variant="outline"
            size="sm"
            onClick={() => handleReactionClick(reaction.emoji)}
            className={`h-6 px-2 text-xs rounded-full border transition duration-150 ${
              userHasReacted
                ? "bg-blue-100 border-blue-300 text-blue-700"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span className="mr-1">{reaction.emoji}</span>
            <span>{reaction.count}</span>
          </Button>
        );
      })}

      {/* Add Reaction Button */}
      <Popover open={showPicker} onOpenChange={setShowPicker}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition duration-150"
          >
            <Plus size={12} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <div className="flex space-x-1">
            {QUICK_REACTIONS.map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                onClick={() => handleQuickReaction(emoji)}
                className="h-8 w-8 p-0 text-lg hover:bg-slate-100 rounded transition duration-150"
              >
                {emoji}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}