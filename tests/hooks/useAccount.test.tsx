import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ContextProvider } from "../../src/provider.js";
import { useAccountStatus } from "../../src/hooks/useAccount.js";

const mockAccount = {
  status: vi.fn().mockResolvedValue({
    address: "0x1", ethBalance: 0n, usdcAllowance: 0n,
    isOperatorApproved: false, needsApprovals: true,
  }),
};

vi.mock("wagmi", () => ({
  useWalletClient: vi.fn(() => ({ data: undefined })),
  useAccount: vi.fn(() => ({ address: undefined })),
}));

vi.mock("context-markets", () => ({
  ContextClient: vi.fn().mockImplementation(() => ({
    markets: {}, orders: {}, portfolio: {}, questions: {}, account: mockAccount, address: null,
  })),
}));

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient },
      createElement(ContextProvider, { apiKey: "test" }, children));
  };
}

describe("useAccountStatus", () => {
  beforeEach(() => vi.clearAllMocks());
  it("fetches account status", async () => {
    const { result } = renderHook(() => useAccountStatus(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockAccount.status).toHaveBeenCalled();
    expect(result.current.data?.needsApprovals).toBe(true);
  });
});
