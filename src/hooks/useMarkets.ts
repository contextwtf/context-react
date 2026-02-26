import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type {
  MarketList, Market, Orderbook, Quotes, PriceHistory,
  ActivityResponse, SimulateResult, SearchMarketsParams,
  GetOrderbookParams, GetPriceHistoryParams, GetActivityParams,
  SimulateTradeParams,
} from "@contextwtf/sdk";
import { useContextClient } from "../provider.js";
import { contextKeys } from "../query-keys.js";

export function useMarkets(
  params?: SearchMarketsParams,
  options?: Omit<UseQueryOptions<MarketList>, "queryKey" | "queryFn">,
) {
  const client = useContextClient();
  return useQuery({
    queryKey: contextKeys.markets.list(params as Record<string, unknown>),
    queryFn: () => client.markets.list(params),
    ...options,
  });
}

export function useMarket(
  marketId: string,
  options?: Omit<UseQueryOptions<Market>, "queryKey" | "queryFn">,
) {
  const client = useContextClient();
  return useQuery({
    queryKey: contextKeys.markets.get(marketId),
    queryFn: () => client.markets.get(marketId),
    enabled: !!marketId,
    ...options,
  });
}

export function useOrderbook(
  marketId: string,
  params?: GetOrderbookParams,
  options?: Omit<UseQueryOptions<Orderbook>, "queryKey" | "queryFn">,
) {
  const client = useContextClient();
  return useQuery({
    queryKey: contextKeys.markets.orderbook(marketId, params as Record<string, unknown>),
    queryFn: () => client.markets.orderbook(marketId, params),
    enabled: !!marketId,
    ...options,
  });
}

export function useQuotes(
  marketId: string,
  options?: Omit<UseQueryOptions<Quotes>, "queryKey" | "queryFn">,
) {
  const client = useContextClient();
  return useQuery({
    queryKey: contextKeys.markets.quotes(marketId),
    queryFn: () => client.markets.quotes(marketId),
    enabled: !!marketId,
    ...options,
  });
}

export function usePriceHistory(
  marketId: string,
  params?: GetPriceHistoryParams,
  options?: Omit<UseQueryOptions<PriceHistory>, "queryKey" | "queryFn">,
) {
  const client = useContextClient();
  return useQuery({
    queryKey: contextKeys.markets.priceHistory(marketId, params as Record<string, unknown>),
    queryFn: () => client.markets.priceHistory(marketId, params),
    enabled: !!marketId,
    ...options,
  });
}

export function useMarketActivity(
  marketId: string,
  params?: GetActivityParams,
  options?: Omit<UseQueryOptions<ActivityResponse>, "queryKey" | "queryFn">,
) {
  const client = useContextClient();
  return useQuery({
    queryKey: contextKeys.markets.activity(marketId, params as Record<string, unknown>),
    queryFn: () => client.markets.activity(marketId, params),
    enabled: !!marketId,
    ...options,
  });
}

export function useSimulateTrade(
  marketId: string,
  params: SimulateTradeParams,
  options?: Omit<UseQueryOptions<SimulateResult>, "queryKey" | "queryFn">,
) {
  const client = useContextClient();
  return useQuery({
    queryKey: contextKeys.markets.simulate({ marketId, ...params }),
    queryFn: () => client.markets.simulate(marketId, params),
    enabled: !!marketId,
    ...options,
  });
}

export function useOracle(
  marketId: string,
  options?: Omit<UseQueryOptions<any>, "queryKey" | "queryFn">,
) {
  const client = useContextClient();
  return useQuery({
    queryKey: contextKeys.markets.oracle(marketId),
    queryFn: () => client.markets.oracle(marketId),
    enabled: !!marketId,
    ...options,
  });
}
