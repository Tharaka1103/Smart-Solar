'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles, Mic, Image, Paperclip } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip } from "@/components/ui/tooltip"

type MessageType = {
  type: 'user' | 'assistant' | 'thinking';
  content: string;
  timestamp?: string;
}

export default function QuestionAnswering() {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<MessageType[]>([
    {
      type: 'assistant',
      content: "Hello! I'm Luminex, your solar assistant. How can I help you today with information about our company or solar services?",
      timestamp: new Date().toLocaleTimeString()
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [typingText, setTypingText] = useState('')
  const [isRecording, setIsRecording] = useState(false)

  useEffect(() => {
    const scrollArea = document.querySelector('.scroll-area-viewport');
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages, typingText]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return
    
    setMessages(prev => [...prev, { 
      type: 'user', 
      content: question,
      timestamp: new Date().toLocaleTimeString()
    }])
    
    setMessages(prev => [...prev, { type: 'thinking', content: '' }])
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/luminex/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      })
      
      if (!response.ok) throw new Error('Failed to get answer')
      
      const data = await response.json()
      
      setMessages(prev => prev.filter(msg => msg.type !== 'thinking'))
      
      let answer = data.answer;
      let currentText = '';
      
      const typingSpeed = Math.max(10, 30 - (answer.length / 15));
      
      for (let i = 0; i < answer.length; i++) {
        currentText += answer[i];
        setTypingText(currentText);
        const randomDelay = Math.random() * 30 + typingSpeed;
        await new Promise(resolve => setTimeout(resolve, randomDelay));
      }
      
      setTypingText('');
      setMessages(prev => [...prev, { 
        type: 'assistant', 
        content: answer,
        timestamp: new Date().toLocaleTimeString()
      }]);
      
    } catch (error) {
      console.error(error)
      setMessages(prev => prev.filter(msg => msg.type !== 'thinking'))
      setMessages(prev => [...prev, { 
        type: 'assistant', 
        content: "I'm sorry, I couldn't process your request. Please try again.",
        timestamp: new Date().toLocaleTimeString()
      }])
    } finally {
      setIsLoading(false)
      setQuestion('')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-[600px] md:h-[500px]"
    >
      <Alert className="mb-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 backdrop-blur-sm">
        <Sparkles className="h-4 w-4 text-primary animate-pulse" />
        <AlertDescription className="font-medium">
          Ask me anything about Smart Solar's services, products, or company information!
        </AlertDescription>
      </Alert>
      
      <ScrollArea className="flex-1 p-4 rounded-lg border mb-4 bg-background/80 backdrop-blur-sm shadow-lg scroll-area-viewport">
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((message, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Avatar className={`${message.type === 'user' ? 'bg-primary/10 ring-2 ring-primary/20' : 'bg-secondary ring-2 ring-secondary/20'} transition-all hover:scale-105`}>
                    <AvatarFallback>
                      {message.type === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                    </AvatarFallback>
                  </Avatar>
                  {message.type === 'thinking' ? (
                    <div className="rounded-2xl px-4 py-3 bg-muted shadow-sm">
                      <div className="flex space-x-2">
                        <div className="h-2 w-2 rounded-full bg-current animate-bounce" />
                        <div className="h-2 w-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="h-2 w-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className={`rounded-2xl px-4 py-3 shadow-sm ${
                        message.type === 'user' 
                          ? 'bg-green-800 text-white' 
                          : 'bg-muted hover:bg-muted/80 transition-colors'
                      }`}>
                        {message.content}
                      </div>
                      <div className={`text-xs text-muted-foreground ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                        {message.timestamp}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            
            {typingText && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex gap-3 max-w-[80%]">
                  <Avatar className="bg-secondary ring-2 ring-secondary/20">
                    <AvatarFallback>
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-2xl px-4 py-3 bg-muted shadow-sm">
                    {typingText}
                    <span className="inline-block w-1 h-4 ml-1 bg-current animate-pulse" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 flex gap-2 items-center bg-background/80 backdrop-blur-sm rounded-lg border px-3">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about our services or company..."
            className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={isLoading || typingText.length > 0}
          />
            <Button 
                type="submit" 
                disabled={isLoading || !question.trim() || typingText.length > 0}
                className="shadow-lg hover:shadow-xl transition-all text-white"
                >
                <Send className="h-4 w-4" />
                </Button>
            </div>
            
      </form>
    </motion.div>
  )
}
