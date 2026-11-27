---
"react-starter-template": patch
---

Close gaps the shared e2e suite found against the Vue starter:

- The wishlist page has a "Clear wishlist" button (`data-testid="clear-wishlist-button"`) that removes every product and reads the list again.
- The product card's wishlist toggle carries `data-in-wishlist`, as in `cms-base-layer`.
- After a successful retry of the recovery link check, focus moves to the new password field instead of being lost with the retry button.
