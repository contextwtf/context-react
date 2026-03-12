import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ContextProvider } from "../../src/provider.js";
import { useAccountSetup, useDeposit, useWithdraw } from "../../src/hooks/useAccount.js";

const mockAccount = {
  status: vi.fn(),
  gaslessSetup: vi.fn(),
  setup: vi.fn(),
  gaslessDeposit: vi.fn(),
  deposit: vi.fn(),
  withdraw: vi.fn().mockResolvedValue("0xtxhash"),
};

vi.mock("wagmi", () => ({
  useWalletClient: vi.fn(() => ({ data: { account: { address: "0x123" } } })),
  useAccount: vi.fn(() => ({ address: "0x123" })),
}));

vi.mock("context-markets", () => ({
  ContextClient: vi.fn().mockImplementation(() => ({
    markets: {}, orders: {}, portfolio: {}, questions: {}, account: mockAccount, address: "0x123",
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

describe("useAccountSetup", () => {
  beforeEach(() => vi.clearAllMocks());

  it("tries gasless first, succeeds", async () => {
    mockAccount.gaslessSetup.mockResolvedValue({ success: true, txHash: "0x1" });
    const { result } = renderHook(() => useAccountSetup(), { wrapper: createWrapper() });
    await act(() => result.current.mutateAsync());
    expect(mockAccount.gaslessSetup).toHaveBeenCalled();
    expect(mockAccount.setup).not.toHaveBeenCalled();
  });

  it("falls back to direct tx when gasless fails", async () => {
    mockAccount.gaslessSetup.mockRejectedValue(new Error("relay down"));
    mockAccount.setup.mockResolvedValue({ usdcApprovalTx: "0x1", operatorApprovalTx: "0x2" });
    const { result } = renderHook(() => useAccountSetup(), { wrapper: createWrapper() });
    await act(() => result.current.mutateAsync());
    expect(mockAccount.gaslessSetup).toHaveBeenCalled();
    expect(mockAccount.setup).toHaveBeenCalled();
  });
});

describe("useDeposit", () => {
  beforeEach(() => vi.clearAllMocks());

  it("tries gasless first, succeeds", async () => {
    mockAccount.gaslessDeposit.mockResolvedValue({ success: true, txHash: "0x1" });
    const { result } = renderHook(() => useDeposit(), { wrapper: createWrapper() });
    await act(() => result.current.mutateAsync(100));
    expect(mockAccount.gaslessDeposit).toHaveBeenCalledWith(100);
    expect(mockAccount.deposit).not.toHaveBeenCalled();
  });

  it("falls back to direct tx when gasless fails", async () => {
    mockAccount.gaslessDeposit.mockRejectedValue(new Error("relay down"));
    mockAccount.deposit.mockResolvedValue("0xtxhash");
    const { result } = renderHook(() => useDeposit(), { wrapper: createWrapper() });
    await act(() => result.current.mutateAsync(100));
    expect(mockAccount.gaslessDeposit).toHaveBeenCalledWith(100);
    expect(mockAccount.deposit).toHaveBeenCalledWith(100);
  });
});

describe("useWithdraw", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls withdraw directly (no gasless variant)", async () => {
    const { result } = renderHook(() => useWithdraw(), { wrapper: createWrapper() });
    await act(() => result.current.mutateAsync(50));
    expect(mockAccount.withdraw).toHaveBeenCalledWith(50);
  });
});
