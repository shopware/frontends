---
"@shopware/composables": patch
---

Propagate session context refresh failures so login, registration, logout, and context setters cannot complete after an unverifiable context switch.
