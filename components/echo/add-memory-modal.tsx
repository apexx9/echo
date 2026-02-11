'use client';
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Link, FileText, Plus } from 'lucide-react';

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMemoryAdded: (memory: { type: 'text' | 'url' | 'file'; content: string; title?: string }) => void;
}

export function AddMemoryModal({ isOpen, onClose, onMemoryAdded }: AddMemoryModalProps) {
  console.log('AddMemoryModal render, isOpen:', isOpen);
  const [activeTab, setActiveTab] = React.useState<'text' | 'url' | 'file'>('text');
  const [textContent, setTextContent] = React.useState('');
  const [urlContent, setUrlContent] = React.useState('');
  const [isDragging, setIsDragging] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    let memoryData: { type: 'text' | 'url' | 'file'; content: string; title?: string } | null = null;

    switch (activeTab) {
      case 'text':
        if (textContent.trim()) {
          memoryData = {
            type: 'text',
            content: textContent.trim(),
            title: textContent.split('\n')[0]?.substring(0, 50) + '...' || 'Note'
          };
        }
        break;
      case 'url':
        if (urlContent.trim()) {
          memoryData = {
            type: 'url',
            content: urlContent.trim(),
            title: new URL(urlContent).hostname
          };
        }
        break;
      case 'file':
        // File upload will be handled separately
        break;
    }

    if (memoryData) {
      onMemoryAdded(memoryData);
      handleClose();
    }
  };

  const handleClose = () => {
    setTextContent('');
    setUrlContent('');
    setActiveTab('text');
    onClose();
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const file = files[0];
      const text = await file.text();
      
      const memoryData = {
        type: 'file' as const,
        content: text,
        title: file.name
      };
      
      onMemoryAdded(memoryData);
      handleClose();
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                Add Memory
              </h2>
              <button
                onClick={handleClose}
                className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-zinc-200 dark:border-zinc-800">
              <button
                onClick={() => setActiveTab('text')}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 font-medium transition-colors ${
                  activeTab === 'text'
                    ? 'text-zinc-900 dark:text-zinc-100 border-b-2 border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Paste text</span>
              </button>
              <button
                onClick={() => setActiveTab('url')}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 font-medium transition-colors ${
                  activeTab === 'url'
                    ? 'text-zinc-900 dark:text-zinc-100 border-b-2 border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                <Link className="w-4 h-4" />
                <span>Paste link</span>
              </button>
              <button
                onClick={() => setActiveTab('file')}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 font-medium transition-colors ${
                  activeTab === 'file'
                    ? 'text-zinc-900 dark:text-zinc-100 border-b-2 border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Upload file</span>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === 'text' && (
                <div className="space-y-4">
                  <textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Paste your text here... Notes, ideas, quotes, anything you want to remember."
                    className="w-full h-32 p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-sm"
                  />
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    {textContent.length} characters
                  </div>
                </div>
              )}

              {activeTab === 'url' && (
                <div className="space-y-4">
                  <input
                    type="url"
                    value={urlContent}
                    onChange={(e) => setUrlContent(e.target.value)}
                    placeholder="https://example.com/article"
                    className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-sm"
                  />
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    We'll extract the content from the webpage and save it to your memory.
                  </p>
                </div>
              )}

              {activeTab === 'file' && (
                <div className="space-y-4">
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      isDragging
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-zinc-300 dark:border-zinc-600 hover:border-zinc-400 dark:hover:border-zinc-500'
                    }`}
                  >
                    <Upload className="w-8 h-8 mx-auto mb-3 text-zinc-400 dark:text-zinc-500" />
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                      Drop files here or click to browse
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                      PDF, TXT, MD files supported
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt,.md,.pdf"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {isUploading ? 'Uploading...' : 'Choose files'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 rounded-b-xl">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                We'll organize it for you
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded-lg font-medium transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={
                    (activeTab === 'text' && !textContent.trim()) ||
                    (activeTab === 'url' && !urlContent.trim())
                  }
                  className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add memory</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
