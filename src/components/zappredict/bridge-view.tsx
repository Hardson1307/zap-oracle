"use client";

import Image from "next/image";
import { useState } from "react";
import { useApp } from "./app-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { STARKZAP_CODE_SNIPPETS } from "./mock-data";
import {
  ArrowLeft,
  ArrowRight,
  Zap,
  Loader2,
  CheckCircle2,
  Globe,
  Shield,
  Clock,
  ExternalLink,
  Wallet,
} from "lucide-react";
import { motion } from "framer-motion";
import { ConnectWalletDialog } from "./connect-wallet-dialog";
import { ThemeToggle } from "./theme-toggle";

export function BridgeView() {
  const { tokens, setCurrentView, isRealWallet } = useApp();
  const [fromChain, setFromChain] = useState<"ethereum" | "solana">("ethereum");
  const [token, setToken] = useState("USDC");
  const [amount, setAmount] = useState("");
  const [bridging, setBridging] = useState(false);
  const [bridgeStep, setBridgeStep] = useState(0);

  const bridged = bridgeStep === 4;

  const handleBridge = () => {
    if (!isRealWallet) return;
    setBridging(true);
    setBridgeStep(1);
    setTimeout(() => setBridgeStep(2), 1500);
    setTimeout(() => setBridgeStep(3), 3500);
    setTimeout(() => {
      setBridgeStep(4);
      setBridging(false);
    }, 5000);
  };

  const steps = [
    { label: "Approve on " + (fromChain === "ethereum" ? "Ethereum" : "Solana"), done: bridgeStep >= 1 },
    { label: "Lock tokens on source chain", done: bridgeStep >= 2 },
    { label: "Mint on Starknet (CCTP)", done: bridgeStep >= 3 },
    { label: "Complete!", done: bridgeStep >= 4 },
  ];

  const fastTransfer = token === "USDC" ? "~20 min" : "~8 hours";
  const fee = "0.05%";

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0508]">
      <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800/50 bg-white dark:bg-white/80 dark:bg-[#0a0508]/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => setCurrentView("markets")}>
            <Image src="/logo.svg" alt="Zap-Oracle" width={28} height={28} unoptimized className="rounded-md" />
            <span className="font-bold text-sm bg-gradient-to-r from-red-500 via-orange-400 to-red-400 bg-clip-text text-transparent dark:from-red-400 dark:via-orange-300 dark:to-red-300 hidden sm:inline">Zap — Oracle</span>
          </div>
          <Separator orientation="vertical" className="h-6 bg-gray-800" />
          <h1 className="text-gray-900 dark:text-white font-semibold">Bridge to Starknet</h1>
          <div className="ml-auto"><ThemeToggle />
            <ConnectWalletDialog /></div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Cross-Chain Bridge</h2>
            <p className="text-sm text-gray-400">Move funds to Starknet via Starkzap</p>
          </div>

          <Card className="border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#100a0c]">
            <CardContent className="p-5 space-y-5">
              {/* Chain selector */}
              <div className="space-y-2">
                <span className="text-xs text-gray-400 dark:text-gray-500">From Chain</span>
                <div className="flex gap-2">
                  {(["ethereum", "solana"] as const).map((chain) => (
                    <Button
                      key={chain}
                      variant={fromChain === chain ? "default" : "outline"}
                      className={`flex-1 ${fromChain === chain ? "bg-gray-800 text-gray-900 dark:text-white" : "border-gray-300 dark:border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400"}`}
                      onClick={() => setFromChain(chain)}
                      disabled={bridging}
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      {chain === "ethereum" ? "Ethereum" : "Solana"}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-red-400" />
                </div>
              </div>

              <div className="space-y-2 text-center">
                <span className="text-xs text-gray-400 dark:text-gray-500">To</span>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <span className="text-red-400 font-bold text-xs">S</span>
                  </div>
                  <span className="text-gray-900 dark:text-white font-semibold">Starknet Sepolia</span>
                </div>
              </div>

              <Separator className="bg-gray-800" />

              {/* Token & Amount */}
              <div className="space-y-2">
                <span className="text-xs text-gray-400 dark:text-gray-500">Token</span>
                <div className="flex gap-2">
                  {["USDC", "ETH", "STRK"].map((t) => (
                    <Button
                      key={t}
                      size="sm"
                      variant={token === t ? "default" : "outline"}
                      className={token === t ? "bg-red-500/15 text-red-400 border-red-500/30" : "border-gray-300 dark:border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400"}
                      onClick={() => setToken(t)}
                      disabled={bridging}
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs text-gray-400 dark:text-gray-500">Amount</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  disabled={bridging}
                  className="w-full bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-lg font-bold text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-red-500/50"
                />
              </div>

              {/* Bridge info */}
              <div className="bg-gray-900/50 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 dark:text-gray-500">Est. Time</span>
                  <span className="text-gray-900 dark:text-white">{token === "USDC" ? fastTransfer + " (CCTP Fast)" : "~8 hours"}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 dark:text-gray-500">Bridge Fee</span>
                  <span className="text-gray-900 dark:text-white">{fee}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 dark:text-gray-500">Protocol</span>
                  <span className="text-gray-900 dark:text-white">LayerZero + CCTP</span>
                </div>
              </div>

              {/* Progress steps */}
              {bridging && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2">
                  {steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {step.done ? (
                        <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-700 shrink-0" />
                      )}
                      <span className={`text-xs ${step.done ? "text-red-400" : "text-gray-400 dark:text-gray-500"}`}>{step.label}</span>
                    </div>
                  ))}
                </motion.div>
              )}

              {!isRealWallet ? (
                <div className="w-full h-12 rounded-md bg-gray-200 dark:bg-gray-800/50 flex items-center justify-center gap-2">
                  <Wallet className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <span className="text-sm font-medium text-gray-400 dark:text-gray-500">Connect Wallet to Bridge</span>
                </div>
              ) : (
              <Button
                className="w-full h-12 bg-red-500 hover:bg-red-400 text-white font-bold"
                disabled={!amount || parseFloat(amount) <= 0 || bridging}
                onClick={handleBridge}
              >
                {bridging ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Bridging...
                  </>
                ) : bridged ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Bridge Complete!
                  </>
                ) : (
                  "Bridge to Starknet"
                )}
              </Button>
              )}
            </CardContent>
          </Card>

          {/* SDK Code */}
          <Card className="border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#100a0c]">
            <CardContent className="p-4">
              <div className="text-xs text-gray-400 dark:text-gray-500 font-mono mb-2">starkzap bridge code</div>
              <pre className="text-[11px] text-green-300/80 font-mono leading-relaxed whitespace-pre-wrap">
                {STARKZAP_CODE_SNIPPETS.bridge}
              </pre>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
