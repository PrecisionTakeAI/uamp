# UAMP - Unified Arbitration Management Platform

A minimal Next.js UI for submitting disputes to the DALRN Gateway with privacy-preserving properties.

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

## Configuration

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_DALRN_URL=http://localhost:8000
```

### Runtime Configuration

The app includes a Developer Settings panel (gear icon in bottom-right) where you can:
- Configure the DALRN Gateway URL dynamically
- Check connection status
- Override environment settings without restart

Settings are persisted in localStorage for development convenience.

## Features

- **Dispute Submission**: Submit encrypted evidence via CID with party/jurisdiction metadata
- **Status Polling**: Real-time updates every 5 seconds with automatic stop on completion
- **Receipt Timeline**: Visual PoDP receipt chain with phase-specific icons
- **Privacy First**: No PII logging, CID-only communication
- **Error Handling**: Network failure recovery with retry logic
- **Epsilon Budget**: Privacy budget tracking widget (when exposed by Gateway)
- **Connection Status**: Live connection indicator with health checks

## API Integration

The UI integrates with DALRN Gateway endpoints:

### POST /submit-dispute
```json
{
  "parties": ["Alice Ltd", "Bob Pty"],
  "jurisdiction": "NSW-AU",
  "cid": "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
  "enc_meta": { "embedding_dim": 768, "tenant_id": "t_demo" }
}
```

### GET /status/{dispute_id}
Returns phase, receipts chain, anchor transaction, and epsilon budget.

## Development in Codespaces

When running in GitHub Codespaces:

1. Forward port 8000 for DALRN Gateway
2. Forward port 3000 for the UI
3. Update the Gateway URL in Dev Settings if needed
4. Ensure CORS is enabled on Gateway for cross-origin requests

## Project Structure

```
├── app/                # Next.js app router
│   ├── page.tsx       # Main dispute form
│   └── layout.tsx     # Root layout
├── components/        # React components
│   ├── ReceiptTimeline.tsx
│   ├── ErrorBanner.tsx
│   ├── LoadingSpinner.tsx
│   ├── ConnectionStatus.tsx
│   └── DevSettings.tsx
├── lib/               # Utilities and API
│   ├── api.ts         # DALRN Gateway client
│   ├── types.ts       # TypeScript types
│   └── utils.ts       # Helper functions
└── docs/
    └── NOTES.md       # Requirements summary
```

## Security Notes

- No plaintext evidence is handled by the UI
- No dispute data stored in localStorage (only settings)
- Only hashes and CIDs are displayed
- All evidence must be pre-encrypted before CID generation
- CORS must be enabled on Gateway for development

## Types

All TypeScript types are in `lib/types.ts` with strict typing throughout.