import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ContextProvider } from "../../src/provider.js";
import {
  useMarkets,
  useMarket,
  useOrderbook,
  useQuotes,
  usePriceHistory,
  useMarketActivity,
  useSimulateTrade,
} from "../../src/hooks/useMarkets.js";

const mockMarkets = {
  list: vi.fn().mockResolvedValue({ markets: [], cursor: null }),
  get: vi.fn().mockResolvedValue({ id: "m1", question: "Test?" }),
  orderbook: vi.fn().mockResolvedValue({ marketId: "m1", bids: [], asks: [] }),
  quotes: vi.fn().mockResolvedValue({ marketId: "m1", yes: {}, no: {} }),
  priceHistory: vi.fn().mockResolvedValue({ prices: [] }),
  activity: vi.fn().mockResolvedValue({ activity: [] }),
  simulate: vi.fn().mockResolvedValue({ estimatedContracts: 10 }),
};

vi.mock("wagmi", () => ({
  useWalletClient: vi.fn(() => ({ data: undefined })),
  useAccount: vi.fn(() => ({ address: undefined })),
}));

vi.mock("@contextwtf/sdk", () => ({
  ContextClient: vi.fn().mockImplementation(() => ({
    markets: mockMarkets,
    orders: {},
    portfolio: {},
    questions: {},
    account: {},
    address: null,
  })),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(ContextProvider, { apiKey: "test" }, children),
    );
  };
}

describe("useMarkets", () => {
  beforeEach(() => vi.clearAllMocks());
  it("fetches market list", async () => {
    const { result } = renderHook(() => useMarkets(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockMarkets.list).toHaveBeenCalled();
  });
  it("passes params to list", async () => {
    const params = { status: "active" as const };
    const { result } = renderHook(() => useMarkets(params), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockMarkets.list).toHaveBeenCalledWith(params);
  });
});

describe("useMarket", () => {
  beforeEach(() => vi.clearAllMocks());
  it("fetches a single market", async () => {
    const { result } = renderHook(() => useMarket("m1"), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockMarkets.get).toHaveBeenCalledWith("m1");
  });
  it("does not fetch when id is undefined", () => {
    const { result } = renderHook(() => useMarket(undefined as any), { wrapper: createWrapper() });
    expect(result.current.fetchStatus).toBe("idle");
  });
});

describe("useOrderbook", () => {
  beforeEach(() => vi.clearAllMocks());
  it("fetches orderbook for a market", async () => {
    const { result } = renderHook(() => useOrderbook("m1"), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockMarkets.orderbook).toHaveBeenCalledWith("m1", undefined);
  });
});

describe("useQuotes", () => {
  beforeEach(() => vi.clearAllMocks());
  it("fetches quotes", async () => {
    const { result } = renderHook(() => useQuotes("m1"), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockMarkets.quotes).toHaveBeenCalledWith("m1");
  });
});

describe("usePriceHistory", () => {
  beforeEach(() => vi.clearAllMocks());
  it("fetches price history", async () => {
    const { result } = renderHook(() => usePriceHistory("m1", { timeframe: "1d" }), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockMarkets.priceHistory).toHaveBeenCalledWith("m1", { timeframe: "1d" });
  });
});

describe("useMarketActivity", () => {
  beforeEach(() => vi.clearAllMocks());
  it("fetches activity", async () => {
    const { result } = renderHook(() => useMarketActivity("m1"), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockMarkets.activity).toHaveBeenCalledWith("m1", undefined);
  });
});

describe("useSimulateTrade", () => {
  beforeEach(() => vi.clearAllMocks());
  it("simulates a trade", async () => {
    const params = { side: "yes" as const, amount: 100 };
    const { result } = renderHook(() => useSimulateTrade("m1", params), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockMarkets.simulate).toHaveBeenCalledWith("m1", params);
  });
});
