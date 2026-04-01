"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useApp } from "./app-context";
import { CATEGORY_INFO } from "./mock-data";
import { MarketCard } from "./market-card";
import { MarketCategory } from "./types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Plus,
  Flame,
  SlidersHorizontal,
  X,
  Clock,
  TrendingUp,
  CheckCircle2,
  BarChart3,
  ChevronDown,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ConnectWalletDialog } from "./connect-wallet-dialog";
import { ThemeToggle } from "./theme-toggle";

const categories: (MarketCategory | "all")[] = [
  "all",
  "sports",
  "f1",
  "crypto",
  "stocks",
  "tech",
  "economics",
  "politics",
  "science",
  "entertainment",
];

type StatusFilter = "all" | "active" | "resolved" | "closing-soon";
type PriceFilter = "all" | "low" | "mid" | "high";
type VolumeFilter = "all" | "high" | "medium" | "low";

interface ActiveFilters {
  status: StatusFilter;
  price: PriceFilter;
  volume: VolumeFilter;
}

function hasActiveFilters(f: ActiveFilters) {
  return f.status !== "all" || f.price !== "all" || f.volume !== "all";
}

const FILTER_LABELS: Record<string, string> = {
  active: "Active",
  resolved: "Resolved",
  "closing-soon": "Closing Soon",
  low: "Low (<30¢)",
  mid: "Mid (30-70¢)",
  high: "High (>70¢)",
  high: "High Volume",
  medium: "Medium Volume",
  low: "Low Volume",
};

export function MarketListing() {
  const { markets, setCurrentView } = useApp();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<MarketCategory | "all">("all");
  const [sortBy, setSortBy] = useState<"volume" | "hot" | "new" | "ending" | "liquidity">("volume");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filters, setFilters] = useState<ActiveFilters>({
    status: "all",
    price: "all",
    volume: "all",
  });

  const updateFilter = <K extends keyof ActiveFilters>(key: K, value: ActiveFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: "all", price: "all", volume: "all" });
    setSearch("");
    setActiveCategory("all");
  };

  const now = new Date();
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  const filtered = useMemo(() => {
    return markets
      .filter((m) => {
        // Status filter
        if (filters.status === "active" && m.status !== "active") return false;
        if (filters.status === "resolved" && m.status !== "resolved") return false;
        if (filters.status === "closing-soon") {
          const resolveDate = new Date(m.resolvesAt);
          if (m.status !== "active" || resolveDate > threeDaysFromNow) return false;
        }
        return true;
      })
      .filter((m) => {
        // Price filter (based on Yes outcome price)
        const yesPrice = m.outcomes[0].currentPrice;
        if (filters.price === "low" && yesPrice >= 0.3) return false;
        if (filters.price === "mid" && (yesPrice < 0.3 || yesPrice >= 0.7)) return false;
        if (filters.price === "high" && yesPrice < 0.7) return false;
        return true;
      })
      .filter((m) => {
        // Volume filter
        if (filters.volume === "high" && m.volume < 300000) return false;
        if (filters.volume === "medium" && (m.volume < 100000 || m.volume >= 300000)) return false;
        if (filters.volume === "low" && m.volume >= 100000) return false;
        return true;
      })
      .filter((m) => activeCategory === "all" || m.category === activeCategory)
      .filter((m) => m.question.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === "hot") return (b.hot ? 1 : 0) - (a.hot ? 1 : 0) || b.volume - a.volume;
        if (sortBy === "new") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === "ending") return new Date(a.resolvesAt).getTime() - new Date(b.resolvesAt).getTime();
        if (sortBy === "liquidity") return b.liquidity - a.liquidity;
        return b.volume - a.volume;
      });
  }, [markets, filters, activeCategory, search, sortBy]);

  const totalActiveFilters =
    (filters.status !== "all" ? 1 : 0) +
    (filters.price !== "all" ? 1 : 0) +
    (filters.volume !== "all" ? 1 : 0) +
    (activeCategory !== "all" ? 1 : 0) +
    (search ? 1 : 0);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0508]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800/50 bg-white/80 dark:bg-[#0a0508]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentView("landing")}>
            <Image
              src="/logo.svg"
              alt="Zap-Oracle"
              width={36}
              height={36}
              unoptimized
              className="rounded-lg drop-shadow-lg shadow-red-500/20"
            />
            <div className="flex items-baseline">
              <span className="font-extrabold text-lg bg-gradient-to-r from-red-500 via-orange-400 to-red-400 bg-clip-text text-transparent dark:from-red-400 dark:via-orange-300 dark:to-red-300" style={{ letterSpacing: "-0.03em" }}>
                Zap
              </span>
              <span className="text-gray-400 dark:text-gray-500 font-light text-lg mx-1">—</span>
              <span className="font-extrabold text-lg bg-gradient-to-r from-orange-400 via-red-400 to-red-500 bg-clip-text text-transparent dark:from-orange-300 dark:via-red-300 dark:to-red-400 italic" style={{ letterSpacing: "-0.03em" }}>
                Oracle
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <ConnectWalletDialog />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Title Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Markets</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {filtered.length} market{filtered.length !== 1 ? "s" : ""} available · Trade with confidence on Starknet
            </p>
          </div>
          <Button
            onClick={() => setCurrentView("create-market")}
            className="bg-red-600 dark:bg-red-500 hover:bg-red-500 dark:hover:bg-red-400 text-white font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Market
          </Button>
        </div>

        {/* Search, Sort & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <Input
              placeholder="Search markets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-gray-50 dark:bg-[#100a0c] border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort buttons */}
          <div className="flex gap-1.5 flex-wrap">
            {([
              { key: "volume" as const, label: "Volume", icon: BarChart3 },
              { key: "hot" as const, label: "Hot", icon: Flame },
              { key: "new" as const, label: "New", icon: Clock },
              { key: "ending" as const, label: "Ending Soon", icon: Clock },
              { key: "liquidity" as const, label: "Liquidity", icon: TrendingUp },
            ]).map((s) => (
              <Button
                key={s.key}
                variant={sortBy === s.key ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy(s.key)}
                className={
                  sortBy === s.key
                    ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
                    : "border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }
              >
                {s.key === "hot" && <s.icon className="w-3.5 h-3.5 mr-1.5" />}
                {s.key !== "hot" && <s.icon className="w-3 h-3 mr-1.5 hidden sm:block" />}
                <span className="text-xs">{s.label}</span>
              </Button>
            ))}

            {/* Filter toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`relative ${
                showFilterPanel || hasActiveFilters(filters)
                  ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30"
                  : "border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" />
              <span className="text-xs">Filters</span>
              {totalActiveFilters > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {totalActiveFilters}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilterPanel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="bg-gray-50 dark:bg-[#100a0c] border border-gray-200 dark:border-gray-800 rounded-xl p-5 mb-4 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-red-400" />
                    Filter Markets
                  </h3>
                  {hasActiveFilters(filters) && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-red-400 hover:text-red-300 font-medium flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      Clear All
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {/* Status Filter */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {([
                        { value: "all" as const, label: "All", icon: null },
                        { value: "active" as const, label: "Active", icon: CheckCircle2 },
                        { value: "resolved" as const, label: "Resolved", icon: CheckCircle2 },
                        { value: "closing-soon" as const, label: "Closing Soon", icon: Clock },
                      ]).map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => updateFilter("status", opt.value)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            filters.status === opt.value
                              ? "bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30"
                              : "bg-white dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                          }`}
                        >
                          {opt.icon && <opt.icon className="w-3 h-3" />}
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Yes Price
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {([
                        { value: "all" as const, label: "All Prices" },
                        { value: "low" as const, label: "Low (<30¢)" },
                        { value: "mid" as const, label: "Mid (30-70¢)" },
                        { value: "high" as const, label: "High (>70¢)" },
                      ]).map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => updateFilter("price", opt.value)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            filters.price === opt.value
                              ? "bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30"
                              : "bg-white dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Volume Filter */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Volume
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {([
                        { value: "all" as const, label: "All Volume" },
                        { value: "high" as const, label: "High (>300K)" },
                        { value: "medium" as const, label: "Mid (100-300K)" },
                        { value: "low" as const, label: "Low (<100K)" },
                      ]).map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => updateFilter("volume", opt.value)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            filters.volume === opt.value
                              ? "bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30"
                              : "bg-white dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Active filter summary */}
                {totalActiveFilters > 0 && (
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-800">
                    <span className="text-xs text-gray-500">Active filters:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeCategory !== "all" && (
                        <Badge variant="outline" className="text-[11px] px-2 py-0.5 border-red-500/30 text-red-400 bg-red-500/5 gap-1">
                          {CATEGORY_INFO[activeCategory]?.icon} {CATEGORY_INFO[activeCategory]?.label}
                          <button onClick={() => setActiveCategory("all")}><X className="w-2.5 h-2.5" /></button>
                        </Badge>
                      )}
                      {search && (
                        <Badge variant="outline" className="text-[11px] px-2 py-0.5 border-red-500/30 text-red-400 bg-red-500/5 gap-1">
                          Search: &quot;{search}&quot;
                          <button onClick={() => setSearch("")}><X className="w-2.5 h-2.5" /></button>
                        </Badge>
                      )}
                      {filters.status !== "all" && (
                        <Badge variant="outline" className="text-[11px] px-2 py-0.5 border-red-500/30 text-red-400 bg-red-500/5 gap-1">
                          {filters.status === "active" ? "Active" : filters.status === "resolved" ? "Resolved" : "Closing Soon"}
                          <button onClick={() => updateFilter("status", "all")}><X className="w-2.5 h-2.5" /></button>
                        </Badge>
                      )}
                      {filters.price !== "all" && (
                        <Badge variant="outline" className="text-[11px] px-2 py-0.5 border-red-500/30 text-red-400 bg-red-500/5 gap-1">
                          {filters.price === "low" ? "Low" : filters.price === "mid" ? "Mid" : "High"} Price
                          <button onClick={() => updateFilter("price", "all")}><X className="w-2.5 h-2.5" /></button>
                        </Badge>
                      )}
                      {filters.volume !== "all" && (
                        <Badge variant="outline" className="text-[11px] px-2 py-0.5 border-red-500/30 text-red-400 bg-red-500/5 gap-1">
                          {filters.volume === "high" ? "High" : filters.volume === "medium" ? "Medium" : "Low"} Volume
                          <button onClick={() => updateFilter("volume", "all")}><X className="w-2.5 h-2.5" /></button>
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            const info = cat === "all" ? { icon: "🌐", label: "All" } : CATEGORY_INFO[cat];
            return (
              <Button
                key={cat}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap ${
                  isActive
                    ? "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30"
                    : "border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <span className="mr-1.5">{info?.icon}</span>
                {info?.label}
              </Button>
            );
          })}
        </div>

        {/* Market Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((market, i) => (
            <MarketCard key={market.id} market={market} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-gray-400 dark:text-gray-500"
          >
            <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No markets found</p>
            <p className="text-sm mt-1 mb-6">Try adjusting your search or filters</p>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              <X className="w-4 h-4 mr-2" />
              Clear All Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
