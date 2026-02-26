export class ContextWalletError extends Error {
  override name = "ContextWalletError";

  constructor(hookName: string) {
    super(
      `Wallet not connected. Connect a wallet before calling ${hookName}().`,
    );
  }
}
