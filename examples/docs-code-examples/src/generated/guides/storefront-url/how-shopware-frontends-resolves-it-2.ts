import type { operations } from "#shopware";

type RegisterParams = Omit<
  operations["register post /account/register"]["body"],
  "storefrontUrl"
>;

// useUser.ts - storefrontUrl is added internally
declare function register(params: RegisterParams): Promise<void>;

await register({} as RegisterParams);
