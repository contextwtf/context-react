const PREFIX = "context" as const;

function withParams<TPrefix extends readonly unknown[]>(
  prefix: TPrefix,
  params?: Record<string, unknown>,
) {
  return params ? ([...prefix, params] as const) : prefix;
}

export const contextKeys = {
  all: [PREFIX] as const,
  markets: {
    all: [PREFIX, "markets"] as const,
    list: (params?: Record<string, unknown>) =>
      withParams([PREFIX, "markets", "list"] as const, params),
    search: (q: string, params?: Record<string, unknown>) =>
      withParams([PREFIX, "markets", "search", q] as const, params),
    get: (id: string) => [PREFIX, "markets", "get", id] as const,
    orderbook: (id: string, params?: Record<string, unknown>) =>
      withParams([PREFIX, "markets", "orderbook", id] as const, params),
    quotes: (id: string) => [PREFIX, "markets", "quotes", id] as const,
    priceHistory: (id: string, params?: Record<string, unknown>) =>
      withParams([PREFIX, "markets", "priceHistory", id] as const, params),
    activity: (id: string, params?: Record<string, unknown>) =>
      withParams([PREFIX, "markets", "activity", id] as const, params),
    simulate: (params: Record<string, unknown>) =>
      [PREFIX, "markets", "simulate", params] as const,
    oracle: (id: string) => [PREFIX, "markets", "oracle", id] as const,
    latestOracleQuote: (id: string) => [PREFIX, "markets", "latestOracleQuote", id] as const,
  },
  orders: {
    all: (address: string | null = null, chain?: string) =>
      chain === undefined
        ? [PREFIX, "orders", address] as const
        : [PREFIX, "orders", chain, address] as const,
    list: (address: string | null = null, chain?: string, params?: Record<string, unknown>) =>
      withParams(
        chain === undefined
          ? [PREFIX, "orders", address, "list"] as const
          : [PREFIX, "orders", chain, address, "list"] as const,
        params,
      ),
    get: (address: string | null = null, id?: string, chain?: string) =>
      chain === undefined
        ? [PREFIX, "orders", address, "get", id] as const
        : [PREFIX, "orders", chain, address, "get", id] as const,
  },
  portfolio: {
    all: (address: string | null = null, chain?: string) =>
      chain === undefined
        ? [PREFIX, "portfolio", address] as const
        : [PREFIX, "portfolio", chain, address] as const,
    get: (address: string | null = null, chain?: string, params?: Record<string, unknown>) =>
      withParams(
        chain === undefined
          ? [PREFIX, "portfolio", address, "get"] as const
          : [PREFIX, "portfolio", chain, address, "get"] as const,
        params,
      ),
    balance: (address: string | null = null, chain?: string) =>
      chain === undefined
        ? [PREFIX, "portfolio", address, "balance"] as const
        : [PREFIX, "portfolio", chain, address, "balance"] as const,
    claimable: (address: string | null = null, chain?: string) =>
      chain === undefined
        ? [PREFIX, "portfolio", address, "claimable"] as const
        : [PREFIX, "portfolio", chain, address, "claimable"] as const,
    stats: (address: string | null = null, chain?: string) =>
      chain === undefined
        ? [PREFIX, "portfolio", address, "stats"] as const
        : [PREFIX, "portfolio", chain, address, "stats"] as const,
    positions: (address: string | null = null, chain?: string, params?: Record<string, unknown>) =>
      withParams(
        chain === undefined
          ? [PREFIX, "portfolio", address, "positions"] as const
          : [PREFIX, "portfolio", chain, address, "positions"] as const,
        params,
      ),
  },
  account: {
    all: (address: string | null = null, chain?: string) =>
      chain === undefined
        ? [PREFIX, "account", address] as const
        : [PREFIX, "account", chain, address] as const,
    status: (address: string | null = null, chain?: string) =>
      chain === undefined
        ? [PREFIX, "account", address, "status"] as const
        : [PREFIX, "account", chain, address, "status"] as const,
  },
} as const;
