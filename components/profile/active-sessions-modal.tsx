'use client';
import * as React from 'react';
import { motion } from 'framer-motion';
import { X, Monitor, Smartphone, Globe, AlertTriangle, Trash2, Shield } from 'lucide-react';

interface Session {
    id: string;
    device: string;
    browser: string;
    location: string;
    ipAddress: string;
    lastActive: string;
    isCurrent: boolean;
}

interface ActiveSessionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function ActiveSessionsModal({ isOpen, onClose, onSuccess }: ActiveSessionsModalProps) {
    const [sessions, setSessions] = React.useState<Session[]>([
        {
            id: '1',
            device: 'MacBook Pro',
            browser: 'Chrome 120',
            location: 'San Francisco, CA',
            ipAddress: '192.168.1.1',
            lastActive: '2 minutes ago',
            isCurrent: true,
        },
        {
            id: '2',
            device: 'iPhone 14',
            browser: 'Safari 17',
            location: 'San Francisco, CA',
            ipAddress: '192.168.1.2',
            lastActive: '1 hour ago',
            isCurrent: false,
        },
        {
            id: '3',
            device: 'Windows PC',
            browser: 'Firefox 121',
            location: 'New York, NY',
            ipAddress: '10.0.0.1',
            lastActive: '3 days ago',
            isCurrent: false,
        },
    ]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');

    const getDeviceIcon = (device: string) => {
        if (device.toLowerCase().includes('iphone') || device.toLowerCase().includes('android')) {
            return <Smartphone className="w-4 h-4" />;
        }
        return <Monitor className="w-4 h-4" />;
    };

    const handleRevokeSession = async (sessionId: string) => {
        setIsLoading(true);
        setError('');

        try {
            // TODO: Implement actual session revocation API call
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            
            setSessions(prev => prev.filter(session => session.id !== sessionId));
            setSuccess('Session revoked successfully');
            setTimeout(() => setSuccess(''), 2000);
        } catch (err) {
            setError('Failed to revoke session. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRevokeAllOtherSessions = async () => {
        setIsLoading(true);
        setError('');

        try {
            // TODO: Implement actual revoke all sessions API call
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
            
            setSessions(prev => prev.filter(session => session.isCurrent));
            setSuccess('All other sessions revoked successfully');
            setTimeout(() => {
                onSuccess?.();
                handleClose();
            }, 1500);
        } catch (err) {
            setError('Failed to revoke sessions. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
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
                className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl max-h-[80vh] overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-zinc-400" />
                        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                            Active Sessions
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Info */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-start space-x-3">
                            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                    Session Security
                                </p>
                                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                    These are all the devices currently logged into your account. 
                                    Revoke any sessions you don't recognize.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sessions List */}
                    <div className="space-y-3">
                        {sessions.map((session) => (
                            <div
                                key={session.id}
                                className={`p-4 border rounded-lg ${
                                    session.isCurrent
                                        ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                                        : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700'
                                }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-3 flex-1">
                                        <div className={`p-2 rounded-lg ${
                                            session.isCurrent
                                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                                                : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
                                        }`}>
                                            {getDeviceIcon(session.device)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                                    {session.device}
                                                </p>
                                                {session.isCurrent && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
                                                        Current
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-2">
                                                {session.browser} • {session.location}
                                            </p>
                                            <div className="flex items-center space-x-4 text-xs text-zinc-500 dark:text-zinc-400">
                                                <span>IP: {session.ipAddress}</span>
                                                <span>Last active: {session.lastActive}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {!session.isCurrent && (
                                        <button
                                            onClick={() => handleRevokeSession(session.id)}
                                            disabled={isLoading}
                                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {sessions.length === 0 && (
                            <div className="text-center py-8">
                                <Globe className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                    No active sessions found
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Suspicious Activity Warning */}
                    {sessions.some(s => !s.isCurrent && s.lastActive.includes('days')) && (
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                            <div className="flex items-start space-x-3">
                                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                                        Old Sessions Detected
                                    </p>
                                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                                        Some sessions haven't been active for days. Consider revoking them for better security.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error/Success Messages */}
                    {error && (
                        <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                            <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="flex items-center space-x-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                            <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-sm text-emerald-600 dark:text-emerald-400">{success}</span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="flex space-x-3">
                        <button
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg font-medium transition-colors"
                        >
                            Close
                        </button>
                        {sessions.length > 1 && (
                            <button
                                onClick={handleRevokeAllOtherSessions}
                                disabled={isLoading}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? 'Revoking...' : 'Revoke All Other Sessions'}
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
