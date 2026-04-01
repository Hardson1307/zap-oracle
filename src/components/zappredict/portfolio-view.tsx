"use client";

import Image from "next/image";
import { useApp } from "./app-context";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Zap,
  Swap,
  ArrowRightLeft,
  Shield,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";
import { ConnectWalletDialog } from "./connect-wallet-dialog";
import { ThemeToggle } from "./theme-toggle";

export function PortfolioView() {
  const { positions, transactions, tokens, setCurrentView, usdBalance } = useApp();

  const totalPnl = positions.reduce((sum, p) => sum + p.pnl, 0);
  const totalValue = positions.reduce((sum, p) => sum + p.currentValue, 0);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0508]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800/50 bg-white dark:bg-white/80 dark:bg-[#0a0508]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => setCurrentView("markets")}>
              <Image src="/logo.svg" alt="Zap-Oracle" width={28} height={28} unoptimized className="rounded-md" />
              <span className="font-bold text-sm bg-gradient-to-r from-red-500 via-orange-400 to-red-400 bg-clip-text text-transparent dark:from-red-400 dark:via-orange-300 dark:to-red-300 hidden sm:inline">Zap — Oracle</span>
            </div>
            <Separator orientation="vertical" className="h-6 bg-gray-800" />
            <h1 className="text-gray-900 dark:text-white font-semibold">Portfolio</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <ConnectWalletDialog />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Tabs defaultValue="positions" className="space-y-6">
          <TabsList className="bg-gray-50 dark:bg-[#100a0c] border border-gray-200 dark:border-gray-800">
            <TabsTrigger value="positions" className="data-[state=active]:bg-gray-800 text-gray-400 data-[state=active]:text-gray-900 dark:text-white">
              Positions
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-gray-800 text-gray-400 data-[state=active]:text-gray-900 dark:text-white">
              Activity
            </TabsTrigger>
            <TabsTrigger value="assets" className="data-[state=active]:bg-gray-800 text-gray-400 data-[state=active]:text-gray-900 dark:text-white">
              Assets
            </TabsTrigger>
          </TabsList>

          {/* Positions Tab */}
          <TabsContent value="positions" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Portfolio Value", value: `$${totalValue.toFixed(0)}`, sub: null },
                { label: "Total P&L", value: `$${totalPnl.toFixed(2)}`, sub: `${((totalPnl / Math.max(totalValue - totalPnl, 1)) * 100).toFixed(1)}%` },
                { label: "USDC Balance", value: `$${usdBalance.toLocaleString()}`, sub: "Available" },
                { label: "Open Positions", value: String(positions.length), sub: "Active" },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#100a0c]">
                    <CardContent className="p-4">
                      <div className="text-xs text-gray-400 dark:text-gray-500 mb-1">{s.label}</div>
                      <div className={`text-xl font-bold ${s.label === "Total P&L" ? (totalPnl >= 0 ? "text-red-400" : "text-red-400") : "text-gray-900 dark:text-white"}`}>
                        {s.value}
                      </div>
                      {s.sub && (
                        <div className={`text-xs mt-0.5 ${s.label === "Total P&L" ? (totalPnl >= 0 ? "text-red-400/70" : "text-red-400/70") : "text-gray-400 dark:text-gray-500"}`}>
                          {s.sub}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Positions List */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Open Positions</h2>
              {positions.map((pos, i) => (
                <motion.div key={pos.market.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
                  <Card
                    className="border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#100a0c] cursor-pointer hover:border-gray-300 dark:border-gray-700 transition-colors"
                    onClick={() => {
                      setCurrentView("market-detail");
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-[10px] border-gray-300 dark:border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 px-1.5 py-0">
                              {pos.outcome}
                            </Badge>
                            <span className="text-sm text-gray-400 dark:text-gray-500">{pos.shares} shares</span>
                          </div>
                          <p className="text-gray-900 dark:text-white font-medium text-sm truncate">{pos.market.question}</p>
                        </div>
                        <div className="flex items-center gap-6 text-right">
                          <div>
                            <div className="text-xs text-gray-400 dark:text-gray-500">Value</div>
                            <div className="text-gray-900 dark:text-white font-semibold">${pos.currentValue.toFixed(2)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-400 dark:text-gray-500">Avg. Price</div>
                            <div className="text-gray-900 dark:text-white">¢{(pos.avgPrice * 100).toFixed(0)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-400 dark:text-gray-500">P&L</div>
                            <div className={`font-semibold flex items-center justify-end ${pos.pnl >= 0 ? "text-red-400" : "text-red-400"}`}>
                              {pos.pnl >= 0 ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                              ${pos.pnl.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card className="border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#100a0c]">
              <CardContent className="p-0">
                <div className="divide-y divide-gray-800/50">
                  {transactions.map((tx, i) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-center gap-4 p-4 hover:bg-gray-100 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          tx.type === "buy"
                            ? "bg-red-500/10"
                            : tx.type === "sell"
                            ? "bg-red-500/10"
                            : tx.type === "swap"
                            ? "bg-orange-500/10"
                            : tx.type === "bridge"
                            ? "bg-purple-500/10"
                            : "bg-gray-500/10"
                        }`}
                      >
                        {tx.type === "buy" && <ArrowUpRight className="w-4 h-4 text-red-400" />}
                        {tx.type === "sell" && <ArrowDownRight className="w-4 h-4 text-red-400" />}
                        {tx.type === "swap" && <ArrowRightLeft className="w-4 h-4 text-orange-400" />}
                        {tx.type === "deposit" && <ArrowUpRight className="w-4 h-4 text-gray-400" />}
                        {tx.type === "bridge" && <ExternalLink className="w-4 h-4 text-purple-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-900 dark:text-white font-medium truncate">
                          {tx.type === "swap"
                            ? `Swap tokens`
                            : tx.type === "bridge"
                            ? `Bridge from Ethereum`
                            : tx.type === "deposit"
                            ? `Deposit USDC`
                            : `${tx.type === "buy" ? "Buy" : "Sell"} ${tx.outcome} — ${tx.marketQuestion?.slice(0, 40)}...`}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {new Date(tx.timestamp).toLocaleDateString()}
                          {tx.gasless && (
                            <Badge className="text-[9px] h-4 px-1.5 bg-red-500/10 text-red-400 border-0 ml-1">
                              Gasless
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm text-gray-900 dark:text-white font-medium">
                          {tx.type === "buy" ? "-" : "+"}${tx.amount.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">{tx.token}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assets Tab */}
          <TabsContent value="assets">
            <div className="space-y-3">
              {tokens.map((token, i) => (
                <motion.div key={token.symbol} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#100a0c]">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-lg">
                          {token.icon}
                        </div>
                        <div>
                          <div className="text-gray-900 dark:text-white font-semibold">{token.symbol}</div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">{token.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-900 dark:text-white font-semibold">{token.balance.toLocaleString()}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">${token.usdValue.toLocaleString()}</div>
                        <div className={`text-xs ${token.change24h >= 0 ? "text-red-400" : "text-red-400"}`}>
                          {token.change24h >= 0 ? "+" : ""}
                          {token.change24h}%
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                <Button
                  onClick={() => setCurrentView("markets")}
                  variant="outline"
                  className="border-gray-300 dark:border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  Trade Markets
                </Button>
                <Button className="bg-red-500 hover:bg-red-400 text-white">
                  <ArrowRightLeft className="w-4 h-4 mr-2" />
                  Swap Tokens
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
