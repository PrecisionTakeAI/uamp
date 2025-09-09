# UAMP on DALRN - Requirements Summary

## Overview
UAMP (Unified Arbitration Management Platform) UI built on DALRN Gateway for dispute resolution with privacy-preserving properties.

## Core Requirements

### API Endpoints
1. **POST /submit-dispute**
   - Submit new dispute with encrypted evidence CID
   - Returns dispute_id and anchor_uri
   
2. **GET /status/{dispute_id}**
   - Poll dispute status and retrieve receipts
   - Returns phase, receipts chain, anchor transaction, epsilon budget

### Data Flow
- **Input**: Party names, jurisdiction, IPFS CID (encrypted bundle)
- **Processing**: DALRN handles FHE similarity search, Nash equilibrium negotiation
- **Output**: PoDP receipts, phase transitions, on-chain anchoring

### Compliance & Security
- **No PII on-chain**: Only hashes and CIDs
- **PoDP Receipts**: Proof of Distributed Processing for all steps
- **ε-ledger**: Privacy budget tracking (differential privacy)
- **Encrypted Evidence**: All documents pre-encrypted before CID generation
- **Ephemeral State**: No localStorage of dispute data

## Technical Stack
- Next.js 14 with App Router
- TypeScript (strict mode)
- Tailwind CSS
- Environment: NEXT_PUBLIC_DALRN_URL

## UI Components

### 1. Dispute Submission Form
- Party names input (validated)
- Jurisdiction selector
- CID input (required, validated format)
- Tenant ID configuration

### 2. Status Polling
- Auto-refresh every 5 seconds
- Display current phase
- Show receipt timeline

### 3. Receipt Timeline
- Visual representation of processing steps
- Hash display (inputs/outputs)
- Timestamp formatting
- Anchor transaction links

### 4. Epsilon Budget Widget
- Tenant budget remaining
- Spent epsilon visualization
- Warning thresholds

## Phases
- `INTAKE`: Initial submission
- `SEARCHING`: FHE similarity search
- `NEGOTIATING`: Nash equilibrium computation
- `COMPLETE`: Settlement reached
- `ERROR`: Processing failure

## Development Workflow

### Branch Strategy
1. `feat/ui/TKT-U1-submit-and-status` - Core form and polling
2. `feat/ui/TKT-U2-receipt-timeline` - Timeline visualization
3. `feat/ui/TKT-U3-errors-and-loading` - UX improvements
4. `feat/ui/TKT-U4-env-and-config` - Environment setup
5. `feat/ui/TKT-U5-eps-budget-widget` - Budget tracking (optional)

### Testing Requirements
- Type safety validation
- API contract adherence
- No PII leakage checks
- Build pipeline verification

## Key Constraints
1. Single-instance workflow (no multi-tenancy in UI)
2. Minimal viable product scope
3. No plaintext evidence handling
4. CID-only communication with DALRN
5. Receipts must be verifiable on-chain