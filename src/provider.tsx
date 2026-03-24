import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import {
  ContextClient,
  type ChainOption,
  type SignerInput,
} from "context-markets";
import type { Address } from "viem";
import { useWalletClient, useAccount } from "wagmi";

interface ContextProviderProps {
  apiKey: string;
  chain?: ChainOption;
  rpcUrl?: string;
  baseUrl?: string;
  children: ReactNode;
}

interface ContextValue {
  client: ContextClient;
  address: Address | null;
  chain: ChainOption;
}

const ContextClientContext = createContext<ContextValue | null>(null);

export function ContextProvider({
  apiKey,
  chain,
  rpcUrl,
  baseUrl,
  children,
}: ContextProviderProps) {
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const resolvedChain = chain ?? "mainnet";

  const client = useMemo(() => {
    const signer = walletClient
      ? ({
          walletClient: walletClient as unknown as SignerInput extends {
            walletClient: infer TWalletClient;
          }
            ? TWalletClient
            : never,
        } satisfies SignerInput)
      : undefined;

    return new ContextClient({
      apiKey,
      chain: resolvedChain,
      rpcUrl,
      baseUrl,
      ...(signer ? { signer } : {}),
    });
  }, [apiKey, resolvedChain, rpcUrl, baseUrl, walletClient]);

  const contextValue = useMemo(
    () => ({
      client,
      address: address ?? null,
      chain: resolvedChain,
    }),
    [client, address, resolvedChain],
  );

  return (
    <ContextClientContext.Provider value={contextValue}>
      {children}
    </ContextClientContext.Provider>
  );
}

export function useContextState(): ContextValue {
  const context = useContext(ContextClientContext);
  if (!context) {
    throw new Error(
      "useContextClient must be used within a <ContextProvider>",
    );
  }
  return context;
}

export function useContextClient(): ContextClient {
  return useContextState().client;
}
