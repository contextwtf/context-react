<p align="center">
  <img src="https://mainnet.contextcdn.com/ced823d63df9dff0390d9ad0a4e1ad3905dd199a6c50758c18a5c92a203adbd7" alt="Context" width="100%" />
</p>

<h1 align="center">Context React</h1>
<p align="center">React hooks for <a href="https://context.markets">Context Markets</a> — built on <code>context-markets</code> and TanStack Query.</p>

<p align="center">
  <a href="https://www.npmjs.com/package/context-markets-react"><img src="https://img.shields.io/npm/v/context-markets-react" alt="npm" /></a>
  <a href="https://github.com/contextwtf/context-react/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="License: MIT" /></a>
  <a href="https://discord.gg/RVmzZsAyM4"><img src="https://img.shields.io/badge/Discord-Join-7289da" alt="Discord" /></a>
</p>

## Install

```bash
npm install context-markets-react context-markets @tanstack/react-query wagmi viem
# or
yarn add context-markets-react context-markets @tanstack/react-query wagmi viem
# or
pnpm add context-markets-react context-markets @tanstack/react-query wagmi viem
```

## Quick Start

### 1. Wrap your app with providers

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { ContextProvider } from "context-markets-react"
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
import { useMarkets, useQuotes } from "context-markets-react"

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

## Available Hooks

**Markets** — `useMarkets` · `useSearchMarkets` · `useMarket` · `useOrderbook` · `useQuotes` · `usePriceHistory` · `useMarketActivity` · `useSimulateTrade` · `useOracle` · `useLatestOracleQuote`

**Orders** — `useOrders` · `useOrder` · `useCreateOrder` · `useCreateMarketOrder` · `useCancelOrder` · `useCancelReplace`

**Portfolio** — `usePortfolio` · `usePositions` · `useBalance` · `useClaimable` · `usePortfolioStats`

**Account** — `useAccountStatus` · `useAccountSetup` · `useDeposit` · `useWithdraw` · `useApproveUsdc` · `useApproveOperator`

**Questions** — `useSubmitQuestion` · `useSubmitAndWait` · `useCreateMarket` · `useAgentSubmit` · `useAgentSubmitAndWait`

**Utilities** — `ContextProvider` · `useContextClient` · `contextKeys` · `ContextWalletError`

## Peer Dependencies

`react` >= 18 · `@tanstack/react-query` >= 5 · `wagmi` >= 2 · `viem` >= 2 · `context-markets` >= 0.6.0

## Documentation

- **[React SDK Guide](https://docs.context.markets/agents/react-sdk)** — setup, providers, and first component
- **[Hooks Reference](https://docs.context.markets/agents/react-sdk/hooks-reference)** — full list of hooks and parameters
- **[Best Practices](https://docs.context.markets/agents/react-sdk/best-practices)** — patterns, error handling, and tips

## Ecosystem

| Package | Description |
|---------|-------------|
| **[context-markets](https://github.com/contextwtf/context-sdk)** | TypeScript SDK for trading |
| **[context-markets-react](https://github.com/contextwtf/context-react)** | React hooks for market data and trading |
| **[context-markets-mcp](https://github.com/contextwtf/context-mcp)** | MCP server for AI agents |
| **[context-markets-cli](https://github.com/contextwtf/context-cli)** | CLI for trading from the terminal |
| **[context-skills](https://github.com/contextwtf/context-skills)** | AI agent skill files |
| **[context-plugin](https://github.com/contextwtf/context-plugin)** | Claude Code plugin |

## License

MIT — see [LICENSE](./LICENSE) for details.
