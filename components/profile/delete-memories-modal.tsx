'use client';
import * as React from 'react';
import { motion } from 'framer-motion';
import { X, AlertTriangle, Trash2, Shield, Check, AlertCircle } from 'lucide-react';

interface DeleteMemoriesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function DeleteMemoriesModal({ isOpen, onClose, onSuccess }: DeleteMemoriesModalProps) {
    const [confirmationText, setConfirmationText] = React.useState('');
    const [understandRisks, setUnderstandRisks] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');

    const requiredConfirmation = 'DELETE ALL MEMORIES';
    const canDelete = confirmationText === requiredConfirmation && understandRisks;

    const handleDelete = async () => {
        if (!canDelete) return;

        setIsDeleting(true);
        setError('');
        setSuccess('');

        try {
            // TODO: Implement actual delete API call
            await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate API call
            
            setSuccess('All memories have been permanently deleted.');
            setTimeout(() => {
                onSuccess?.();
                handleClose();
            }, 2000);
        } catch (err) {
            setError('Failed to delete memories. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleClose = () => {
        setConfirmationText('');
        setUnderstandRisks(false);
        setError('');
        setSuccess('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center space-x-3">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Delete All Memories</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Warning */}
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <div className="flex items-start space-x-3">
                            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-red-900 dark:text-red-100 mb-2">
                                    This action cannot be undone
                                </h3>
                                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                                    <li>• All {47} memories will be permanently deleted</li>
                                    <li>• All associated data and metadata will be lost</li>
                                    <li>• This action cannot be reversed</li>
                                    <li>• Your account and settings will remain intact</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* What will be deleted */}
                    <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
                        <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-3">What will be deleted:</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-zinc-600 dark:text-zinc-400">Total Memories</span>
                                <span className="font-medium text-zinc-900 dark:text-zinc-100">47</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-zinc-600 dark:text-zinc-400">Storage Used</span>
                                <span className="font-medium text-zinc-900 dark:text-zinc-100">12.4 MB</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-zinc-600 dark:text-zinc-400">File Attachments</span>
                                <span className="font-medium text-zinc-900 dark:text-zinc-100">3</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-zinc-600 dark:text-zinc-400">Tags & Categories</span>
                                <span className="font-medium text-zinc-900 dark:text-zinc-100">12</span>
                            </div>
                        </div>
                    </div>

                    {/* Confirmation */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            Type <span className="font-mono bg-zinc-100 dark:bg-zinc-700 px-2 py-1 rounded">DELETE ALL MEMORIES</span> to confirm
                        </label>
                        <input
                            type="text"
                            value={confirmationText}
                            onChange={(e) => setConfirmationText(e.target.value)}
                            placeholder="Type confirmation text"
                            className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono"
                        />
                    </div>

                    {/* Risk Acknowledgment */}
                    <div className="flex items-start space-x-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                        <div className="flex-1">
                            <label className="flex items-start space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={understandRisks}
                                    onChange={(e) => setUnderstandRisks(e.target.checked)}
                                    className="w-4 h-4 text-amber-600 border-zinc-300 focus:ring-amber-500 mt-0.5"
                                />
                                <div>
                                    <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                                        I understand the risks
                                    </p>
                                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                                        I acknowledge that this action is permanent and cannot be undone. 
                                        I have backed up any important data I want to keep.
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>

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
                            disabled={isDeleting}
                            className="flex-1 px-4 py-2 text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={!canDelete || isDeleting}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        >
                            {isDeleting ? (
                                <>
                                    <Trash2 className="w-4 h-4 mr-2 animate-pulse" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete All Memories
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
