import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import type {
  PlaceOrderRequest, PlaceMarketOrderRequest, CreateOrderResult,
  CancelResult, CancelReplaceResult,
} from "context-markets";
import type { Hex } from "viem";
import { useContextClient } from "../provider.js";
import { contextKeys } from "../query-keys.js";

export function useCreateOrder(
  options?: Omit<UseMutationOptions<CreateOrderResult, Error, PlaceOrderRequest>, "mutationFn">,
) {
  const client = useContextClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req: PlaceOrderRequest) => client.orders.create(req),
    retry: false,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: contextKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: contextKeys.markets.orderbook(args[1].marketId) });
      queryClient.invalidateQueries({ queryKey: contextKeys.portfolio.all });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

export function useCreateMarketOrder(
  options?: Omit<UseMutationOptions<CreateOrderResult, Error, PlaceMarketOrderRequest>, "mutationFn">,
) {
  const client = useContextClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req: PlaceMarketOrderRequest) => client.orders.createMarket(req),
    retry: false,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: contextKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: contextKeys.markets.orderbook(args[1].marketId) });
      queryClient.invalidateQueries({ queryKey: contextKeys.portfolio.all });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

export function useCancelOrder(
  options?: Omit<UseMutationOptions<CancelResult, Error, Hex>, "mutationFn">,
) {
  const client = useContextClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (nonce: Hex) => client.orders.cancel(nonce),
    retry: false,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: contextKeys.orders.all });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

export function useCancelReplace(
  options?: Omit<UseMutationOptions<CancelReplaceResult, Error, { cancelNonce: Hex; newOrder: PlaceOrderRequest }>, "mutationFn">,
) {
  const client = useContextClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cancelNonce, newOrder }) => client.orders.cancelReplace(cancelNonce, newOrder),
    retry: false,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: contextKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: contextKeys.portfolio.all });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
