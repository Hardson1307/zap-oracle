import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { StarknetProvider } from "@/components/zappredict/starknet-provider";
import { OracleWidget } from "@/components/zappredict/oracle-widget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zap-Oracle — Prediction Markets on Starknet",
  icons: {
    icon: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
  description:
    "The first Polymarket-style prediction market on Starknet. Trade on real-world events with gasless transactions and instant settlements.",
  keywords: [
    "Zap-Oracle",
    "prediction market",
    "Polymarket",
    "Starknet",
    "Starkzap",
    "crypto",
    "gasless",
    "blockchain",
  ],
  openGraph: {
    title: "Zap-Oracle — Prediction Markets on Starknet",
    description: "Trade the future. Gasless. Onchain. Powered by Starkzap.",
    type: "website",
    images: ["/icon.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zap-Oracle — Prediction Markets on Starknet",
    description: "Trade the future. Gasless. Onchain. Powered by Starkzap.",
    images: ["/icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0508] dark:bg-[#0a0508] text-gray-900 dark:text-white`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <StarknetProvider>
            {children}
            <OracleWidget />
          </StarknetProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
