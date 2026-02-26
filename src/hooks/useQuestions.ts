import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import type { SubmitQuestionResult, CreateMarketResult } from "@contextwtf/sdk";
import { useContextClient } from "../provider.js";
import { contextKeys } from "../query-keys.js";

export function useSubmitQuestion(
  options?: Omit<UseMutationOptions<SubmitQuestionResult, Error, string>, "mutationFn">,
) {
  const client = useContextClient();
  return useMutation({
    mutationFn: (question: string) => client.questions.submit(question),
    retry: false,
    ...options,
  });
}

export function useCreateMarket(
  options?: Omit<UseMutationOptions<CreateMarketResult, Error, string>, "mutationFn">,
) {
  const client = useContextClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (questionId: string) => client.markets.create(questionId),
    retry: false,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: contextKeys.markets.all });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
