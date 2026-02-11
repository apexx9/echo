'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
import { queryBrain } from '@/app/actions/echo-actions';
import { AnswerObject } from '@/lib/types';

interface AskInputProps {
    onAnswerReceived: (answer: AnswerObject) => void;
}

export function AskInput({ onAnswerReceived }: AskInputProps) {
    const [query, setQuery] = React.useState('');
    const [isThinking, setIsThinking] = React.useState(false);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!query.trim() || isThinking) return;

        setIsThinking(true);
        try {
            const answer = await queryBrain(query);
            onAnswerReceived(answer);
            setQuery(''); // Clear input on success? Or keep it? Spec says "input shifts up", maybe keep context. 
            // Actually spec says "Input shifts up". For this prototype, let's clear it or keep it as title.
            // Let's keep it simple for now: clear and show answer.
        } catch (error) {
            console.error("Failed to query brain:", error);
        } finally {
            setIsThinking(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto relative z-10">
            <motion.div
                layout
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }} // Antigravity ease
                className="relative group"
            >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />

                <form onSubmit={handleSubmit} className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-black/50 overflow-hidden border border-zinc-200 dark:border-zinc-800 transition-colors">
                    <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask your past self anything..."
                        className="w-full bg-transparent border-0 px-6 py-5 text-lg placeholder:text-zinc-400 focus:ring-0 resize-none min-h-[80px] outline-none text-zinc-800 dark:text-zinc-100 font-medium"
                        rows={1}
                        disabled={isThinking}
                    />

                    <div className="flex justify-between items-center px-4 pb-3">
                        <div className="flex gap-2">
                            {/* Future: Add Filters/Context buttons here */}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={!query.trim() || isThinking}
                            type="submit"
                            className="p-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isThinking ? (
                                <Sparkles className="w-5 h-5 animate-pulse" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </motion.button>
                    </div>
                </form>

                <AnimatePresence>
                    {isThinking && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute -bottom-10 left-0 right-0 text-center"
                        >
                            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 flex items-center justify-center gap-2">
                                <Sparkles className="w-4 h-4 text-purple-500" />
                                Connecting meaningful dots...
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
