import React, { useState } from 'react';
import { Sparkles, Send, X, Copy, Check, Zap, Flame, Compass, RefreshCw } from 'lucide-react';

interface NexoraAIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPromptToCaption?: (caption: string) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'spark';
  text: string;
  timestamp: string;
}

export const NexoraAIAssistant: React.FC<NexoraAIAssistantProps> = ({
  isOpen,
  onClose,
  onApplyPromptToCaption,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init_1',
      sender: 'spark',
      text: "⚡ **Welcome to NEXORA SPARK AI!**\nI'm your creative copilot. Ask me to generate viral video hooks, write punchy captions, research trending audio, or plan a multi-part series to skyrocket your Super Sparks earnings!",
      timestamp: 'Just now',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    { label: '5 Viral Video Hooks', prompt: 'Generate 5 high-retention viral video hooks for a music producer/fashion reel on Nexora' },
    { label: 'Caption & Hashtags', prompt: 'Write an energetic, punchy 2-sentence reel caption with 5 high-volume hashtags for a Tokyo cyberpunk aesthetic' },
    { label: 'Monetization Plan', prompt: 'Give me 3 actionable tips to increase Super Sparks gifts and paid subscribers on Nexora' },
    { label: '3-Part Series Idea', prompt: 'Pitch a 3-part storytelling series idea with cliffhangers for social entertainment' },
  ];

  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend || inputQuery).trim();
    if (!prompt || isLoading) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: 'Now',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      const replyText = data.response || data.error || 'Spark AI encountered a hiccup. Try again!';

      const sparkMessage: Message = {
        id: `spark_${Date.now()}`,
        sender: 'spark',
        text: replyText,
        timestamp: 'Now',
      };
      setMessages((prev) => [...prev, sparkMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `spark_err_${Date.now()}`,
          sender: 'spark',
          text: '⚡ [NEXORA SPARK CREATIVE]: Here are high-converting ideas for your reel:\n\n1. "Stop scrolling if you want to know what happens next..."\n2. "The secret transition trick taking over Nexora."\n3. Use 128 BPM track with abrupt visual pause at 0:03.\n\nRecommended tags: #NexoraCreators #ViralHook #Trending2026',
          timestamp: 'Now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-zinc-950 border-2 border-yellow-500/40 rounded-3xl h-[85vh] flex flex-col shadow-[0_0_60px_rgba(250,204,21,0.25)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-yellow-500 via-red-500 to-sky-400 p-[2px]">
              <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black italic text-white uppercase tracking-wider">
                  NEXORA SPARK
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-400 text-[10px] font-black italic uppercase">
                  AI Creative Studio
                </span>
              </div>
              <p className="text-[11px] font-semibold italic text-zinc-400">
                Powered by Gemini 3.8 Flash • Viral Hook & Script Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Prompts Carousel */}
        <div className="px-5 py-2.5 bg-zinc-900/30 border-b border-zinc-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          {quickPrompts.map((qp, index) => (
            <button
              key={index}
              onClick={() => handleSend(qp.prompt)}
              className="px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-bold italic text-zinc-300 hover:text-yellow-400 hover:border-yellow-500/50 transition-all shrink-0 active:scale-95 flex items-center gap-1.5"
            >
              <Zap className="w-3 h-3 text-yellow-400" />
              {qp.label}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm font-semibold italic ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-red-600 to-yellow-500 text-black font-black'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-100 shadow-lg'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>

                {msg.sender === 'spark' && (
                  <div className="mt-3 pt-2 border-t border-zinc-800 flex items-center justify-between text-xs font-bold italic text-zinc-400">
                    <span className="text-[10px] text-zinc-500">{msg.timestamp}</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="hover:text-yellow-400 transition-colors flex items-center gap-1"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                      {onApplyPromptToCaption && (
                        <button
                          onClick={() => {
                            onApplyPromptToCaption(msg.text);
                            onClose();
                          }}
                          className="text-yellow-400 hover:underline flex items-center gap-1"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          Apply to Post
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs font-bold italic text-yellow-400 w-fit">
              <RefreshCw className="w-4 h-4 animate-spin text-yellow-400" />
              <span>NEXORA SPARK is formulating viral recommendations...</span>
            </div>
          )}
        </div>

        {/* Input Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center gap-2.5 shrink-0"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask Nexora Spark (e.g., 'Hooks for fitness reel', 'Trending sound breakdown')..."
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-sm font-bold italic text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-400 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-red-500 text-black flex items-center justify-center font-black italic disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-95 transition-all shadow-md shrink-0"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
