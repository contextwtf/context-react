import {
  useQuery, useMutation, useQueryClient,
  type UseQueryOptions, type UseMutationOptions,
} from "@tanstack/react-query";
import type { WalletStatus, WalletSetupResult, GaslessOperatorResult, GaslessDepositResult } from "@contextwtf/sdk";
import type { Hex } from "viem";
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

export function useAccountSetup(
  options?: Omit<UseMutationOptions<GaslessOperatorResult | WalletSetupResult, Error, void>, "mutationFn">,
) {
  const client = useContextClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      try {
        return await client.account.gaslessSetup();
      } catch {
        return await client.account.setup();
      }
    },
    retry: false,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: contextKeys.account.all });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

export function useDeposit(
  options?: Omit<UseMutationOptions<GaslessDepositResult | Hex, Error, number>, "mutationFn">,
) {
  const client = useContextClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (amount: number) => {
      try {
        return await client.account.gaslessDeposit(amount);
      } catch {
        return await client.account.deposit(amount);
      }
    },
    retry: false,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: contextKeys.account.all });
      queryClient.invalidateQueries({ queryKey: contextKeys.portfolio.all });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

export function useWithdraw(
  options?: Omit<UseMutationOptions<Hex, Error, number>, "mutationFn">,
) {
  const client = useContextClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (amount: number) => client.account.withdraw(amount),
    retry: false,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: contextKeys.account.all });
      queryClient.invalidateQueries({ queryKey: contextKeys.portfolio.all });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
