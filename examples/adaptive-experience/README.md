# Adaptive experience (R&D)

A storefront that changes its own layout based on what the shopper does.

The app holds one versioned `ExperiencePlan` that describes the whole page -
mode, shell, workspace, and which modules sit in which region. Semantic events
feed an anonymous `ExperienceContext`; local rules read it and propose small
patches; a merger validates every patch against a closed registry and applies
what is safe; the renderer builds the page only from registered components. AI,
when enabled, may only return the same validated patch shape - it can never name
a component or reach commerce data.

This implements the blueprint at
[this gist](https://gist.github.com/mkucmus/70d059b96122d577f60cdeef3e048517),
faithfully to its sections 7-24. Read [FINDINGS.md](./FINDINGS.md) for the full
story, including a first attempt that diverged from the spec and what the
faithful rebuild changed.

## How it is built

A Nuxt layer on top of `vue-starter-template`, which is not modified. Everything
commerce-related (Shopware wiring, product cards, listing filters, cart) is
inherited unchanged, so the diff here is only what the adaptive part costs.

```
shared/experience/    Contracts, registry, defaults, merger, rules, policy, context.
                      Pure data - no Vue, no Pinia, no Shopware, no AI (blueprint E1).
app/components/experience/  The five module components + the region/workspace renderer.
app/composables/      Plan, context, engine, AI planner client.
app/layouts/          Layout override, so the plan can drive the shell.
app/pages/adaptive.vue      The adaptive listing route.
server/api/experience/      The one place AI may touch the experience.
server/services/ai/         The planner provider, behind an interface.
```

## Run it

```bash
pnpm i
pnpm --filter=example-adaptive-experience dev
```

Compare the two listings side by side (the demo store has no shirts - try
`chair`, `sofa`, `table`):

- `http://localhost:3000/search?search=chair` - the standard listing
- `http://localhost:3000/adaptive?search=chair` - the adaptive one

## Try it

1. Click "Compare" on one product. Nothing changes.
2. Click "Compare" on a second. The page enters `compare` mode and a comparison
   tray appears above the grid.
3. Remove one product from the tray. You cannot compare one, so the tray closes
   and the page returns to `explore`. Add another and it rebuilds.
4. Sort by price twice. Repeated price sorting reads as price sensitivity, so the
   workspace goes compact and the grid widens.
5. Click "Restore standard view" - it clears what the rules learned about you,
   not just the layout, so nothing snaps back.

## The contract, in one place

- **Modes** (§7): `explore, inspire, compare, decide, configure, support`.
- **Regions** (§7): `top, main, aside, bottom`.
- **Module types** (§7): ten in the contract; five are registered and renderable
  today (`product-grid`, `product-comparison`, `contextual-filters`,
  `assistant-message`, `intent-summary`). A patch naming an unregistered type is
  rejected - that is the closed registry working, not a gap.
- **Merger** (§18): pure `(plan, patch, context, policy)`. It clones, validates
  every operation against the registry, enforces AI capability flags, the
  checkout route-lock, patch limits, source precedence and minimum lifetimes,
  applies the survivors, re-validates the whole plan, and advances the version
  only if something changed.
- **The keystone** (§10): the product grid is `canBeHiddenByAI: false`, so a
  validated AI patch can never empty the page.

## AI (shadow mode)

The planner loop runs. On each settled context change the client asks
`/api/experience/plan`; in shadow mode (the default, `app.config.ts`) it records
what the merger _would_ have done and applies nothing. The provider is a
deterministic mock. The endpoint validates the request, rate-limits per session,
validates the provider's patch, and re-validates the whole response before it
leaves. To let AI actually move the UI, set `experience.aiShadowMode` to `false`.

## Testing with a local model (Ollama)

The planner is a swappable `PlannerProvider`
([server/services/ai](server/services/ai)). A local model can drive it, and it
stays safe: whatever the model returns is untrusted, so the endpoint re-validates
it against the patch schema and the merger enforces the capability flags - a bad
model only ever produces a _rejected_ proposal.

```bash
# 1. install Ollama (https://ollama.com), then:
ollama pull llama3.2:3b

# 2. point the example at it (see .env.example):
cp .env.example .env      # then uncomment EXPERIENCE_PLANNER=ollama etc.
pnpm --filter=example-adaptive-experience dev
```

Open `/adaptive?search=chair`, stage products or sort by price, and watch the
**"AI planner - shadow proposals"** panel: it shows each proposal's reason,
confidence, and how many operations the merger _would_ accept - the quality
signal for a model before you trust it. The output is constrained to the patch
schema via Ollama's structured-output `format` (built from the Zod schema with
`z.toJSONSchema`), and re-validated regardless. A local model on CPU is slower
than 2s, so `EXPERIENCE_PLANNER_TIMEOUT_MS` raises the client's wait.

## Tests

```bash
pnpm --filter=example-adaptive-experience test
```

64 unit tests cover the schemas, the merger, the rules, the context signals and
the planner provider. They run in plain node because `shared/` and the provider
have no Vue in them. The composables and components are exercised by driving the
running app; two real bugs in the first attempt passed every unit test and only
surfaced in the browser, so that split is deliberate. See [FINDINGS.md](./FINDINGS.md).

## Not built

Sales-channel switching (blueprint phases 8-10; the merger reports the operation
as `not-implemented`), the §11 async shell-component registry (the existing
layout is driven by the shell values instead), and any real AI provider.
