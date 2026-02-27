# Context React

[![npm](https://img.shields.io/npm/v/@contextwtf/react)](https://www.npmjs.com/package/@contextwtf/react)

React hooks for [Context Markets](https://context.markets) — built on `@contextwtf/sdk` and TanStack Query.

For the full quickstart guide and hook reference, visit [docs.context.markets](https://docs.context.markets).

## Install

```bash
npm install @contextwtf/react @contextwtf/sdk @tanstack/react-query wagmi viem
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
| `useMarket(marketId)` | Get a single market |
| `useOrderbook(marketId, params?)` | Get bid/ask ladder |
| `useQuotes(marketId)` | Get bid/ask/last prices |
| `usePriceHistory(marketId, params?)` | Historical price data |
| `useMarketActivity(marketId, params?)` | Market event feed |
| `useSimulateTrade(marketId, params)` | Preview trade execution |
| `useOracle(marketId)` | Oracle resolution status |

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
| `@contextwtf/sdk` | >= 0.3.0 |

## Development

```bash
bun install          # Install dependencies
bun run build        # Build ESM + types
bun run typecheck    # Type check
bun run test         # Run tests
```
