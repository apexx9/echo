'use client';
import * as React from 'react';
import { TimelineView } from '@/components/echo/timeline-view';
import { AddMemoryModal } from '@/components/echo/add-memory-modal';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Clock, User, Home as HomeIcon } from 'lucide-react';

export default function TimelinePage() {
    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
    
    console.log('Timeline page render, isAddModalOpen:', isAddModalOpen);

    const handleMemoryAdded = (memory: { type: 'text' | 'url' | 'file'; content: string; title?: string }) => {
        console.log('Memory added:', memory);
    };

    return (
        <>
            <main className="min-h-screen flex flex-col bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 transition-colors duration-500">

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
                                    console.log('Timeline Add Memory button clicked');
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
                                onClick={() => window.location.href = '/landing'}
                                className="flex items-center space-x-2 px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg font-medium transition-colors"
                            >
                                <HomeIcon className="w-4 h-4" />
                                <span>Home</span>
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

                {/* Page Header */}
                <div className="pt-24 pb-12 px-6">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.4, 0.0, 0.2, 1] }}
                            className="text-center space-y-4"
                        >
                            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">
                                Your Memory Timeline
                            </h1>
                            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                                Track how your understanding evolves. Watch your knowledge build on itself over time.
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Timeline Content */}
                <div className="flex-1 px-6 pb-12">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                        >
                            <TimelineView />
                        </motion.div>
                    </div>
                </div>
            </main>

            {/* Add Memory Modal */}
            <AddMemoryModal
                isOpen={isAddModalOpen}
                onClose={() => {
                    console.log('Timeline modal close called');
                    setIsAddModalOpen(false);
                }}
                onMemoryAdded={handleMemoryAdded}
            />
        </>
    );
}
