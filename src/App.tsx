import React, { useState, useRef, useEffect } from 'react';
import { Send, ChefHat, Sparkles, Loader2, Utensils } from 'lucide-react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Hello! I'm ChefAgent, your personal culinary concierge. 👨‍🍳\\n\\nTo get started, tell me what ingredients you have in your fridge or pantry, how much time you have, and if you have any dietary restrictions. Let's cook something amazing and reduce food waste!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: messages,
          message: userMessage
        })
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'model', text: data.text }]);
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "Oops! My kitchen timer distracted me. Could you repeat that?" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-neutral-50 font-sans text-neutral-900">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center shadow-sm z-10">
        <div className="bg-orange-100 p-2 rounded-full mr-3">
          <ChefHat className="text-orange-600 w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-800 flex items-center gap-2">
            ChefAgent <Sparkles className="w-4 h-4 text-orange-400" />
          </h1>
          <p className="text-sm text-neutral-500 font-medium">Your Personal Culinary Concierge</p>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 w-full max-w-4xl mx-auto space-y-6">
        {messages.map((msg, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div className="flex-shrink-0 mt-1">
                {msg.role === 'model' ? (
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center border border-orange-200">
                    <Utensils className="w-4 h-4 text-orange-600" />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white text-xs font-bold">U</span>
                  </div>
                )}
              </div>

              {/* Bubble */}
              <div 
                className={`px-5 py-4 rounded-2xl shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-neutral-800 text-white rounded-tr-sm' 
                    : 'bg-white border border-neutral-200 text-neutral-800 rounded-tl-sm'
                }`}
              >
                {msg.role === 'model' ? (
                  <div className="prose prose-sm prose-orange max-w-none">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex gap-3">
               <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center border border-orange-200">
                  <Utensils className="w-4 h-4 text-orange-600" />
                </div>
              <div className="px-5 py-4 bg-white border border-neutral-200 rounded-2xl rounded-tl-sm flex items-center gap-2 text-neutral-500 text-sm font-medium shadow-sm">
                <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                ChefAgent is thinking...
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="bg-white border-t border-neutral-200 p-4">
        <div className="max-w-4xl mx-auto relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="I have some chicken, rice, and broccoli..."
            className="w-full bg-neutral-50 border border-neutral-300 rounded-full py-4 pl-6 pr-16 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-inner"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 bg-orange-500 hover:bg-orange-600 disabled:bg-neutral-300 text-white rounded-full transition-colors flex items-center justify-center"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </div>
        <div className="text-center mt-2">
          <p className="text-xs text-neutral-400">ChefAgent can make mistakes. Always check cooking times and temperatures.</p>
        </div>
      </footer>
    </div>
  );
}
