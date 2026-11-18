// `@vueuse/core` 15 types (`useTemporalNow`) reference the global `Temporal`
// API, which TypeScript only ships in its `ESNext` lib from 6.0. `vue-tsc` here
// runs on TypeScript 5.9, so with `skipLibCheck: false` those types fail to
// resolve. This declares just the members they use. Delete it once `vue-tsc`
// runs on TypeScript 6 or newer: the real lib types would then clash with it.
declare namespace Temporal {
  interface ZonedDateTime {}
  interface PlainDate {}
  interface PlainTime {}
  interface PlainDateTime {}
  type DurationLike = object | string;
  // Makes the namespace a value, so `typeof Temporal` resolves.
  const Now: unknown;
}
