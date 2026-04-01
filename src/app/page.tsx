"use client";

import { AppProvider, useApp } from "@/components/zappredict/app-context";
import { LandingHero } from "@/components/zappredict/landing-hero";
import { MarketListing } from "@/components/zappredict/market-listing";
import { MarketDetail } from "@/components/zappredict/market-detail";
import { PortfolioView } from "@/components/zappredict/portfolio-view";
import { CreateMarketView } from "@/components/zappredict/create-market-view";
import { SwapView } from "@/components/zappredict/swap-view";
import { BridgeView } from "@/components/zappredict/bridge-view";
import { AnimatePresence, motion } from "framer-motion";

function AppContent() {
  const { currentView } = useApp();

  return (
    <AnimatePresence mode="wait">
      {currentView === "landing" && (
        <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <LandingHero />
        </motion.div>
      )}
      {currentView === "markets" && (
        <motion.div key="markets" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <MarketListing />
        </motion.div>
      )}
      {currentView === "market-detail" && (
        <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <MarketDetail />
        </motion.div>
      )}
      {currentView === "portfolio" && (
        <motion.div key="portfolio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <PortfolioView />
        </motion.div>
      )}
      {currentView === "create-market" && (
        <motion.div key="create" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <CreateMarketView />
        </motion.div>
      )}
      {currentView === "swap" && (
        <motion.div key="swap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <SwapView />
        </motion.div>
      )}
      {currentView === "bridge" && (
        <motion.div key="bridge" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <BridgeView />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Page() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
