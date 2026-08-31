# AI Agent Guide for Shopware Frontends

This document provides guidance for AI assistants working with the Shopware Frontends monorepo.

## TL;DR

**What**: Vue.js framework for Shopware 6 eCommerce storefronts
**Structure**: pnpm monorepo with Turbo
**Tech**: Vue 3, Nuxt 4, TypeScript, Vitest, Oxlint, Oxfmt
**Key Packages**: api-client, composables, helpers, cms-base-layer, nuxt-module
**Templates**: vue-demo-store (full featured), vue-starter-template (production), vue-starter-template-extended (layer example), vue-blank (minimal)

**Quick Start**:

```bash
pnpm i                                    # Install
pnpm run build --filter='./packages/*'   # Build packages
pnpm run dev --filter=vue-demo-store     # Run demo
pnpm run test                             # Test
pnpm changeset                            # Create changeset for PR
```

**Before commits**: Run `pnpm run lint:fix && pnpm format && pnpm run typecheck`

## Repository Overview

Shopware Frontends is a Vue.js framework for building custom eCommerce storefronts with Shopware 6. It's a pnpm workspace monorepo using Turbo for build orchestration.

**Root Directory**: `.`

## Project Structure

```
frontends/
├── packages/          # Core framework packages
│   ├── api-client/           # HTTP client for Shopware API
│   ├── composables/          # Vue composables
│   ├── helpers/              # Utility functions
│   ├── cms-base-layer/       # CMS components
│   ├── nuxt-module/          # Nuxt integration
│   ├── tsconfig/             # Shared TypeScript configs (private)
│   ├── unocss-design-tokens-layer/ # UnoCSS design tokens Nuxt layer
│   └── api-gen/              # Type generation tool
├── templates/         # Starter templates
│   ├── manifest.json                  # Source of truth: which templates exist
│   ├── manifest.schema.json           # Schema for the manifest
│   ├── vue-demo-store/                # Full demo with UnoCSS, i18n, CMS
│   ├── vue-starter-template/          # Production-ready starter
│   ├── vue-starter-template-extended/ # Layer extension example
│   ├── vue-blank/                     # Minimal Nuxt setup
│   ├── vue-vite-blank/                # Minimal Vite setup
│   └── astro/                         # Astro integration example
├── apps/              # Applications
│   ├── docs/                 # Documentation site
│   └── e2e-tests/            # E2E test suite
└── examples/          # Example implementations
```

## Tech Stack

- **Framework**: Vue 3, Nuxt 4
- **Build**: Vite 8, Turbo, unbuild
- **Package Manager**: pnpm 11.5.2
- **Language**: TypeScript
- **Styling**: UnoCSS, Tailwind.css
- **Testing**: Vitest (unit), Playwright (e2e)
- **Linting/Formatting**: Oxlint and Oxfmt
- **Versioning**: Changesets

## Common Development Commands

### Package Management

```bash
pnpm i                                    # Install dependencies
pnpm run build                            # Build all packages
pnpm run build --filter='./packages/*'   # Build only packages
pnpm run build --filter=@shopware/api-client  # Build specific package
```

### Development

```bash
pnpm run dev --filter=vue-demo-store     # Run demo store
pnpm docs:env && pnpm docs:link && pnpm docs:preview  # Run documentation (developer-portal CLI)
```

### Quality Assurance

```bash
pnpm run lint                             # Lint all packages
pnpm run lint:fix                         # Fix linting issues
pnpm run typecheck                        # TypeScript checking
pnpm run test                             # Run tests
pnpm run test:watch                       # Watch mode
pnpm run test:e2e                         # E2E tests (@storefront specs)
pnpm format                               # Format with Oxfmt
pnpm run check:templates                  # templates/manifest.json matches disk
```

### Type Generation

```bash
pnpm run generate-types                   # Generate API types
```

## Important Patterns

### 1. Workspace Dependencies

Packages use workspace protocol for internal dependencies:

```json
{
  "dependencies": {
    "@shopware/api-client": "workspace:*",
    "@shopware/helpers": "workspace:*"
  }
}
```

### 2. Build Order

Packages must be built in dependency order (handled by Turbo):

- `api-client` + `helpers` (independent) → `composables` → `nuxt-module`; `api-gen` builds after `api-client`
- `cms-base-layer` and `unocss-design-tokens-layer` are plain Nuxt layers with no build step

### 3. Package Exports

Modern packages use conditional exports:

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  }
}
```

### 4. Source Files

- **api-client**: Source in `src/`, builds to `dist/`
- **composables**: Source in `src/`, exports TypeScript directly
- **helpers**: Source in `src/`, builds to `dist/`

### 5. Caching

Caching spans several independent layers. The full reference is [Best practices: Caching](apps/docs/src/best-practices/caching.md); the essentials for code changes:

- **`cacheableReads` (request layer)**: an opt-in context flag (default `false`) that switches a defined set of anonymous read composables from POST to the cacheable GET variant of the Store API. It is wired `nuxt.config` (`shopware: { cacheableReads: true }`) -> `createShopwareContext` -> `useShopwareContext()`. GET-over-POST is a Shopware platform decision: POST bodies are not HTTP-cacheable, so reads compress the Criteria into a `_criteria` query param via `encodeForQuery` from `@shopware/api-client/helpers` (JSON -> gzip -> base64url, matching the backend `RequestCriteriaBuilder`).
  - When adding/editing a read composable, branch on `cacheableReads` and call the GET route with `query: { _criteria: encodeForQuery(criteria) }`; keep the POST variant as the `else`. A route can only move to GET once its GET variant declares `_criteria` in the generated Store API types (`useListing`, single-category `useCategorySearch.search`, and `useLandingSearch` stay POST until then). Mutations always stay POST/PATCH.
- **`routeRules` (render layer)**: page-level caching lives in each template's `nuxt.config.ts` `routeRules` (`isr` for catalog/content, `ssr: false` for personalized routes like `/checkout` and `/account/**`, immutable `Cache-Control` for static assets). Do not bake personalized data into ISR-cached HTML.
- **Client state**: shared composables (`createSharedComposable`) and `provide`/`inject` context dedupe work in-memory per session; they are not a durable response cache.

## Key Files to Know

### Root Configuration

- [package.json](package.json) - Root workspace config
- [turbo.json](turbo.json) - Build pipeline configuration
- [pnpm-workspace.yaml](pnpm-workspace.yaml) - Workspace definition
- [.oxlintrc.json](.oxlintrc.json) - Oxlint config
- [.oxfmtrc.json](.oxfmtrc.json) - Oxfmt config
- [.changeset/](.changeset/) - Changesets for versioning

### Package Configs

- Each package has its own `package.json`, `tsconfig.json`
- Build configs: `build.config.ts`
- Test configs: `vitest.config.ts`

## Working with Specific Packages

### @shopware/api-client

**Purpose**: HTTP client abstraction for Shopware Store API and Admin API

**Key Files**:

- [src/createAPIClient.ts](packages/api-client/src/createAPIClient.ts) - Store API client factory
- [src/createAdminAPIClient.ts](packages/api-client/src/createAdminAPIClient.ts) - Admin API client factory
- [api-types/storeApiTypes.d.ts](packages/api-client/api-types/storeApiTypes.d.ts) - Generated Store API types
- [api-types/adminApiTypes.d.ts](packages/api-client/api-types/adminApiTypes.d.ts) - Generated Admin API types

**Common Tasks**:

- Adding new endpoints: Extend type definitions or regenerate types
- Error handling: Check [src/errorInterceptor.ts](packages/api-client/src/errorInterceptor.ts)
- Testing: Uses Vitest with mock server

### @shopware/composables

**Purpose**: Vue composables for business logic

**Available as Nuxt Layer**: Can be used as a Nuxt layer via `@shopware/composables/nuxt-layer`

**Key Files**:

- [src/index.ts](packages/composables/src/index.ts) - Main exports
- [nuxt.config.ts](packages/composables/nuxt.config.ts) - Nuxt layer configuration
- Individual composables in `src/use*/` directories
- Each composable has `.ts` and `.test.ts` files

**Structure**:

```
src/
├── useProduct/
│   ├── useProduct.ts
│   └── useProduct.test.ts
├── useCart/
│   ├── useCart.ts
│   └── useCart.test.ts
└── ...
```

**Common Composables**:

- `useProduct` - Product data and operations
- `useCart` - Shopping cart management
- `useUser` - User authentication and profile
- `useCheckout` - Checkout process
- `useListing` - Product listings with filters
- `useNavigation` - Navigation tree
- CMS composables: `useCmsBlock`, `useCmsSection`, `useCmsMeta`

**Testing**: Heavily tested with Vitest and `@vue/test-utils`

### @shopware/helpers

**Purpose**: Framework-agnostic utility functions

**Key Areas**:

- Price formatting
- URL handling (including `getBackgroundImageUrl` for CMS background image optimization)
- Translation helpers
- Data transformation

**Key Function — `getBackgroundImageUrl`**:
Generates optimized CSS `url()` values for CMS background images. Accepts an optional `BackgroundImageOptions` parameter (`{ format?: string; quality?: number }`) to append `&format=` and `&quality=` query parameters to the image URL. Used by `CmsPage` and `CmsGenericBlock` in `cms-base-layer`.

**Testing**: Pure functions, easy to test

### @shopware/nuxt-module

**Purpose**: Nuxt module for Shopware integration

**Note**: This is a Nuxt module (not a layer); layer functionality lives in `@shopware/composables/nuxt-layer` and `@shopware/cms-base-layer`

**Key Features**:

- Auto-imports composables
- Configures API client
- Provides plugins and middleware
- Layer support for extending Nuxt applications

## Working with Templates

Templates are starter projects demonstrating different use cases and setups.

### templates/manifest.json

**Read this before the prose below.** It is the single source of truth for which
templates exist and what each one needs. The list used to live in five places
that had already drifted apart, so anything that needs to know about templates
should read the manifest instead of hardcoding a list or globbing `templates/`.

```js
const manifest = require("./templates/manifest.json");

manifest.templates.filter((t) => t.scaffoldable); // may be offered as a project starting point
manifest.templates.filter((t) => t.supportLevel === "supported");
manifest.templates.find((t) => t.id === "vue-blank").env;
```

To start a new project from a template: run its `scaffoldCommand`, install
dependencies with pnpm (Node per its `node` range), run the package.json `dev`
script, open `http://localhost:<devPort>`. Every template
runs against a public demo backend out of the box; the `env` vars only re-point
it at your own Shopware instance. `devCommand`/`buildCommand` show what the
scripts do - run the scripts, not these strings. The root `manifestVersion`
bumps when field semantics change.

Per template:

| Field                       | Meaning                                                             |
| --------------------------- | ------------------------------------------------------------------- |
| `id`                        | Directory name under `templates/`. The identity used everywhere     |
| `displayName`               | Human-readable name for navigation, pickers and labels              |
| `packageName`               | The `name` in its `package.json`. Does **not** always match `id`    |
| `framework`                 | `nuxt`, `astro` or `vite`                                           |
| `purpose`                   | One sentence on what it is for                                      |
| `supportLevel`              | `supported`, `example` or `deprecated`                              |
| `scaffoldable`              | Whether it may be offered as a starting point for a new project     |
| `scaffoldCommand`           | Copies it out of the monorepo. `null` exactly when not scaffoldable |
| `deployable`                | Whether it is deployed anywhere                                     |
| `devcontainer`              | Whether `.devcontainer/<id>/` exists, for Codespaces links          |
| `docsUrl`                   | Documentation page, or `null` when none exists yet                  |
| `issueUrl`                  | Prefilled report link, title prefixed with the template id          |
| `env`                       | Env vars that point it at your own instance. Demo defaults built in |
| `node`                      | The `engines.node` range from its `package.json`                    |
| `devPort`                   | Port the dev server listens on                                      |
| `buildCommand`/`devCommand` | What the `build` and `dev` scripts in its `package.json` do         |
| `typeGeneration`            | How to regenerate Store API types for your instance, or `null`      |
| `notes`                     | Optional, anything the fields above cannot express                  |

Two ids do not match their package name: `astro` is `shopware-astro` and
`vue-starter-template-extended` is `lumora-demo-store`. Filter pnpm workspaces on
`packageName`, identify directories on `id`.

`templates/manifest.schema.json` is the schema. Editors pick it up through the
`$schema` key in the manifest, and `pnpm run check:templates` validates against
it with ajv, so the schema is the definition rather than a copy of one.

The check also fails when `templates/` on disk and the manifest disagree in
either direction, when an id is duplicated, when `packageName`, `buildCommand`,
`devCommand`, `node` or `typeGeneration` disagree with the template's `package.json`,
when the `node` range admits versions the template's framework rejects, when a `docsUrl`
does not resolve to a file under `apps/docs/src/`, when an `issueUrl` title is
not prefixed with its own template id, when `scaffoldable` and `scaffoldCommand`
disagree, or when the `devcontainer` flag and `.devcontainer/<id>/` disagree in
either direction. It runs in CI as its own `Templates manifest` workflow,
triggered by changes to `templates/`, `apps/docs/src/`, `.devcontainer/` or the
check itself. **When you add or remove a template, or change its build or dev
script, update the manifest in the same change.**

### vue-demo-store

**Purpose**: Full-featured reference implementation

**Location**: `templates/vue-demo-store/`

**What's Included**:

- Nuxt 4 with full SSR
- UnoCSS (Tailwind-compatible) styling
- i18n (internationalization) support
- @shopware/cms-base-layer for CMS integration
- Complete eCommerce features: product listings, cart, checkout, user account
- Pre-configured with demo Shopware 6 API

**Key Files**:

- `nuxt.config.ts` - Nuxt and Shopware configuration
- `uno.config.ts` - UnoCSS styling configuration
- `app/` - Application pages and components
- `i18n/` - Translation files

**Use Case**: Full reference for production applications, learning all features

**How to Use**:

```bash
# From root
pnpm run dev --filter=vue-demo-store

# Or standalone
cd templates/vue-demo-store
pnpm i
pnpm dev
```

### vue-starter-template

**Purpose**: Starter without demo content

**Location**: `templates/vue-starter-template/`

**What's Included**:

- Nuxt 4 setup
- All core Shopware packages
- UnoCSS styling
- i18n support
- Clean structure ready to build upon
- Type generation setup

**Component dirs** (see `nuxt.config.ts` `components`):

- `app/components/global/` — SEO page resolver targets (`FrontendDetailPage`, `FrontendLandingPage`, `FrontendNavigationPage`). Registered `global: true` for `resolveComponent` in `pages/[...all].vue`. Use `pathPrefix: false` so names stay `Frontend*`.
- `app/components/cms/` — custom / override CMS blocks & elements (`CmsBlock*`, `CmsElement*`). Also `global: true` for CMS `resolveComponent`.
- `app/components/**` — layout, checkout, account, forms, etc. Normal auto-import (not global), to avoid `INEFFECTIVE_DYNAMIC_IMPORT` from Lazy wrappers.

Do **not** register `global: true` twice on the same `components/` path with different `pattern`/`ignore` — Nuxt skips the second scan under that path.

**Use Case**: Starting a new production project from scratch

### vue-blank

**Purpose**: Minimal Nuxt setup

**Location**: `templates/vue-blank/`

**What's Included**:

- Bare minimum Nuxt 4 configuration
- Shopware core packages only
- No styling framework
- No i18n
- Minimal dependencies

**Use Case**: Learning, prototyping, or custom setup from minimal base

### vue-vite-blank

**Purpose**: Minimal Vite + Vue setup (no Nuxt)

**Location**: `templates/vue-vite-blank/`

**What's Included**:

- Plain Vite + Vue 3
- Shopware composables and API client
- No SSR (client-side only)
- Minimal setup

**Use Case**: Non-Nuxt projects, SPAs, or custom bundler setups

### astro

**Purpose**: Astro integration example

**Location**: `templates/astro/`

**What's Included**:

- Astro 7.x setup
- Vue integration for Shopware composables
- Shopware API client
- Server-side rendering with Astro

**Use Case**: Using Shopware with Astro framework, content-focused sites

**Key Differences**:

- Astro's island architecture
- Different SSR approach than Nuxt
- Mix of static and dynamic content

### vue-starter-template-extended

**Purpose**: Example of extending templates using Nuxt layers

**Location**: `templates/vue-starter-template-extended/`

**What's Included**:

- Extends vue-starter-template using Nuxt's `extends` feature
- Minimal codebase - only customizations and overrides
- Custom app.config.ts for theme customization (e.g., image placeholder color)
- UnoCSS configuration with brand-specific styles
- Example of the "Lumora" brand (home scents store)

**Key Concepts**:

**Layer Pattern** - Nuxt layers allow extending a base template:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ["../vue-starter-template"], // or npm package
  // ... your customizations
});
```

**Component Inheritance** - All components from the base layer are automatically available:

- Pages (`FrontendNavigationPage`, `FrontendDetailPage`, …) from base `app/components/global/`
- Layouts (headers, footers, navigation)
- Forms (login, checkout, account)
- Shared components (modals, notifications)

**Component Overriding** - Match the base directory so names and `resolveComponent` keep working:

```
your-project/
  app/
    components/
      global/
        FrontendDetailPage.vue  # Overrides SEO PDP resolver (must stay global)
      cms/
        element/
          CmsElementImage.vue   # Overrides CMS element (must stay global)
      SwProductCard.vue         # Normal auto-import override
      layout/
        Header.vue              # Overrides LayoutHeader
```

**App Config Customization** - Use `app.config.ts` to customize layer settings:

```typescript
// app/app.config.ts
export default defineAppConfig({
  imagePlaceholder: {
    color: "#B38A65", // Brand color
  },
});
```

**Benefits**:

- Inherits all features from vue-starter-template
- Minimal code duplication
- Easy to customize specific components
- Automatic updates when base template improves

**Use Case**:

- Creating brand-specific storefronts without duplicating code
- Maintaining multiple store variants from a single base
- Testing customizations without modifying the base template
- Learning the layer pattern for production projects

**Dependencies**:

- Lists `vue-starter-template` as workspace dependency
- Gets `@shopware/cms-base-layer` CMS components through the vue-starter-template base layer

### Template Configuration

Every template ships with working demo-backend defaults, so it runs with no
configuration at all. To point one at your own Shopware instance, set the env
vars its manifest entry lists under `env`. The names differ per framework, so
read them from the manifest instead of memorizing them. For the Nuxt templates:

```bash
# .env (vue-starter-template ships a .env.template with these two)
NUXT_PUBLIC_SHOPWARE_ENDPOINT=https://your-shop.com/store-api
NUXT_PUBLIC_SHOPWARE_ACCESS_TOKEN=your-access-token
```

The demo defaults these override live in each template's `nuxt.config.ts`, under
the `shopware` module key or `runtimeConfig.public.shopware`. See
[packages/nuxt-module/README.md](packages/nuxt-module/README.md) for both forms.

The astro template reads `API_URL`/`API_ACCESS_TOKEN` and vue-vite-blank reads
`VITE_DEMO_API_URL`/`VITE_DEMO_API_ACCESS_TOKEN`.

**Type Generation** (templates whose manifest `typeGeneration` is not `null`):

```bash
# Set OPENAPI_JSON_URL and OPENAPI_ACCESS_KEY first, then:
npx shopware-api-gen loadSchema --apiType=store   # fetch your instance's schema
pnpm run generate-types                           # regenerate the types from it
```

Both values derive from the storefront configuration: `OPENAPI_JSON_URL` is
`NUXT_PUBLIC_SHOPWARE_ENDPOINT` without its `/store-api` suffix, and
`OPENAPI_ACCESS_KEY` is the same value as `NUXT_PUBLIC_SHOPWARE_ACCESS_TOKEN`.
The manifest's `typeGeneration.env` carries these derivations per template.

Skipping the fetch makes `generate-types` fall back to the published default
types, which do not include your instance's extensions.

### Choosing a Template

| Need                     | Template                      |
| ------------------------ | ----------------------------- |
| Learn all features       | vue-demo-store                |
| Start production project | vue-starter-template          |
| Extend existing template | vue-starter-template-extended |
| Minimal Nuxt setup       | vue-blank                     |
| No SSR/No Nuxt           | vue-vite-blank                |
| Use Astro                | astro                         |

This table is for humans. Code should read `templates/manifest.json`.

## Making Changes

### 1. Before Starting

```bash
# Ensure dependencies are installed
pnpm i

# Build packages if working in templates/apps
pnpm run build --filter='./packages/*'
```

### 2. During Development

```bash
# For package changes, use stub mode for fast iteration
cd packages/composables
pnpm run dev  # unbuild --stub

# Run tests in watch mode
pnpm run test:watch

# Check types continuously
pnpm run typecheck
```

### 3. Before Committing

```bash
# Run linting and formatting
pnpm run lint:fix
pnpm format

# Run tests
pnpm run test

# Check types
pnpm run typecheck
```

### 4. Creating Changesets

When making changes that affect published packages:

```bash
pnpm changeset
# Follow prompts to:
# 1. Select affected packages
# 2. Choose version bump (major/minor/patch)
# 3. Write description
```

This creates a file in `.changeset/` - commit it with your changes.

### 5. Pull Request Guidelines

- **Title**: Follow [Conventional Commits](https://www.conventionalcommits.org/)
  - `feat: add new feature`
  - `fix: resolve bug`
  - `docs: update documentation`
  - `chore: maintenance task`
- **Description**: Clear explanation of changes
- **Changeset**: Required for package changes
- **Tests**: Add/update tests for new functionality

## Git Workflow

**Main Branch**: `main`

**Recent Activity**: Dependency updates, documentation improvements, feature additions

## Testing Strategy

### Unit Tests (Vitest)

- Located next to source files (`.test.ts`)
- Run with `pnpm test`
- Coverage with `pnpm run coverage` (only `packages/composables` has this script)

### E2E Tests (Playwright)

- Located in `apps/e2e-tests/`
- Install the browsers once with `pnpm exec playwright install chromium`
- Run with `pnpm run test:e2e`. That script is `playwright test --grep @storefront` and takes its target from `BASE_E2E_URL`. The tag names the intent; the specs still hardcode demo store catalog content, so they only pass against that storefront today
- CI runs them against `vue-starter-template` in `.github/workflows/e2e-starter-template.yml`. That run is red on purpose and does not block pull requests, see #2650 and #2651
- The `@accessibility` specs are template agnostic. Run them against any storefront:

```bash
cd apps/e2e-tests
BASE_E2E_URL=https://frontends-starter-template.vercel.app/ \
  pnpm exec playwright test --grep @accessibility --project=chromium
```

- Target host comes from `BASE_E2E_URL`, read from a `.env` file found by walking up from the working directory. See `.env.template` and `apps/e2e-tests/README.md`

### Type Tests

- TypeScript compilation checks
- Run with `pnpm run typecheck`

## Common Issues and Solutions

### Issue: Type errors after changes

```bash
# Rebuild packages
pnpm run build --filter='./packages/*'
# Recheck types
pnpm run typecheck
```

### Issue: Changes not reflected in template

```bash
# Packages need to be built, or use stub mode
cd packages/[package-name]
pnpm run dev  # Runs unbuild --stub for hot reload
```

The Nuxt layers (`cms-base-layer`, `unocss-design-tokens-layer`) have no build step. They
ship their sources as-is, so template changes show up straight away.

### Issue: Dependency conflicts

```bash
# Check pnpm overrides in root package.json
# Clear and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm i
```

### Issue: Turbo cache issues

```bash
# Clear Turbo cache
rm -rf .turbo
pnpm run build
```

## Best Practices for AI Agents

1. **Always read before editing**: Use Read tool before Write/Edit
2. **Respect build order**: Build packages before templates/apps
3. **Follow existing patterns**: Match code style and structure
4. **Test changes**: Run tests and type checks
5. **Use workspace protocol**: For internal dependencies
6. **Create changesets**: For version-bumped changes
7. **Preserve exports**: Don't break public APIs without major version
8. **TypeScript first**: Maintain type safety
9. **Test with real data**: Use demo store for integration testing
10. **Document public APIs**: JSDoc for exported functions/types

## File Patterns to Recognize

- `*.test.ts` - Test files (Vitest)
- `*.spec.ts` - Alternative test files
- `*.d.ts` - TypeScript declaration files
- `build.config.ts` - Build configuration (unbuild)
- `vitest.config.ts` - Test configuration
- `nuxt.config.ts` - Nuxt configuration
- `.changeset/*.md` - Changeset files

## API and Documentation

- **Documentation**: [developer.shopware.com/frontends](https://developer.shopware.com/frontends/)
- **Demo**: [frontends-starter-template.vercel.app](https://frontends-starter-template.vercel.app/)
- **Repository**: [github.com/shopware/frontends](https://github.com/shopware/frontends)
- **Discussions**: [GitHub Discussions](https://github.com/shopware/frontends/discussions)

## Environment

- **Node.js**: 22.19+, 24.11+ or 26+ required (the floor comes from Nuxt 4.5)
- **pnpm**: 11.5.2 (managed by packageManager field)
- **Corepack**: Recommended for Node.js version management

## References for Deep Work

When working on specific features, consult:

- API client: Check Store API types in `api-types/storeApiTypes.d.ts`
- Composables: Review tests for usage examples
- CMS: Check [cms-base-layer](packages/cms-base-layer/) for component structure
- Templates: Use [vue-starter-template](templates/vue-starter-template/) as reference implementation

## Quick Commands Reference

```bash
# Install
pnpm i

# Build everything
pnpm run build

# Build packages only
pnpm run build --filter='./packages/*'

# Build specific package
pnpm run build --filter=@shopware/api-client

# Run demo store
pnpm run dev --filter=vue-demo-store

# Run docs (developer-portal CLI)
pnpm docs:env && pnpm docs:link && pnpm docs:preview

# Lint and fix
pnpm run lint:fix && pnpm format

# Test
pnpm run test

# Type check
pnpm run typecheck

# Create changeset
pnpm changeset
```

## Security Note

This is a frontend framework for eCommerce. Be mindful of:

- Authentication flows
- Payment integrations
- Customer data handling
- XSS prevention in CMS content
- CSRF protection
- Secure API communication

---

**Last Updated**: 2026-08-28
**Repository Version**: Based on commit 469d6347
