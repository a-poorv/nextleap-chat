'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    Cpu,
    Database,
    Zap,
    Users,
    ShieldCheck,
    ArrowRight,
    Code2,
    LineChart,
    Workflow,
    Target,
    Terminal,
    Globe,
    Sparkles,
    Trash2,
    MessageSquare,
    CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
};

const PhaseCard = ({ number, title, subtitle, children }: { number: string, title: string, subtitle: string, children: React.ReactNode }) => (
    <motion.div {...fadeInUp} className="relative pl-12 pb-20 last:pb-0 border-l border-primary/20 ml-4 md:ml-0">
        <div className="absolute left-[-17px] top-0 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center font-bold text-primary z-10 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            {number}
        </div>
        <div className="mb-2">
            <h3 className="text-2xl font-black text-white italic tracking-tight">{title}</h3>
            <p className="text-primary/70 font-medium text-sm">{subtitle}</p>
        </div>
        <div className="mt-6 glass p-6 rounded-2xl border border-primary/10 hover:border-primary/30 transition-all">
            {children}
        </div>
    </motion.div>
);

export default function LinkedInShowcase() {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 pb-32">
            {/* Header */}
            <nav className="fixed top-0 w-full z-50 glass-dark border-b border-border py-4 px-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                        <Terminal className="text-white w-5 h-5" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white uppercase italic">The AI Agent <span className="text-primary">Journal</span></span>
                </div>
                <Link href="https://nextleap-chat.vercel.app" target="_blank" className="bg-primary text-white py-2 px-5 rounded-xl hover:bg-accent transition-all text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center gap-2">
                    Live Chatbot <ArrowRight size={14} />
                </Link>
            </nav>

            {/* Hero Section */}
            <section className="pt-40 pb-24 px-6 max-w-5xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-primary mb-4 block">System Design & Product Story</span>
                    <h1 className="text-5xl md:text-7xl font-black mb-8 bg-gradient-to-br from-white via-white to-primary/50 bg-clip-text text-transparent italic leading-[1.1] tracking-tighter">
                        How We Built a Contextual <br />Career Advisor for NextLeap
                    </h1>
                    <p className="text-lg md:text-xl text-foreground/50 max-w-3xl mx-auto leading-relaxed font-medium">
                        From raw web scraping to a persistent RAG-powered agent. A journey of technical trade-offs, system architecture, and product intuition.
                    </p>
                </motion.div>
            </section>

            {/* The Story / Phases */}
            <section className="px-6 max-w-4xl mx-auto mb-32">
                <div className="space-y-4">

                    <PhaseCard
                        number="1"
                        title="The Data Hunt: Web Scraping"
                        subtitle="Phase 1: Ingestion & Knowledge Extraction"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-foreground/70 leading-relaxed mb-4">
                                    We didn't just use static summaries. We custom-crawled NextLeap's course pages to extract high-signal data points that usually hide in the FAQ sections.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {["Python Scraper", "Semantic Tagging", "Knowledge Merging"].map(t => (
                                        <span key={t} className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-md font-bold uppercase">{t}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-secondary/40 p-4 rounded-xl border border-border flex items-center justify-center">
                                <Search size={40} className="text-primary opacity-50" />
                                <div className="ml-4">
                                    <div className="text-xs font-bold text-white uppercase">Data Extracted</div>
                                    <div className="text-lg font-black text-primary italic">25+ Mentors, 40+ Tools, 15+ Success Stories</div>
                                </div>
                            </div>
                        </div>
                    </PhaseCard>

                    <PhaseCard
                        number="2"
                        title="The Memory: Vector Indexing"
                        subtitle="Phase 2: Building the Retrieval Engine"
                    >
                        <p className="text-sm text-foreground/70 leading-relaxed mb-6">
                            To ensure the bot "understands" concepts instead of just matching words, we implemented a custom <strong>Cosine-Similarity Vector Engine</strong>.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-background/60 rounded-xl border border-border">
                                <LineChart className="text-primary mb-2" size={18} />
                                <h5 className="font-bold text-xs mb-1">Concept Matching</h5>
                                <p className="text-[10px] text-foreground/50 italic">Maps "Cost" to "Pricing" coordinates.</p>
                            </div>
                            <div className="p-4 bg-background/60 rounded-xl border border-border">
                                <Database className="text-emerald-400 mb-2" size={18} />
                                <h5 className="font-bold text-xs mb-1">Zero-Latency DB</h5>
                                <p className="text-[10px] text-foreground/50 italic">Local VDB for sub-millisecond lookups.</p>
                            </div>
                            <div className="p-4 bg-background/60 rounded-xl border border-border">
                                <Cpu className="text-purple-400 mb-2" size={18} />
                                <h5 className="font-bold text-xs mb-1">RAG Pipeline</h5>
                                <p className="text-[10px] text-foreground/50 italic">Only feeds relevant context to the AI.</p>
                            </div>
                        </div>
                    </PhaseCard>

                    <PhaseCard
                        number="3"
                        title="The Intelligence: Groq & Llama 3"
                        subtitle="Phase 3: High-Performance Inference"
                    >
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="flex-1">
                                <p className="text-sm text-foreground/70 leading-relaxed mb-4">
                                    <strong>The Trade-off:</strong> We chose Groq Llama 3 over GPT-4.
                                </p>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2 text-xs text-foreground/60">
                                        <CheckCircle2 size={12} className="text-primary" /> Why? Sub-second response time.
                                    </li>
                                    <li className="flex items-center gap-2 text-xs text-foreground/60">
                                        <CheckCircle2 size={12} className="text-primary" /> Result: Conversations feel human and instant.
                                    </li>
                                </ul>
                            </div>
                            <div className="p-6 bg-primary/5 border-2 border-primary/20 rounded-2xl text-center">
                                <div className="text-4xl font-black text-primary italic">&lt; 0.8s</div>
                                <div className="text-[10px] uppercase font-bold tracking-widest text-foreground/40 mt-1">Latency Achieved</div>
                            </div>
                        </div>
                    </PhaseCard>

                    <PhaseCard
                        number="4"
                        title="The User Flow: UX & Persistence"
                        subtitle="Phase 4: Product Mindset & Onboarding"
                    >
                        <div className="space-y-4">
                            <p className="text-sm text-foreground/70 leading-relaxed">
                                Great AI needs great UX. We implemented features that prioritize user retention and ease of use.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3 p-4 bg-background/40 rounded-xl border border-border">
                                    <MessageSquare size={16} className="text-primary mt-1" />
                                    <div>
                                        <h6 className="font-bold text-xs text-white">Chat History</h6>
                                        <p className="text-[10px] text-foreground/50">Restoration via LocalStorage (No Login Friction).</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-4 bg-background/40 rounded-xl border border-border">
                                    <Zap size={16} className="text-primary mt-1" />
                                    <div>
                                        <h6 className="font-bold text-xs text-white">Dynamic Transitions</h6>
                                        <p className="text-[10px] text-foreground/50">Input placeholders that guide the user journey.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-4 bg-background/40 rounded-xl border border-border">
                                    <ShieldCheck size={16} className="text-primary mt-1" />
                                    <div>
                                        <h6 className="font-bold text-xs text-white">Feedback Loop</h6>
                                        <p className="text-[10px] text-foreground/50">Like/Dislike system to collect internal datasets.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-4 bg-background/40 rounded-xl border border-border">
                                    <Globe size={16} className="text-primary mt-1" />
                                    <div>
                                        <h6 className="font-bold text-xs text-white">Vercel Edge Ready</h6>
                                        <p className="text-[10px] text-foreground/50">Read-only server optimization for cloud scaling.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </PhaseCard>
                </div>
            </section>

            {/* System Design Highlights */}
            <section className="px-6 max-w-6xl mx-auto mb-32 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="glass p-10 rounded-3xl border border-primary/20 relative overflow-hidden">
                    <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
                    <Target className="text-primary mb-6" size={32} />
                    <h2 className="text-3xl font-black mb-6 italic italic tracking-tighter">Product Trade-offs</h2>
                    <ul className="space-y-6">
                        <li>
                            <h4 className="font-bold text-white text-lg">Speed &gt; Reasoning Depth</h4>
                            <p className="text-sm text-foreground/50 leading-relaxed">For a career inquiry, "thinking time" is a drop-off point. We sacrificed complex gpt-4 chain-of-thought for the instant feedback cycle of Llama 3.</p>
                        </li>
                        <li>
                            <h4 className="font-bold text-white text-lg">Privacy &gt; User Data</h4>
                            <p className="text-sm text-foreground/50 leading-relaxed">By using LocalStorage for history instead of a server-side DB, we removed the "Login" barrier, increasing trust and initial conversion.</p>
                        </li>
                    </ul>
                </div>

                <div className="glass p-10 rounded-3xl border border-secondary/20 bg-secondary/10">
                    <ShieldCheck className="text-emerald-400 mb-6" size={32} />
                    <h2 className="text-3xl font-black mb-6 italic tracking-tighter">Out of Scope <span className="text-xs font-normal opacity-40 uppercase">(Roadmap)</span></h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-sm text-foreground/60 border-b border-white/5 pb-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary ring-4 ring-primary/10"></span>
                            Multi-modal Support (Voice-to-Voice)
                        </div>
                        <div className="flex items-center gap-3 text-sm text-foreground/60 border-b border-white/5 pb-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary ring-4 ring-primary/10"></span>
                            Direct Interview Slot Booking via Calendly API
                        </div>
                        <div className="flex items-center gap-3 text-sm text-foreground/60 border-b border-white/5 pb-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary ring-4 ring-primary/10"></span>
                            Sentiment Analysis Analytics Dashboard for Admins
                        </div>
                        <div className="flex items-center gap-3 text-sm text-foreground/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary ring-4 ring-primary/10"></span>
                            Real-time Salary Benchmark Integration
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="text-center px-6">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto py-20 border-t border-primary/20"
                >
                    <h2 className="text-4xl font-black mb-6 italic tracking-tight">The Future of <span className="text-primary">Learning</span> is Contextual</h2>
                    <p className="text-foreground/50 mb-10 font-medium">Experience the system we just described.</p>
                    <Link href="https://nextleap-chat.vercel.app" target="_blank" className="inline-flex items-center gap-4 bg-primary text-white py-4 px-10 rounded-2xl hover:bg-accent transition-all font-black uppercase text-sm tracking-widest shadow-2xl shadow-primary/30 active:scale-95 group">
                        Enter Chatbot <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </section>
        </div>
    );
}
