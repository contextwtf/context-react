import { type UseMutationOptions } from "@tanstack/react-query";
import type {
  PlaceOrderRequest, PlaceMarketOrderRequest, CreateOrderResult,
  CancelResult, CancelReplaceResult,
} from "context-markets";
import type { Hex } from "viem";
import { useContextState } from "../provider.js";
import { contextKeys } from "../query-keys.js";
import { useContextMutation } from "./useContextMutation.js";

export function useCreateOrder(
  options?: Omit<UseMutationOptions<CreateOrderResult, Error, PlaceOrderRequest>, "mutationFn">,
) {
  const { address, chain } = useContextState();

  return useContextMutation({
    mutationFn: (client, req: PlaceOrderRequest) => client.orders.create(req),
    invalidateKeys: (_, req) => [
      contextKeys.orders.all(address, chain),
      contextKeys.markets.orderbook(req.marketId),
      contextKeys.portfolio.all(address, chain),
    ],
    options,
  });
}

export function useCreateMarketOrder(
  options?: Omit<UseMutationOptions<CreateOrderResult, Error, PlaceMarketOrderRequest>, "mutationFn">,
) {
  const { address, chain } = useContextState();

  return useContextMutation({
    mutationFn: (client, req: PlaceMarketOrderRequest) =>
      client.orders.createMarket(req),
    invalidateKeys: (_, req) => [
      contextKeys.orders.all(address, chain),
      contextKeys.markets.orderbook(req.marketId),
      contextKeys.portfolio.all(address, chain),
    ],
    options,
  });
}

export function useCancelOrder(
  options?: Omit<UseMutationOptions<CancelResult, Error, Hex>, "mutationFn">,
) {
  const { address, chain } = useContextState();

  return useContextMutation({
    mutationFn: (client, nonce: Hex) => client.orders.cancel(nonce),
    invalidateKeys: () => [
      contextKeys.orders.all(address, chain),
      contextKeys.markets.all,
    ],
    options,
  });
}

export function useCancelReplace(
  options?: Omit<UseMutationOptions<CancelReplaceResult, Error, { cancelNonce: Hex; newOrder: PlaceOrderRequest }>, "mutationFn">,
) {
  const { address, chain } = useContextState();

  return useContextMutation({
    mutationFn: (client, { cancelNonce, newOrder }) =>
      client.orders.cancelReplace(cancelNonce, newOrder),
    invalidateKeys: (_, { newOrder }) => [
      contextKeys.orders.all(address, chain),
      contextKeys.markets.orderbook(newOrder.marketId),
      contextKeys.portfolio.all(address, chain),
    ],
    options,
  });
}
