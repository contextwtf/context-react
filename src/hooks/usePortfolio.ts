import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type {
  Portfolio,
  Balance,
  ClaimableResponse,
  PortfolioStats,
  GetPortfolioParams,
  PositionList,
  GetPositionsParams,
} from "context-markets";
import type { Address } from "viem";
import { useContextClient, useContextState } from "../provider.js";
import { contextKeys } from "../query-keys.js";

export function usePortfolio(
  address?: Address,
  params?: GetPortfolioParams,
  options?: Omit<UseQueryOptions<Portfolio>, "queryKey" | "queryFn">,
) {
  const client = useContextClient();
  const { address: connectedAddress, chain } = useContextState();
  const scopedAddress = address ?? connectedAddress;

  return useQuery({
    queryKey: contextKeys.portfolio.get(
      scopedAddress,
      chain,
      params as Record<string, unknown> | undefined,
    ),
    queryFn: () => client.portfolio.get(scopedAddress ?? undefined, params),
    ...options,
  });
}

export function useBalance(
  address?: Address,
  options?: Omit<UseQueryOptions<Balance>, "queryKey" | "queryFn">,
) {
  const client = useContextClient();
  const { address: connectedAddress, chain } = useContextState();
  const scopedAddress = address ?? connectedAddress;

  return useQuery({
    queryKey: contextKeys.portfolio.balance(scopedAddress, chain),
    queryFn: () => client.portfolio.balance(scopedAddress ?? undefined),
    ...options,
  });
}

export function useClaimable(
  address?: Address,
  options?: Omit<UseQueryOptions<ClaimableResponse>, "queryKey" | "queryFn">,
) {
  const client = useContextClient();
  const { address: connectedAddress, chain } = useContextState();
  const scopedAddress = address ?? connectedAddress;

  return useQuery({
    queryKey: contextKeys.portfolio.claimable(scopedAddress, chain),
    queryFn: () => client.portfolio.claimable(scopedAddress ?? undefined),
    ...options,
  });
}

export function usePortfolioStats(
  address?: Address,
  options?: Omit<UseQueryOptions<PortfolioStats>, "queryKey" | "queryFn">,
) {
  const client = useContextClient();
  const { address: connectedAddress, chain } = useContextState();
  const scopedAddress = address ?? connectedAddress;

  return useQuery({
    queryKey: contextKeys.portfolio.stats(scopedAddress, chain),
    queryFn: () => client.portfolio.stats(scopedAddress ?? undefined),
    ...options,
  });
}

export function usePositions(
  address?: Address,
  params?: GetPositionsParams,
  options?: Omit<UseQueryOptions<PositionList>, "queryKey" | "queryFn">,
) {
  const client = useContextClient();
  const { address: connectedAddress, chain } = useContextState();
  const scopedAddress = address ?? connectedAddress;

  return useQuery({
    queryKey: contextKeys.portfolio.positions(
      scopedAddress,
      chain,
      params as Record<string, unknown> | undefined,
    ),
    queryFn: () => client.portfolio.positions(scopedAddress ?? undefined, params),
    ...options,
  });
}
