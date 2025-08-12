'use client';
import { useState, useEffect } from 'react';

interface ConnectionStatusProps {
  url: string;
  onRetry?: () => void;
}

export default function ConnectionStatus({ url, onRetry }: ConnectionStatusProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`${url}/health`, {
        signal: controller.signal,
        mode: 'cors'
      }).catch(() => null);
      
      clearTimeout(timeoutId);
      setIsConnected(response?.ok || false);
    } catch {
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, [url]);

  if (isChecking && isConnected === null) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
        <span>Checking DALRN Gateway...</span>
      </div>
    );
  }

  if (isConnected === false) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm text-red-600">
          <div className="w-2 h-2 bg-red-500 rounded-full" />
          <span>Disconnected</span>
        </div>
        {onRetry && (
          <button
            onClick={() => {
              checkConnection();
              onRetry();
            }}
            className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-green-600">
      <div className="w-2 h-2 bg-green-500 rounded-full" />
      <span>Connected to DALRN</span>
    </div>
  );
}