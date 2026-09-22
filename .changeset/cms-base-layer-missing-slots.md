---
"@shopware/cms-base-layer": minor
---

Render blocks reactively and survive a missing slot

`CmsGenericElement` now takes `content` as an optional prop and renders nothing when it is missing, instead of handing `undefined` to `resolveCmsComponent` and throwing. A block does not have to carry every slot its layout allows, so that is no longer an error path.

Every block component now passes its `content` to `useCmsBlock` as a getter and reads slot lookups through a `computed`, and `CmsSectionSidebar` does the same with `useCmsSection`. A block or section that receives new content re-resolves which slot goes where, instead of rendering the tree it was mounted with.

`CmsGenericBlock` now provides `cms-block-slot-count` and `cms-image-sizes` as computeds rather than values captured in setup, so a block handed different content no longer leaves its children with a stale slot count. The layer's own sliders read them with `toValue()` and still accept a plain number; a custom component that injects `cms-block-slot-count` and uses it as a number directly has to do the same.

That stops at the element boundary. Element components still call `useCmsElementConfig(props.content)` and `useCmsElementImage(props.content)`, which capture the slot object at setup, so an element reused for a different slot of the same type keeps its old config- and media-derived values — an image its old source, a text its old configured content. Only values read straight from the prop (`props.content.data`) follow. Making those composables accept a getter is a separate change.

Both generic components also stop emitting an empty `<div>` where they used to render a placeholder: a missing slot and — in production — a block or element type with no component now render nothing. Dev mode is unchanged: it still warns and renders `CmsNoComponent`.

`CmsGenericBlock` and `CmsGenericElement` dropped their `Problem resolving component: …` branch. It sat behind `if (resolvedComponent)` and tested `isResolved`, which was always `true` there, so it never rendered; an unresolved component still logs a dev warning and renders `CmsNoComponent`.
