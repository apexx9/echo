'use client';
import * as React from 'react';
import { AskInput } from '@/components/echo/ask-input';
import { AnswerView } from '@/components/echo/answer-view';
import { AddMemoryModal } from '@/components/echo/add-memory-modal';
import { AnswerObject } from '@/lib/types';
import { motion } from 'framer-motion';
import { Plus, Clock, User, Home as HomeIcon } from 'lucide-react';

export default function Home() {
    const [answer, setAnswer] = React.useState<AnswerObject | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
    
    console.log('Home page render, isAddModalOpen:', isAddModalOpen);

    const handleMemoryAdded = (memory: { type: 'text' | 'url' | 'file'; content: string; title?: string }) => {
        console.log('Memory added:', memory);
        // Here you would typically send this to your backend
        // For now, just log it and close the modal
    };

    return (
        <>
            <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 transition-colors duration-500">

                {/* Top Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-0 left-0 right-0 z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800"
                >
                    <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center space-x-8">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => window.location.href = '/landing'}
                                className="flex items-center space-x-2 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                            >
                                <HomeIcon className="w-4 h-4" />
                                <span className="font-semibold">Echo</span>
                            </motion.button>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    console.log('Add Memory button clicked');
                                    setIsAddModalOpen(true);
                                }}
                                className="flex items-center space-x-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Memory</span>
                            </motion.button>
                            
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => window.location.href = '/timeline'}
                                className="flex items-center space-x-2 px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg font-medium transition-colors"
                            >
                                <Clock className="w-4 h-4" />
                                <span>Timeline</span>
                            </motion.button>
                            
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => window.location.href = '/profile'}
                                className="p-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                            >
                                <User className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                <div className="w-full max-w-4xl flex flex-col items-center gap-12">

                    {/* Hero Text - Fades out when answer present */}
                    {!answer && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-center space-y-4"
                        >
                            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
                                Ask anything you've ever learned.
                            </h2>
                            <p className="text-lg text-zinc-500 max-w-lg mx-auto">
                                Your personal memory, grounded in your real past.
                            </p>
                        </motion.div>
                    )}

                    {/* Input Area */}
                    <motion.div layout className="w-full">
                        <AskInput
                            onAnswerReceived={(newAnswer) => setAnswer(newAnswer)}
                        />
                    </motion.div>

                    {/* Answer Area */}
                    {answer && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full flex justify-center pb-20"
                        >
                            <AnswerView answer={answer} />
                        </motion.div>
                    )}

                </div>
            </main>

            {/* Add Memory Modal */}
            <AddMemoryModal
                isOpen={isAddModalOpen}
                onClose={() => {
                    console.log('Modal close called');
                    setIsAddModalOpen(false);
                }}
                onMemoryAdded={handleMemoryAdded}
            />
        </>
    );
}
