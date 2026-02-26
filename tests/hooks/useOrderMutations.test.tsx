import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ContextProvider } from "../../src/provider.js";
import {
  useCreateOrder, useCreateMarketOrder, useCancelOrder, useCancelReplace,
} from "../../src/hooks/useOrderMutations.js";

const mockOrders = {
  list: vi.fn(),
  get: vi.fn(),
  create: vi.fn().mockResolvedValue({ success: true, order: { nonce: "0x1" } }),
  createMarket: vi.fn().mockResolvedValue({ success: true, order: { nonce: "0x2" } }),
  cancel: vi.fn().mockResolvedValue({ success: true }),
  cancelReplace: vi.fn().mockResolvedValue({
    cancel: { success: true }, create: { success: true, order: { nonce: "0x3" } },
  }),
};

vi.mock("wagmi", () => ({
  useWalletClient: vi.fn(() => ({ data: { account: { address: "0x123" } } })),
  useAccount: vi.fn(() => ({ address: "0x123" })),
}));

vi.mock("@contextwtf/sdk", () => ({
  ContextClient: vi.fn().mockImplementation(() => ({
    markets: {}, orders: mockOrders, portfolio: {}, questions: {}, account: {}, address: "0x123",
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

describe("useCreateOrder", () => {
  beforeEach(() => vi.clearAllMocks());
  it("calls orders.create with the request", async () => {
    const { result } = renderHook(() => useCreateOrder(), { wrapper: createWrapper() });
    const req = { marketId: "m1", outcome: "yes" as const, side: "buy" as const, priceCents: 45, size: 100 };
    await act(() => result.current.mutateAsync(req));
    expect(mockOrders.create).toHaveBeenCalledWith(req);
  });
});

describe("useCreateMarketOrder", () => {
  beforeEach(() => vi.clearAllMocks());
  it("calls orders.createMarket", async () => {
    const { result } = renderHook(() => useCreateMarketOrder(), { wrapper: createWrapper() });
    const req = { marketId: "m1", outcome: "yes" as const, side: "buy" as const, maxPriceCents: 50, maxSize: 100 };
    await act(() => result.current.mutateAsync(req));
    expect(mockOrders.createMarket).toHaveBeenCalledWith(req);
  });
});

describe("useCancelOrder", () => {
  beforeEach(() => vi.clearAllMocks());
  it("calls orders.cancel with nonce", async () => {
    const { result } = renderHook(() => useCancelOrder(), { wrapper: createWrapper() });
    await act(() => result.current.mutateAsync("0xabc" as any));
    expect(mockOrders.cancel).toHaveBeenCalledWith("0xabc");
  });
});

describe("useCancelReplace", () => {
  beforeEach(() => vi.clearAllMocks());
  it("calls orders.cancelReplace", async () => {
    const { result } = renderHook(() => useCancelReplace(), { wrapper: createWrapper() });
    const args = {
      cancelNonce: "0xabc" as `0x${string}`,
      newOrder: { marketId: "m1", outcome: "yes" as const, side: "buy" as const, priceCents: 50, size: 100 },
    };
    await act(() => result.current.mutateAsync(args));
    expect(mockOrders.cancelReplace).toHaveBeenCalledWith("0xabc", args.newOrder);
  });
});
