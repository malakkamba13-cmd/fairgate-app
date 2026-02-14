# FairGate - Reputation Gated App

A Next.js 14 application demonstrating FairScale reputation integration. It uses the `fairScore` API and on-chain metrics to gate content.

## Features

- **Wallet Connection**: Uses Solana Wallet Adapter (Phantom, Solflare).
- **Reputation Scoring**: Fetches real-time FairScores from FairScale API.
- **Gated Content**: Unlocks specific UI sections based on reputation tiers.
- **Badges**: Displays earned badges (e.g., Diamond Hands).

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Create a `.env.local` file:
    ```env
    NEXT_PUBLIC_FAIRSCALE_API_URL=https://api.fairscale.xyz
    FAIRSCALE_API_KEY=your-api-key-here
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS
- Solana Wallet Adapter
- FairScale API
