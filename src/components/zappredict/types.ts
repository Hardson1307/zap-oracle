export type MarketStatus = "active" | "resolved" | "upcoming";
export type MarketCategory = "politics" | "crypto" | "sports" | "science" | "entertainment" | "economics" | "tech" | "f1" | "stocks";

export interface Token {
  symbol: string;
  name: string;
  balance: number;
  usdValue: number;
  icon: string;
  change24h: number;
}

export interface OutcomeShare {
  outcome: string;
  price: number; // 0-100 cents
  quantity: number;
  costBasis: number;
  currentValue: number;
  pnl: number;
}

export interface Market {
  id: string;
  question: string;
  description: string;
  category: MarketCategory;
  status: MarketStatus;
  outcomes: MarketOutcome[];
  volume: number;
  liquidity: number;
  createdAt: string;
  resolvesAt: string;
  image?: string;
  hot: boolean;
  verified: boolean;
  participants: number;
}

export interface MarketOutcome {
  name: string;
  currentPrice: number; // 0-1 probability
  previousPrice: number;
  volume: number;
  color: string;
}

export interface Transaction {
  id: string;
  type: "buy" | "sell" | "claim" | "deposit" | "withdraw" | "swap";
  marketId?: string;
  marketQuestion?: string;
  outcome?: string;
  amount: number;
  shares?: number;
  price?: number;
  token: string;
  timestamp: string;
  status: "confirmed" | "pending" | "failed";
  txHash: string;
  gasless: boolean;
}

export interface Position {
  market: Market;
  outcome: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  costBasis: number;
  currentValue: number;
}

export type View =
  | "landing"
  | "markets"
  | "market-detail"
  | "portfolio"
  | "create-market"
  | "swap"
  | "bridge";
