# AI Agent Guide for example-adaptive-experience

Guidance for AI assistants working in the `adaptive-experience` example.

## TL;DR

**What**: an R&D example - a storefront that adapts its own layout to shopper
behaviour, driven by one versioned `ExperiencePlan`.
**Status**: faithful implementation of the blueprint (gist) sections 7-24. Runs;
AI is in shadow mode behind a deterministic mock. Not production code.
**Tech**: Nuxt 4 layer over `vue-starter-template`, Zod contracts, Vitest.

**The one rule that matters**: `shared/experience/` is the security boundary and
the source of truth. It is pure data - no Vue, Pinia, Shopware or AI imports. The
merger there is the only thing allowed to change a plan. If you weaken it, you
break the whole safety story.

```bash
pnpm --filter=example-adaptive-experience dev         # run
pnpm --filter=example-adaptive-experience test        # 64 unit tests
pnpm --filter=example-adaptive-experience typecheck   # nuxt prepare + vue-tsc
```

## Before you change anything

1. **Read the blueprint.** The real one is 74 KB / 53 sections, not the summary a
   fetch tool may return. Section references below (§7, §18, …) are to it. The
   first attempt at this example was built from a summary and diverged from the
   spec in almost every detail; [FINDINGS.md](./FINDINGS.md) records what that
   cost. Do not repeat it.
2. **Read FINDINGS.md.** It documents the real bugs, the contract deviations
   (and why), and the process lesson: the bugs here were found by driving a
   browser, not by reading code. Reasoning about this code without running it is
   how it went wrong twice.
3. **The example must build both ways or not at all.** `shared/` and the app
   layer share a contract; you cannot migrate one without the other. A half-done
   change leaves the example non-building.

## Architecture

```
events → context (signals) → rules → merger → plan → renderer
                                        ↑
                             AI patch (shadow) — same validated shape
```

Unidirectional. Components report semantic events; they never patch the plan
directly. The plan is a projection of the context, so any "undo" (reset) must
clear the context, not just the plan.

## Directory map

| Path                                               | Role                                                                                                    |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `shared/experience/schemas.ts`                     | Zod contracts - the single source of truth. Types are inferred from here.                               |
| `shared/experience/types.ts`                       | `z.infer` type exports.                                                                                 |
| `shared/experience/registry.ts`                    | §10 module registry (metadata + AI capability flags). Five of ten types registered.                     |
| `shared/experience/applyPatch.ts`                  | §18 merger - pure `(plan, patch, context, policy, {source, now})`.                                      |
| `shared/experience/rules.ts`                       | §16 local rules + `evaluateLocalRules`.                                                                 |
| `shared/experience/policy.ts`                      | §19 `AdaptationPolicy` defaults.                                                                        |
| `shared/experience/context.ts`                     | §15 `deriveSignals` + default context.                                                                  |
| `shared/experience/defaults.ts`                    | §9 default plan.                                                                                        |
| `app/composables/useExperiencePlan.ts`             | Holds the plan (`useState`); `apply` calls the merger.                                                  |
| `app/composables/useExperienceContext.ts`          | Event log → context; `track`, `reset`.                                                                  |
| `app/composables/useExperienceEngine.ts`           | §20 orchestrator: rules to a fixed point.                                                               |
| `app/composables/useExperiencePlanner.ts`          | §21-23 AI client (shadow, stale check, cooldown).                                                       |
| `app/components/experience/*Module.vue`            | The five renderable modules.                                                                            |
| `app/components/experience/moduleComponents.ts`    | Type → component map (mirrors the registry).                                                            |
| `app/components/experience/{Region,Workspace}.vue` | §12 renderer.                                                                                           |
| `app/layouts/default.vue`                          | Shell driven by `plan.shell`.                                                                           |
| `server/api/experience/plan.post.ts`               | §4/§23 the one AI integration point.                                                                    |
| `server/services/ai/planner.ts`                    | §24 mock provider behind an interface; returns untrusted `unknown`.                                     |
| `server/services/ai/ollamaPlanner.ts`              | Local-model provider (schema-constrained). Selected by `EXPERIENCE_PLANNER=ollama`; see `.env.example`. |
| `app/components/experience/ShadowProposals.vue`    | Surfaces the recorded shadow proposals on `/adaptive`.                                                  |

## Invariants you must not break

- **The merger is pure.** It never mutates its input; it clones, and it unwraps
  the reactive proxy with `toRaw` at the composable boundary (`structuredClone`
  throws on a Vue proxy - a bug that passed every unit test and only showed in
  the browser).
- **The version advances only on real change** (§18 step 8), so idempotent rules
  cannot churn it and invalidate in-flight AI responses.
- **AI output is untrusted.** `PlannerProvider.propose` returns `unknown`; the
  endpoint validates it against `experiencePatchSchema`, and the merger would
  refuse the operations even if validation were bypassed. Keep both gates.
- **`canBeHiddenByAI: false` on the product grid** (§10) is the keystone: it stops
  a validated patch from emptying the page. There is a unit test for it; do not
  delete it.
- **A patch may only ever be operations from the closed enum.** There is no
  escape hatch for arbitrary plan mutation. That is what makes an AI patch safe.

## Deliberate deviations from the blueprint

These are commented at their site and explained in FINDINGS.md:

- The registry entry keeps `component` out (it lives in `moduleComponents.ts`) so
  the merger can validate on the server where no component exists.
- The `ensure-module` operation carries an optional `minimumLifetimeMs`, so a
  user-driven module (the comparison tray) can opt out of the §19 anti-flap
  window. The blueprint's operation shape does not have this field.
- `leaveCompareRule` exits compare below two staged products, because the
  comparison schema requires ≥2 ids - you cannot compare one.
- The §11 async shell-component registry is not built; the existing layout is
  driven by the shell values instead.

## Testing

- Unit tests live next to source as `*.test.ts` and run in plain node (no Nuxt
  harness). Cover schemas, merger, rules, context, provider.
- Composables/components have no unit tests - drive the running app. Reach for a
  Playwright script against `localhost:3000/adaptive?search=chair`; the DOM
  carries `data-testid` and `data-experience-mode` hooks.
- After any contract change: `test`, then `typecheck`, then a browser pass. Do
  not claim done without the browser pass.

## References

- Blueprint gist: https://gist.github.com/mkucmus/70d059b96122d577f60cdeef3e048517
- [FINDINGS.md](./FINDINGS.md) - the honest write-up
- [README.md](./README.md) - what it is and how to run it

---

**Last updated**: 2026-07-22
**Status**: R&D, faithful to blueprint §7-24, AI in shadow mode.
