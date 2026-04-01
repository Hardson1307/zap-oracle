"use client";

import { useConnect, useDisconnect, useAccount, useBalance, useNetwork } from "@starknet-react/core";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Wallet,
  Zap,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Copy,
  PieChart,
  ArrowRightLeft,
  Shield,
  Sparkles,
  ExternalLink,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { STARKZAP_CODE_SNIPPETS } from "./mock-data";
import { motion, AnimatePresence } from "framer-motion";

/* ──────────────────────────────────────────
   Connected wallet button (shown in header)
   ────────────────────────────────────────── */
export function ConnectedWalletButton() {
  const { address, chainId, status } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balanceData } = useBalance({ address, watch: true });
  const { chain } = useNetwork();
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);

  const handleCopy = () => {
    if (address) navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!address) return null;

  const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  const isSepolia = chain?.network === "sepolia" || chainId?.toString(16) === "534e5f5345504f4c4941";
  const formattedBalance = balanceData
    ? `${(Number(balanceData.value) / 1e18).toFixed(4)} ETH`
    : "...";

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="h-10 border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white gap-2 pr-3"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
          <Wallet className="w-3.5 h-3.5 text-red-400" />
        </div>
        <span className="text-sm font-medium hidden sm:inline">{truncatedAddress}</span>
        <Badge className="text-[9px] h-4 px-1.5 bg-red-500/15 text-red-400 border-0 gap-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
          {isSepolia ? "Sepolia" : "Mainnet"}
        </Badge>
        <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
      </Button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-14 z-50 w-72 bg-white dark:bg-[#12121a] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl shadow-black/50 overflow-hidden"
            >
              {/* Address & balance */}
              <div className="p-4 bg-gradient-to-br from-red-500/5 to-transparent">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-full bg-red-500/15 flex items-center justify-center">
                    <Wallet className="w-4.5 h-4.5 text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-gray-900 dark:text-white font-semibold text-sm truncate">Starknet Wallet</div>
                    <div className="text-gray-500 text-xs">Connected via Starkzap</div>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-gray-100 dark:bg-[#0a0a12] rounded-lg p-2.5">
                  <code className="text-xs text-gray-700 dark:text-gray-300 font-mono">{truncatedAddress}</code>
                  <Button variant="ghost" size="sm" className="h-7 px-2 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={handleCopy}>
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-red-400" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
                  </Button>
                </div>
              </div>

              <Separator className="bg-gray-800" />

              {/* Balance */}
              <div className="p-4 space-y-1">
                <div className="text-xs text-gray-500">Balance</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">{formattedBalance}</div>
                <div className="text-[10px] text-gray-500 dark:text-gray-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  {isSepolia ? "Starknet Sepolia Testnet" : "Starknet Mainnet"}
                </div>
              </div>

              <Separator className="bg-gray-800" />

              {/* Quick actions */}
              <div className="p-2">
                {[
                  { label: "View on Explorer", icon: ExternalLink, action: () => {
                    if (address) window.open(`https://sepolia.starkscan.co/address/${address}`, "_blank");
                    setMenuOpen(false);
                  }},
                  { label: "Disconnect", icon: X, action: () => {
                    setShowDisconnectConfirm(true);
                    setMenuOpen(false);
                  }, danger: true },
                ].map((item) => (
                  <Button
                    key={item.label}
                    variant="ghost"
                    className={`w-full justify-start h-10 gap-3 px-4 ${item.danger ? "text-red-400 hover:text-red-300 hover:bg-red-500/5" : "text-gray-400 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-100 dark:bg-gray-800/50"}`}
                    onClick={item.action}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                ))}
              </div>

              <div className="p-3 mx-2 mb-2 rounded-lg bg-gray-100 dark:bg-[#0a0a12]">
                <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                  <Zap className="w-3 h-3 text-red-400" />
                  Powered by @starknet-react/core on real Starknet
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Disconnect confirmation dialog */}
      <Dialog open={showDisconnectConfirm} onOpenChange={setShowDisconnectConfirm}>
        <DialogContent className="sm:max-w-sm bg-white dark:bg-[#12121a] border-gray-200 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Disconnect Wallet</DialogTitle>
            <DialogDescription className="text-gray-400">Are you sure you want to disconnect from Starknet?</DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-2">
            <Button variant="outline" className="flex-1 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300" onClick={() => setShowDisconnectConfirm(false)}>
              Cancel
            </Button>
            <Button className="flex-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 border-0" onClick={() => { disconnect(); setShowDisconnectConfirm(false); }}>
              Disconnect
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ──────────────────────────────────────────
   Connect wallet dialog (shown when disconnected)
   ────────────────────────────────────────── */
export function ConnectWalletDialog() {
  const { connect, connectors, error, isPending: isConnecting } = useConnect();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [open, setOpen] = useState(false);

  if (address) return <ConnectedWalletButton />;

  const handleConnect = async (connectorId: string) => {
    try {
      const connector = connectors.find((c) => c.id === connectorId);
      if (connector) {
        await connect({ connector });
      }
    } catch {
      // Connection failed — user may have rejected or no wallet installed
    }
  };

  const walletOptions = connectors.map((c) => {
    const info = getConnectorInfo(c.id, c.name);
    return { id: c.id, ...info };
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-red-600 dark:bg-red-500 hover:bg-red-500 dark:hover:bg-red-400 text-white font-bold shadow-lg shadow-red-600/20 dark:shadow-red-500/20 h-10 gap-2">
          <Wallet className="w-4 h-4" />
          <span className="hidden sm:inline">Connect Wallet</span>
          <span className="sm:hidden">Connect</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[420px] bg-white dark:bg-[#12121a] border-gray-200 dark:border-gray-800 p-0 gap-0 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500" />
        <div className="p-6">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-red-400" />
              </div>
              <DialogTitle className="text-gray-900 dark:text-white text-xl">Connect Wallet</DialogTitle>
            </div>
            <DialogDescription className="text-gray-500 dark:text-gray-400 text-sm">
              Connect your Starknet wallet to trade on Zap-Oracle. Supports Argent X, Braavos, and other injected wallets.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {isConnecting && (
              <div className="flex items-center gap-2 p-3 bg-red-500/5 border border-red-500/20 rounded-lg mb-2">
                <Loader2 className="w-4 h-4 text-red-400 animate-spin" />
                <span className="text-sm text-red-400">Waiting for wallet confirmation...</span>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-500/5 border border-red-500/20 rounded-lg mb-2">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-red-400 font-medium">Connection failed</p>
                  <p className="text-xs text-red-400/70 mt-0.5">
                    {error.message.includes("rejected")
                      ? "Request was rejected. Please try again."
                      : "Make sure your wallet extension is installed and unlocked."}
                  </p>
                </div>
              </div>
            )}

            {walletOptions.map((wallet) => (
              <Button
                key={wallet.id}
                variant="outline"
                className={`w-full justify-start h-14 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800/80 text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:text-white gap-3 rounded-xl transition-all hover:border-gray-600 ${wallet.accent}`}
                onClick={() => handleConnect(wallet.id)}
                disabled={isConnecting}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${wallet.iconBg}`}>
                  <span className="text-lg">{wallet.icon}</span>
                </div>
                <div className="text-left">
                  <div className="font-medium">{wallet.label}</div>
                  <div className="text-xs text-gray-500">{wallet.subtitle}</div>
                </div>
                <ArrowRight className="w-4 h-4 ml-auto text-gray-500 dark:text-gray-600" />
              </Button>
            ))}

            {walletOptions.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <Wallet className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">No wallets detected</p>
                <p className="text-xs mt-1 mb-4">Install Argent X or Braavos browser extension</p>
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs border-gray-300 dark:border-gray-700 text-gray-400"
                    onClick={() => window.open("https://www.argent.xyz/", "_blank")}
                  >
                    Install Argent X
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs border-gray-300 dark:border-gray-700 text-gray-400"
                    onClick={() => window.open("https://braavos.app/", "_blank")}
                  >
                    Install Braavos
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-[#0a0a12] px-6 py-4">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="text-[10px] h-5 border-gray-300 dark:border-gray-700 text-gray-400 gap-1 px-2">
              <Shield className="w-2.5 h-2.5 text-red-400" />
              {chain?.network === "sepolia" ? "Sepolia Testnet" : "Starknet"}
            </Badge>
            <Badge variant="outline" className="text-[10px] h-5 border-gray-300 dark:border-gray-700 text-gray-400 gap-1 px-2">
              <Zap className="w-2.5 h-2.5 text-orange-400" />
              Real Chain
            </Badge>
          </div>
          <div className="rounded-lg bg-gray-100 dark:bg-[#07070d] border border-gray-200 dark:border-gray-800/50 p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-gray-500 dark:text-gray-600 font-mono">@starknet-react/core</span>
            </div>
            <pre className="text-[10px] text-green-300/60 font-mono leading-relaxed">
{`import { StarknetConfig, publicProvider } from "@starknet-react/core";
import { sepolia } from "@starknet-react/chains";
import { argent, braavos } from "@starknet-react/core";

<StarknetConfig
  chains={[sepolia]}
  provider={publicProvider()}
  connectors={[argent(), braavos()]}
>
  <App />
</StarknetConfig>`}
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getConnectorInfo(id: string, name: string): {
  label: string;
  subtitle: string;
  icon: string;
  accent: string;
  iconBg: string;
} {
  switch (id) {
    case "argent":
      return {
        label: "Argent X",
        subtitle: "Popular Starknet wallet",
        icon: "🔷",
        accent: "bg-blue-500/10 border-blue-500/20",
        iconBg: "bg-blue-500/10",
      };
    case "braavos":
      return {
        label: "Braavos",
        subtitle: "Smart wallet for Starknet",
        icon: "🟣",
        accent: "bg-purple-500/10 border-purple-500/20",
        iconBg: "bg-purple-500/10",
      };
    default:
      return {
        label: name || "Wallet",
        subtitle: "Starknet wallet",
        icon: "💼",
        accent: "bg-gray-500/10 border-gray-500/20",
        iconBg: "bg-gray-500/10",
      };
  }
}
