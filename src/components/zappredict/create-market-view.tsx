"use client";

import Image from "next/image";
import { useState } from "react";
import { useApp } from "./app-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Plus,
  Zap,
  Calendar,
  CheckCircle2,
  Loader2,
  Sparkles,
  Wallet,
} from "lucide-react";
import { motion } from "framer-motion";
import { STARKZAP_CODE_SNIPPETS } from "./mock-data";
import { MarketCategory } from "./types";
import { ConnectWalletDialog } from "./connect-wallet-dialog";
import { ThemeToggle } from "./theme-toggle";

export function CreateMarketView() {
  const { setCurrentView, isRealWallet } = useApp();
  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<MarketCategory>("crypto");
  const [resolutionDate, setResolutionDate] = useState("");
  const [deposit, setDeposit] = useState("");
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const handleCreate = () => {
    if (!isRealWallet) return;
    setCreating(true);
    setTimeout(() => {
      setCreating(false);
      setCreated(true);
    }, 2500);
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
          <h1 className="text-gray-900 dark:text-white font-semibold">Create Market</h1>
          <div className="ml-auto"><ThemeToggle />
            <ConnectWalletDialog /></div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {created ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Market Created!</h2>
            <p className="text-gray-400 mb-8">Your prediction market is now live on Starknet Sepolia</p>
            <div className="space-y-4 max-w-md mx-auto">
              <div className="bg-gray-50 dark:bg-[#100a0c] border border-gray-200 dark:border-gray-800 rounded-lg p-4 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 dark:text-gray-500">Market ID</span>
                  <span className="text-gray-900 dark:text-white font-mono text-xs">0x8f3a...2b7c</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 dark:text-gray-500">Network</span>
                  <Badge className="text-[10px] h-5 bg-red-500/10 text-red-400 border-0">Starknet Sepolia</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 dark:text-gray-500">Gas Fee</span>
                  <span className="text-red-400 font-medium">$0.00 <span className="text-gray-400 dark:text-gray-500">(sponsored)</span></span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 dark:text-gray-500">Tx Hash</span>
                  <span className="text-gray-900 dark:text-white font-mono text-xs">0xa4e2...8f91</span>
                </div>
              </div>
              <Button onClick={() => setCurrentView("markets")} className="w-full bg-red-500 hover:bg-red-400 text-white font-semibold">
                View Markets
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Create a New Prediction Market</h2>
              <p className="text-gray-400 dark:text-gray-500 dark:text-gray-400 text-sm">
                Define a question with binary outcomes. Deposit USDC as initial liquidity. Everything is gasless via Starkzap.
              </p>
            </div>

            <Card className="border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#100a0c]">
              <CardContent className="p-6 space-y-5">
                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm">Question</Label>
                  <Textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g. Will Bitcoin reach $150,000 by December 2026?"
                    className="bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 min-h-[80px] resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm">Description</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the resolution criteria, source of truth, and any edge cases..."
                    className="bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 min-h-[100px] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300 text-sm">Category</Label>
                    <Select value={category} onValueChange={(v) => setCategory(v as MarketCategory)}>
                      <SelectTrigger className="bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-50 dark:bg-[#140e10] border-gray-300 dark:border-gray-700">
                        {(["crypto", "economics", "politics", "tech", "sports", "science", "entertainment"] as const).map((c) => (
                          <SelectItem key={c} value={c} className="text-gray-300">
                            {c.charAt(0).toUpperCase() + c.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300 text-sm flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Resolution Date
                    </Label>
                    <Input
                      type="date"
                      value={resolutionDate}
                      onChange={(e) => setResolutionDate(e.target.value)}
                      className="bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm">Initial Liquidity Deposit (USDC)</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={deposit}
                      onChange={(e) => setDeposit(e.target.value)}
                      placeholder="100"
                      className="bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white pr-16"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm font-medium">USDC</span>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Minimum deposit: 50 USDC</p>
                </div>

                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3 flex items-start gap-2">
                  <Zap className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-green-300/80">
                    Market creation is <strong>gasless</strong>. Transaction sponsored via Starkzap&apos;s AVNU paymaster integration.
                  </p>
                </div>

                {!isRealWallet ? (
                  <div className="w-full h-12 rounded-md bg-gray-200 dark:bg-gray-800/50 flex items-center justify-center gap-2">
                    <Wallet className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <span className="text-sm font-medium text-gray-400 dark:text-gray-500">Connect Wallet to Create Market</span>
                  </div>
                ) : (
                <Button
                  className="w-full h-12 bg-red-500 hover:bg-red-400 text-white font-bold text-base"
                  disabled={!question || !description || !resolutionDate || !deposit || creating}
                  onClick={handleCreate}
                >
                  {creating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating Market...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Create Market
                    </>
                  )}
                </Button>
                )}
              </CardContent>
            </Card>

            {/* SDK Code */}
            <Card className="border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#100a0c]">
              <CardContent className="p-4">
                <button onClick={() => setShowCode(!showCode)} className="flex items-center justify-between w-full">
                  <span className="text-sm text-gray-400">How does this work under the hood?</span>
                  <Badge variant="secondary" className="text-[10px] h-5 bg-gray-800 text-gray-400">starkzap</Badge>
                </button>
                {showCode && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3">
                    <pre className="text-[11px] text-green-300/80 font-mono bg-gray-100 dark:bg-[#0a0a12] rounded-lg p-3 overflow-x-auto leading-relaxed whitespace-pre-wrap">
                      {STARKZAP_CODE_SNIPPETS.createMarket}
                    </pre>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
