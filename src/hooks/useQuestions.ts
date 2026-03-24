import { type UseMutationOptions } from "@tanstack/react-query";
import type { SubmitQuestionResult, CreateMarketResult, QuestionSubmission, SubmitAndWaitOptions, AgentSubmitMarketDraft } from "context-markets";
import { contextKeys } from "../query-keys.js";
import { useContextMutation } from "./useContextMutation.js";

export function useSubmitQuestion(
  options?: Omit<UseMutationOptions<SubmitQuestionResult, Error, string>, "mutationFn">,
) {
  return useContextMutation({
    mutationFn: (client, question: string) => client.questions.submit(question),
    invalidateKeys: () => [],
    options,
  });
}

interface SubmitAndWaitInput {
  question: string;
  options?: SubmitAndWaitOptions;
}

export function useSubmitAndWait(
  options?: Omit<UseMutationOptions<QuestionSubmission, Error, SubmitAndWaitInput>, "mutationFn">,
) {
  return useContextMutation({
    mutationFn: (client, input: SubmitAndWaitInput) =>
      client.questions.submitAndWait(input.question, input.options),
    invalidateKeys: () => [contextKeys.markets.all],
    options,
  });
}

export function useCreateMarket(
  options?: Omit<UseMutationOptions<CreateMarketResult, Error, string>, "mutationFn">,
) {
  return useContextMutation({
    mutationFn: (client, questionId: string) => client.markets.create(questionId),
    invalidateKeys: () => [contextKeys.markets.all],
    options,
  });
}

export function useAgentSubmit(
  options?: Omit<UseMutationOptions<SubmitQuestionResult, Error, AgentSubmitMarketDraft>, "mutationFn">,
) {
  return useContextMutation({
    mutationFn: (client, draft: AgentSubmitMarketDraft) =>
      client.questions.agentSubmit(draft),
    invalidateKeys: () => [],
    options,
  });
}

interface AgentSubmitAndWaitInput {
  draft: AgentSubmitMarketDraft;
  options?: SubmitAndWaitOptions;
}

export function useAgentSubmitAndWait(
  options?: Omit<UseMutationOptions<QuestionSubmission, Error, AgentSubmitAndWaitInput>, "mutationFn">,
) {
  return useContextMutation({
    mutationFn: (client, input: AgentSubmitAndWaitInput) =>
      client.questions.agentSubmitAndWait(input.draft, input.options),
    invalidateKeys: () => [contextKeys.markets.all],
    options,
  });
}
