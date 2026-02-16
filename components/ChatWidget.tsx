'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState('');
    const [isEnabled, setIsEnabled] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

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

    // Auto-scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!isEnabled) return null;

    const toggleChat = () => setIsOpen(!isOpen);

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
                content: 'Sorry, I encountered an error. Please try again.'
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
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="mb-4 w-[90vw] sm:w-[400px] h-[500px] bg-gray-900 border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="bg-white/20 p-1.5 rounded-lg">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">Chester's AI Assistant</h3>
                                    <p className="text-blue-100 text-xs flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                        Online
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={toggleChat}
                                className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-600">
                            {messages.length === 0 && (
                                <div className="text-center text-gray-400 mt-8 space-y-2">
                                    <p className="text-sm">👋 Hi there! I'm Chester's virtual assistant.</p>
                                    <p className="text-xs">Ask me anything about his projects, skills, or experience!</p>
                                    <div className="flex flex-wrap gap-2 justify-center mt-4">
                                        {['What are his skills?', 'Show me his projects', 'Contact info?'].map(q => (
                                            <button
                                                key={q}
                                                onClick={() => sendMessage(q)}
                                                className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-3 py-1 transition-colors"
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
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : 'bg-white/10 text-gray-100 border border-white/10 rounded-bl-none'
                                            }`}
                                    >
                                        {m.role === 'assistant' ? (
                                            <div className="prose prose-invert prose-sm max-w-none">
                                                <ReactMarkdown
                                                    components={{
                                                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                                        a: ({ children, href }) => (
                                                            <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                                                {children}
                                                            </a>
                                                        ),
                                                        ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                                                        ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                                                        li: ({ children }) => <li className="mb-1">{children}</li>,
                                                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                                        code: ({ children }) => <code className="bg-white/10 px-1 py-0.5 rounded text-xs">{children}</code>,
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
                                    <div className="bg-white/10 rounded-2xl rounded-bl-none px-4 py-3 border border-white/10">
                                        <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (!input.trim()) return;
                                sendMessage(input);
                                setInput('');
                            }}
                            className="p-4 border-t border-white/10 bg-gray-900/50 backdrop-blur-sm"
                        >
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 placeholder-gray-500 transition-all"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type a message..."
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !(input || '').trim()}
                                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white p-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/20"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="text-center mt-2">
                                <p className="text-[10px] text-gray-600">Powered by Gemini AI</p>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleChat}
                className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full shadow-2xl shadow-blue-900/30 hover:shadow-blue-600/40 transition-all duration-300 z-50"
            >
                <span className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-0 group-hover:opacity-100 duration-1000"></span>
                {isOpen ? (
                    <X className="w-6 h-6 text-white" />
                ) : (
                    <MessageCircle className="w-6 h-6 text-white" />
                )}
            </motion.button>
        </div >
    );
}
