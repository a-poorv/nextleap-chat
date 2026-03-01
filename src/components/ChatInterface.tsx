'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Sparkles, Sidebar as SidebarIcon, Plus, ExternalLink, ThumbsUp, ThumbsDown, Trash2, MessageSquare } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
    timestamp: Date;
}

export default function ChatInterface() {
    const initialMessage: Message = {
        id: '1',
        role: 'assistant',
        content: "Hello! I'm your NextLeap Assistant. I can help you with questions about our Product Management, UX Design, Data Analytics, Business Analytics, and GenAI cohorts. What would you like to know today?",
        timestamp: new Date(),
    };

    const [messages, setMessages] = useState<Message[]>([initialMessage]);
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState(Date.now().toString());
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<Record<string, 'like' | 'dislike'>>({});
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    // 1. Load history from localStorage on startup
    useEffect(() => {
        const savedSessions = localStorage.getItem('nextleap_chats');
        if (savedSessions) {
            try {
                const parsed = JSON.parse(savedSessions);
                // Convert string dates back to Date objects
                const formatted = parsed.map((s: any) => ({
                    ...s,
                    timestamp: new Date(s.timestamp),
                    messages: s.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }))
                }));
                setSessions(formatted);
            } catch (e) {
                console.error("Failed to parse saved chats", e);
            }
        }
    }, []);

    // 2. Save history to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('nextleap_chats', JSON.stringify(sessions));
    }, [sessions]);

    const placeholders = [
        "Ask about Product Management...",
        "Who is teaching the UX course?",
        "What is the salary hike after Data Analytics?",
        "Tell me about the PM mentors from Meta...",
        "Are there any EMI options available?",
        "Can I join with 2 years of sales experience?",
        "What tools are taught in GenAI bootcamp?"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: newMessages.map(m => ({ role: m.role, content: m.content }))
                }),
            });

            const data = await response.json();

            if (data.error) throw new Error(data.error);

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.content,
                timestamp: new Date(),
            };
            const finalMessages = [...newMessages, botMessage];
            setMessages(finalMessages);

            // Auto-save/update session in history immediately
            upsertSession(currentSessionId, finalMessages);
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I'm having trouble connecting to my brain right now. Please make sure the API key is configured!",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFeedback = (id: string, type: 'like' | 'dislike') => {
        setFeedback(prev => ({ ...prev, [id]: type }));
        // Internally, this is where you'd call an API like /api/feedback
        console.log(`Feedback received for ${id}: ${type}`);
    };

    const upsertSession = (id: string, msgs: Message[]) => {
        if (msgs.length <= 1) return; // Don't save empty/initial greetings

        const firstUserMessage = msgs.find(m => m.role === 'user');
        const sessionTitle = firstUserMessage ?
            (firstUserMessage.content.length > 25 ? firstUserMessage.content.substring(0, 25) + '...' : firstUserMessage.content)
            : 'New Chat';

        const sessionData: ChatSession = {
            id,
            title: sessionTitle,
            messages: [...msgs],
            timestamp: new Date(),
        };

        setSessions(prev => {
            const exists = prev.find(s => s.id === id);
            if (exists) {
                // Update existing: Replace it and move to top
                const others = prev.filter(s => s.id !== id);
                return [sessionData, ...others];
            }
            // Add new to top
            return [sessionData, ...prev];
        });
    };

    const handleNewChat = () => {
        upsertSession(currentSessionId, messages);
        setMessages([initialMessage]);
        setFeedback({});
        setInput('');
        setCurrentSessionId(Date.now().toString());
    };

    const loadSession = (session: ChatSession) => {
        // Save current session progress before switching
        upsertSession(currentSessionId, messages);

        // Load the target session
        setMessages(session.messages);
        setCurrentSessionId(session.id);
        setFeedback({});
    };

    const deleteSession = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setSessions(prev => {
            const updated = prev.filter(s => s.id !== id);
            localStorage.setItem('nextleap_chats', JSON.stringify(updated));
            return updated;
        });
        if (currentSessionId === id) {
            handleNewChat();
        }
    };

    return (
        <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-64 glass-dark border-r border-border p-4 gap-4">
                <div className="flex items-center gap-2 px-2 py-4">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <Sparkles className="text-white w-5 h-5" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-primary">NextLeap</span>
                </div>

                <button
                    onClick={handleNewChat}
                    className="flex items-center gap-2 w-full p-3 rounded-xl border border-border hover:bg-secondary/30 transition-all text-sm font-medium"
                >
                    <Plus size={18} />
                    New Inquiry
                </button>

                <div className="flex flex-col gap-1 mt-4 flex-1 overflow-y-auto custom-scrollbar">
                    <p className="text-xs font-semibold text-emerald-500/60 uppercase px-2 mb-2">Recent Chats</p>
                    {sessions.length === 0 ? (
                        <p className="text-[10px] text-foreground/30 px-3 italic">No past inquiries yet</p>
                    ) : (
                        sessions.map((session) => (
                            <div key={session.id} className="group relative">
                                <button
                                    onClick={() => loadSession(session)}
                                    className={cn(
                                        "flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-all text-left",
                                        currentSessionId === session.id ? "bg-emerald-500/10 text-emerald-400" : "hover:bg-secondary/20 text-foreground/60 hover:text-foreground"
                                    )}
                                >
                                    <MessageSquare size={14} className="shrink-0 opacity-50 group-hover:opacity-100" />
                                    <span className="truncate pr-6">{session.title}</span>
                                </button>
                                <button
                                    onClick={(e) => deleteSession(e, session.id)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-foreground/30 hover:text-red-400 transition-all"
                                    title="Delete Chat"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        ))
                    )}

                    <p className="text-xs font-semibold text-emerald-500/60 uppercase px-2 mt-6 mb-2">Cohorts</p>
                    {['Product Management', 'UX Design', 'Data Analytics', 'GenAI Bootcamp'].map((cohort) => (
                        <button key={cohort} className="text-left px-3 py-2 rounded-lg text-sm hover:bg-secondary/20 transition-colors text-foreground/70 hover:text-foreground">
                            {cohort}
                        </button>
                    ))}
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col relative h-screen">
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-6 border-b border-border/50 glass z-10">
                    <div className="flex items-center gap-3">
                        <div className="md:hidden">
                            <SidebarIcon className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="font-semibold text-lg flex items-center gap-2">
                            Fellowship Advisor
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleNewChat}
                            className="p-2 rounded-lg hover:bg-secondary/40 text-foreground/40 hover:text-red-400 transition-colors"
                            title="Clear Chat"
                        >
                            <Trash2 size={18} />
                        </button>
                        <button className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                            Live Support
                        </button>
                    </div>
                </header>

                {/* Messages */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth"
                    style={{ paddingBottom: '120px' }}
                >
                    {messages.map((msg) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={msg.id}
                            className={cn(
                                "flex w-full gap-4 max-w-4xl mx-auto",
                                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                            )}
                        >
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                                msg.role === 'user' ? "bg-emerald-600" : "bg-secondary glass"
                            )}>
                                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} className="text-primary" />}
                            </div>

                            <div className={cn(
                                "flex flex-col gap-2 max-w-[80%]",
                                msg.role === 'user' ? "items-end" : "items-start"
                            )}>
                                <div className={cn(
                                    "p-4 rounded-2xl text-sm leading-relaxed",
                                    msg.role === 'user'
                                        ? "bg-emerald-700/30 border border-emerald-500/20 text-emerald-50"
                                        : "glass text-foreground/90 shadow-xl"
                                )}>
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            h1: ({ node, ...props }) => <h1 className="text-lg font-bold my-2 text-primary" {...props} />,
                                            h2: ({ node, ...props }) => <h2 className="text-md font-bold my-2 text-primary" {...props} />,
                                            h3: ({ node, ...props }) => <h3 className="text-sm font-bold my-1 text-primary" {...props} />,
                                            ul: ({ node, ...props }) => <ul className="list-disc pl-4 space-y-1 mb-2" {...props} />,
                                            ol: ({ node, ...props }) => <ol className="list-decimal pl-4 space-y-1 mb-2" {...props} />,
                                            p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                            strong: ({ node, ...props }) => <strong className="text-primary font-bold" {...props} />,
                                            table: ({ node, ...props }) => (
                                                <div className="overflow-x-auto my-4 rounded-lg border border-emerald-500/20">
                                                    <table className="min-w-full divide-y divide-emerald-500/20" {...props} />
                                                </div>
                                            ),
                                            thead: ({ node, ...props }) => <thead className="bg-emerald-500/10" {...props} />,
                                            th: ({ node, ...props }) => <th className="px-4 py-2 text-left text-xs font-semibold text-primary uppercase tracking-wider" {...props} />,
                                            td: ({ node, ...props }) => <td className="px-4 py-2 text-sm text-foreground/80 border-t border-emerald-500/10" {...props} />,
                                            tr: ({ node, ...props }) => <tr className="hover:bg-emerald-500/5 transition-colors" {...props} />,
                                        }}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                                {msg.role === 'assistant' && (
                                    <div className="flex items-center gap-3 mt-2 px-1">
                                        <button
                                            onClick={() => handleFeedback(msg.id, 'like')}
                                            className={cn(
                                                "p-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-[10px]",
                                                feedback[msg.id] === 'like' ? "bg-emerald-500/20 text-emerald-400" : "hover:bg-secondary/50 text-foreground/40 hover:text-emerald-400"
                                            )}
                                        >
                                            <ThumbsUp size={12} className={feedback[msg.id] === 'like' ? "fill-emerald-400" : ""} />
                                            Helpful
                                        </button>
                                        <button
                                            onClick={() => handleFeedback(msg.id, 'dislike')}
                                            className={cn(
                                                "p-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-[10px]",
                                                feedback[msg.id] === 'dislike' ? "bg-red-500/20 text-red-400" : "hover:bg-secondary/50 text-foreground/40 hover:text-red-400"
                                            )}
                                        >
                                            <ThumbsDown size={12} className={feedback[msg.id] === 'dislike' ? "fill-red-400" : ""} />
                                            Not Helpful
                                        </button>
                                    </div>
                                )}
                                <span className="text-[10px] text-foreground/30 px-1">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-4 max-w-4xl mx-auto">
                            <div className="w-10 h-10 rounded-xl bg-secondary glass flex items-center justify-center">
                                <Bot size={20} className="text-primary animate-pulse" />
                            </div>
                            <div className="flex items-center gap-1 px-4 py-2 rounded-full glass">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-6 glass-dark border-t border-border/50">
                    <div className="max-w-4xl mx-auto relative">
                        <div className="relative w-full">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                className="w-full bg-secondary/50 border border-border rounded-2xl py-4 pl-6 pr-16 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground"
                                placeholder=""
                            />
                            <AnimatePresence mode="wait">
                                {!input && (
                                    <motion.span
                                        key={placeholderIndex}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/30 pointer-events-none text-sm whitespace-nowrap overflow-hidden"
                                    >
                                        {placeholders[placeholderIndex]}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-primary text-white hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                    <p className="text-[10px] text-center mt-3 text-foreground/20">
                        Powered by NextLeap AI • Trained on Fellowship Data 2026
                    </p>
                </div>
            </main>
        </div>
    );
}
