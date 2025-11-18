import { Bot, User, Globe } from "lucide-react"; // Import Globe for grounding indicator
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge"; // Ensure Badge is imported

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  is_grounded?: boolean; // NEW PROP
}

export function ChatMessage({ role, content, is_grounded = false }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "w-full py-4 sm:py-6 px-3 sm:px-4 animate-in fade-in slide-in-from-bottom-4 duration-500",
        isUser ? "bg-[hsl(var(--message-user-bg))]" : "bg-[hsl(var(--message-ai-bg))]"
      )}
    >
      <div className="max-w-3xl mx-auto flex gap-2 sm:gap-4">
        <div
          className={cn(
            "flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center",
            isUser
              ? "bg-accent text-accent-foreground"
              : "bg-secondary text-secondary-foreground"
          )}
        >
          {isUser ? <User className="h-4 w-4 sm:h-5 sm:w-5" /> : <Bot className="h-4 w-4 sm:h-5 w-5" />}
        </div>
        <div className="flex-1 prose prose-invert max-w-none">
          {/* AI Message Header/Grounding Indicator */}
          {!isUser && is_grounded && (
            <div className="mb-2">
                <Badge variant="secondary" className="text-xs font-normal bg-secondary/70">
                    <Globe className="h-3 w-3 mr-1" />
                    Searched the Web for live data
                </Badge>
            </div>
          )}
          <p className="text-sm sm:text-base text-foreground leading-relaxed whitespace-pre-wrap break-words">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}