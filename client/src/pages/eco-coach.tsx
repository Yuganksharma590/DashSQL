import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Leaf, Lightbulb, Recycle, Droplets, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { ChatMessage } from "@shared/schema";

const quickTips = [
  { icon: Lightbulb, text: "Energy saving tips", category: "energy" },
  { icon: Recycle, text: "Recycling guide", category: "waste" },
  { icon: Droplets, text: "Water conservation", category: "water" },
  { icon: Zap, text: "Carbon footprint tips", category: "carbon" },
];

export default function EcoCoach() {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat"],
  });

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("POST", "/api/chat", {
        userId: "default-user",
        role: "user",
        content,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat"] });
      setMessage("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSend = () => {
    if (message.trim()) {
      sendMessage.mutate(message);
    }
  };

  const handleQuickTip = (tip: string) => {
    sendMessage.mutate(tip);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="p-6 md:p-8 h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2">Eco Coach</h1>
        <p className="text-muted-foreground">Get personalized sustainability tips and advice</p>
      </div>

      <div className="flex-1 min-h-0 grid gap-6 lg:grid-cols-4">
        {/* Chat Area */}
        <Card className="lg:col-span-3 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Chat with Eco Coach
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4" data-testid="chat-messages">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : messages && messages.length > 0 ? (
                <>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      data-testid={`message-${msg.role}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-card border-l-4 border-primary"
                        }`}
                      >
                        {msg.role === "assistant" && (
                          <div className="flex items-center gap-2 mb-2">
                            <Leaf className="h-4 w-4 text-primary" />
                            <span className="font-semibold text-sm">Eco Coach</span>
                          </div>
                        )}
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageCircle className="h-16 w-16 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Welcome to Eco Coach!</h3>
                  <p className="text-muted-foreground max-w-sm mb-4">
                    I'm here to help you live more sustainably. Ask me anything about reducing your carbon footprint,
                    saving energy, recycling, or eco-friendly living!
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {quickTips.map((tip) => (
                      <Button
                        key={tip.category}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickTip(tip.text)}
                        data-testid={`quick-tip-${tip.category}`}
                      >
                        <tip.icon className="h-4 w-4 mr-2" />
                        {tip.text}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Ask about sustainability..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={sendMessage.isPending}
                data-testid="input-message"
              />
              <Button
                onClick={handleSend}
                disabled={!message.trim() || sendMessage.isPending}
                data-testid="button-send"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips Sidebar */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickTips.map((tip) => (
              <Button
                key={tip.category}
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleQuickTip(tip.text)}
                data-testid={`sidebar-tip-${tip.category}`}
              >
                <tip.icon className="h-4 w-4 mr-2 text-primary" />
                <span className="text-sm">{tip.text}</span>
              </Button>
            ))}
            
            <div className="pt-4 border-t space-y-2">
              <h4 className="font-medium text-sm">Popular Topics</h4>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => sendMessage.mutate("How can I reduce my plastic waste?")}
                >
                  Plastic waste
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => sendMessage.mutate("What are the best ways to save energy at home?")}
                >
                  Energy saving
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => sendMessage.mutate("Tell me about composting")}
                >
                  Composting
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => sendMessage.mutate("How do I start a zero-waste lifestyle?")}
                >
                  Zero waste
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
