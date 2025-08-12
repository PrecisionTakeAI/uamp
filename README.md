# UAMP (on DALRN) — Minimal UI

A tiny Next.js app that calls the DALRN Gateway to submit a dispute and view PoDP receipts.

## Quickstart

1) Copy `.env.example` to `.env.local` and set:
```
NEXT_PUBLIC_DALRN_URL=http://localhost:8000
```

2) Install deps and run:
```
npm install
npm run dev
```

3) Open http://localhost:3000 — paste an IPFS CID and click **Submit Dispute**.

The app will display the returned `dispute_id`, `anchor_uri`, and poll `/status/{id}` every 5 seconds to render the receipt timeline.

## Notes
- No plaintext evidence is handled by this UI; only a CID string is sent to DALRN.
- Styling: Tailwind CSS.
- Types live in `lib/types.ts`. API calls in `lib/api.ts`.
