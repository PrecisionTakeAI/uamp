'use client';
import { useState, useEffect } from 'react';
import ConnectionStatus from './ConnectionStatus';

interface DevSettingsProps {
  onUrlChange: (url: string) => void;
}

export default function DevSettings({ onUrlChange }: DevSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    const storedUrl = localStorage.getItem('DALRN_URL');
    const defaultUrl = process.env.NEXT_PUBLIC_DALRN_URL || 'http://localhost:8000';
    const url = storedUrl || defaultUrl;
    setCurrentUrl(url);
    setCustomUrl(url);
  }, []);

  const handleSave = () => {
    if (customUrl) {
      localStorage.setItem('DALRN_URL', customUrl);
      setCurrentUrl(customUrl);
      onUrlChange(customUrl);
      window.location.reload();
    }
  };

  const handleReset = () => {
    const defaultUrl = process.env.NEXT_PUBLIC_DALRN_URL || 'http://localhost:8000';
    localStorage.removeItem('DALRN_URL');
    setCustomUrl(defaultUrl);
    setCurrentUrl(defaultUrl);
    onUrlChange(defaultUrl);
    window.location.reload();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
        title="Dev Settings"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-96 z-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Developer Settings</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            DALRN Gateway URL
          </label>
          <input
            type="url"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="http://localhost:8000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Current: <code className="font-mono bg-gray-100 px-1 rounded">{currentUrl}</code>
          </p>
        </div>

        <div className="border-t pt-3">
          <ConnectionStatus url={currentUrl} />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Save & Reload
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Changes require page reload</p>
          <p>• Settings persist in localStorage</p>
          <p>• CORS must be enabled on Gateway</p>
        </div>
      </div>
    </div>
  );
}