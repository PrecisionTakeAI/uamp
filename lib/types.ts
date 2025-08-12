export type SubmitDisputeRequest = {
  parties: string[];
  jurisdiction: string;
  cid: string;
  enc_meta: Record<string, unknown>;
};

export type SubmitDisputeResponse = {
  dispute_id: string;
  anchor_uri: string;
};

export type Receipt = {
  receipt_id: string;
  step: string;
  hashes: { inputs_hash: string; outputs_hash: string };
  ts: string;
};

export type StatusResponse = {
  dispute_id: string;
  phase: 'SEARCHING'|'NEGOTIATING'|'COMPLETE'|'ERROR'|'INTAKE';
  receipts: Receipt[];
  anchor_tx?: { network: string; tx: string; block: number };
  eps_budget?: { tenant_id: string; spent: number; budget: number };
};
