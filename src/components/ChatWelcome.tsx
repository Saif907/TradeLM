import { TrendingUp, BarChart3, Target, Calendar } from "lucide-react";

const suggestions = [
  {
    icon: TrendingUp,
    title: "Log a Trade",
    description: "I bought AAPL at $256 and sold at $325",
  },
  {
    icon: BarChart3,
    title: "Analyze Performance",
    description: "Show me my trading statistics this month",
  },
  {
    icon: Target,
    title: "Plan Strategy",
    description: "Help me plan my next trade for TSLA",
  },
  {
    icon: Calendar,
    title: "Review Trades",
    description: "What trades did I make last week?",
  },
];

export function ChatWelcome({ onSuggestionClick }: { onSuggestionClick: (text: string) => void }) {
  return (
    <div className="flex-1 flex items-center justify-center p-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-semibold text-foreground tracking-tight">
            Your AI Trading Journal
          </h1>
          <p className="text-muted-foreground text-lg">
            Record trades, analyze performance, and plan strategies naturally
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick(suggestion.description)}
              className="group p-4 rounded-xl border border-border bg-[hsl(var(--message-ai-bg))] hover:bg-[hsl(var(--hover-bg))] hover:border-accent transition-all duration-200 text-left"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-accent/10 text-accent group-hover:bg-accent/20 transition-colors">
                  <suggestion.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground mb-1">
                    {suggestion.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {suggestion.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
