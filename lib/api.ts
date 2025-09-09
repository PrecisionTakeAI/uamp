import { SubmitDisputeRequest, SubmitDisputeResponse, StatusResponse } from './types';

function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('DALRN_URL');
    if (stored) return stored;
  }
  return process.env.NEXT_PUBLIC_DALRN_URL || 'http://localhost:8000';
}

export async function submitDispute(payload: SubmitDisputeRequest): Promise<SubmitDisputeResponse> {
  const r = await fetch(`${getBaseUrl()}/submit-dispute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const msg = await r.text();
    throw new Error(`submit-dispute failed: ${r.status} ${msg}`);
  }
  return r.json();
}

export async function getStatus(disputeId: string): Promise<StatusResponse> {
  const r = await fetch(`${getBaseUrl()}/status/${encodeURIComponent(disputeId)}`, { cache: 'no-store' });
  if (!r.ok) {
    const msg = await r.text();
    throw new Error(`status failed: ${r.status} ${msg}`);
  }
  return r.json();
}
