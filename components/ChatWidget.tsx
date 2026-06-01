'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

const SUGGESTIONS = ['What are his skills?', 'Show me his projects', 'How do I contact him?'];

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState('');
    const [isEnabled, setIsEnabled] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const reduce = useReducedMotion();

    // Check if chatbot is enabled
    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await fetch('/api/settings');
                const data = await res.json();
                if (data.chatbot_enabled !== undefined) {
                    setIsEnabled(data.chatbot_enabled);
                }
            } catch (error) {
                console.error('Error checking chatbot status:', error);
            }
        };
        checkStatus();
    }, []);

    // Auto-scroll to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    }, [messages, reduce]);

    if (!isEnabled) return null;

    const toggleChat = () => setIsOpen((prev) => !prev);

    const sendMessage = async (text: string) => {
        if (!text.trim()) return;

        const userMessage: Message = {
            id: Math.random().toString(36).substring(7),
            role: 'user',
            content: text
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map(m => ({
                        role: m.role,
                        parts: [{ type: 'text', text: m.content }]
                    }))
                })
            });

            if (!response.ok) throw new Error('Failed to get response');

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let assistantMessage = '';

            const assistantId = Math.random().toString(36).substring(7);

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    assistantMessage += chunk;

                    setMessages(prev => {
                        const lastMsg = prev[prev.length - 1];
                        if (lastMsg?.id === assistantId) {
                            return [...prev.slice(0, -1), { ...lastMsg, content: assistantMessage }];
                        }
                        return [...prev, { id: assistantId, role: 'assistant', content: assistantMessage }];
                    });
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, {
                id: Math.random().toString(36).substring(7),
                role: 'assistant',
                content: 'Sorry, I ran into an error. Please try again.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        sendMessage(input);
        setInput('');
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end sm:bottom-6 sm:right-6">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.97 }}
                        transition={{ duration: reduce ? 0.15 : 0.22, ease: [0.25, 1, 0.5, 1] }}
                        role="dialog"
                        aria-label="Chat with Chester's AI assistant"
                        className="mb-4 w-[90vw] sm:w-[400px] h-[500px] bg-popover text-popover-foreground border border-border rounded-2xl shadow-[0_16px_48px_-12px_rgba(0,0,0,0.55)] overflow-hidden flex flex-col font-sans"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between gap-2 p-4 border-b border-border">
                            <div className="flex items-center gap-3">
                                <span className="flex size-9 items-center justify-center rounded-lg border border-border text-foreground">
                                    <Sparkles className="size-5" aria-hidden="true" />
                                </span>
                                <div>
                                    <h3 className="font-semibold text-foreground text-sm leading-tight">
                                        Chester&apos;s AI assistant
                                    </h3>
                                    <p className="text-muted-foreground text-xs flex items-center gap-1.5">
                                        <span className="relative flex size-2" aria-hidden="true">
                                            {!reduce && (
                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
                                            )}
                                            <span className="relative inline-flex size-2 rounded-full bg-brand" />
                                        </span>
                                        Online
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={toggleChat}
                                aria-label="Close chat"
                                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-accent outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            >
                                <X className="size-5" aria-hidden="true" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40">
                            {messages.length === 0 && (
                                <div className="text-center mt-8 space-y-2">
                                    <p className="text-sm text-foreground">Ask me about Chester&apos;s work.</p>
                                    <p className="text-xs text-muted-foreground">
                                        Projects, skills, experience, or how to get in touch.
                                    </p>
                                    <div className="flex flex-wrap gap-2 justify-center pt-3">
                                        {SUGGESTIONS.map((q) => (
                                            <button
                                                key={q}
                                                type="button"
                                                onClick={() => sendMessage(q)}
                                                className="text-xs text-foreground bg-transparent hover:bg-accent border border-border rounded-full px-3 py-1 transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                            >
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {messages.map((m) => (
                                <div
                                    key={m.id}
                                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${m.role === 'user'
                                            ? 'bg-primary text-primary-foreground rounded-br-none'
                                            : 'bg-muted text-foreground border border-border rounded-bl-none'
                                            }`}
                                    >
                                        {m.role === 'assistant' ? (
                                            <div className="prose prose-invert prose-sm max-w-none">
                                                <ReactMarkdown
                                                    components={{
                                                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                                        a: ({ children, href }) => (
                                                            <a href={href} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                                                                {children}
                                                            </a>
                                                        ),
                                                        ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                                                        ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                                                        li: ({ children }) => <li className="mb-1">{children}</li>,
                                                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                                        code: ({ children }) => <code className="bg-background/60 px-1 py-0.5 rounded text-xs">{children}</code>,
                                                    }}
                                                >
                                                    {m.content}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            m.content
                                        )}
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-muted rounded-2xl rounded-bl-none px-4 py-3 border border-border">
                                        <Loader2 className="size-4 text-muted-foreground animate-spin" aria-label="Assistant is typing" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="p-4 border-t border-border">
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 bg-background border border-input rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-[3px] focus:ring-ring/50 focus:border-ring transition"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type a message…"
                                    aria-label="Message"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    aria-label="Send message"
                                    className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none p-2.5 rounded-xl transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                >
                                    <Send className="size-4" aria-hidden="true" />
                                </button>
                            </div>
                            <p className="text-center text-[10px] text-muted-foreground mt-2">Powered by Gemini</p>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                type="button"
                whileHover={reduce ? undefined : { scale: 1.05 }}
                whileTap={reduce ? undefined : { scale: 0.95 }}
                onClick={toggleChat}
                aria-label={isOpen ? 'Close chat' : 'Open chat with AI assistant'}
                aria-expanded={isOpen}
                className="group relative flex items-center justify-center size-12 sm:size-14 bg-brand text-brand-foreground rounded-full shadow-[0_16px_48px_-12px_rgba(0,0,0,0.55)] hover:bg-brand-deep transition-colors duration-300 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
                {!reduce && !isOpen && (
                    <span className="absolute inset-0 rounded-full bg-brand opacity-0 group-hover:opacity-40 group-hover:animate-ping" />
                )}
                {isOpen ? <X className="size-6" aria-hidden="true" /> : <MessageCircle className="size-6" aria-hidden="true" />}
            </motion.button>
        </div>
    );
}
