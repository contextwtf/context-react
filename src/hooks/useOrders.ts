import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { OrderList, Order, GetOrdersParams } from "context-markets";
import { useContextClient, useContextState } from "../provider.js";
import { contextKeys } from "../query-keys.js";

export function useOrders(
  params?: GetOrdersParams,
  options?: Omit<UseQueryOptions<OrderList>, "queryKey" | "queryFn">,
) {
  const client = useContextClient();
  const { address, chain } = useContextState();

  return useQuery({
    queryKey: contextKeys.orders.list(
      address,
      chain,
      params as Record<string, unknown> | undefined,
    ),
    queryFn: () => client.orders.list(params),
    ...options,
  });
}

export function useOrder(
  orderId: string,
  options?: Omit<UseQueryOptions<Order>, "queryKey" | "queryFn">,
) {
  const client = useContextClient();
  const { address, chain } = useContextState();

  return useQuery({
    queryKey: contextKeys.orders.get(address, chain, orderId),
    queryFn: () => client.orders.get(orderId),
    enabled: !!orderId,
    ...options,
  });
}
