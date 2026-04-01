"use client";

import React, { ReactNode } from "react";
import { StarknetConfig, publicProvider } from "@starknet-react/core";
import { sepolia } from "@starknet-react/chains";
import { argent, braavos, injected } from "@starknet-react/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function StarknetProvider({ children }: { children: ReactNode }) {
  const connectors = [
    argent(),
    braavos(),
    injected({ id: "kbip" }),
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <StarknetConfig
        chains={[sepolia]}
        provider={publicProvider()}
        connectors={connectors}
        autoConnect={false}
      >
        {children}
      </StarknetConfig>
    </QueryClientProvider>
  );
}
