import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { OrderList, Order, GetOrdersParams } from "context-markets";
import { useContextClient } from "../provider.js";
import { contextKeys } from "../query-keys.js";

export function useOrders(
  params?: GetOrdersParams,
  options?: Omit<UseQueryOptions<OrderList>, "queryKey" | "queryFn">,
) {
  const client = useContextClient();
  return useQuery({
    queryKey: contextKeys.orders.list(params as Record<string, unknown>),
    queryFn: () => client.orders.list(params),
    ...options,
  });
}

export function useOrder(
  orderId: string,
  options?: Omit<UseQueryOptions<Order>, "queryKey" | "queryFn">,
) {
  const client = useContextClient();
  return useQuery({
    queryKey: contextKeys.orders.get(orderId),
    queryFn: () => client.orders.get(orderId),
    enabled: !!orderId,
    ...options,
  });
}
