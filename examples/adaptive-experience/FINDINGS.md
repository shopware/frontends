# Findings: adaptive storefront spike

One day, building the blueprint from
[the gist](https://gist.github.com/mkucmus/70d059b96122d577f60cdeef3e048517)
against the real starter template.

Short version: the core idea holds. A versioned plan, a closed registry and a
validating merger work, and they work on a real Shopware storefront with SSR.
The blueprint is under-specified in a few places. One of those broke a stated MVP
goal, and fixing it turned out to be ten lines rather than the contract change we
first proposed.

## What held up

**The closed contract does what it promises.** AI cannot name a component,
because there is nowhere in the operation set to put a component name. A patch is
a list from a fixed enum, and every module type resolves through a registry the
model has no access to. A deliberately hostile mock planner that returns
`{ type: "render-component", component: "<script>alert(1)</script>" }` is
rejected by the schema before it leaves the server, and would be rejected again
by the merger if validation were skipped. This is the strongest part of the
design.

**Server rendering works.** The plan renders on the server with `useState`, and
15 real Shopware products came back through the plan-driven registry on the first
request. No hydration mismatch.

**Shopware stays the data owner.** The plan holds product ids, never product
data. The comparison tray gets `{ productIds: [...] }` and resolves them through
the shared listing composable. This boundary was easy to hold and never fought us.

**The merger keeps the plan valid.** Every operation is checked against the
registry, so a plan that leaves the merger always satisfies it. Rejecting bad
operations one at a time, rather than failing the whole patch, means a partly
useful proposal is still worth applying.

**Guardrails are cheap.** Checkout lock and stale-version rejection are about 30
lines together and both work.

## What broke

### 1. Two real bugs passed every unit test

Both were found only by clicking through a browser.

**`structuredClone` throws on a Vue reactive proxy.** The merger clones its input
to stay pure. `useState` hands back a reactive proxy. `structuredClone(proxy)`
throws `DataCloneError`. Every unit test passed, because tests pass plain
objects. Server rendering passed too, because no rule fires on the server, so the
default plan renders without ever going through the merger. The bug only appears
on the first patch in a browser, which is the one path neither check covered.

The fix is `toRaw` at the composable boundary, which keeps `shared/` free of Vue.
The wider lesson: a framework-free core needs an explicit unwrap step at the
edge, and something has to test that edge.

**Idempotent rules churned the plan version.** `update-module-props` marked the
plan as changed even when the props were identical. Rules re-run on every signal
change and re-propose the same props, so the version advanced on every pass. Any
AI response in flight would then fail the stale check and be thrown away. The
planner would have looked broken while working correctly.

A test that ran the rule set twice and asserted the plan was unchanged caught it.
That test is worth keeping in any real implementation.

### 2. The comparison selection cannot live in the plan

The registry says `comparison-tray` may only exist in `compare` mode. But the
shopper stages their first product while still in `explore`. If the selection
lives in the tray's props, that first action has nowhere to go and gets rejected.

So events have to be the source of truth, and the plan is a projection of them:

```
events -> signals -> rules -> guardrails -> merger -> plan -> render
```

This is a change to the blueprint's data flow, not a detail. It also turned out
well: the signals the rules see and the context the AI sees became two different
objects, with the AI getting a reduced projection with no product ids in it. One
function, `toAiContext`, is the only place data can leave the browser, which is a
single point to audit.

### 3. "User can restore standard view" failed, and our first diagnosis was wrong

This is an MVP acceptance item in the gist. It failed, and it is now fixed. The
way it was wrong is the useful part.

The symptom was real. Reset worked and the next signal change undid it: reset to
`explore`, click one more Compare, and the rule saw two products still staged and
switched straight back to `compare`.

We read that as a contract gap. `source` lives on a module, so it cannot protect
`mode`, `shell` or `workspace`, which carry no source at all. The proposed fix
was to give plan-level fields a source and keep a dismissal set, and we estimated
half a day for it.

That was wrong. The plan is a projection of the signals. Reset cleared the
projection and left the source untouched, so the rules rebuilt the adapted view
on the next pass. No rule was overruling the shopper. Nothing had told the rules
that anything had changed.

The real fix is ten lines and no contract change:

```ts
const reset = () => {
  resetSignals(); // the source
  resetPlan(); // the projection
};
```

Reset now holds, verified in a browser. Restoring the standard view drops the
staged selection and the price-sort count, so the rules have nothing left to
re-adapt from, and the Compare buttons stop claiming products are staged when
nothing renders them. The shopper opts back in by staging products again.

The general lesson is worth more than the fix: **where the plan is a projection,
any undo that touches only the plan is cosmetic.** The source has to move. That
applies to every future user control, not just this button.

The salvageable half of the first diagnosis, still true and still unfixed:

- A shopper who dismisses a module leaves no trace, so a rule puts it back. No UI
  reaches this today, but it becomes real the moment the planner goes live in
  phase 7: it proposes a panel, the shopper closes it, it proposes it again.
- A shopper who picks a mode explicitly cannot outrank a rule, because mode has
  no source. This needs solving before any manual mode control ships.

Both are worth adding alongside the first UI that exercises them. Building them
now would be contract surface with no caller, which is how the estimate above got
inflated in the first place.

### 4. A layer needs its own `uno.config.ts`, and fails silently without one

Not about the blueprint, but the most expensive hour of the day, and anyone
building this on top of the starter will hit it.

`unocss.nuxtLayers` does generate `.nuxt/uno.config.mjs` merging every layer's
config, and the Nuxt layer chain was correct the whole time. But UnoCSS resolves
its config separately from that chain: without a root `uno.config.ts` the module
falls back to its default preset. Generic utilities keep working, so the page
looks almost right, while the entire Shopware design token layer is gone - brand
colours, surfaces, and every icon, since `presetIcons` is configured there. We
only noticed because the icons were visibly missing. The brand colours were
missing too and looked plausible enough to miss.

The fix is to import the starter's config, which already merges the design
tokens, so extending both layers explicitly is not needed:

```ts
export default mergeConfigs([starterConfig, adaptiveConfig]);
```

Two things to know once you do:

- **`presetAttributify` reads zod and emits broken CSS.** The starter's config
  brings `presetAttributify`, whose extractor treats anything shaped like an
  element as markup. Zod's generics parse as exactly that, producing rules like
  `[object~="$ZodCheckGreaterThan"]{...}` that are not valid CSS and take the
  whole stylesheet down. The starter never hits this because it has no zod. Scope
  the scan with `content.pipeline.exclude`. Any layer adding a schema library to
  a template with attributify will meet this.
- **Not everything is a token.** The image placeholder colour is an `app.config`
  value baked into a data URI, so retheming `uno.config.ts` does not reach it. It
  has to be set again in `app/app.config.ts` or images flash the old brand colour
  while loading.

### 5. Signals do not survive a reload

`useState` is per page load. Sorting by price twice compacts the shell; pressing
F5 puts it back to standard, because the counter is gone. "Price sensitivity" is
only real inside one client-side session. Anything derived from behaviour over
time needs real storage. This is not hard, but the blueprint does not mention it
and it quietly makes several of the interesting rules useless.

## Contract changes we made

**Dropped `workspace.columns`.** The gist puts `columns` on the workspace, and a
grid module carries its own `columns` prop. Two fields, same meaning, no rule for
who wins. The renderer never read the workspace one. Column count belongs to the
module that draws a grid. The workspace owns only the space it hands out.

**Split signals from context.** `ExperienceSignals` is what the rules see and
holds ids. `ExperienceContext` is what the endpoint sees and holds scalars.

**The shell does not need a registry.** Modules need one, because a patch names a
module type and something has to stop that being arbitrary. The shell is a small
set of layout flags the layout itself reads. Building a component registry for it
would have been ceremony.

## Practical notes

- **UnoCSS scans source text.** A class built by interpolation, like
  `grid-cols-${n}`, generates nothing. Plan-driven layout needs static lookup
  maps. This works out well: the schemas bound every value, so the maps are
  exhaustive by contract rather than by hope.
- **An adaptive shell means owning the layout.** The header and footer live
  outside the page, so the plan can only reach them from the layout. In a layer,
  that means copying `default.vue`, and that copy will drift from the base.
- **The layer pattern otherwise held up well.** The starter is not modified at
  all. Everything commerce related is inherited, retheming is a colour block in
  `uno.config.ts`, and the whole spike is one directory that can be deleted. The
  only copied file is the layout above.
- **`#shared` is a Nuxt alias.** A plain vitest run has to be told about it.
  Type-only imports are erased and hide the problem until the first value import.
- **The cooldown is in memory**, so it is per instance. On more than one instance
  it does not limit anything.
- **No Pinia needed.** `useState` carried the plan, survived hydration and cost
  nothing. Pinia would earn its place only if stores needed to watch each other.
- **Zod was already in the lockfile** at 4.4.3, so it added no new resolution.

## What we did not do

Real AI provider, sales channel switching, E2E tests in CI, more than four module
types, and any A/B measurement.

## Recommendation

Worth continuing.

The safety story is genuinely good, the retrofit onto a real storefront was
cheaper than expected, and the MVP acceptance list now passes without AI. The
remaining gap is narrower than it first looked: the blueprint models where a
change came from, but not what the shopper has already decided. That only starts
to bite once the shopper has controls beyond reset, or once a model is live.

Suggested order:

1. Move the signals into real storage. Everything behavioural is fiction until
   they survive a reload, and it is the cheapest work left.
2. Add the E2E scenarios. Two of the bugs found today were invisible to unit
   tests and SSR checks, the missing design tokens were invisible to those plus
   typecheck and lint, and the reset fix is only provable by driving the app.
3. Add dismissal memory and a mode source, together with the first UI that needs
   them. Both are required before the planner goes live.
4. Only then wire a model in, in shadow mode, and read the rejection reasons
   before trusting any of it.

One process note. Three of the four real bugs today were found by driving the
browser, and the fourth by a test that asserted the rules settle. None were found
by reading the code, and the one time we reasoned from the code alone we
misdiagnosed it and would have shipped an unnecessary contract change. That is
the argument for item 2.
