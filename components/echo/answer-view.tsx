'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ExternalLink, FileText, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { AnswerObject, MemoryObject } from '@/lib/types';
import clsx from 'clsx';

// --- Sub-components ---

function ConfidenceIndicator({ score }: { score: number }) {
    let color = 'text-red-500 bg-red-50 dark:bg-red-950/20';
    let label = 'Limited Confidence';
    let Icon = HelpCircle;

    if (score >= 0.8) {
        color = 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20';
        label = 'High Confidence';
        Icon = CheckCircle2;
    } else if (score >= 0.5) {
        color = 'text-amber-500 bg-amber-50 dark:bg-amber-950/20';
        label = 'Moderate Confidence';
        Icon = AlertCircle;
    }

    return (
        <div className={clsx("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", color)}>
            <Icon className="w-3.5 h-3.5" />
            {label}
        </div>
    );
}

function MemoryCard({ memory, relevance }: { memory: any, relevance: number }) {
    const [expanded, setExpanded] = React.useState(false);

    return (
        <motion.div
            layout
            className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-zinc-50 dark:bg-zinc-900/50"
        >
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-1.5 bg-white dark:bg-zinc-800 rounded-md border border-zinc-200 dark:border-zinc-700 text-zinc-500">
                        {memory.source_type === 'web' ? <ExternalLink className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                    </div>
                    <div className="truncate">
                        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                            {memory.source_title || 'Untitled Source'}
                        </div>
                        <div className="text-xs text-zinc-500 flex gap-2">
                            <span>{new Date(memory.consumed_at || memory.created_at || Date.now()).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className={relevance > 0.8 ? "text-emerald-600" : "text-zinc-500"}>
                                {(relevance * 100).toFixed(0)}% relevant
                            </span>
                        </div>
                    </div>
                </div>
                <ChevronDown className={clsx("w-4 h-4 text-zinc-400 transition-transform", expanded && "rotate-180")} />
            </button>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-3 pt-0 text-sm text-zinc-600 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800">
                            <div className="mb-2 italic text-zinc-500">"{memory.snippet}"</div>
                            {/* In real app, fetch full raw content here */}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function EvidenceAccordion({ memories }: { memories: AnswerObject['supporting_memories'] }) {
    const [isOpen, setIsOpen] = React.useState(false);

    if (!memories || memories.length === 0) return null;

    return (
        <div className="mt-8 border-t border-zinc-100 dark:border-zinc-800 pt-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 flex items-center gap-2 mb-4 transition-colors"
            >
                Based on {memories.length} Supporting Memories
                <ChevronDown className={clsx("w-3 h-3 transition-transform", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-3 overflow-hidden"
                    >
                        {memories.map((mem) => (
                            <MemoryCard key={mem.memory_id} memory={mem} relevance={mem.relevance_score} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// --- Main Component ---

export function AnswerView({ answer }: { answer: AnswerObject }) {
    return (
        <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 border border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-zinc-200/50 dark:shadow-black/50">
            <div className="flex items-start justify-between gap-4 mb-6">
                <div className="space-y-1">
                    {/* We could display the original query here if we didn't show it in the input logic */}
                </div>
                <ConfidenceIndicator score={answer.overall_confidence} />
            </div>

            <div className="prose dark:prose-invert prose-zinc max-w-none">
                <p className="text-lg leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">
                    {answer.answer_text}
                </p>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
                {answer.suggested_actions.map((action, i) => (
                    <button
                        key={i}
                        className="px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                    >
                        {action.label}
                    </button>
                ))}
            </div>

            <EvidenceAccordion memories={answer.supporting_memories} />
        </div>
    );
}
