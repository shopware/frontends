---
"vue-starter-template": patch
---

Load category and product breadcrumbs after hydration so they no longer block the primary SSR response. Abort stale breadcrumb requests during navigation and animate the complete breadcrumb trail as a single transition while reserving its row height to avoid layout shifts.
