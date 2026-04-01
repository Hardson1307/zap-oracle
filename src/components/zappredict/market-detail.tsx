"use client";

import { useState } from "react";
import Image from "next/image";
import { useApp } from "./app-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  TrendingUp,
  Users,
  Clock,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Eye,
  Wallet,
} from "lucide-react";
import { motion } from "framer-motion";
import { CATEGORY_INFO, STARKZAP_CODE_SNIPPETS } from "./mock-data";
import { ConnectWalletDialog } from "./connect-wallet-dialog";
import { ThemeToggle } from "./theme-toggle";

export function MarketDetail() {
  const { selectedMarket: market, setCurrentView, usdBalance, addTransaction, isRealWallet } = useApp();
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
  const [selectedOutcome, setSelectedOutcome] = useState(0);
  const [amount, setAmount] = useState("");
  const [showOrderBook, setShowOrderBook] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showCode, setShowCode] = useState(false);

  if (!market) return null;

  const cat = CATEGORY_INFO[market.category];
  const outcome = market.outcomes[selectedOutcome];
  const price = outcome.currentPrice;
  const potentialReturn = amount ? (parseFloat(amount) / price) * (1 - price) : 0;

  const handleTrade = () => {
    if (!isRealWallet) return;
    if (!amount || parseFloat(amount) <= 0) return;
    setProcessing(true);
    setTimeout(() => {
      addTransaction({
        id: `tx_${Date.now()}`,
        type: activeTab,
        marketId: market.id,
        marketQuestion: market.question,
        outcome: outcome.name,
        amount: parseFloat(amount),
        shares: parseFloat(amount) / price,
        price,
        token: "USDC",
        timestamp: new Date().toISOString(),
        status: "confirmed",
        txHash: `0x${Math.random().toString(16).slice(2, 14)}...`,
        gasless: true,
      });
      setProcessing(false);
      setAmount("");
    }, 2000);
  };

  // Generate order book data
  const orderBookAsks = Array.from({ length: 6 }, (_, i) => ({
    price: price + (i + 1) * 0.01,
    amount: Math.floor(Math.random() * 500 + 100),
    total: 0,
  }));
  const orderBookBids = Array.from({ length: 6 }, (_, i) => ({
    price: price - (i + 1) * 0.01,
    amount: Math.floor(Math.random() * 500 + 100),
    total: 0,
  }));

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0508]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800/50 bg-white dark:bg-white/80 dark:bg-[#0a0508]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => setCurrentView("markets")}>
            <Image src="/logo.svg" alt="Zap-Oracle" width={28} height={28} unoptimized className="rounded-md" />
            <span className="font-bold text-sm bg-gradient-to-r from-red-500 via-orange-400 to-red-400 bg-clip-text text-transparent dark:from-red-400 dark:via-orange-300 dark:to-red-300 hidden sm:inline">Zap — Oracle</span>
          </div>
          <Separator orientation="vertical" className="h-6 bg-gray-800" />
          <span className="text-gray-400 dark:text-gray-500 dark:text-gray-400 text-sm truncate">{market.question}</span>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <ConnectWalletDialog />
            {market.status === "resolved" && (
              <Badge className="bg-orange-500/10 text-orange-400 border-0 text-xs">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Resolved
              </Badge>
            )}
            {market.verified && (
              <Badge className="bg-red-500/10 text-red-400 border-0 text-xs">
                <Shield className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Market Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Meta */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="text-[11px] border-gray-300 dark:border-gray-700 bg-gray-800/50 text-gray-300">
                  {cat?.icon} {cat?.label}
                </Badge>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  Resolves {new Date(market.resolvesAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-snug">{market.question}</h1>
              <p className="text-gray-400 dark:text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{market.description}</p>
            </motion.div>

            {/* Outcome Cards */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-3">
              {market.outcomes.map((o, i) => {
                const priceChange = o.currentPrice - o.previousPrice;
                return (
                  <Card
                    key={o.name}
                    className={`border cursor-pointer transition-all ${
                      selectedOutcome === i ? "border-red-500/50 bg-red-500/5" : "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#100a0c] hover:border-gray-300 dark:border-gray-700"
                    }`}
                    onClick={() => setSelectedOutcome(i)}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${o.color}15` }}>
                          <span className="text-sm font-bold" style={{ color: o.color }}>
                            ¢{(o.currentPrice * 100).toFixed(0)}
                          </span>
                        </div>
                        <div>
                          <div className="text-gray-900 dark:text-white font-medium">{o.name}</div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            {priceChange >= 0 ? "+" : ""}
                            {(priceChange * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-900 dark:text-white font-bold text-lg">¢{(o.currentPrice * 100).toFixed(1)}</div>
                        <div className={`text-xs flex items-center justify-end ${priceChange >= 0 ? "text-red-400" : "text-red-400"}`}>
                          {priceChange >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
                          {priceChange >= 0 ? "+" : ""}{(priceChange * 100).toFixed(2)}%
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </motion.div>

            {/* Stats row */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Volume", value: `$${(market.volume / 1000).toFixed(0)}K`, icon: TrendingUp },
                  { label: "Liquidity", value: `$${(market.liquidity / 1000).toFixed(0)}K`, icon: Shield },
                  { label: "Traders", value: market.participants.toLocaleString(), icon: Users },
                ].map((s) => (
                  <Card key={s.label} className="border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#100a0c]">
                    <CardContent className="p-3 text-center">
                      <s.icon className="w-4 h-4 mx-auto mb-1 text-gray-400 dark:text-gray-500" />
                      <div className="text-gray-900 dark:text-white font-bold">{s.value}</div>
                      <div className="text-[11px] text-gray-400 dark:text-gray-500">{s.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Trading Panel */}
          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Card className="border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#100a0c]">
                <CardContent className="p-5 space-y-4">
                  {/* Buy/Sell Toggle */}
                  <div className="flex gap-1 bg-gray-900 rounded-lg p-1">
                    {(["buy", "sell"] as const).map((tab) => (
                      <Button
                        key={tab}
                        variant="ghost"
                        size="sm"
                        className={`flex-1 rounded-md font-medium ${
                          activeTab === tab
                            ? tab === "buy"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-red-500/20 text-red-400"
                            : "text-gray-400 dark:text-gray-500 hover:text-gray-300"
                        }`}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)} {outcome.name}
                      </Button>
                    ))}
                  </div>

                  {/* Balance display */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 dark:text-gray-500">Balance</span>
                    <span className="text-gray-900 dark:text-white font-medium">{usdBalance.toLocaleString()} USDC</span>
                  </div>

                  {/* Amount input */}
                  <div className="space-y-2">
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="text-xl font-bold h-14 bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white pr-16"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm font-medium">USDC</span>
                    </div>
                    <div className="flex gap-2">
                      {[25, 50, 100, 500].map((pct) => (
                        <Button
                          key={pct}
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs border-gray-300 dark:border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-white h-8"
                          onClick={() => setAmount(String(Math.min(pct, usdBalance)))}
                        >
                          ${pct}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Preview */}
                  {amount && parseFloat(amount) > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-2 bg-gray-900/50 rounded-lg p-3"
                    >
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400 dark:text-gray-500">Shares you get</span>
                        <span className="text-gray-900 dark:text-white">{(parseFloat(amount) / price).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400 dark:text-gray-500">Avg. price</span>
                        <span className="text-gray-900 dark:text-white">¢{(price * 100).toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400 dark:text-gray-500">Potential P&L</span>
                        <span className="text-red-400">+${potentialReturn.toFixed(2)}</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Trade button */}
                  {!isRealWallet ? (
                    <div className="w-full h-12 rounded-md bg-gray-200 dark:bg-gray-800/50 flex items-center justify-center gap-2">
                      <Wallet className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      <span className="text-sm font-medium text-gray-400 dark:text-gray-500">Connect Wallet to Trade</span>
                    </div>
                  ) : (
                  <Button
                    className={`w-full h-12 font-bold text-base ${
                      activeTab === "buy"
                        ? "bg-red-500 hover:bg-red-400 text-white"
                        : "bg-red-500 hover:bg-red-400 text-gray-900 dark:text-white"
                    }`}
                    disabled={!amount || parseFloat(amount) <= 0 || processing}
                    onClick={handleTrade}
                  >
                    {processing ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                        <Zap className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <>
                        {activeTab === "buy" ? "Buy" : "Sell"} {outcome.name}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                  )}

                  {/* Gasless badge */}
                  <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                    <Zap className="w-3 h-3 text-red-400" />
                    Gasless via Starkzap + AVNU Paymaster
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Starkzap Code */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#100a0c]">
                <CardContent className="p-4">
                  <button
                    onClick={() => setShowCode(!showCode)}
                    className="flex items-center justify-between w-full text-sm"
                  >
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      {showCode ? "Hide" : "Show"} SDK Code
                    </span>
                    <Badge variant="secondary" className="text-[10px] h-5 bg-gray-800 text-gray-400">
                      starkzap
                    </Badge>
                  </button>
                  {showCode && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-3"
                    >
                      <pre className="text-[11px] text-green-300/80 font-mono bg-gray-100 dark:bg-[#0a0a12] rounded-lg p-3 overflow-x-auto leading-relaxed whitespace-pre-wrap">
                        {STARKZAP_CODE_SNIPPETS.buyShares}
                      </pre>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
