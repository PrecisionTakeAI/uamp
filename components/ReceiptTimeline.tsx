'use client';
import { Receipt } from '../lib/types';
import { formatTimestamp } from '../lib/utils';

const stepConfig: Record<string, { color: string; icon: string; label: string }> = {
  INTAKE_V1: { color: 'bg-blue-500', icon: '📥', label: 'Intake' },
  SEARCH_INIT: { color: 'bg-indigo-500', icon: '🔍', label: 'Search Initialized' },
  SEARCH_COMPLETE: { color: 'bg-purple-500', icon: '✓', label: 'Search Complete' },
  NEGOTIATION_START: { color: 'bg-yellow-500', icon: '🤝', label: 'Negotiation Started' },
  NASH_COMPUTED: { color: 'bg-orange-500', icon: '⚖️', label: 'Nash Equilibrium' },
  SETTLEMENT_REACHED: { color: 'bg-green-500', icon: '✅', label: 'Settlement' },
  ANCHOR_PENDING: { color: 'bg-gray-500', icon: '⏳', label: 'Anchoring' },
  ANCHOR_COMPLETE: { color: 'bg-green-600', icon: '🔗', label: 'Anchored' },
  ERROR: { color: 'bg-red-500', icon: '❌', label: 'Error' }
};

export default function ReceiptTimeline({ receipts }: { receipts: Receipt[] }) {
  if (!receipts || receipts.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-3">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm text-gray-500">No receipts yet</p>
        <p className="text-xs text-gray-400 mt-1">Receipts will appear here as your dispute is processed</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {receipts.map((receipt, index) => {
        const config = stepConfig[receipt.step] || {
          color: 'bg-gray-400',
          icon: '•',
          label: receipt.step
        };
        const isLast = index === receipts.length - 1;

        return (
          <div key={receipt.receipt_id} className="flex gap-4 pb-6">
            <div className="flex flex-col items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${config.color} text-white font-bold shadow-lg`}>
                <span className="text-lg">{config.icon}</span>
              </div>
              {!isLast && (
                <div className="w-0.5 h-full bg-gray-300 mt-2" />
              )}
            </div>

            <div className="flex-1 pb-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{config.label}</h3>
                    <time className="text-xs text-gray-500">{formatTimestamp(receipt.ts)}</time>
                  </div>
                  <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                    {receipt.receipt_id}
                  </span>
                </div>

                <div className="mt-3 space-y-1">
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-gray-500 font-medium min-w-[70px]">Inputs:</span>
                    <code className="text-xs font-mono text-gray-700 break-all bg-gray-50 px-2 py-1 rounded flex-1">
                      {receipt.hashes.inputs_hash}
                    </code>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-gray-500 font-medium min-w-[70px]">Outputs:</span>
                    <code className="text-xs font-mono text-gray-700 break-all bg-gray-50 px-2 py-1 rounded flex-1">
                      {receipt.hashes.outputs_hash}
                    </code>
                  </div>
                </div>

                {receipt.step === 'ANCHOR_COMPLETE' && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-green-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Verified on-chain</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {receipts.length > 0 && receipts[receipts.length - 1].step === 'SETTLEMENT_REACHED' && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium text-green-800">Dispute Resolution Complete</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            All parties have reached a settlement through the Nash equilibrium negotiation process.
          </p>
        </div>
      )}
    </div>
  );
}