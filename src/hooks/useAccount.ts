import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { WalletStatus } from "@contextwtf/sdk";
import { useContextClient } from "../provider.js";
import { contextKeys } from "../query-keys.js";

export function useAccountStatus(
  options?: Omit<UseQueryOptions<WalletStatus>, "queryKey" | "queryFn">,
) {
  const client = useContextClient();
  return useQuery({
    queryKey: contextKeys.account.status(),
    queryFn: () => client.account.status(),
    ...options,
  });
}
