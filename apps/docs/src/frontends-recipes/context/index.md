---
nav:
  title: Context
  position: 30
---

# Context

Recipes for the sales channel context and everything derived from it: language, currency, navigation, and URL resolving.

<PageRef page="session-context.html" title="Session Context" sub="Understand why a context patch does not return the new context, where the shared context value is seeded, the narrow set of fields a switch can change, which reactive values go stale after one, and what server-side rendering does to the first context a visitor sees." />

<PageRef page="language-and-currency.html" title="Language and Currency Switch" sub="Understand why a language switch ends in a redirect while a currency switch does not, which setter refreshes the context and which does not, and what goes stale after each." />

<PageRef page="navigation.html" title="Navigation and Breadcrumbs" sub="Understand why the navigation route takes types where it names ids, which request actually resolves a URL, why the breadcrumb trail has no composable to fetch it, and which component its lifetime is tied to." />
