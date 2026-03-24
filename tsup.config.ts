import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  external: [
    "react",
    "viem",
    "wagmi",
    "@tanstack/react-query",
    "context-markets",
  ],
});
