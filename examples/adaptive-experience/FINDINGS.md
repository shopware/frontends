# Findings: adaptive storefront

The arc of this example, in order: one day building it against the real starter
template, a multi-agent audit, the discovery that it was built from a _summary_
of the blueprint rather than the blueprint, and finally a faithful rebuild onto
the real contract. Read top to bottom for the whole story.

## Update — the faithful rebuild is done and runnable

The contract was rebuilt against blueprint §7-24 and the whole app + server was
migrated onto it. Current state:

- **Contract library** (`shared/experience`): faithful to the spec - 6 modes,
  `top/main/aside/bottom` regions, 10 module types, the §18 merger with all its
  steps, §19 `AdaptationPolicy`, §10 AI capability flags. Type-sound, and covered
  by **64 unit tests**.
- **App + server migrated**: five module components, the §12 renderer, the §20
  engine, the §21-23 AI client and the §4 endpoint all run on the new contract.
  Full typecheck passes; the whole flow is verified in a browser
  (add-two→compare, remove-one→tray-closes→explore, re-add rebuilds, price-sort
  densifies, reset restores).
- **The keystone holds in code and test**: a validated AI patch cannot hide the
  product grid (`canBeHiddenByAI: false`).
- **Phase 6 now actually runs**: the earlier version defined the planner loop but
  never called it. `requestPlan` is wired to the settled-context watcher, throttled
  by a client cooldown, recording shadow proposals.

Two things the rebuild itself surfaced:

- **The §19 minimum-lifetime guardrail can fight the user.** It exists to stop
  _adaptation_ from flickering a module, but every plan change here is
  rule-sourced, so a change reflecting the shopper's _own_ action (removing a
  compared product) was blocked for 5 s and the tray showed a product that was
  already gone. Fix: a module may declare its own `minimumLifetimeMs` at ensure
  time, and the comparison tray sets 0. A fuller answer would distinguish
  user-driven syncs from autonomous adaptation.
- **Vue's SFC macro cannot resolve a zod `z.infer` type in `defineProps`.** It
  typechecks and unit-tests fine, then fails to compile in the browser. Module
  props must be inlined as concrete shapes. Another bug only a browser catches.

Everything below is the record of how it got here. It is still accurate about the
_first_ attempt; the contract it critiques has since been replaced.

## Read this first (about the first attempt)

**The spike was built against a summary of the blueprint, not the blueprint.**

The blueprint is a 74 KB document with 53 numbered sections. The tool used to
read it returned a two-page summary instead, and nobody noticed. Everything below
was implemented from that summary. Section 0 of the real document opens with
"Read this entire document." That did not happen.

The result is not an implementation of the blueprint. It is a different system
that shares its vocabulary. The idea was validated. The contract was not.

Judge the spike on that basis. The parts that are still worth something are the
implementation lessons, which are independent of the contract, and the fact that
the general shape works at all on a real storefront.

## What the divergence looks like

Every line of this table is the specified contract against what was built:

| Blueprint                                                                                                                  | Built here                                                  |
| -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| 6 modes: `explore, inspire, compare, decide, configure, support`                                                           | 3                                                           |
| Regions `top, main, aside, bottom`                                                                                         | `header, main, sidebar, footer`                             |
| 10 module types, e.g. `product-comparison`, `contextual-filters`, `assistant-message`, `product-finder`, `recently-viewed` | 4, renamed                                                  |
| Header `default / compact / search-first`                                                                                  | `standard / compact`                                        |
| Navigation `mega-menu / contextual / hidden`                                                                               | `standard / minimal`                                        |
| Footer `full / compact / hidden`                                                                                           | `standard / minimal`                                        |
| Module carries `enabled`, `createdAt`, `updatedAt`, `minimumLifetimeMs`                                                    | none of them                                                |
| Plan carries `schemaVersion`, `routeKey`, `metadata { reason, source, generatedAt }`                                       | none of them                                                |
| `overlays` is an object of three booleans                                                                                  | an array                                                    |
| Workspace has `maxWidth`, `density`, `columns`, `sidebar`, `stickyAside`                                                   | `width`, `density`                                          |
| Registry entry has `commerceRisk`, `canBeAddedByAI`, `canBeMovedByAI`, `canBeHiddenByAI`, `maxInstances`                   | none of them                                                |
| Shell registry of async components (§11)                                                                                   | none, and the spike argued against having one               |
| Patch: max 3-5 operations, max 1 shell change, max 2 module moves                                                          | max 8 operations, no other limits                           |
| Merger takes `(plan, patch, context, policy)` and validates the complete next plan before accepting it (§18 step 7)        | takes `(plan, patch, {source})`, never validates the result |
| `AdaptationPolicy` and `useAdaptationLock` (§19)                                                                           | absent                                                      |
| Module count limit, e.g. 20                                                                                                | absent                                                      |

The operation shapes differ too: the blueprint's `set-shell` is
`{ target, value }`, its `ensure-module` nests the module object, its
`move-module` requires `priority`, and its patch supports `quickActions`.

## Findings that did not survive contact with the real document

These were written up as blueprint critiques. They were not.

**"Dropped `workspace.columns` as redundant."** This was the worst one. The
blueprint's `ProductGridPropsSchema` has no `columns` field. It has `limit`. The
`columns` prop on the grid module was invented here, which manufactured the
duplication with `workspace.columns`, which was then "discovered" and resolved by
deleting the specified field. A self-inflicted problem, documented as a flaw in
someone else's design.

**"The shell does not need a registry, it would be ceremony."** Section 11
specifies a shell registry with async header, navigation and footer components.
This was a confident architectural opinion about a section that was never read.

**"The closed contract does what it promises, this is the strongest part of the
design."** It promises more than was built. Section 10 requires
`canBeHiddenByAI: false` on the product grid. It is not implemented, so a
validated AI patch can hide the grid and the filter panel and leave an empty page
that still passes schema validation. The blueprint prevents this. The spike does
not. The commerce half of the claim does hold: no operation in the enum writes
Shopware state.

**"The MVP acceptance list now passes without AI."** That was measured against
the summary's 8 items. The real list (§46) has 13. Three do not pass: guardrails
must protect checkout _and active forms_ (no form protection exists), a decision
log must be available (rejections are collected but never surfaced), and E2E must
demonstrate `explore -> compare` (it is demonstrated by throwaway scripts, not
tests in the repo).

**"Restore standard view needs a contract change."** Half wrong twice over. The
real fix was ten lines (see below), and §19 already specifies the durable answer:
"when the user explicitly reverts an adaptation, remember that preference for the
session."

## Findings that still stand

These are implementation lessons. They are independent of the contract and would
have happened against any version of it.

**`structuredClone` throws on a Vue reactive proxy.** The merger clones its input
to stay pure. `useState` returns a reactive proxy. Every unit test passed, because
tests pass plain objects. SSR passed, because no rule fires on the server so the
merger is never reached. The bug only appears on the first patch in a browser. Fix
is `toRaw` at the composable boundary. The lesson: a framework-free core needs an
explicit unwrap at the edge, and something has to test that edge.

**Idempotent rules churned the plan version.** `update-module-props` marked the
plan changed even when the props were identical, so the version advanced on every
rule pass and any in-flight AI response would fail the stale check. Found by a
test that ran the rule set twice and asserted the plan was unchanged. The
blueprint agrees: §18 step 8 says increment only when something changed. That test
is worth keeping.

**Restoring the standard view has to clear the signals, not just the plan.** The
plan is a projection of the signals. Resetting the projection while the source is
untouched means the rules rebuild it on the next pass. Where the plan is a
projection, any undo that touches only the plan is cosmetic. Ten lines:

```ts
const reset = () => {
  resetSignals(); // the source
  resetPlan(); // the projection
};
```

**A Nuxt layer needs its own `uno.config.ts`, and fails silently without one.**
`unocss.nuxtLayers` generates `.nuxt/uno.config.mjs` from the layer chain, but
UnoCSS resolves its config separately: with no root `uno.config.ts` the module
falls back to its default preset. Generic utilities keep working so the page looks
almost right, while the entire design token layer vanishes, including every icon,
because `presetIcons` is configured there. Two related traps: `presetAttributify`
reads zod's generics as markup and emits invalid CSS that kills the whole
stylesheet, so scope it with `content.pipeline.exclude`; and the image placeholder
colour is an `app.config` value baked into a data URI, so retheming UnoCSS does
not reach it.

**An adaptive shell means owning the layout.** The header and footer live outside
the page, so the plan can only reach them from the layout. In a layer that means
copying `default.vue`, and that copy will drift.

**The layer pattern itself held up well.** The starter is not modified. Commerce
is inherited. Retheming is a colour block. The whole spike is one deletable
directory.

## Live bugs in the spike

Confirmed by a multi-agent audit and reproduced by hand. 92 findings were raised,
46 survived a hostile refutation pass, 11 died unverified when the run hit a rate
limit.

1. **Phase 6 never runs.** `useExperiencePlanner` has zero call sites. The
   endpoint, cooldown, stale check and shadow recorder are unreached code. Every
   AI-path behaviour this spike claims to have proven is proven only by unit tests
   calling the pieces directly.
2. **The tray lies at exactly one staged product.** `compareOnComparisonIntent`
   bails below 2, `leaveCompareWhenTrayEmpty` bails above 0, so length 1 is
   uncovered. Remove one of two staged products and the plan comes back by
   identity: the tray still renders the removed product while the grid button for
   it flips back to "Compare". Two components contradicting each other on the
   flagship demo path, reachable in ten seconds of clicking.
3. **Price sorting strips the language and currency switchers site-wide.** The
   densify rule sets `navigation: "minimal"`, the layout gates
   `LayoutMetaNavigation` on it, the plan is global `useState`, and the reset
   button only renders inside `/adaptive`. Sort twice, navigate away, and the
   shopper has lost currency selection everywhere until they reload.
4. **AI can blank the storefront** (see above).
5. **The planner cooldown is keyed on an attacker-supplied cookie** and its `Map`
   never evicts. It is not merely per-instance, it is bypassable on one instance,
   and it leaks memory.
6. **The tray resolves ids against the current listing page**, so staged products
   vanish on sort or pagination.
7. **`plan.overlays` is inert.** Nothing renders it, yet the merger maintains it
   and the mock planner proposes it.

## Recommendation (from the first attempt — now carried out)

The recommendation at the time was: keep the layer, rewrite the contract against
the real document. That has since been done - see the update at the top. For the
record, the plan was:

1. Re-implement the contract from §7 to §19. **Done.** This subsumed most of the
   live bug list: `canBeHiddenByAI` closes the page-blanking hole, `AdaptationPolicy`
   and the module-count limit close unbounded growth, `routeKey` scopes the shell,
   and the §18 whole-plan revalidation backstops the class.
2. Fix the tray-at-one-product hole. **Done** - and the rebuild found it was
   deeper than a rule-coverage gap (the minimum-lifetime guardrail; see the top).
3. Add browser verification. **Partly** - the flow is driven by a Playwright
   script, but it still lives outside the repo; promoting it into `apps/e2e-tests`
   is the remaining testing work.
4. Wire phase 6 to something, or delete it. **Done** - the planner loop now runs
   in shadow mode.
5. Only then a real model. **Not done, by design** - the blueprint itself gates
   this behind telemetry and an A/B comparison, which do not exist here.

### What is left

- Promote the browser flow into `apps/e2e-tests` so it runs in CI.
- The §11 async shell-component registry (the layout drives shell values instead).
- Real storage for the context (still `useState`, so it resets on reload) and the
  §22 sales-channel work (phases 8-10).
- A real provider, only after telemetry exists to judge proposals.

## The process lesson

Four real bugs were found by driving a browser, one by a test asserting the rules
settle, and seven more by an adversarial audit. None were found by reading the
code. The two times something was reasoned about without being checked against
the source, it was wrong: the reset misdiagnosis, and the entire contract.

Read the source. Then check the code against it. Neither alone was enough.
