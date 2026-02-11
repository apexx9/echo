'use client';
import * as React from 'react';
import { motion } from 'framer-motion';
import { X, Shield, ShieldCheck, Smartphone, Mail, Check, AlertCircle, Copy } from 'lucide-react';

interface TwoFactorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function TwoFactorModal({ isOpen, onClose, onSuccess }: TwoFactorModalProps) {
    const [isEnabled, setIsEnabled] = React.useState(false);
    const [method, setMethod] = React.useState<'authenticator' | 'email'>('authenticator');
    const [step, setStep] = React.useState<'setup' | 'verify'>('setup');
    const [verificationCode, setVerificationCode] = React.useState('');
    const [backupCodes, setBackupCodes] = React.useState<string[]>([]);
    const [showBackupCodes, setShowBackupCodes] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');

    // Mock backup codes
    const generateBackupCodes = () => {
        const codes = [];
        for (let i = 0; i < 10; i++) {
            codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
        }
        return codes;
    };

    const handleSetup = async () => {
        setIsLoading(true);
        setError('');

        try {
            // TODO: Implement actual 2FA setup API call
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
            
            if (method === 'authenticator') {
                setStep('verify');
                setSuccess('Authenticator app setup initiated. Please scan the QR code and enter the verification code.');
            } else {
                setStep('verify');
                setSuccess('Verification code sent to your email. Please enter the code below.');
            }
        } catch (err) {
            setError('Failed to setup two-factor authentication. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async () => {
        setIsLoading(true);
        setError('');

        try {
            // TODO: Implement actual verification API call
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
            
            setIsEnabled(true);
            setBackupCodes(generateBackupCodes());
            setSuccess('Two-factor authentication enabled successfully!');
            
            setTimeout(() => {
                onSuccess?.();
                handleClose();
            }, 2000);
        } catch (err) {
            setError('Invalid verification code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDisable = async () => {
        setIsLoading(true);
        setError('');

        try {
            // TODO: Implement actual disable API call
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
            
            setIsEnabled(false);
            setBackupCodes([]);
            setStep('setup');
            setSuccess('Two-factor authentication disabled.');
            
            setTimeout(() => {
                onSuccess?.();
                handleClose();
            }, 1500);
        } catch (err) {
            setError('Failed to disable two-factor authentication. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const copyBackupCodes = () => {
        navigator.clipboard.writeText(backupCodes.join('\n'));
        setSuccess('Backup codes copied to clipboard!');
        setTimeout(() => setSuccess(''), 2000);
    };

    const handleClose = () => {
        setVerificationCode('');
        setError('');
        setSuccess('');
        setShowBackupCodes(false);
        if (!isEnabled) {
            setStep('setup');
        }
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
                        {isEnabled ? (
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        ) : (
                            <Shield className="w-5 h-5 text-zinc-400" />
                        )}
                        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                            Two-Factor Authentication
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Status */}
                    <div className={`p-4 rounded-lg border ${
                        isEnabled 
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' 
                            : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700'
                    }`}>
                        <div className="flex items-center space-x-3">
                            {isEnabled ? (
                                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                                <Shield className="w-5 h-5 text-zinc-400" />
                            )}
                            <div>
                                <p className={`font-medium ${
                                    isEnabled 
                                        ? 'text-emerald-900 dark:text-emerald-100' 
                                        : 'text-zinc-900 dark:text-zinc-100'
                                }`}>
                                    {isEnabled ? '2FA is Enabled' : '2FA is Disabled'}
                                </p>
                                <p className={`text-sm ${
                                    isEnabled 
                                        ? 'text-emerald-700 dark:text-emerald-300' 
                                        : 'text-zinc-600 dark:text-zinc-400'
                                }`}>
                                    {isEnabled 
                                        ? 'Your account has an extra layer of security' 
                                        : 'Add an extra layer of security to your account'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Setup Step */}
                    {step === 'setup' && !isEnabled && (
                        <>
                            {/* Method Selection */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                                    Choose verification method
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-center p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                                        <input
                                            type="radio"
                                            name="method"
                                            value="authenticator"
                                            checked={method === 'authenticator'}
                                            onChange={(e) => setMethod(e.target.value as 'authenticator')}
                                            className="w-4 h-4 text-indigo-600 border-zinc-300 focus:ring-indigo-500"
                                        />
                                        <div className="ml-3 flex items-center space-x-2">
                                            <Smartphone className="w-4 h-4 text-zinc-400" />
                                            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                                Authenticator App
                                            </span>
                                        </div>
                                    </label>
                                    <label className="flex items-center p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                                        <input
                                            type="radio"
                                            name="method"
                                            value="email"
                                            checked={method === 'email'}
                                            onChange={(e) => setMethod(e.target.value as 'email')}
                                            className="w-4 h-4 text-indigo-600 border-zinc-300 focus:ring-indigo-500"
                                        />
                                        <div className="ml-3 flex items-center space-x-2">
                                            <Mail className="w-4 h-4 text-zinc-400" />
                                            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                                Email
                                            </span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* QR Code (Mock) */}
                            {method === 'authenticator' && (
                                <div className="text-center">
                                    <div className="w-48 h-48 mx-auto bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-600">
                                        <div className="text-center">
                                            <Smartphone className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400">QR Code</p>
                                        </div>
                                    </div>
                                    <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                                        Scan this QR code with your authenticator app
                                    </p>
                                </div>
                            )}
                        </>
                    )}

                    {/* Verification Step */}
                    {step === 'verify' && (
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                {method === 'authenticator' ? 'Enter 6-digit code' : 'Enter verification code'}
                            </label>
                            <input
                                type="text"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center text-lg font-mono"
                                placeholder="000000"
                                maxLength={6}
                            />
                            {method === 'email' && (
                                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                                    Check your email for the verification code
                                </p>
                            )}
                        </div>
                    )}

                    {/* Backup Codes */}
                    {isEnabled && backupCodes.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    Backup Codes
                                </label>
                                <button
                                    onClick={() => setShowBackupCodes(!showBackupCodes)}
                                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                                >
                                    {showBackupCodes ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            {showBackupCodes && (
                                <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
                                    <div className="grid grid-cols-2 gap-2 mb-3">
                                        {backupCodes.map((code, index) => (
                                            <div key={index} className="font-mono text-sm text-zinc-600 dark:text-zinc-400">
                                                {code}
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={copyBackupCodes}
                                        className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded-lg transition-colors"
                                    >
                                        <Copy className="w-3 h-3" />
                                        <span>Copy All Codes</span>
                                    </button>
                                </div>
                            )}
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
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        
                        {step === 'setup' && !isEnabled && (
                            <button
                                onClick={handleSetup}
                                disabled={isLoading}
                                className="flex-1 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? 'Setting up...' : 'Enable 2FA'}
                            </button>
                        )}
                        
                        {step === 'verify' && (
                            <button
                                onClick={handleVerify}
                                disabled={isLoading || verificationCode.length !== 6}
                                className="flex-1 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? 'Verifying...' : 'Verify'}
                            </button>
                        )}
                        
                        {isEnabled && (
                            <button
                                onClick={handleDisable}
                                disabled={isLoading}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? 'Disabling...' : 'Disable 2FA'}
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
