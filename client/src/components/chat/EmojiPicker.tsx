import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Smile } from "lucide-react";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const EMOJI_CATEGORIES = {
  "Smileys": ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳"],
  "Gestures": ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👋", "🤚", "🖐", "✋", "🖖", "👏", "🙌", "🤲", "🤝", "🙏"],
  "Hearts": ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟"],
  "Objects": ["🎉", "🎊", "🎈", "🎁", "🎂", "🍰", "🧁", "🍭", "🍬", "🍫", "🍿", "🥤", "☕", "🍺", "🍻", "🥂", "🍷", "🥃", "🍸", "🍹", "🍾", "🔥", "⭐", "✨", "💫", "⚡", "💯"],
  "Nature": ["🌸", "🌺", "🌻", "🌷", "🌹", "🌼", "🌿", "🍀", "🌱", "🌲", "🌳", "🌴", "🌵", "🌾", "🌈", "☀️", "🌤", "⛅", "🌦", "🌧", "⛈", "🌩", "❄️", "☃️", "⛄", "🌊", "💧", "🔥"]
};

export default function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const [selectedCategory, setSelectedCategory] = useState("Smileys");
  const [isOpen, setIsOpen] = useState(false);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition duration-150"
        >
          <Smile size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="bg-white rounded-lg shadow-lg border border-slate-200">
          {/* Category Tabs */}
          <div className="flex border-b border-slate-200 p-2">
            {Object.keys(EMOJI_CATEGORIES).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 text-xs font-medium rounded transition duration-150 ${
                  selectedCategory === category
                    ? "bg-blue-100 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Emoji Grid */}
          <div className="p-3 max-h-48 overflow-y-auto">
            <div className="grid grid-cols-8 gap-1">
              {EMOJI_CATEGORIES[selectedCategory as keyof typeof EMOJI_CATEGORIES].map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiClick(emoji)}
                  className="w-8 h-8 flex items-center justify-center text-lg hover:bg-slate-100 rounded transition duration-150"
                  title={emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Reactions */}
          <div className="border-t border-slate-200 p-2">
            <div className="text-xs font-medium text-slate-600 mb-2">Quick Reactions</div>
            <div className="flex space-x-1">
              {["❤️", "😂", "😮", "😢", "😡", "👍", "👎", "🎉"].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleEmojiClick(emoji)}
                  className="w-8 h-8 flex items-center justify-center text-lg hover:bg-slate-100 rounded transition duration-150"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}