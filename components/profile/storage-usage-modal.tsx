'use client';
import * as React from 'react';
import { motion } from 'framer-motion';
import { X, HardDrive, FileText, Database, TrendingUp, Calendar, BarChart3, PieChart } from 'lucide-react';

interface StorageUsageModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function StorageUsageModal({ isOpen, onClose }: StorageUsageModalProps) {
    const [activeTab, setActiveTab] = React.useState<'overview' | 'breakdown' | 'trends'>('overview');

    // Mock data for storage usage
    const storageData = {
        totalMemories: 47,
        storageUsed: 12.4,
        storageLimit: 25.0, // MB based on Student Pro plan
        averageConfidence: 87,
        memoriesByType: [
            { type: 'Notes', count: 28, size: 6.2, color: 'bg-blue-500' },
            { type: 'Web', count: 12, size: 3.8, color: 'bg-green-500' },
            { type: 'PDF', count: 7, size: 2.4, color: 'bg-purple-500' },
        ],
        monthlyGrowth: [
            { month: 'Jan', memories: 12, size: 3.2 },
            { month: 'Feb', memories: 18, size: 4.8 },
            { month: 'Mar', memories: 25, size: 6.1 },
            { month: 'Apr', memories: 35, size: 8.9 },
            { month: 'May', memories: 47, size: 12.4 },
        ],
        confidenceDistribution: [
            { range: '90-100%', count: 15, color: 'bg-emerald-500' },
            { range: '80-89%', count: 20, color: 'bg-blue-500' },
            { range: '70-79%', count: 8, color: 'bg-amber-500' },
            { range: '60-69%', count: 4, color: 'bg-orange-500' },
        ]
    };

    const storagePercentage = (storageData.storageUsed / storageData.storageLimit) * 100;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl max-h-[80vh] overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center space-x-3">
                        <HardDrive className="w-5 h-5 text-zinc-400" />
                        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Storage Usage</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="px-6 pt-4 border-b border-zinc-200 dark:border-zinc-800">
                    <nav className="flex space-x-6">
                        {['overview', 'breakdown', 'trends'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${
                                    activeTab === tab
                                        ? 'text-zinc-900 dark:text-zinc-100 border-zinc-900 dark:border-zinc-100'
                                        : 'text-zinc-500 dark:text-zinc-400 border-transparent hover:text-zinc-700 dark:hover:text-zinc-300'
                                }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'overview' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Storage Overview */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
                                    <div className="flex items-center justify-between mb-2">
                                        <FileText className="w-5 h-5 text-zinc-400" />
                                        <span className="text-xs text-zinc-500 dark:text-zinc-400">Total</span>
                                    </div>
                                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                        {storageData.totalMemories}
                                    </p>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Memories</p>
                                </div>

                                <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
                                    <div className="flex items-center justify-between mb-2">
                                        <Database className="w-5 h-5 text-zinc-400" />
                                        <span className="text-xs text-zinc-500 dark:text-zinc-400">Used</span>
                                    </div>
                                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                        {storageData.storageUsed}
                                    </p>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400">MB of {storageData.storageLimit} MB</p>
                                </div>

                                <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
                                    <div className="flex items-center justify-between mb-2">
                                        <TrendingUp className="w-5 h-5 text-zinc-400" />
                                        <span className="text-xs text-zinc-500 dark:text-zinc-400">Average</span>
                                    </div>
                                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                        {storageData.averageConfidence}%
                                    </p>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Confidence</p>
                                </div>
                            </div>

                            {/* Storage Progress */}
                            <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Storage Usage</h3>
                                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                        {storagePercentage.toFixed(1)}% used
                                    </span>
                                </div>
                                <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-3 mb-2">
                                    <div 
                                        className={`h-3 rounded-full transition-all duration-500 ${
                                            storagePercentage > 80 ? 'bg-red-500' : 
                                            storagePercentage > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                                        }`}
                                        style={{ width: `${storagePercentage}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                                    <span>{storageData.storageUsed} MB used</span>
                                    <span>{(storageData.storageLimit - storageData.storageUsed).toFixed(1)} MB available</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'breakdown' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Memory Types */}
                            <div>
                                <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-4 flex items-center">
                                    <PieChart className="w-4 h-4 mr-2" />
                                    Memories by Type
                                </h3>
                                <div className="space-y-3">
                                    {storageData.memoriesByType.map((type) => (
                                        <div key={type.type} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-3 h-3 rounded-full ${type.color}`} />
                                                <span className="font-medium text-zinc-900 dark:text-zinc-100">{type.type}</span>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-zinc-900 dark:text-zinc-100">{type.count}</p>
                                                <p className="text-sm text-zinc-500 dark:text-zinc-400">{type.size} MB</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Confidence Distribution */}
                            <div>
                                <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-4 flex items-center">
                                    <BarChart3 className="w-4 h-4 mr-2" />
                                    Confidence Distribution
                                </h3>
                                <div className="space-y-2">
                                    {storageData.confidenceDistribution.map((range) => (
                                        <div key={range.range} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-3 h-3 rounded-full ${range.color}`} />
                                                <span className="text-sm text-zinc-600 dark:text-zinc-400">{range.range}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{range.count}</span>
                                                <div className="w-20 bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                                                    <div 
                                                        className={`h-2 rounded-full ${range.color}`}
                                                        style={{ width: `${(range.count / storageData.totalMemories) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'trends' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div>
                                <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-4 flex items-center">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Monthly Growth
                                </h3>
                                <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
                                    <div className="space-y-3">
                                        {storageData.monthlyGrowth.map((month) => (
                                            <div key={month.month} className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 w-12">
                                                    {month.month}
                                                </span>
                                                <div className="flex items-center space-x-4 flex-1">
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                                                            <span>{month.memories} memories</span>
                                                            <span>{month.size} MB</span>
                                                        </div>
                                                        <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                                                            <div 
                                                                className="bg-indigo-500 h-2 rounded-full"
                                                                style={{ width: `${(month.size / storageData.storageUsed) * 100}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Growth Summary */}
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
                                <h4 className="font-medium text-emerald-900 dark:text-emerald-100 mb-2">Growth Summary</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-emerald-700 dark:text-emerald-300">Monthly Average:</span>
                                        <span className="font-medium text-emerald-900 dark:text-emerald-100 ml-2">
                                            +{(storageData.totalMemories / 5).toFixed(1)} memories
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-emerald-700 dark:text-emerald-300">Total Growth:</span>
                                        <span className="font-medium text-emerald-900 dark:text-emerald-100 ml-2">
                                            +{storageData.totalMemories} memories
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg font-medium transition-colors"
                        >
                            Close
                        </button>
                        <button
                            onClick={() => window.location.href = '/profile?tab=plan'}
                            className="flex-1 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                        >
                            Upgrade Storage
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
