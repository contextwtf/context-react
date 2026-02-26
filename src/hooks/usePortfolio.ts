import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type {
  Portfolio,
  Balance,
  ClaimableResponse,
  PortfolioStats,
  GetPortfolioParams,
} from "@contextwtf/sdk";
import type { Address } from "viem";
import { useContextClient } from "../provider.js";
import { contextKeys } from "../query-keys.js";

export function usePortfolio(
  address?: Address,
  params?: GetPortfolioParams,
  options?: Omit<UseQueryOptions<Portfolio>, "queryKey" | "queryFn">,
) {
  const client = useContextClient();
  return useQuery({
    queryKey: contextKeys.portfolio.get(address, params as Record<string, unknown>),
    queryFn: () => client.portfolio.get(address, params),
    ...options,
  });
}

export function useBalance(
  address?: Address,
  options?: Omit<UseQueryOptions<Balance>, "queryKey" | "queryFn">,
) {
  const client = useContextClient();
  return useQuery({
    queryKey: contextKeys.portfolio.balance(address),
    queryFn: () => client.portfolio.balance(address),
    ...options,
  });
}

export function useClaimable(
  address?: Address,
  options?: Omit<UseQueryOptions<ClaimableResponse>, "queryKey" | "queryFn">,
) {
  const client = useContextClient();
  return useQuery({
    queryKey: contextKeys.portfolio.claimable(address),
    queryFn: () => client.portfolio.claimable(address),
    ...options,
  });
}

export function usePortfolioStats(
  address?: Address,
  options?: Omit<UseQueryOptions<PortfolioStats>, "queryKey" | "queryFn">,
) {
  const client = useContextClient();
  return useQuery({
    queryKey: contextKeys.portfolio.stats(address),
    queryFn: () => client.portfolio.stats(address),
    ...options,
  });
}
