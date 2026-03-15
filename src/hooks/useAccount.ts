import {
  useQuery, useMutation, useQueryClient,
  type UseQueryOptions, type UseMutationOptions,
} from "@tanstack/react-query";
import type { AccountStatus, SetupResult, DepositResult } from "context-markets";
import type { Hex } from "viem";
import { useContextClient } from "../provider.js";
import { contextKeys } from "../query-keys.js";

export function useAccountStatus(
  options?: Omit<UseQueryOptions<AccountStatus>, "queryKey" | "queryFn">,
) {
  const client = useContextClient();
  return useQuery({
    queryKey: contextKeys.account.status(),
    queryFn: () => client.account.status(),
    ...options,
  });
}

export function useAccountSetup(
  options?: Omit<UseMutationOptions<SetupResult, Error, void>, "mutationFn">,
) {
  const client = useContextClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => client.account.setup(),
    retry: false,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: contextKeys.account.all });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

export function useDeposit(
  options?: Omit<UseMutationOptions<DepositResult, Error, number>, "mutationFn">,
) {
  const client = useContextClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (amount: number) => client.account.deposit(amount),
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

export function useApproveUsdc(
  options?: Omit<UseMutationOptions<Hex | null, Error, void>, "mutationFn">,
) {
  const client = useContextClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => client.account.approveUsdc(),
    retry: false,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: contextKeys.account.all });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

export function useApproveOperator(
  options?: Omit<UseMutationOptions<Hex | null, Error, void>, "mutationFn">,
) {
  const client = useContextClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => client.account.approveOperator(),
    retry: false,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: contextKeys.account.all });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
