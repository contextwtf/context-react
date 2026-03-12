import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { ContextClient, type ChainOption } from "context-markets";
import { useWalletClient, useAccount } from "wagmi";

interface ContextProviderProps {
  apiKey: string;
  chain?: ChainOption;
  rpcUrl?: string;
  baseUrl?: string;
  children: ReactNode;
}

const ContextClientContext = createContext<ContextClient | null>(null);

export function ContextProvider({
  apiKey,
  chain,
  rpcUrl,
  baseUrl,
  children,
}: ContextProviderProps) {
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();

  const client = useMemo(() => {
    return new ContextClient({
      apiKey,
      chain,
      rpcUrl,
      baseUrl,
      ...(walletClient ? { signer: { walletClient: walletClient as any } } : {}),
    });
  }, [apiKey, chain, rpcUrl, baseUrl, walletClient, address]);

  return (
    <ContextClientContext.Provider value={client}>
      {children}
    </ContextClientContext.Provider>
  );
}

export function useContextClient(): ContextClient {
  const client = useContext(ContextClientContext);
  if (!client) {
    throw new Error(
      "useContextClient must be used within a <ContextProvider>",
    );
  }
  return client;
}
