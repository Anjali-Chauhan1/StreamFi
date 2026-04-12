# StreamFi - PayFi-Powered Web3TV Platform

StreamFi is a decentralized Web3 entertainment platform that transforms movies into financial assets.

Users do not only watch content. They can watch, invest, earn, and help promote titles, while payments and revenue sharing are executed on-chain.

Final one-line positioning:

"StreamFi is a PayFi-powered Web3 platform where users invest in movies, pay per watch, and earn from every view in real time."

## Core Idea

Watch, Pay, Earn, and Invest in content.

Traditional streaming keeps users as consumers only. StreamFi turns users into:

- Viewers
- Investors
- Promoters

Every interaction can create measurable financial value.

## Full Value Loop

Creator uploads -> Users invest -> Movie releases -> Viewers pay while watching -> Revenue auto-splits -> Investors earn

## Key Features

### 1) Pay-Per-Second Streaming (Micro-Payments)

- Viewers do not need to pre-buy full movies.
- Charging is based on watch duration.
- Payment settlement can happen continuously or in short intervals.

Benefits:

- Lower upfront risk for users
- Real-time monetization for creators

### 2) Revenue Auto-Split (PayFi Core)

Each payment is split by smart contract rules.

Current split in this repository:

- Creator: 60%
- Investors: 30%
- Platform: 10%

No manual payout process is required once payment is received.

### 3) Movie NFTs / Revenue Assets (Roadmap)

- The product vision is to tokenize movies into earning assets.
- Investors can hold revenue-linked positions similar to a movie marketplace.

Status: Concept and product direction are defined. Full NFT revenue tokenization is roadmap work.

### 4) Watch-to-Earn Model (Roadmap)

- Reward mechanics for watching, reviewing, and sharing are part of StreamFi strategy.

Status: Billing and watch tracking primitives exist; full token reward engine is roadmap work.

### 5) Anti-Piracy via Wallet-Bound Access (Roadmap)

Target model:

- Encrypted playback
- Wallet verification
- Device-aware access control

Status: This repository contains payment-gated playback flows; full wallet+device cryptographic binding is roadmap work.

### 6) Creator Financing (Pre-Release Funding)

- Upcoming movie entries can be published before release.
- Users can invest on-chain and creators can raise pre-release capital.
- Revenue sharing after release aligns creators and investors.

## Technical Architecture

### On-Chain Layer

- Solidity smart contract: `StreamFiPayment`
- Functions include:
	- movie registration
	- investment
	- pay-per-view settlement
	- stream start / settle / stop
	- automated payout splitting

### Web App Layer

- Next.js frontend (App Router)
- Wallet connection via RainbowKit + Wagmi
- Ethers integration for contract interactions
- Creator upload and viewer watch flow

### Data and Media Layer

- MongoDB for metadata persistence
- MongoDB GridFS for media and thumbnail file storage/streaming

Note:

- Product vision targets decentralized storage (for example IPFS).
- Current codebase uses MongoDB/GridFS in this implementation.

### Network

- EVM-compatible flow
- Current dApp wallet and UI configuration targets HashKey Chain Testnet (chainId 133)
- Hardhat config also includes local simulated networks and Sepolia support

## Product Roadmap

### Phase 1: Launch (Free + Earn)

- Free movies
- Token rewards
- Free NFTs
- Referral incentives

Goal: onboard users with earn-first behavior.

### Phase 2: Community Building

- Discord/Telegram integration
- Community voting on movie decisions and alternate endings

Goal: build emotional + financial participation.

### Phase 3: Hybrid Monetization

- Free content (ads/sponsors)
- Premium content (pay-per-second)

Goal: gradual transition to a balanced paid ecosystem.

### Phase 4: Viral Growth Loop

- Investors promote movies they have exposure to
- More views can increase shared revenue

Goal: decentralized built-in marketing engine.

## Why Users Join

Three hooks:

- Earn while watching
- Free early access
- Be part of creation and upside

## Unique Selling Proposition

- Real-time micropayment streaming
- Instant automated royalty distribution
- Movies as financial assets
- Fans can become investors
- Viral growth incentives
- Strong anti-piracy direction with wallet-bound access model

## Positioning

- Not a Netflix clone
- Not only a piracy solution
- A platform where users do not only consume content, they can earn from it

## Repository Structure

This repository has two main parts:

- Root: smart contracts, Hardhat config, deployment scripts
- `frontend/`: Next.js dApp, APIs, media upload/stream routes, UI

Important folders:

- `contracts/` -> Solidity contracts (`StreamFiPayment.sol`)
- `scripts/` -> deploy scripts
- `ignition/modules/` -> Hardhat Ignition deployment modules
- `frontend/app/` -> pages + API routes
- `frontend/components/` -> UI and player components
- `frontend/lib/` -> MongoDB and billing helpers
- `frontend/prisma/` -> Prisma schema (MongoDB)

## Local Setup

### Prerequisites

- Node.js 18+
- npm
- MongoDB connection string
- Wallet browser extension (for example MetaMask)

### 1) Install dependencies

At repo root:

```bash
npm install
```

Inside frontend:

```bash
cd frontend
npm install
```

### 2) Configure environment variables

Create `.env` in project root for Hardhat/network usage:

```env
SEPOLIA_RPC_URL=
SEPOLIA_PRIVATE_KEY=
HASHKEY_RPC_URL=https://testnet.hsk.xyz
HASHKEY_PRIVATE_KEY=
```

Create `.env.local` in `frontend/`:

```env
NEXT_PUBLIC_STREAMFI_CONTRACT_ADDRESS=
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
DATABASE_URL=
```

### 3) Deploy the contract

Example deploy using script:

```bash
npx hardhat run scripts/deploy.ts --network hashkeyTestnet
```

Or with Ignition module:

```bash
npx hardhat ignition deploy --network hashkeyTestnet ignition/modules/StreamFiPayment.ts
```

After deployment, copy the contract address into `frontend/.env.local` as `NEXT_PUBLIC_STREAMFI_CONTRACT_ADDRESS`.

### 4) Run frontend

```bash
cd frontend
npm run dev
```

Open `http://localhost:3000`.

## Current Functional Flows

### Creator flow

- Connect wallet
- Register movie on-chain
- Upload media + thumbnail
- Save metadata to database

### Investor flow

- Invest in a movie by sending value on-chain
- Receive proportional share distribution from viewer payments

### Viewer flow

- Watch content in player
- Usage is tracked and due amount is enforced
- Pending due can trigger settlement before continued playback

## Smart Contract Notes

Contract: `contracts/StreamFiPayment.sol`

Highlights:

- Revenue split constants: 60/30/10
- Investment tracking per movie
- Stream lifecycle:
	- `startStream(movieId)`
	- `settleStream(movieId)`
	- `stopStream(movieId)`
- Direct payment path via `pay(movieId)`

## Known Gaps vs Product Vision

This repository already demonstrates core PayFi mechanics, but some vision items are still roadmap-level:

- Full movie NFT/revenue token marketplace
- Tokenized watch-to-earn reward engine
- Wallet+device cryptographic playback binding
- Complete decentralized storage pipeline (IPFS-first)
- Full DAO/community governance modules

## License

ISC
