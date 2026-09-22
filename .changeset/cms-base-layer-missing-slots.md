---
"@shopware/cms-base-layer": minor
---

Render blocks reactively and survive a missing slot

`CmsGenericElement` now takes `content` as an optional prop and renders nothing when it is missing, instead of handing `undefined` to `resolveCmsComponent` and throwing. A block does not have to carry every slot its layout allows, so that is no longer an error path.

Every block component now passes its `content` to `useCmsBlock` as a getter and reads slot lookups through a `computed`, and `CmsSectionSidebar` does the same with `useCmsSection`. A block or section that receives new content updates in place instead of rendering the tree it was mounted with.

`CmsGenericBlock` and `CmsGenericElement` dropped their `Problem resolving component: …` branch. It sat behind `if (resolvedComponent)` and tested `isResolved`, which was always `true` there, so it never rendered; an unresolved component still logs a dev warning and renders `CmsNoComponent`.
