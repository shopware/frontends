// A UCP checkout id is the Shopware context token of the agent's cart:
// 32 hex characters from the plugin, 32 alphanumerics once Shopware rotates it.
// The confirm page posts only a token of this shape, and the adopt route
// accepts only one.
export const CONTEXT_TOKEN_PATTERN = /^[A-Za-z0-9]{32}$/;
