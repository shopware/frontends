# Adaptive experience (R&D spike)

A storefront that changes its own layout based on what the shopper does.

The app keeps one versioned `ExperiencePlan` that describes the whole page:
shell, workspace, and which modules sit in which region. Local rules watch the
shopper's actions and propose small patches. Guardrails decide what may be
applied. The renderer builds the page only from registered components.

This is a spike for the blueprint in
[this gist](https://gist.github.com/mkucmus/70d059b96122d577f60cdeef3e048517).
Read [FINDINGS.md](./FINDINGS.md) for what held up and what did not.

## How it is built

This is a Nuxt layer on top of `vue-starter-template`. The template is not
modified. Everything commerce related (Shopware wiring, product cards, listing
filters, cart) comes from it unchanged, so the diff here is only what the
adaptive part costs.

It is rethemed (teal, own logo) so it is never mistaken for the starter in a
screenshot. The theme lives in [uno.config.ts](./uno.config.ts), except the image
placeholder colour, which is an app config value and is set in
[app/app.config.ts](./app/app.config.ts).

That `uno.config.ts` is required, not decorative. Without it the design tokens
silently vanish while the page still looks roughly right. See
[FINDINGS.md](./FINDINGS.md).

## Run it

```bash
pnpm i
pnpm run dev --filter=example-adaptive-experience
```

Then compare the two listings side by side:

- `http://localhost:3000/search?search=chair` - the standard listing
- `http://localhost:3000/adaptive?search=chair` - the adaptive one

## Try it

1. Click "Compare" on one product. Nothing changes.
2. Click "Compare" on a second product. The page switches to `compare` mode and
   a comparison tray appears above the grid.
3. Click "Restore standard view". The page goes back to normal and stays there.
   The reset clears what the rules learned about you, not just the layout, so
   nothing snaps back. Stage two products again and it re-adapts.
4. Sort by price twice. The header goes compact and the grid widens to four
   columns.

## Layout

```
shared/experience/     Contracts, registry, rules, guardrails, merger. No Vue.
app/components/experience/  Module components and the renderer.
app/composables/       Plan, signals, engine, AI planner client.
app/layouts/           Layout override, so the plan can drive the shell.
app/pages/adaptive.vue The adaptive listing route.
server/api/experience/ The only place AI may touch the experience.
server/services/ai/    Planner provider behind an interface.
```

## Tests

```bash
pnpm run test --filter=example-adaptive-experience
```

56 unit tests cover the schemas, the merger, the rules and the guardrails. They
run in plain node because `shared/` has no Vue in it.

The tests do not cover the composables or components. Those were checked by
driving the running app in a browser. That split matters: two real bugs in this
spike passed every unit test and only showed up in the browser. See
[FINDINGS.md](./FINDINGS.md).

## State of the spike

**Read [FINDINGS.md](./FINDINGS.md) before trusting anything here.** This spike was
built against a summary of the blueprint rather than the blueprint itself, and its
contract diverges from the specified one in most details.

AI does not run. The Nitro endpoint, the mock provider, the cooldown and the
shadow recorder are all built and unit tested, but `useExperiencePlanner` has no
caller anywhere in the app, so `/api/experience/plan` is never hit at runtime.
Phase 6 is written, not exercised. An earlier version of this file claimed the
loop runs. It does not.

Sales channel switching is not implemented. The operation exists in the contract
and the merger reports it as `not-implemented`.

Known live bugs in the demo, all confirmed:

- Remove one of two staged products and the tray keeps showing the removed one.
  No rule covers exactly one staged product.
- Sort by price twice and the language and currency switchers disappear from the
  whole storefront, with no way back except a reload. The plan is global, the
  reset button only exists on `/adaptive`.
- A validated AI patch can hide the product grid and blank the page. The
  blueprint specifies `canBeHiddenByAI: false` to prevent exactly this. It is not
  implemented here.
