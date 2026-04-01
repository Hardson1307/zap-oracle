"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useApp } from "./app-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Shield, TrendingUp, ArrowRight, Lock, Globe, Coins, Trophy } from "lucide-react";

export function LandingHero() {
  const { setConnected, setCurrentView } = useApp();

  const handleConnect = () => {
    setConnected(true);
    setCurrentView("markets");
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0508]">
      {/* Sports Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/sports-bg.png"
          alt="Sports background"
          fill
          className="object-cover opacity-30"
          priority
        />
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0508]/80 via-[#0a0508]/60 to-[#0a0508]/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0508]/70 via-transparent to-[#0a0508]/70" />
      </div>

      {/* Red glow effects */}
      <div className="absolute inset-0 overflow-hidden z-[1]">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-red-600/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-orange-500/8 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-red-900/8 blur-[150px]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,60,60,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,60,60,0.15) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Logo Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 180 }}
          className="mb-6"
        >
          <div className="relative inline-block">
            {/* Logo glow behind */}
            <div className="absolute inset-0 scale-150 bg-red-500/20 blur-[60px] rounded-full" />
            <Image
              src="/zap-oracle-logo.png"
              alt="Zap-Oracle Logo"
              width={320}
              height={320}
              priority
              className="relative z-10 w-48 sm:w-56 md:w-64 h-auto drop-shadow-2xl"
            />
          </div>
        </motion.div>

        {/* Brand text underneath logo */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-baseline justify-center">
            <span className="text-3xl sm:text-4xl md:text-5xl font-black uppercase bg-gradient-to-r from-red-400 via-orange-300 to-amber-300 bg-clip-text text-transparent" style={{ letterSpacing: "-0.04em" }}>
              Zap
            </span>
            <span className="text-2xl sm:text-3xl md:text-4xl text-gray-500 font-extralight mx-1.5 select-none" style={{ letterSpacing: "0.05em" }}>
              —
            </span>
            <span className="text-3xl sm:text-4xl md:text-5xl font-black uppercase bg-gradient-to-r from-orange-400 via-red-400 to-red-500 bg-clip-text text-transparent italic" style={{ letterSpacing: "-0.04em" }}>
              Oracle
            </span>
          </div>
        </motion.div>

        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <Badge
            variant="outline"
            className="mb-6 px-4 py-1.5 border-red-500/30 bg-red-500/10 text-red-400 text-sm font-medium"
          >
            <Zap className="w-3.5 h-3.5 mr-1.5" />
            Built on Starknet
          </Badge>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6"
        >
          <span className="text-white">Predict the Game.</span>
          <br />
          <span className="bg-gradient-to-r from-red-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
            Profit from Being Right.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          The first Polymarket-style prediction market on Starknet. Trade on sports, crypto & world events
          with <span className="text-red-400 font-medium">gasless transactions</span>,
          <span className="text-orange-400 font-medium"> instant settlements</span>, and
          <span className="text-red-400 font-medium"> real crypto rewards</span>.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Button
            size="lg"
            onClick={handleConnect}
            className="bg-red-600 hover:bg-red-500 text-white font-bold text-lg px-8 py-6 rounded-xl shadow-lg shadow-red-600/25 transition-all hover:shadow-red-500/40"
          >
            <Globe className="w-5 h-5 mr-2" />
            Start Trading
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-gray-600 text-gray-200 hover:bg-gray-800/80 font-semibold text-lg px-8 py-6 rounded-xl"
          >
            View Markets
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
        >
          {[
            { label: "Total Volume", value: "$12.4M", icon: TrendingUp },
            { label: "Active Markets", value: "142", icon: Coins },
            { label: "Traders", value: "28.5K", icon: Globe },
            { label: "Avg. Gas", value: "$0.00", icon: Shield },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4">
              <stat.icon className="w-5 h-5 mx-auto mb-2 text-red-400" />
              <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Feature Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="relative z-10 max-w-6xl mx-auto px-4 pb-20 w-full mt-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Lock,
              title: "Gasless Trading",
              desc: "Every trade is sponsored via Starkzap's AVNU paymaster integration. Zero gas fees, ever.",
              bgClass: "bg-red-500/10",
              hoverBgClass: "group-hover:bg-red-500/20",
              iconClass: "text-red-400",
            },
            {
              icon: Shield,
              title: "Social Login Wallets",
              desc: "Connect with Google, Apple, or email via Privy. No seed phrases, no extensions needed.",
              bgClass: "bg-orange-500/10",
              hoverBgClass: "group-hover:bg-orange-500/20",
              iconClass: "text-orange-400",
            },
            {
              icon: TrendingUp,
              title: "Onchain & Transparent",
              desc: "All markets live on Starknet. Fully verifiable, instant finality, provably fair resolution.",
              bgClass: "bg-red-500/10",
              hoverBgClass: "group-hover:bg-red-500/20",
              iconClass: "text-red-400",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="group relative p-6 rounded-2xl border border-gray-800 bg-[#0f0a0c]/80 backdrop-blur-sm hover:border-red-900/50 transition-all"
            >
              <div
                className={`w-12 h-12 rounded-xl ${feature.bgClass} flex items-center justify-center mb-4 ${feature.hoverBgClass} transition-colors`}
              >
                <feature.icon className={`w-6 h-6 ${feature.iconClass}`} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <div className="relative z-10 pb-8 text-center text-gray-600 text-sm">
        Built on Starknet
      </div>
    </div>
  );
}
