import {
  useQuery,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AccountStatus, SetupResult, DepositResult } from "context-markets";
import type { Hex } from "viem";
import { useContextClient, useContextState } from "../provider.js";
import { contextKeys } from "../query-keys.js";
import { useContextMutation } from "./useContextMutation.js";

export function useAccountStatus(
  options?: Omit<UseQueryOptions<AccountStatus>, "queryKey" | "queryFn">,
) {
  const client = useContextClient();
  const { address, chain } = useContextState();

  return useQuery({
    queryKey: contextKeys.account.status(address, chain),
    queryFn: () => client.account.status(),
    ...options,
  });
}

export function useAccountSetup(
  options?: Omit<UseMutationOptions<SetupResult, Error, void>, "mutationFn">,
) {
  const { address, chain } = useContextState();

  return useContextMutation({
    mutationFn: (client) => client.account.setup(),
    invalidateKeys: () => [contextKeys.account.status(address, chain)],
    options,
  });
}

export function useDeposit(
  options?: Omit<UseMutationOptions<DepositResult, Error, number>, "mutationFn">,
) {
  const { address, chain } = useContextState();

  return useContextMutation({
    mutationFn: (client, amount: number) => client.account.deposit(amount),
    invalidateKeys: () => [
      contextKeys.account.all(address, chain),
      contextKeys.portfolio.all(address, chain),
    ],
    options,
  });
}

export function useWithdraw(
  options?: Omit<UseMutationOptions<Hex, Error, number>, "mutationFn">,
) {
  const { address, chain } = useContextState();

  return useContextMutation({
    mutationFn: (client, amount: number) => client.account.withdraw(amount),
    invalidateKeys: () => [
      contextKeys.account.all(address, chain),
      contextKeys.portfolio.all(address, chain),
    ],
    options,
  });
}

export function useApproveUsdc(
  options?: Omit<UseMutationOptions<Hex | null, Error, void>, "mutationFn">,
) {
  const { address, chain } = useContextState();

  return useContextMutation({
    mutationFn: (client) => client.account.approveUsdc(),
    invalidateKeys: () => [contextKeys.account.all(address, chain)],
    options,
  });
}

export function useApproveOperator(
  options?: Omit<UseMutationOptions<Hex | null, Error, void>, "mutationFn">,
) {
  const { address, chain } = useContextState();

  return useContextMutation({
    mutationFn: (client) => client.account.approveOperator(),
    invalidateKeys: () => [contextKeys.account.all(address, chain)],
    options,
  });
}
