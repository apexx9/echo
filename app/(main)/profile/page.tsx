'use client';
import * as React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Shield, CreditCard, LogOut, Settings, ChevronRight } from 'lucide-react';
import { ChangePasswordModal } from '@/components/profile/change-password-modal';
import { TwoFactorModal } from '@/components/profile/two-factor-modal';
import { ActiveSessionsModal } from '@/components/profile/active-sessions-modal';
import { ExportMemoriesModal } from '@/components/profile/export-memories-modal';
import { DeleteMemoriesModal } from '@/components/profile/delete-memories-modal';
import { StorageUsageModal } from '@/components/profile/storage-usage-modal';

export default function ProfilePage() {
    const [activeTab, setActiveTab] = React.useState('account');
    const [showPasswordModal, setShowPasswordModal] = React.useState(false);
    const [showTwoFactorModal, setShowTwoFactorModal] = React.useState(false);
    const [showSessionsModal, setShowSessionsModal] = React.useState(false);
    const [showExportModal, setShowExportModal] = React.useState(false);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const [showStorageModal, setShowStorageModal] = React.useState(false);

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
                                onClick={() => window.location.href = '/app'}
                                className="flex items-center space-x-2 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="font-semibold">Echo</span>
                            </motion.button>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => window.location.href = '/timeline'}
                                className="flex items-center space-x-2 px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg font-medium transition-colors"
                            >
                                <Settings className="w-4 h-4" />
                                <span>Settings</span>
                            </motion.button>
                            
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                            >
                                <User className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Page Header */}
                <div className="pt-24 pb-12 px-6">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.4, 0.0, 0.2, 1] }}
                            className="text-center space-y-4"
                        >
                            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">
                                Your Account
                            </h1>
                            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                                Manage your settings, view your plan, and control your data.
                            </p>
                        </motion.div>

                        {/* Tab Navigation */}
                        <div className="mt-12 border-b border-zinc-200 dark:border-zinc-800">
                            <nav className="flex space-x-8">
                                {['account', 'plan', 'data', 'security'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-4 px-1 text-sm font-medium transition-colors border-b-2 ${
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

                        {/* Tab Content */}
                        <div className="mt-8">
                            {activeTab === 'account' && <AccountTab />}
                            {activeTab === 'plan' && <PlanTab />}
                            {activeTab === 'data' && <DataTab 
                                onExport={() => setShowExportModal(true)}
                                onDelete={() => setShowDeleteModal(true)}
                                onStorage={() => setShowStorageModal(true)}
                            />}
                            {activeTab === 'security' && <SecurityTab 
                                onPasswordChange={() => setShowPasswordModal(true)}
                                onTwoFactor={() => setShowTwoFactorModal(true)}
                                onSessions={() => setShowSessionsModal(true)}
                            />}
                        </div>
                    </div>
                </div>
            </main>

            {/* Modals */}
            <ChangePasswordModal
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
                onSuccess={() => console.log('Password changed')}
            />
            <TwoFactorModal
                isOpen={showTwoFactorModal}
                onClose={() => setShowTwoFactorModal(false)}
                onSuccess={() => console.log('2FA updated')}
            />
            <ActiveSessionsModal
                isOpen={showSessionsModal}
                onClose={() => setShowSessionsModal(false)}
                onSuccess={() => console.log('Sessions updated')}
            />
            <ExportMemoriesModal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                onSuccess={() => console.log('Export completed')}
            />
            <DeleteMemoriesModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onSuccess={() => console.log('Delete completed')}
            />
            <StorageUsageModal
                isOpen={showStorageModal}
                onClose={() => setShowStorageModal(false)}
            />
        </>
    );
}

// Tab Components
function AccountTab() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="space-y-8"
        >
            <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4">Profile Information</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Email</label>
                        <div className="flex items-center space-x-3">
                            <Mail className="w-4 h-4 text-zinc-400" />
                            <span className="text-zinc-900 dark:text-zinc-100">user@example.com</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Member Since</label>
                        <span className="text-zinc-900 dark:text-zinc-100">January 15, 2026</span>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Account Type</label>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
                            Student Pro
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4">Preferences</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Email Notifications</label>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Receive weekly insights and updates</p>
                        </div>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-zinc-200 dark:bg-zinc-700 transition-colors">
                            <span className="inline-block h-4 w-4 rounded-full bg-zinc-900 dark:bg-zinc-100 transition-transform translate-x-6"></span>
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Dark Mode</label>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Use system preference</p>
                        </div>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-zinc-200 dark:bg-zinc-700 transition-colors">
                            <span className="inline-block h-4 w-4 rounded-full bg-zinc-900 dark:bg-zinc-100 transition-transform translate-x-6"></span>
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function PlanTab() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="space-y-8"
        >
            {/* Current Plan */}
            <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Current Plan</h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage your subscription</p>
                    </div>
                    <div className="text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
                            Student Pro
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b border-zinc-200 dark:border-zinc-800">
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">Memory Limit</span>
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">2,000 memories</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-zinc-200 dark:border-zinc-800">
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">Monthly Ingestions</span>
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">1,500 / month</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-zinc-200 dark:border-zinc-800">
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">Max File Size</span>
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">25 MB</span>
                    </div>
                    <div className="flex justify-between py-3">
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">Search Depth</span>
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">40 results</span>
                    </div>
                </div>
            </div>

            {/* Usage Stats */}
            <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4">Usage This Month</h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm text-zinc-600 dark:text-zinc-400">Memories Created</span>
                            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">47</span>
                        </div>
                        <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '2.35%' }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                            <span>47 of 1,500 used</span>
                            <span>1,453 remaining</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upgrade Options */}
            <div className="bg-linear-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800 p-6">
                <div className="text-center">
                    <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">Ready for more?</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">Upgrade to Pro for unlimited memories and priority features</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                    >
                        Upgrade to Pro
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}

function DataTab({ onExport, onDelete, onStorage }: {
    onExport: () => void;
    onDelete: () => void;
    onStorage: () => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="space-y-8"
        >
            <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4">Data Management</h3>
                <div className="space-y-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onExport}
                        className="w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                    >
                        <div className="text-left">
                            <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Export All Memories</h4>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Download your data as JSON</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-zinc-400" />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onDelete}
                        className="w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                    >
                        <div className="text-left">
                            <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Delete All Memories</h4>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Permanently remove all data</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-red-400" />
                    </motion.button>
                </div>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Storage Usage</h3>
                    <button
                        onClick={onStorage}
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                    >
                        View Details
                    </button>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">Total Memories</span>
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">47</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">Storage Used</span>
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">12.4 MB</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">Average Confidence</span>
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">87%</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function SecurityTab({ onPasswordChange, onTwoFactor, onSessions }: {
    onPasswordChange: () => void;
    onTwoFactor: () => void;
    onSessions: () => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="space-y-8"
        >
            <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4">Security Settings</h3>
                <div className="space-y-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onPasswordChange}
                        className="w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                    >
                        <div className="text-left">
                            <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Change Password</h4>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Update your account password</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-zinc-400" />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onTwoFactor}
                        className="w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                    >
                        <div className="text-left">
                            <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Two-Factor Authentication</h4>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Add an extra layer of security</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-zinc-400" />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onSessions}
                        className="w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                    >
                        <div className="text-left">
                            <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Active Sessions</h4>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage your logged-in devices</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-zinc-400" />
                    </motion.button>
                </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 p-6">
                <h3 className="text-lg font-medium text-red-900 dark:text-red-100 mb-4">Danger Zone</h3>
                <div className="space-y-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-lg border border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 transition-colors"
                    >
                        <div className="text-left">
                            <h4 className="font-medium text-red-900 dark:text-red-100">Delete Account</h4>
                            <p className="text-sm text-red-600 dark:text-red-400">Permanently delete your account and all data</p>
                        </div>
                        <LogOut className="w-5 h-5 text-red-400" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
