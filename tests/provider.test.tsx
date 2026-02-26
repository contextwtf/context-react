import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ContextProvider, useContextClient } from "../src/index.js";
import { ContextClient } from "@contextwtf/sdk";
import { useWalletClient, useAccount } from "wagmi";

// Mock wagmi hooks
vi.mock("wagmi", () => ({
  useWalletClient: vi.fn(() => ({ data: undefined })),
  useAccount: vi.fn(() => ({ address: undefined })),
}));

// Mock the SDK
vi.mock("@contextwtf/sdk", () => ({
  ContextClient: vi.fn().mockImplementation((opts: any) => ({
    markets: {},
    orders: {},
    portfolio: {},
    questions: {},
    account: {},
    address: null,
    _opts: opts,
  })),
}));

const MockedContextClient = vi.mocked(ContextClient);
const MockedUseWalletClient = vi.mocked(useWalletClient);

function createWrapper(apiKey = "test-key") {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(ContextProvider, { apiKey }, children),
    );
  };
}

describe("ContextProvider", () => {
  it("provides a ContextClient via useContextClient", () => {
    const { result } = renderHook(() => useContextClient(), {
      wrapper: createWrapper(),
    });
    expect(result.current).toBeDefined();
    expect(result.current.markets).toBeDefined();
  });

  it("throws when useContextClient is used outside provider", () => {
    expect(() => {
      renderHook(() => useContextClient());
    }).toThrow("useContextClient must be used within a <ContextProvider>");
  });

  it("creates a read-only client when no wallet is connected", () => {
    renderHook(() => useContextClient(), {
      wrapper: createWrapper("my-api-key"),
    });
    expect(MockedContextClient).toHaveBeenCalledWith(
      expect.objectContaining({ apiKey: "my-api-key" }),
    );
  });

  it("passes walletClient as signer when wallet is connected", async () => {
    const mockWalletClient = { account: { address: "0x123" } };
    MockedUseWalletClient.mockReturnValue({ data: mockWalletClient } as any);

    renderHook(() => useContextClient(), {
      wrapper: createWrapper(),
    });
    expect(MockedContextClient).toHaveBeenCalledWith(
      expect.objectContaining({
        signer: { walletClient: mockWalletClient },
      }),
    );
  });
});
