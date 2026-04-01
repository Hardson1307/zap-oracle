"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useAccount, useBalance, useNetwork } from "@starknet-react/core";
import { View, Token, Market, Transaction, Position } from "./types";
import { MOCK_TOKENS, MOCK_MARKETS, MOCK_TRANSACTIONS, MOCK_POSITIONS } from "./mock-data";

interface AppState {
  connected: boolean;
  setConnected: (v: boolean) => void;
  currentView: View;
  setCurrentView: (v: View) => void;
  selectedMarket: Market | null;
  setSelectedMarket: (m: Market | null) => void;
  tokens: Token[];
  markets: Market[];
  transactions: Transaction[];
  positions: Position[];
  addTransaction: (tx: Transaction) => void;
  walletAddress: string;
  chainId: string;
  usdBalance: number;
  ethBalance: string;
  isRealWallet: boolean;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [currentView, setCurrentView] = useState<View>("landing");
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);

  // Real wallet hooks
  const { address, isConnected, chainId } = useAccount();
  const { data: balanceData } = useBalance({ address, watch: true });
  const { chain } = useNetwork();

  const addTransaction = (tx: Transaction) => {
    setTransactions((prev) => [tx, ...prev]);
  };

  const isRealWallet = !!isConnected;
  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "0x7F4e...3aB9";

  const formattedEthBalance = balanceData
    ? `${(Number(balanceData.value) / 1e18).toFixed(4)} ETH`
    : "0.0000 ETH";

  // Use real wallet if connected, mock data otherwise
  const walletAddress = isRealWallet ? truncatedAddress : "0x7F4e...3aB9";
  const currentChainId = isRealWallet
    ? chain?.network === "sepolia" ? "SN_SEPOLIA" : "SN_MAINNET"
    : "SN_SEPOLIA";
  const usdBalance = MOCK_TOKENS.find((t) => t.symbol === "USDC")?.balance ?? 0;

  return (
    <AppContext.Provider
      value={{
        connected,
        setConnected,
        currentView,
        setCurrentView,
        selectedMarket,
        setSelectedMarket,
        tokens: MOCK_TOKENS,
        markets: MOCK_MARKETS,
        transactions,
        positions: MOCK_POSITIONS,
        addTransaction,
        walletAddress,
        chainId: currentChainId,
        usdBalance,
        ethBalance: formattedEthBalance,
        isRealWallet,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
