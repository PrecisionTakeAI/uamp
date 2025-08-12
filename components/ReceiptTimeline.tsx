'use client';
import { Receipt } from '../lib/types';
import { formatTimestamp } from '../lib/utils';

export default function ReceiptTimeline({ receipts }: { receipts: Receipt[] }) {
  if (!receipts || receipts.length === 0) {
    return <p className="text-sm text-gray-500">No receipts yet. Submit and wait a moment…</p>;
  }
  return (
    <ol className="relative border-s border-gray-200 dark:border-gray-700 ml-2">
      {receipts.map((r) => (
        <li key={r.receipt_id} className="mb-6 ms-4">
          <div className="absolute w-3 h-3 bg-blue-200 rounded-full mt-1.5 -start-1.5 border border-white"></div>
          <time className="mb-1 text-xs font-medium leading-none text-gray-500">{formatTimestamp(r.ts)}</time>
          <h3 className="text-sm font-semibold text-gray-900">{r.step}</h3>
          <p className="text-xs text-gray-500 break-all">inputs_hash: {r.hashes.inputs_hash}</p>
          <p className="text-xs text-gray-500 break-all">outputs_hash: {r.hashes.outputs_hash}</p>
        </li>
      ))}
    </ol>
  );
}
