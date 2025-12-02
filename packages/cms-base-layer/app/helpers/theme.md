# Theme Configuration

## Single Source of Truth

All theme colors are defined in `theme.ts` and automatically imported into UnoCSS and composables.

### File Structure

```
app/helpers/theme.ts          → Define colors once
    ↓
    ├→ uno.config.ts           → Import for CSS classes
    └→ composables/            → Import for JavaScript contexts
```

### How to Update Colors

1. **Edit only** `app/helpers/theme.ts`:

```ts
export const THEME_COLORS = {
  "brand-primary": "#543B95",  // ← Change this
  // ... other colors
} as const;
```

2. **Changes automatically propagate to:**
   - UnoCSS classes (e.g., `text-brand-primary`, `bg-brand-primary`)
   - Composables (e.g., `THEME_COLORS["brand-primary"]`)
   - All components importing `THEME_COLORS`

### Usage Examples

#### In UnoCSS/Tailwind classes
```vue
<div class="text-brand-primary bg-brand-secondary">
  <!-- Colors from theme.ts via UnoCSS -->
</div>
```

#### In JavaScript/TypeScript
```ts
import { THEME_COLORS } from '../helpers/theme'

const color = THEME_COLORS["brand-primary"]  // "#543B95"
const placeholder = useImagePlaceholder(THEME_COLORS["brand-secondary"])
```

## Benefits

✅ **Single source of truth** - Edit colors in one place
✅ **Type-safe** - TypeScript knows all available colors
✅ **Consistent** - Same colors everywhere
✅ **Maintainable** - Easy to update theme

## Migration Note

Previously, colors were duplicated in both `uno.config.ts` and `theme.ts`. Now they're defined once in `theme.ts` and imported where needed.
