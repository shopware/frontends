# @shopware/cms-base-layer-react

React Server Components that render Shopware Shopping Experiences (CMS)
pages: the sections, blocks and elements of a `CmsPage`, with the same markup,
classes and behavior as the Vue layer `@shopware/cms-base-layer`.

## Install

```bash
pnpm add @shopware/cms-base-layer-react @shopware/api-client @shopware/helpers
```

The package ships TypeScript source. Next.js compiles workspace packages on
its own; for an npm install add it to `transpilePackages`:

```ts
const nextConfig = {
  transpilePackages: ["@shopware/cms-base-layer-react"],
};
```

Import the stylesheet after Tailwind and let Tailwind scan the package:

```css
@import "tailwindcss";
@import "@shopware/design-tokens/tailwind.css";
@import "@shopware/cms-base-layer-react/styles.css";
@source "../node_modules/@shopware/cms-base-layer-react/src";
```

## Render a page

```tsx
import {
  CmsPage,
  createCmsContext,
  defaultCmsRegistry,
} from "@shopware/cms-base-layer-react";

export default async function CategoryPage({ category }) {
  const ctx = createCmsContext({
    registry: defaultCmsRegistry,
    routeName: "frontend.navigation.page",
    foreignKey: category.id,
    category,
    locale: "en-GB",
    currencyCode: "EUR",
  });

  return <CmsPage content={category.cmsPage} ctx={ctx} />;
}
```

## Override a component

```tsx
import {
  mergeCmsRegistries,
  defaultCmsRegistry,
} from "@shopware/cms-base-layer-react";
import { MyImageText } from "./MyImageText";

export const registry = mergeCmsRegistries(defaultCmsRegistry, {
  blocks: { "image-text": MyImageText },
});
```

Registry keys are the CMS `type` values (`image-text`, `product-listing`,
`sidebar`). A component receives `content`, `ctx`, `className` and `style`.

## Wire the interactive parts

Client islands call the app through the actions port:

```tsx
"use client";
import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";

export function StorefrontProviders({ children }) {
  return (
    <CmsActionsProvider actions={{ addToCart, toggleWishlist, isInWishlist }}>
      {children}
    </CmsActionsProvider>
  );
}
```

Listing filters, sorting and pagination write to the URL
(`?manufacturer=…&order=…&p=2`). Read the listing for those params on the
server and pass it as `ctx.listing`.
