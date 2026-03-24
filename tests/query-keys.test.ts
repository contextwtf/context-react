import { describe, it, expect } from "vitest";
import { contextKeys } from "../src/query-keys.js";
import { ContextWalletError } from "../src/errors.js";

describe("contextKeys", () => {
  it("generates market list keys", () => {
    expect(contextKeys.markets.list()).toEqual(["context", "markets", "list"]);
    expect(contextKeys.markets.list({ status: "active" })).toEqual([
      "context", "markets", "list", { status: "active" },
    ]);
  });

  it("generates market search keys", () => {
    expect(contextKeys.markets.search("bitcoin")).toEqual([
      "context", "markets", "search", "bitcoin",
    ]);
    expect(contextKeys.markets.search("bitcoin", { limit: 10 })).toEqual([
      "context", "markets", "search", "bitcoin", { limit: 10 },
    ]);
  });

  it("generates market detail keys", () => {
    expect(contextKeys.markets.get("abc")).toEqual([
      "context", "markets", "get", "abc",
    ]);
  });

  it("generates orderbook keys", () => {
    expect(contextKeys.markets.orderbook("abc")).toEqual([
      "context", "markets", "orderbook", "abc",
    ]);
  });

  it("generates order keys", () => {
    expect(contextKeys.orders.list()).toEqual(["context", "orders", null, "list"]);
    expect(contextKeys.orders.get("0x1", "id1")).toEqual([
      "context", "orders", "0x1", "get", "id1",
    ]);
  });

  it("generates portfolio keys", () => {
    expect(contextKeys.portfolio.get("0x1")).toEqual([
      "context", "portfolio", "0x1", "get",
    ]);
    expect(contextKeys.portfolio.balance()).toEqual([
      "context", "portfolio", null, "balance",
    ]);
  });

  it("generates account keys", () => {
    expect(contextKeys.account.status()).toEqual([
      "context", "account", null, "status",
    ]);
  });

  it("supports module-level invalidation", () => {
    expect(contextKeys.markets.all).toEqual(["context", "markets"]);
    expect(contextKeys.orders.all()).toEqual(["context", "orders", null]);
    expect(contextKeys.portfolio.all()).toEqual(["context", "portfolio", null]);
  });
});

describe("ContextWalletError", () => {
  it("creates an error with hook name", () => {
    const err = new ContextWalletError("useCreateOrder");
    expect(err.message).toBe(
      "Wallet not connected. Connect a wallet before calling useCreateOrder().",
    );
    expect(err.name).toBe("ContextWalletError");
    expect(err).toBeInstanceOf(Error);
  });
});
