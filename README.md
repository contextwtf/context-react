<p align="center">
  <img src="https://mainnet.contextcdn.com/d9830b941541ef49ab92e4afe7a1110ffb883bf9c4af42570dbcb09bf17233e8" alt="Context" width="100%" />
</p>

<p align="center">
  <strong>React hooks for <a href="https://context.markets">Context Markets</a> — built on <code>@contextwtf/sdk</code> and TanStack Query.</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@contextwtf/react"><img src="https://img.shields.io/npm/v/@contextwtf/react" alt="npm" /></a>
  <a href="https://github.com/contextwtf/context-react/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="License: MIT" /></a>
  <a href="https://discord.gg/RVmzZsAyM4"><img src="https://img.shields.io/badge/Discord-Join-7289da" alt="Discord" /></a>
</p>

## Install

```bash
npm install @contextwtf/react @contextwtf/sdk @tanstack/react-query wagmi viem
# or
yarn add @contextwtf/react @contextwtf/sdk @tanstack/react-query wagmi viem
# or
pnpm add @contextwtf/react @contextwtf/sdk @tanstack/react-query wagmi viem
```

## Quick Start

### 1. Wrap your app with providers

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { ContextProvider } from "@contextwtf/react"
import { wagmiConfig } from "./wagmi"

const queryClient = new QueryClient()

function App({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ContextProvider apiKey={process.env.NEXT_PUBLIC_CONTEXT_API_KEY!}>
          {children}
        </ContextProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

### 2. Use hooks

```tsx
import { useMarkets, useQuotes } from "@contextwtf/react"

function MarketList() {
  const { data, isLoading } = useMarkets({ status: "active", sortBy: "trending" })

  if (isLoading) return <div>Loading...</div>

  return (
    <ul>
      {data?.markets.map((m) => (
        <li key={m.id}>{m.question}</li>
      ))}
    </ul>
  )
}
```

## Hook Reference

### Markets (queries)

| Hook | Description |
|------|-------------|
| `useMarkets(params?)` | Search and filter markets |
| `useSearchMarkets(params)` | Full-text search across markets |
| `useMarket(marketId)` | Get a single market |
| `useOrderbook(marketId, params?)` | Get bid/ask ladder |
| `useQuotes(marketId)` | Get bid/ask/last prices |
| `usePriceHistory(marketId, params?)` | Historical price data |
| `useMarketActivity(marketId, params?)` | Market event feed |
| `useSimulateTrade(marketId, params)` | Preview trade execution |
| `useOracle(marketId)` | Oracle resolution status |
| `useLatestOracleQuote(marketId)` | Latest oracle quote for a market |

### Orders (queries)

| Hook | Description |
|------|-------------|
| `useOrders(params?)` | List orders with filters |
| `useOrder(orderId)` | Get a single order |

### Orders (mutations)

| Hook | Description |
|------|-------------|
| `useCreateOrder()` | Place a signed limit order |
| `useCreateMarketOrder()` | Place a market order |
| `useCancelOrder()` | Cancel by nonce |
| `useCancelReplace()` | Atomic cancel + replace |

### Portfolio (queries)

| Hook | Description |
|------|-------------|
| `usePortfolio(address?, params?)` | Positions across markets |
| `usePositions(address?, params?)` | List positions with filters |
| `useBalance(address?)` | TUSD + token balances |
| `useClaimable(address?)` | Claimable winnings |
| `usePortfolioStats(address?)` | Portfolio value summary |

### Account

| Hook | Description |
|------|-------------|
| `useAccountStatus()` | Check wallet approval status |
| `useAccountSetup()` | Approve contracts (gasless-first) |
| `useDeposit()` | Deposit TUSD (gasless-first) |
| `useWithdraw()` | Withdraw TUSD |

### Questions (mutations)

| Hook | Description |
|------|-------------|
| `useSubmitQuestion()` | Submit a prediction question |
| `useSubmitAndWait()` | Submit + poll until processed |
| `useCreateMarket()` | Create a market from a question |
| `useAgentSubmit()` | Submit a pre-built market draft (for agents) |
| `useAgentSubmitAndWait()` | Submit a market draft + poll until processed |

### Utilities

| Export | Description |
|--------|-------------|
| `ContextProvider` | Provider component (wraps SDK client) |
| `useContextClient()` | Access the raw `ContextClient` instance |
| `contextKeys` | TanStack Query key factory for manual invalidation |
| `ContextWalletError` | Error class for wallet-required operations |

## Peer Dependencies

| Package | Version |
|---------|---------|
| `react` | >= 18.0.0 |
| `@tanstack/react-query` | >= 5.0.0 |
| `wagmi` | >= 2.0.0 |
| `viem` | >= 2.0.0 |
| `@contextwtf/sdk` | >= 0.4.0 |

## Development

```bash
bun install          # Install dependencies
bun run build        # Build ESM + types
bun run typecheck    # Type check
bun run test         # Run tests
```

## Documentation

Full hook reference and usage guides at **[docs.context.markets](https://docs.context.markets/agents/react-sdk)**.

## Ecosystem

| Package | Description |
|---------|-------------|
| **[@contextwtf/sdk](https://github.com/contextwtf/context-sdk)** | TypeScript SDK for trading |
| **[@contextwtf/react](https://github.com/contextwtf/context-react)** | React hooks for market data and trading |
| **[@contextwtf/mcp](https://github.com/contextwtf/context-mcp)** | MCP server for AI agents |
| **[@contextwtf/cli](https://github.com/contextwtf/context-cli)** | CLI for trading from the terminal |
| **[context-skills](https://github.com/contextwtf/context-skills)** | AI agent skill files |
| **[context-plugin](https://github.com/contextwtf/context-plugin)** | Claude Code plugin |

## License

MIT — see [LICENSE](./LICENSE) for details.
