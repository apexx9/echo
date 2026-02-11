'use client';
import * as React from 'react';
import { motion } from 'framer-motion';
import { X, Download, FileText, Calendar, Check, AlertCircle, Loader2 } from 'lucide-react';

interface ExportMemoriesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function ExportMemoriesModal({ isOpen, onClose, onSuccess }: ExportMemoriesModalProps) {
    const [exportFormat, setExportFormat] = React.useState<'json' | 'csv' | 'pdf'>('json');
    const [dateRange, setDateRange] = React.useState<'all' | 'last30' | 'last90' | 'custom'>('all');
    const [startDate, setStartDate] = React.useState('');
    const [endDate, setEndDate] = React.useState('');
    const [includeMetadata, setIncludeMetadata] = React.useState(true);
    const [isExporting, setIsExporting] = React.useState(false);
    const [exportProgress, setExportProgress] = React.useState(0);
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');

    const handleExport = async () => {
        setIsExporting(true);
        setError('');
        setSuccess('');
        setExportProgress(0);

        try {
            // Simulate export progress
            for (let i = 0; i <= 100; i += 10) {
                setExportProgress(i);
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            // TODO: Implement actual export API call
            const mockData = {
                exportDate: new Date().toISOString(),
                format: exportFormat,
                dateRange: dateRange,
                totalMemories: 47,
                memories: [] // Would contain actual memory data
            };

            // Create and download file
            const blob = new Blob([JSON.stringify(mockData, null, 2)], { 
                type: exportFormat === 'json' ? 'application/json' : 'text/plain' 
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `echo-memories-${new Date().toISOString().split('T')[0]}.${exportFormat}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setSuccess('Export completed successfully!');
            setTimeout(() => {
                onSuccess?.();
                handleClose();
            }, 1500);
        } catch (err) {
            setError('Failed to export memories. Please try again.');
        } finally {
            setIsExporting(false);
            setExportProgress(0);
        }
    };

    const handleClose = () => {
        setExportProgress(0);
        setError('');
        setSuccess('');
        setStartDate('');
        setEndDate('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center space-x-3">
                        <Download className="w-5 h-5 text-zinc-400" />
                        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Export Memories</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-6">
                    {/* Export Format */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                            Export Format
                        </label>
                        <div className="space-y-2">
                            {[
                                { value: 'json', label: 'JSON', desc: 'Machine-readable format' },
                                { value: 'csv', label: 'CSV', desc: 'Spreadsheet compatible' },
                                { value: 'pdf', desc: 'Human-readable report', label: 'PDF' }
                            ].map((format) => (
                                <label key={format.value} className="flex items-center p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                                    <input
                                        type="radio"
                                        name="format"
                                        value={format.value}
                                        checked={exportFormat === format.value}
                                        onChange={(e) => setExportFormat(e.target.value as any)}
                                        className="w-4 h-4 text-indigo-600 border-zinc-300 focus:ring-indigo-500"
                                    />
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{format.label}</p>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{format.desc}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Date Range */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                            Date Range
                        </label>
                        <div className="space-y-2">
                            {[
                                { value: 'all', label: 'All memories' },
                                { value: 'last30', label: 'Last 30 days' },
                                { value: 'last90', label: 'Last 90 days' },
                                { value: 'custom', label: 'Custom range' }
                            ].map((range) => (
                                <label key={range.value} className="flex items-center p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                                    <input
                                        type="radio"
                                        name="dateRange"
                                        value={range.value}
                                        checked={dateRange === range.value}
                                        onChange={(e) => setDateRange(e.target.value as any)}
                                        className="w-4 h-4 text-indigo-600 border-zinc-300 focus:ring-indigo-500"
                                    />
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{range.label}</p>
                                    </div>
                                </label>
                            ))}
                        </div>

                        {/* Custom Date Range */}
                        {dateRange === 'custom' && (
                            <div className="mt-4 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                                    Select Date Range
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                                            Start Date
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className="w-full px-3 py-2 pl-10 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm appearance-none cursor-pointer"
                                                max={new Date().toISOString().split('T')[0]}
                                            />
                                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                                            End Date
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                className="w-full px-3 py-2 pl-10 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm appearance-none cursor-pointer"
                                                max={new Date().toISOString().split('T')[0]}
                                            />
                                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                                {startDate && endDate && (
                                    <div className="mt-3 p-3 bg-zinc-100 dark:bg-zinc-700 rounded-lg border border-zinc-200 dark:border-zinc-600">
                                        <div className="flex items-center space-x-2 text-xs text-zinc-600 dark:text-zinc-400">
                                            <Calendar className="w-3 h-3" />
                                            <span>Exporting memories from {new Date(startDate).toLocaleDateString('en-US', { 
                                                month: 'short', 
                                                day: 'numeric', 
                                                year: 'numeric' 
                                            })} to {new Date(endDate).toLocaleDateString('en-US', { 
                                                month: 'short', 
                                                day: 'numeric', 
                                                year: 'numeric' 
                                            })}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Include Metadata */}
                    <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
                        <div>
                            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Include Metadata</label>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Export confidence scores, timestamps, and sources</p>
                        </div>
                        <button
                            onClick={() => setIncludeMetadata(!includeMetadata)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                includeMetadata ? 'bg-indigo-600' : 'bg-zinc-200 dark:bg-zinc-700'
                            }`}
                        >
                            <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                                includeMetadata ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                        </button>
                    </div>

                    {/* Progress */}
                    {isExporting && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-zinc-600 dark:text-zinc-400">Exporting...</span>
                                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{exportProgress}%</span>
                            </div>
                            <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                                <div 
                                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                                    style={{ width: `${exportProgress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Error/Success Messages */}
                    {error && (
                        <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                            <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="flex items-center space-x-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-sm text-emerald-600 dark:text-emerald-400">{success}</span>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-3">
                        <button
                            onClick={handleClose}
                            disabled={isExporting}
                            className="flex-1 px-4 py-2 text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="flex-1 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 transition-colors flex items-center justify-center"
                        >
                            {isExporting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Exporting...
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4 mr-2" />
                                    Export
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
