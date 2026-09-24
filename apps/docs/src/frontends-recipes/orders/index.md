---
nav:
  title: Orders
  position: 40
---

# Orders

Recipes for reading one placed order — access without a customer session, and everything a detail page renders from it.

<PageRef page="guest-order-lookup.html" title="Guest Order Lookup via Deep Link" sub="Understand why the first lookup is meant to fail, which error code asks for credentials, what login: true does to the session token, and why the deep link filter is not a normal criteria filter." />

<PageRef page="details.html" title="Order Details" sub="Understand why reading one order is a search, how the default associations decide what the page can render, where paymentChangeable comes from, and what cancellation and document downloads actually send." />

The paginated list a signed-in customer opens these pages from lives in the Account area:

<PageRef page="../account/order-history.html" title="Order History" sub="Understand the paginated order list, the associations a list row does not contain, the order detail request, payment change, cancellation, and guest order access." />
