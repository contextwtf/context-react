import {
  useMutation,
  useQueryClient,
  type QueryKey,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { useContextClient } from "../provider.js";

interface ContextMutationOptions<TData, TVariables> {
  mutationFn: (
    client: ReturnType<typeof useContextClient>,
    variables: TVariables,
  ) => Promise<TData>;
  invalidateKeys: (data: TData, variables: TVariables) => QueryKey[];
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, "mutationFn">;
}

export function useContextMutation<TData, TVariables = void>({
  mutationFn,
  invalidateKeys,
  options,
}: ContextMutationOptions<TData, TVariables>) {
  const client = useContextClient();
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};

  return useMutation({
    mutationFn: (variables: TVariables) => mutationFn(client, variables),
    retry: false,
    ...rest,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await Promise.all(
        invalidateKeys(data, variables).map((queryKey) =>
          queryClient.invalidateQueries({ queryKey }),
        ),
      );
      await onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
