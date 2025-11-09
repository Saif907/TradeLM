import { useState } from "react";
import { Send, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-border bg-background safe-bottom">
      <div className="max-w-3xl mx-auto p-3 sm:p-4">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end gap-1.5 sm:gap-2 bg-[hsl(var(--message-ai-bg))] rounded-2xl border border-border p-1.5 sm:p-2 focus-within:border-accent transition-colors">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="flex-shrink-0 hover:bg-[hsl(var(--hover-bg))] h-8 w-8 sm:h-10 sm:w-10"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Record a trade, ask for insights..."
              disabled={disabled}
              className="flex-1 min-h-[24px] max-h-[160px] sm:max-h-[200px] bg-transparent border-0 focus-visible:ring-0 resize-none px-1 sm:px-2 py-2 text-sm sm:text-base"
              rows={1}
            />
            
            <Button
              type="submit"
              size="icon"
              disabled={!message.trim() || disabled}
              className="flex-shrink-0 bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed h-8 w-8 sm:h-10 sm:w-10"
            >
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </form>
        <p className="text-xs text-muted-foreground text-center mt-2 hidden sm:block">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}
