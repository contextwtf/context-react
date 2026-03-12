<p align="center">
  <img src="https://mainnet.contextcdn.com/ced823d63df9dff0390d9ad0a4e1ad3905dd199a6c50758c18a5c92a203adbd7" alt="Context" width="100%" />
</p>

<h1 align="center">Context React</h1>
<p align="center">React hooks for <a href="https://context.markets">Context Markets</a> — built on <code>context-markets</code> and TanStack Query.</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@contextwtf/react"><img src="https://img.shields.io/npm/v/@contextwtf/react" alt="npm" /></a>
  <a href="https://github.com/contextwtf/context-react/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="License: MIT" /></a>
  <a href="https://discord.gg/RVmzZsAyM4"><img src="https://img.shields.io/badge/Discord-Join-7289da" alt="Discord" /></a>
</p>

## Install

```bash
npm install @contextwtf/react context-markets @tanstack/react-query wagmi viem
```

## Quick Start

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

## Documentation

- **[React SDK Guide](https://docs.context.markets/agents/react-sdk)** — setup, providers, and first component
- **[Hooks Reference](https://docs.context.markets/agents/react-sdk/hooks-reference)** — full list of hooks and parameters
- **[Best Practices](https://docs.context.markets/agents/react-sdk/best-practices)** — patterns, error handling, and tips

## Ecosystem

| Package | Description |
|---------|-------------|
| **[context-markets](https://github.com/contextwtf/context-sdk)** | TypeScript SDK for trading |
| **[@contextwtf/react](https://github.com/contextwtf/context-react)** | React hooks for market data and trading |
| **[@contextwtf/mcp](https://github.com/contextwtf/context-mcp)** | MCP server for AI agents |
| **[@contextwtf/cli](https://github.com/contextwtf/context-cli)** | CLI for trading from the terminal |
| **[context-skills](https://github.com/contextwtf/context-skills)** | AI agent skill files |
| **[context-plugin](https://github.com/contextwtf/context-plugin)** | Claude Code plugin |

## License

MIT — see [LICENSE](./LICENSE) for details.
