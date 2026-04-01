# ⚡ Zap-Oracle — Prediction Markets on Starknet

The first Polymarket-style prediction market on Starknet. Trade on real-world events with gasless transactions, instant settlements, and social login via Starkzap SDK.

## Features

- **Prediction Markets** — Trade Yes/No shares on real-world events across Sports, F1, Crypto, Stocks, Tech, Economics, Entertainment, Science, and Politics
- **Gasless Transactions** — Powered by Starkzap SDK + AVNU Paymaster
- **Starknet Native** — Built on Starknet with full wallet support (MetaMask, ArgentX, Braavos, Starknet Wallet)
- **AI Oracle Chat** — Ask our mystical Oracle AI about markets, predictions, and crypto
- **Swap & Bridge** — Built-in token swap and cross-chain bridge to Starknet
- **Portfolio Tracking** — Real-time P&L tracking and position management

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Blockchain**: Starknet (@starknet-react/core v5)
- **SDK**: Starkzap SDK
- **AI**: z-ai-web-dev-sdk
- **Animations**: Framer Motion

## Getting Started

```bash
# Install dependencies
bun install

# Run development server
bun dev

# Build for production
bun run build

# Start production server
bun start
```

## Project Structure

```
src/
├── app/
│   ├── api/oracle/route.ts    # AI Oracle chat endpoint
│   ├── globals.css             # Global styles + button glow effects
│   ├── layout.tsx              # Root layout with providers
│   └── page.tsx                # Main SPA entry point
├── components/
│   ├── zappredict/
│   │   ├── app-context.tsx     # Global app state (Zustand)
│   │   ├── market-listing.tsx  # Market browser with filters
│   │   ├── market-card.tsx     # Individual market card
│   │   ├── market-detail.tsx   # Market trading view
│   │   ├── oracle-widget.tsx   # 3D Oracle chat widget
│   │   ├── landing-hero.tsx    # Landing page
│   │   ├── portfolio-view.tsx  # Portfolio & P&L
│   │   ├── swap-view.tsx       # Token swap
│   │   ├── bridge-view.tsx     # Cross-chain bridge
│   │   ├── create-market-view.tsx # Create new market
│   │   ├── connect-wallet-dialog.tsx # Wallet connection
│   │   ├── starknet-provider.tsx     # Starknet provider
│   │   ├── theme-toggle.tsx    # Dark/light mode
│   │   ├── mock-data.ts        # 46 prediction markets
│   │   └── types.ts            # TypeScript types
│   └── ui/                     # shadcn/ui components
├── hooks/                      # Custom React hooks
└── lib/                        # Utilities
```

## Built for Starkzap Builder Challenge

This project was built for the Starkzap Builder Challenge ($3,000 prize pool).

## License

MIT
