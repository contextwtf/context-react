import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ContextProvider } from "../../src/provider.js";
import { usePortfolio, useBalance, useClaimable, usePortfolioStats } from "../../src/hooks/usePortfolio.js";

const mockPortfolio = {
  get: vi.fn().mockResolvedValue({ portfolio: [], marketIds: [], cursor: null }),
  balance: vi.fn().mockResolvedValue({ address: "0x1", usdc: {} }),
  claimable: vi.fn().mockResolvedValue({ positions: [], totalClaimable: "0" }),
  stats: vi.fn().mockResolvedValue({ currentPortfolioValue: "100" }),
};

vi.mock("wagmi", () => ({
  useWalletClient: vi.fn(() => ({ data: undefined })),
  useAccount: vi.fn(() => ({ address: undefined })),
}));

vi.mock("@contextwtf/sdk", () => ({
  ContextClient: vi.fn().mockImplementation(() => ({
    markets: {}, orders: {}, portfolio: mockPortfolio, questions: {}, account: {}, address: null,
  })),
}));

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient },
      createElement(ContextProvider, { apiKey: "test" }, children));
  };
}

describe("usePortfolio", () => {
  beforeEach(() => vi.clearAllMocks());
  it("fetches portfolio", async () => {
    const { result } = renderHook(() => usePortfolio("0x1"), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockPortfolio.get).toHaveBeenCalledWith("0x1", undefined);
  });
});

describe("useBalance", () => {
  beforeEach(() => vi.clearAllMocks());
  it("fetches balance", async () => {
    const { result } = renderHook(() => useBalance("0x1"), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockPortfolio.balance).toHaveBeenCalledWith("0x1");
  });
});

describe("useClaimable", () => {
  beforeEach(() => vi.clearAllMocks());
  it("fetches claimable positions", async () => {
    const { result } = renderHook(() => useClaimable("0x1"), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockPortfolio.claimable).toHaveBeenCalledWith("0x1");
  });
});

describe("usePortfolioStats", () => {
  beforeEach(() => vi.clearAllMocks());
  it("fetches portfolio stats", async () => {
    const { result } = renderHook(() => usePortfolioStats("0x1"), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockPortfolio.stats).toHaveBeenCalledWith("0x1");
  });
});
