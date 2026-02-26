import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ContextProvider } from "../../src/provider.js";
import { useOrders, useOrder } from "../../src/hooks/useOrders.js";

const mockOrders = {
  list: vi.fn().mockResolvedValue({ orders: [], cursor: null }),
  get: vi.fn().mockResolvedValue({ nonce: "0x1", marketId: "m1" }),
};

vi.mock("wagmi", () => ({
  useWalletClient: vi.fn(() => ({ data: undefined })),
  useAccount: vi.fn(() => ({ address: undefined })),
}));

vi.mock("@contextwtf/sdk", () => ({
  ContextClient: vi.fn().mockImplementation(() => ({
    markets: {}, orders: mockOrders, portfolio: {}, questions: {}, account: {}, address: null,
  })),
}));

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient },
      createElement(ContextProvider, { apiKey: "test" }, children));
  };
}

describe("useOrders", () => {
  beforeEach(() => vi.clearAllMocks());
  it("fetches order list", async () => {
    const { result } = renderHook(() => useOrders(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockOrders.list).toHaveBeenCalled();
  });
  it("passes params", async () => {
    const params = { marketId: "m1" };
    const { result } = renderHook(() => useOrders(params), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockOrders.list).toHaveBeenCalledWith(params);
  });
});

describe("useOrder", () => {
  beforeEach(() => vi.clearAllMocks());
  it("fetches a single order", async () => {
    const { result } = renderHook(() => useOrder("o1"), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockOrders.get).toHaveBeenCalledWith("o1");
  });
});
