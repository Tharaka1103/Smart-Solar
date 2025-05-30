"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, Send, X, Maximize2, Minimize2, MessageSquare, Loader2,
  Sun, ZapIcon, Battery, Home, Building, Wrench, Coins, 
  PanelTop, BarChart, Calendar, Banknote, Percent, Clock, 
  ShieldCheck, Lightbulb, Leaf, HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

// Define icon mapping
const iconMap: Record<string, React.ReactNode> = {
  Sun: <Sun className="inline h-4 w-4 text-yellow-500 mx-1" />,
  ZapIcon: <ZapIcon className="inline h-4 w-4 text-yellow-500 mx-1" />,
  Battery: <Battery className="inline h-4 w-4 text-green-500 mx-1" />,
  Home: <Home className="inline h-4 w-4 text-blue-500 mx-1" />,
  Building: <Building className="inline h-4 w-4 text-blue-700 mx-1" />,
  Wrench: <Wrench className="inline h-4 w-4 text-gray-600 mx-1" />,
  Coins: <Coins className="inline h-4 w-4 text-amber-500 mx-1" />,
  PanelTop: <PanelTop className="inline h-4 w-4 text-blue-500 mx-1" />,
  BarChart: <BarChart className="inline h-4 w-4 text-purple-500 mx-1" />,
  Calendar: <Calendar className="inline h-4 w-4 text-indigo-500 mx-1" />,
  Banknote: <Banknote className="inline h-4 w-4 text-green-600 mx-1" />,
  Percent: <Percent className="inline h-4 w-4 text-red-500 mx-1" />,
  Clock: <Clock className="inline h-4 w-4 text-gray-500 mx-1" />,
  ShieldCheck: <ShieldCheck className="inline h-4 w-4 text-green-500 mx-1" />,
  Lightbulb: <Lightbulb className="inline h-4 w-4 text-yellow-400 mx-1" />,
  Leaf: <Leaf className="inline h-4 w-4 text-green-400 mx-1" />,
  HelpCircle: <HelpCircle className="inline h-4 w-4 text-blue-400 mx-1" />,
};

// Types
type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

type SuggestedQuestion = {
  id: string;
  text: string;
};

const suggestedQuestions: SuggestedQuestion[] = [
    { id: "q1", text: "How much money can I save with solar? 💰" },
    { id: "q2", text: "What size solar system for my home? 🏠" },
    { id: "q3", text: "How long does installation take? ⏱️" },
    { id: "q4", text: "Do solar panels need maintenance? 🔧" },
    { id: "q5", text: "Any government rebates in Sri Lanka? 🇱🇰" },
    { id: "q6", text: "How does solar power work? ☀️" },
    { id: "q7", text: "What happens during power outages? 🔌" },
    { id: "q8", text: "Best roof types for solar panels? 🏡" },
  ];
  

// Helper function to parse and render content with icons
const renderContentWithIcons = (content: string) => {
  if (!content) return null;
  
  // First, process any remaining ** markers for emphasis
  // This regex matches patterns like **text** and replaces them with <strong> tags
  const processedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Regular expression to match [IconName] patterns
  const iconRegex = /\[([A-Za-z]+)\]/g;
  
  // Split the content based on icon markers
  const parts = processedContent.split(iconRegex);
  
  return parts.map((part, index) => {
    // Create a unique key for each part
    const key = `part-${index}`;
    
    // Check if this part is an icon name
    if (index % 2 === 1) {
      const iconName = part as keyof typeof iconMap;
      return (
        <React.Fragment key={key}>
          {iconMap[iconName] || `[${part}]`}
        </React.Fragment>
      );
    }
    
    // Regular text part - if it contains HTML tags from our processing, render them properly
    if (part.includes('<strong>')) {
      return (
        <React.Fragment key={key}>
          {part.split(/(<strong>.*?<\/strong>)/g).map((fragment, i) => {
            if (fragment.startsWith('<strong>') && fragment.endsWith('</strong>')) {
              // Extract the text between the strong tags
              const strongText = fragment.replace(/<strong>(.*?)<\/strong>/, '$1');
              return <strong key={`${key}-strong-${i}`}>{strongText}</strong>;
            }
            return <React.Fragment key={`${key}-text-${i}`}>{fragment}</React.Fragment>;
          })}
        </React.Fragment>
      );
    }
    
    // Regular text with no HTML
    return <React.Fragment key={key}>{part}</React.Fragment>;
  });
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { successt, errort } = useToast();

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleOpenChat = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      setShowWelcome(true);
      setTimeout(() => {
        setShowWelcome(false);
        setMessages([
          {
            role: "assistant",
            content:
              "👋 Hello there! I'm Luminex Intelligence, your friendly solar energy buddy! How can I brighten up your day? [Sun]",
          },
        ]);
      }, 2000);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      errort({
        title: "Error",
        description: "Failed to get a response. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionClick = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <>
      {/* Chat Button */}
      <motion.div
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <Button
          onClick={handleOpenChat}
          className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-primary shadow-lg hover:bg-primary/90"
          aria-label="Open chat"
        >
          <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`fixed bottom-0 sm:bottom-24 right-0 sm:right-6 z-50 w-full ${
              isExpanded 
                ? "h-[100vh] sm:h-[85vh] sm:max-w-[500px]" 
                : "h-[80vh] sm:h-[500px] sm:max-w-[380px]"
            }`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="flex flex-col h-full shadow-xl border-primary/20">
              <CardHeader className="bg-primary/10 p-2 sm:p-3 flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2,
                      repeatType: "reverse"
                    }}
                  >
                    <Avatar className="h-7 w-7 sm:h-8 sm:w-8 bg-primary">
                      <AvatarImage src="/bot-avatar.png" alt="Luminex AI" />
                      <AvatarFallback className="bg-primary">
                        <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                  <div>
                    <h3 className="font-medium text-xs sm:text-sm">Luminex Intelligence</h3>
                    <p className="text-[10px] sm:text-xs opacity-70">Solar Energy Assistant</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? (
                      <Minimize2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    ) : (
                      <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                {/* Welcome Alert */}
                <AnimatePresence>
                  {showWelcome && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Alert className="mb-3 sm:mb-4 bg-primary/5 border-primary/20">
                        <div className="flex items-center gap-2">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          >
                            <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                          </motion.div>
                          <AlertDescription className="text-xs sm:text-sm">
                            Welcome to Luminex Intelligence! I'm here to brighten your day with solar knowledge! ☀️
                          </AlertDescription>
                        </div>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Chat Messages */}
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-2 sm:p-3 ${
                        message.role === "user"
                          ? "bg-emerald-900 text-white ml-auto"
                          : "bg-background"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                          <Avatar className="h-4 w-4 sm:h-5 sm:w-5 bg-primary items-center text-center justify-center">
                            <Bot className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary-foreground" />
                          </Avatar>
                          <span className="text-xs sm:text-sm font-medium text-primary">Luminex AI</span>
                        </div>
                      )}
                      <p className="text-[11px] sm:text-xs whitespace-pre-wrap">
                        {message.role === "assistant" 
                          ? renderContentWithIcons(message.content) 
                          : message.content}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="bg-muted rounded-lg p-2 sm:p-3">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Avatar className="h-4 w-4 sm:h-5 sm:w-5 bg-primary">
                          <Bot className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary-foreground" />
                        </Avatar>
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin text-primary" />
                        <span className="text-[11px] sm:text-xs">I'm thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Suggested Questions */}
                {messages.length === 1 && (
                  <motion.div
                    className="mt-3 sm:mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <p className="text-[11px] sm:text-xs text-muted-foreground mb-1.5 sm:mb-2">
                      What would you like to know about solar energy?
                    </p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {suggestedQuestions.map((q) => (
                        <Button
                          key={q.id}
                          variant="outline"
                          size="sm"
                          className="text-[10px] sm:text-xs py-0.5 sm:py-1 h-auto rounded-full bg-primary/5 hover:bg-primary/10 border-primary/20"
                          onClick={() => handleQuestionClick(q.text)}
                        >
                          {q.text}
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </CardContent>

              <CardFooter className="p-2 sm:p-3 border-t block">
                <motion.div>
                <form
                  className="flex w-full gap-1.5 sm:gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(inputMessage);
                  }}
                >
                  <Input
                    placeholder="Ask me anything about solar..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="flex-1 text-xs sm:text-sm"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="h-8 w-8 sm:h-10 sm:w-10 bg-primary hover:bg-primary/90"
                    disabled={!inputMessage.trim() || isLoading}
                  >
                    <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </form>
                </motion.div>
                <motion.div
                  className="text-xs sm:text-sm text-muted-foreground italic font-light px-2 py-1 rounded-md bg-secondary/20 mt-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  Luminex intelligence can make mistakes. Please verify the
                  information before taking any action.
                </motion.div>
              </CardFooter>              
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
