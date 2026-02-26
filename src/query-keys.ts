const PREFIX = "context" as const;

export const contextKeys = {
  markets: {
    all: [PREFIX, "markets"] as const,
    list: (params?: Record<string, unknown>) =>
      params
        ? ([PREFIX, "markets", "list", params] as const)
        : ([PREFIX, "markets", "list"] as const),
    get: (id: string) => [PREFIX, "markets", "get", id] as const,
    orderbook: (id: string, params?: Record<string, unknown>) =>
      params
        ? ([PREFIX, "markets", "orderbook", id, params] as const)
        : ([PREFIX, "markets", "orderbook", id] as const),
    quotes: (id: string) => [PREFIX, "markets", "quotes", id] as const,
    priceHistory: (id: string, params?: Record<string, unknown>) =>
      params
        ? ([PREFIX, "markets", "priceHistory", id, params] as const)
        : ([PREFIX, "markets", "priceHistory", id] as const),
    activity: (id: string, params?: Record<string, unknown>) =>
      params
        ? ([PREFIX, "markets", "activity", id, params] as const)
        : ([PREFIX, "markets", "activity", id] as const),
    simulate: (params: Record<string, unknown>) =>
      [PREFIX, "markets", "simulate", params] as const,
    oracle: (id: string) => [PREFIX, "markets", "oracle", id] as const,
  },
  orders: {
    all: [PREFIX, "orders"] as const,
    list: (params?: Record<string, unknown>) =>
      params
        ? ([PREFIX, "orders", "list", params] as const)
        : ([PREFIX, "orders", "list"] as const),
    get: (id: string) => [PREFIX, "orders", "get", id] as const,
  },
  portfolio: {
    all: [PREFIX, "portfolio"] as const,
    get: (address?: string, params?: Record<string, unknown>) =>
      address
        ? ([PREFIX, "portfolio", "get", address, ...(params ? [params] : [])] as const)
        : ([PREFIX, "portfolio", "get"] as const),
    balance: (address?: string) =>
      address
        ? ([PREFIX, "portfolio", "balance", address] as const)
        : ([PREFIX, "portfolio", "balance"] as const),
    claimable: (address?: string) =>
      address
        ? ([PREFIX, "portfolio", "claimable", address] as const)
        : ([PREFIX, "portfolio", "claimable"] as const),
    stats: (address?: string) =>
      address
        ? ([PREFIX, "portfolio", "stats", address] as const)
        : ([PREFIX, "portfolio", "stats"] as const),
  },
  account: {
    all: [PREFIX, "account"] as const,
    status: () => [PREFIX, "account", "status"] as const,
  },
} as const;
