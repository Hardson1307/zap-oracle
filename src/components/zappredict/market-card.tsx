"use client";

import { useApp } from "./app-context";
import { Market } from "./types";
import { CATEGORY_INFO } from "./mock-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, Clock, Flame, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface MarketCardProps {
  market: Market;
  index: number;
}

export function MarketCard({ market, index }: MarketCardProps) {
  const { setCurrentView, setSelectedMarket } = useApp();
  const cat = CATEGORY_INFO[market.category];

  const handleClick = () => {
    setSelectedMarket(market);
    setCurrentView("market-detail");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card
        className="group cursor-pointer border-gray-200 dark:border-gray-800 bg-white dark:bg-[#100a0c] hover:border-red-300 dark:hover:border-red-900/50 transition-all hover:shadow-lg hover:shadow-red-500/5"
        onClick={handleClick}
      >
        <CardContent className="p-4 sm:p-5">
          {/* Top row */}
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="text-[11px] px-2 py-0.5 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300">
              <span className="mr-1">{cat?.icon}</span>
              {cat?.label}
            </Badge>
            {market.hot && (
              <Badge className="text-[11px] px-2 py-0.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 border-0">
                <Flame className="w-2.5 h-2.5 mr-1" />
                Hot
              </Badge>
            )}
            {market.verified && (
              <Badge className="text-[11px] px-2 py-0.5 bg-red-500/10 text-red-600 dark:text-red-400 border-0">
                <CheckCircle className="w-2.5 h-2.5 mr-1" />
                Verified
              </Badge>
            )}
            {market.status === "resolved" && (
              <Badge className="text-[11px] px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-0">
                Resolved
              </Badge>
            )}
          </div>

          {/* Question */}
          <h3 className="text-gray-900 dark:text-white font-semibold text-sm sm:text-base mb-3 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors leading-snug">
            {market.question}
          </h3>

          {/* Price bars */}
          <div className="space-y-2 mb-4">
            {market.outcomes.map((outcome) => (
              <div key={outcome.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{outcome.name}</span>
                  <span className="text-xs font-semibold text-gray-900 dark:text-white">
                    ¢{(outcome.currentPrice * 100).toFixed(0)}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: outcome.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${outcome.currentPrice * 100}%` }}
                    transition={{ duration: 0.8, delay: index * 0.05 + 0.3 }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                ${(market.volume / 1000).toFixed(0)}K
              </span>
              <span className="flex items-center">
                <Users className="w-3 h-3 mr-1" />
                {market.participants.toLocaleString()}
              </span>
            </div>
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {new Date(market.resolvesAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
