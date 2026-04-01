"use client";

import Image from "next/image";
import { useApp } from "./app-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { STARKZAP_CODE_SNIPPETS } from "./mock-data";
import {
  ArrowLeft,
  Zap,
  ArrowRight,
  Shield,
  Copy,
  CheckCircle2,
  Wallet,
  TrendingUp,
  Globe,
  ArrowRightLeft,
  Lock,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { ConnectWalletDialog } from "./connect-wallet-dialog";
import { ThemeToggle } from "./theme-toggle";

export function SwapView() {
  const { tokens, setCurrentView, isRealWallet } = useApp();
  const [fromToken, setFromToken] = useState("STRK");
  const [toToken, setToToken] = useState("USDC");
  const [amount, setAmount] = useState("");
  const [swapping, setSwapping] = useState(false);
  const [swapped, setSwapped] = useState(false);

  const from = tokens.find((t) => t.symbol === fromToken);
  const to = tokens.find((t) => t.symbol === toToken);
  const estimatedReceive = amount && from && to
    ? (parseFloat(amount) * (from.usdValue / from.balance) * (to.balance / to.usdValue)).toFixed(2)
    : "0";

  const handleSwap = () => {
    if (!isRealWallet) return;
    setSwapping(true);
    setTimeout(() => {
      setSwapping(false);
      setSwapped(true);
      setTimeout(() => setSwapped(false), 3000);
    }, 2000);
  };

  const handleFlip = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setAmount("");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0508]">
      <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800/50 bg-white dark:bg-white/80 dark:bg-[#0a0508]/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => setCurrentView("markets")}>
            <Image src="/logo.svg" alt="Zap-Oracle" width={28} height={28} unoptimized className="rounded-md" />
            <span className="font-bold text-sm bg-gradient-to-r from-red-500 via-orange-400 to-red-400 bg-clip-text text-transparent dark:from-red-400 dark:via-orange-300 dark:to-red-300 hidden sm:inline">Zap — Oracle</span>
          </div>
          <Separator orientation="vertical" className="h-6 bg-gray-800" />
          <h1 className="text-gray-900 dark:text-white font-semibold">Swap Tokens</h1>
          <div className="ml-auto"><ThemeToggle />
            <ConnectWalletDialog /></div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Swap via Starkzap</h2>
            <p className="text-sm text-gray-400">Best-price routing through AVNU + Ekubo</p>
          </div>

          <Card className="border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#100a0c]">
            <CardContent className="p-5 space-y-4">
              {/* From token */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 dark:text-gray-500">From</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">Balance: {from?.balance.toLocaleString()} {fromToken}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-xl font-bold text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-red-500/50"
                    />
                  </div>
                  <Button variant="outline" className="h-12 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white min-w-[100px]">
                    {from?.icon} {fromToken}
                  </Button>
                </div>
              </div>

              {/* Flip button */}
              <div className="flex justify-center -my-2 relative z-10">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-9 h-9 rounded-full border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#100a0c] hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={handleFlip}
                >
                  <ArrowRight className="w-4 h-4 text-gray-400 rotate-90" />
                </Button>
              </div>

              {/* To token */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 dark:text-gray-500">To</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">Balance: {to?.balance.toLocaleString()} {toToken}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="w-full bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-xl font-bold text-gray-900 dark:text-white">
                      {estimatedReceive}
                    </div>
                  </div>
                  <Button variant="outline" className="h-12 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white min-w-[100px]">
                    {to?.icon} {toToken}
                  </Button>
                </div>
              </div>

              {/* Route info */}
              {amount && parseFloat(amount) > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gray-900/50 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400 dark:text-gray-500">Route</span>
                    <span className="text-gray-900 dark:text-white">AVNU Aggregator</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400 dark:text-gray-500">Price Impact</span>
                    <span className="text-red-400">{"<0.01%"}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400 dark:text-gray-500">Network Fee</span>
                    <span className="text-red-400">$0.00</span>
                  </div>
                </motion.div>
              )}

              {!isRealWallet ? (
                <div className="w-full h-12 rounded-md bg-gray-200 dark:bg-gray-800/50 flex items-center justify-center gap-2">
                  <Wallet className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <span className="text-sm font-medium text-gray-400 dark:text-gray-500">Connect Wallet to Swap</span>
                </div>
              ) : (
              <Button
                className="w-full h-12 bg-red-500 hover:bg-red-400 text-white font-bold"
                disabled={!amount || parseFloat(amount) <= 0 || swapping}
                onClick={handleSwap}
              >
                {swapping ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <Zap className="w-5 h-5" />
                  </motion.div>
                ) : swapped ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Swap Complete!
                  </>
                ) : (
                  "Swap"
                )}
              </Button>
              )}

              <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                <Zap className="w-3 h-3 text-red-400" />
                Gasless via Starkzap + AVNU
              </div>
            </CardContent>
          </Card>

          {/* SDK Code */}
          <Card className="border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#100a0c]">
            <CardContent className="p-4">
              <div className="text-xs text-gray-400 dark:text-gray-500 font-mono mb-2">starkzap swap code</div>
              <pre className="text-[11px] text-green-300/80 font-mono leading-relaxed whitespace-pre-wrap">
                {STARKZAP_CODE_SNIPPETS.swap}
              </pre>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
