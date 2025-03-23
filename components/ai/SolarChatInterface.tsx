"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, Send, RefreshCw, Bot, User } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from '@/hooks/use-toast'
import Typewriter from 'typewriter-effect';

type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: string;
  };
  

export default function SolarChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const { successt, errort, warningt, infot, dismissAll } = useToast()

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: 'numeric',
      hour12: true 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage: Message = { 
      id: `user-${Date.now()}`, 
      role: "user", 
      content: input,
      timestamp: formatTime()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);
  
    try {
      const apiMessages = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content
      }));

      setLoading(true);
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to get response");
      }
  
      const data = await response.json();
      setIsThinking(false);
      
      const aiMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.content,
        timestamp: formatTime()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error("Error in chat:", error);
      errort({
        title: "Failed to send message",
        description: "Please check your internet connection and try again.",
      })
    } finally {
      setLoading(false);
    }
  };

  const resetConversation = () => {
    setMessages([]);
    successt({
      title: "Conversation reset",
      description: "Your conversation history has been cleared.",
    })
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="relative overflow-hidden">
          <CardContent className="pt-6 pb-6">
            <Alert className="mb-6 border-emerald-500/50 bg-emerald-500/10">
              <AlertCircle className="h-5 w-5 text-emerald-500" />
              <AlertTitle className="text-emerald-500 font-medium">Ask Luminex Intelligence</AlertTitle>
              <AlertDescription>
                Ask any question about solar energy, our products, or services. Luminex AI will provide
                informative answers based on current knowledge about Smart Solar and the solar industry.
              </AlertDescription>
            </Alert>

            <div className="mb-4 space-y-4 h-[400px] overflow-y-auto p-2" id="chat-container">
              <AnimatePresence initial={false}>
                {messages.length === 0 && (
                  <motion.div
                    key="empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center p-6"
                  >
                    <Bot className="h-12 w-12 mx-auto text-primary/60 mb-2" />
                    <h3 className="text-xl font-medium text-primary">Luminex AI Assistant</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mt-2">
                      Ask me anything about solar energy, Smart Solar's services, or how to reduce your energy costs!
                    </p>
                  </motion.div>
                )}

                {messages.map((message) => (
                <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className={`flex items-start gap-3 max-w-[80%]`}>
                      {message.role === "assistant" && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/luminex-avatar.png" alt="Luminex" />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            LI
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div
                        className={`rounded-lg p-3 ${
                          message.role === "user"
                            ? "bg-lime-300 text-black"
                            : "bg-secondary"
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      </div>

                      {message.role === "user" && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-muted">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                    <div className="text-xs ml-2 mt-2 opacity-70 self-end">{message.timestamp}</div>
                  </motion.div>
                ))}

                {isThinking && (
                  <motion.div
                    key="thinking"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start gap-3 max-w-[80%]">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/luminex-avatar.png" alt="Luminex" />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          LI
                        </AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg bg-secondary p-4">
                        <div>Thinking...</div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={endOfMessagesRef} />
              </AnimatePresence>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={resetConversation}
                title="Reset conversation"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about solar energy, our services, or pricing..."
                  className="flex-1"
                  disabled={loading}
                />
                <Button type="submit" disabled={loading || !input.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
