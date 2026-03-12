import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import type { SubmitQuestionResult, CreateMarketResult, QuestionSubmission, SubmitAndWaitOptions, AgentSubmitMarketDraft } from "context-markets";
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

interface SubmitAndWaitInput {
  question: string;
  options?: SubmitAndWaitOptions;
}

export function useSubmitAndWait(
  options?: Omit<UseMutationOptions<QuestionSubmission, Error, SubmitAndWaitInput>, "mutationFn">,
) {
  const client = useContextClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SubmitAndWaitInput) =>
      client.questions.submitAndWait(input.question, input.options),
    retry: false,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: contextKeys.markets.all });
      options?.onSuccess?.(...args);
    },
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

export function useAgentSubmit(
  options?: Omit<UseMutationOptions<SubmitQuestionResult, Error, AgentSubmitMarketDraft>, "mutationFn">,
) {
  const client = useContextClient();
  return useMutation({
    mutationFn: (draft: AgentSubmitMarketDraft) => client.questions.agentSubmit(draft),
    retry: false,
    ...options,
  });
}

interface AgentSubmitAndWaitInput {
  draft: AgentSubmitMarketDraft;
  options?: SubmitAndWaitOptions;
}

export function useAgentSubmitAndWait(
  options?: Omit<UseMutationOptions<QuestionSubmission, Error, AgentSubmitAndWaitInput>, "mutationFn">,
) {
  const client = useContextClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AgentSubmitAndWaitInput) =>
      client.questions.agentSubmitAndWait(input.draft, input.options),
    retry: false,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: contextKeys.markets.all });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
