'use client';
import { useState, useEffect } from 'react';
import { submitDispute, getStatus } from '../lib/api';
import type { StatusResponse } from '../lib/types';
import ReceiptTimeline from '../components/ReceiptTimeline';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import { validateCID, copyToClipboard } from '../lib/utils';

export default function Page() {
  const [parties, setParties] = useState('Alice Ltd,Bob Pty');
  const [jurisdiction, setJurisdiction] = useState('NSW-AU');
  const [cid, setCid] = useState('');
  const [disputeId, setDisputeId] = useState<string>('');
  const [anchorUri, setAnchorUri] = useState<string>('');
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [error, setError] = useState<string>('');
  const [networkError, setNetworkError] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const partiesList = parties.split(',').map(s => s.trim()).filter(Boolean);
    if (partiesList.length < 2) {
      setError('At least 2 parties required');
      return;
    }
    
    if (!validateCID(cid)) {
      setError('Invalid CID format. Please provide a valid IPFS CID');
      return;
    }
    
    setLoading(true);
    try {
      const enc_meta = { embedding_dim: 768, tenant_id: 't_demo' };
      const res = await submitDispute({
        parties: partiesList,
        jurisdiction,
        cid: cid.trim(),
        enc_meta
      });
      setDisputeId(res.dispute_id);
      setAnchorUri(res.anchor_uri);
      setStatus(null);
      setPolling(true);
    } catch (err: any) {
      setError(err.message || 'Submit failed');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCopyDisputeId = async () => {
    if (await copyToClipboard(disputeId)) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  useEffect(() => {
    if (!disputeId || !polling) return;
    
    const fetchStatus = async () => {
      try {
        const s = await getStatus(disputeId);
        setStatus(s);
        setNetworkError('');
        setRetryCount(0);
        
        if (s.phase === 'COMPLETE' || s.phase === 'ERROR') {
          setPolling(false);
        }
      } catch (err: any) {
        const errorMsg = err.message || 'Failed to fetch status';
        
        if (errorMsg.includes('CORS') || errorMsg.includes('Network')) {
          setNetworkError(`Network error: ${errorMsg}. Retrying...`);
          setRetryCount(prev => prev + 1);
          
          if (retryCount > 5) {
            setPolling(false);
            setNetworkError('Connection lost. Please check if DALRN Gateway is running.');
          }
        } else {
          console.error('Status fetch error:', err);
        }
      }
    };
    
    fetchStatus();
    const iv = setInterval(fetchStatus, 5000);
    return () => clearInterval(iv);
  }, [disputeId, polling, retryCount]);

  return (
    <main>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">UAMP • Submit Dispute</h1>
        <p className="text-sm text-gray-600 mt-1">Submit encrypted dispute documents to DALRN Gateway for resolution</p>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-3 p-4 bg-white rounded-xl shadow">
        <label className="grid gap-1">
          <span className="text-sm font-medium">Parties (comma-separated)</span>
          <input 
            className="border rounded p-2" 
            value={parties} 
            onChange={e => setParties(e.target.value)}
            required
            placeholder="Alice Ltd, Bob Pty"
          />
        </label>
        <label className="grid gap-1">
          <span className="text-sm font-medium">Jurisdiction</span>
          <select 
            className="border rounded p-2" 
            value={jurisdiction} 
            onChange={e => setJurisdiction(e.target.value)}
            required
          >
            <option value="NSW-AU">NSW-AU</option>
            <option value="VIC-AU">VIC-AU</option>
            <option value="QLD-AU">QLD-AU</option>
            <option value="WA-AU">WA-AU</option>
            <option value="SA-AU">SA-AU</option>
            <option value="TAS-AU">TAS-AU</option>
            <option value="ACT-AU">ACT-AU</option>
            <option value="NT-AU">NT-AU</option>
          </select>
        </label>
        <label className="grid gap-1">
          <span className="text-sm font-medium">Evidence CID (IPFS)</span>
          <input 
            className="border rounded p-2 font-mono text-sm" 
            placeholder="bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi" 
            value={cid} 
            onChange={e => setCid(e.target.value)}
            required
          />
        </label>
        <button 
          type="submit"
          disabled={loading || !cid.trim()} 
          className="bg-blue-600 text-white rounded p-2 disabled:opacity-60 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          {loading && <LoadingSpinner size="sm" />}
          <span>{loading ? 'Submitting…' : 'Submit Dispute'}</span>
        </button>
        {error && <ErrorBanner error={error} onDismiss={() => setError('')} />}
      </form>

      {networkError && (
        <div className="mt-4">
          <ErrorBanner 
            error={networkError} 
            type={retryCount > 5 ? 'error' : 'warning'}
            onDismiss={() => setNetworkError('')}
          />
        </div>
      )}

      {disputeId && (
        <section className="mt-8 space-y-4">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold">Dispute Status</h2>
              {!status && polling && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <LoadingSpinner size="sm" />
                  <span>Fetching status...</span>
                </div>
              )}
              {status && (
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                  status.phase === 'COMPLETE' ? 'bg-green-100 text-green-800' :
                  status.phase === 'ERROR' ? 'bg-red-100 text-red-800' :
                  status.phase === 'NEGOTIATING' ? 'bg-yellow-100 text-yellow-800' :
                  status.phase === 'SEARCHING' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {status.phase}
                </span>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Dispute ID:</span>
                <code className="font-mono text-sm bg-gray-50 px-2 py-1 rounded">{disputeId}</code>
                <button
                  onClick={handleCopyDisputeId}
                  className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                >
                  {copySuccess ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              
              {anchorUri && (
                <div className="flex items-start gap-2">
                  <span className="text-sm text-gray-600">Anchor:</span>
                  <a 
                    href={anchorUri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-mono text-sm text-blue-600 hover:underline break-all"
                  >
                    {anchorUri}
                  </a>
                </div>
              )}
              
              {status?.anchor_tx && (
                <div className="text-sm text-gray-600">
                  <span>On-chain: </span>
                  <span className="font-mono">{status.anchor_tx.network}</span>
                  <span className="mx-1">•</span>
                  <span className="font-mono">Block #{status.anchor_tx.block}</span>
                  <span className="mx-1">•</span>
                  <span className="font-mono text-xs">{status.anchor_tx.tx.slice(0, 10)}...</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Processing Timeline</h3>
              {polling && status?.receipts && status.receipts.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Live</span>
                </div>
              )}
            </div>
            {status?.receipts ? (
              <ReceiptTimeline receipts={status.receipts} />
            ) : (
              <div className="py-8 text-center">
                <LoadingSpinner size="lg" />
                <p className="text-sm text-gray-500 mt-3">Waiting for receipts...</p>
              </div>
            )}
          </div>
          
          {status?.eps_budget && (
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="text-lg font-semibold mb-3">Privacy Budget</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tenant:</span>
                  <span className="font-mono">{status.eps_budget.tenant_id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Spent:</span>
                  <span className="font-mono">{status.eps_budget.spent.toFixed(2)} ε</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Budget:</span>
                  <span className="font-mono">{status.eps_budget.budget.toFixed(2)} ε</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${(status.eps_budget.spent / status.eps_budget.budget) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
