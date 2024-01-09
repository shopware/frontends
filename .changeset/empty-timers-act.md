---
"@shopware-pwa/cms-base": minor
---

Rename getTranslations to getCmsTranslations.  
Export some helpers for external use e.g. in demo-store:

```
import { getCmsTranslations, deepMerge } from "@shopware-pwa/cms-base/helpers";
```
