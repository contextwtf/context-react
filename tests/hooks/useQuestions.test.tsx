import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ContextProvider } from "../../src/provider.js";
import { useSubmitQuestion, useCreateMarket } from "../../src/hooks/useQuestions.js";

const mockQuestions = {
  submit: vi.fn().mockResolvedValue({ submissionId: "s1", status: "pending" }),
};

const mockMarkets = {
  create: vi.fn().mockResolvedValue({ marketId: "m1", txHash: "0x1" }),
};

vi.mock("wagmi", () => ({
  useWalletClient: vi.fn(() => ({ data: undefined })),
  useAccount: vi.fn(() => ({ address: undefined })),
}));

vi.mock("@contextwtf/sdk", () => ({
  ContextClient: vi.fn().mockImplementation(() => ({
    markets: mockMarkets, orders: {}, portfolio: {}, questions: mockQuestions, account: {}, address: null,
  })),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient },
      createElement(ContextProvider, { apiKey: "test" }, children));
  };
}

describe("useSubmitQuestion", () => {
  beforeEach(() => vi.clearAllMocks());
  it("submits a question", async () => {
    const { result } = renderHook(() => useSubmitQuestion(), { wrapper: createWrapper() });
    await act(() => result.current.mutateAsync("Will it rain?"));
    expect(mockQuestions.submit).toHaveBeenCalledWith("Will it rain?");
  });
});

describe("useCreateMarket", () => {
  beforeEach(() => vi.clearAllMocks());
  it("creates a market from a question ID", async () => {
    const { result } = renderHook(() => useCreateMarket(), { wrapper: createWrapper() });
    await act(() => result.current.mutateAsync("q1"));
    expect(mockMarkets.create).toHaveBeenCalledWith("q1");
  });
});
