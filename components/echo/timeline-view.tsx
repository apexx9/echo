'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Circle, GitCommit } from 'lucide-react';

interface TimelineItem {
    id: string;
    date: Date;
    title: string;
    type: 'note' | 'web' | 'pdf';
    summary: string;
}

// Mock data for prototype - using fixed dates to prevent hydration errors
const MOCK_TIMELINE: TimelineItem[] = [
    { id: '1', date: new Date('2026-01-15'), title: 'React Server Components', type: 'web', summary: 'Analysis of RSC architecture vs PHP.' },
    { id: '2', date: new Date('2026-01-10'), title: 'System Design Interview', type: 'note', summary: 'Notes on CAP theorem and scaling strategies.' },
    { id: '3', date: new Date('2026-01-05'), title: 'The Pragmatic Programmer', type: 'pdf', summary: 'Key takeaways: tracer bullets and DRY principle.' },
];

export function TimelineView() {
    return (
        <div className="w-full max-w-2xl mx-auto py-12 px-6">
            <div className="flex items-center gap-3 mb-8">
                <GitCommit className="w-5 h-5 text-indigo-500" />
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Memory Timeline</h2>
            </div>

            <div className="relative border-l-2 border-zinc-200 dark:border-zinc-800 ml-2.5 space-y-8 pl-8">
                {MOCK_TIMELINE.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative"
                    >
                        {/* Dot */}
                        <div className="absolute -left-[41px] top-1.5 w-5 h-5 rounded-full bg-zinc-50 dark:bg-zinc-950 border-2 border-indigo-500 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        </div>

                        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:border-indigo-500/30 transition-colors shadow-sm">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.title}</span>
                                <span className="text-xs text-zinc-400">
                                    {item.date.toLocaleDateString('en-US', { 
                                        year: 'numeric', 
                                        month: 'short', 
                                        day: 'numeric' 
                                    })}
                                </span>
                            </div>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                {item.summary}
                            </p>
                            <div className="mt-2 flex gap-2">
                                <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                                    {item.type}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
