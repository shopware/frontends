# AI Agent Guide for Shopware Frontends

This document provides guidance for AI assistants working with the Shopware Frontends monorepo.

## TL;DR

**What**: Vue.js framework for Shopware 6 eCommerce storefronts
**Structure**: pnpm monorepo with Turbo
**Tech**: Vue 3, Nuxt 4, TypeScript, Vitest, Biome
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
│   ├── nuxt-module/          # Nuxt 3 integration
│   ├── api-gen/              # Type generation tool
│   └── eslint-config-shopware/
├── templates/         # Starter templates
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

- **Framework**: Vue 3, Nuxt 4.1
- **Build**: Vite 7, Turbo, unbuild
- **Package Manager**: pnpm 10.17.0
- **Language**: TypeScript
- **Styling**: UnoCSS, Tailwind.css
- **Testing**: Vitest (unit), Playwright (e2e)
- **Linting**: Biome (replaces ESLint + Prettier)
- **Versioning**: Changesets

## Common Development Commands

### Package Management
```bash
pnpm i                                    # Install dependencies
pnpm run build                            # Build all packages
pnpm run build --filter='./packages/*'   # Build only packages
pnpm run build --filter=api-client       # Build specific package
```

### Development
```bash
pnpm run dev --filter=vue-demo-store     # Run demo store
pnpm run dev --filter=docs               # Run documentation
```

### Quality Assurance
```bash
pnpm run lint                             # Lint all packages
pnpm run lint:fix                         # Fix linting issues
pnpm run typecheck                        # TypeScript checking
pnpm run test                             # Run tests
pnpm run test:watch                       # Watch mode
pnpm run test:e2e                         # E2E tests
pnpm format                               # Format with Biome
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
- `api-client` → `helpers` → `composables` → `cms-base-layer` → `nuxt-module`

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

## Key Files to Know

### Root Configuration
- [package.json](package.json) - Root workspace config
- [turbo.json](turbo.json) - Build pipeline configuration
- [pnpm-workspace.yaml](pnpm-workspace.yaml) - Workspace definition
- [biome.json](biome.json) - Linting/formatting config
- [.changeset/](\.changeset/) - Changesets for versioning

### Package Configs
- Each package has its own `package.json`, `tsconfig.json`
- Build configs: `unbuild.config.ts` or `build.config.ts`
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

**Purpose**: Nuxt 3 module for Shopware integration

**Available as Nuxt Layer**: Provides full Nuxt layer functionality for seamless integration

**Key Features**:
- Auto-imports composables
- Configures API client
- Provides plugins and middleware
- Layer support for extending Nuxt applications

## Working with Templates

Templates are starter projects demonstrating different use cases and setups.

### vue-demo-store

**Purpose**: Full-featured reference implementation

**Location**: `templates/vue-demo-store/`

**What's Included**:
- Nuxt 4.1 with full SSR
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
- Nuxt 4.1 setup
- All core Shopware packages
- UnoCSS styling
- i18n support
- Clean structure ready to build upon
- Type generation setup

**Use Case**: Starting a new production project from scratch

### vue-blank

**Purpose**: Minimal Nuxt setup

**Location**: `templates/vue-blank/`

**What's Included**:
- Bare minimum Nuxt 4.1 configuration
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
- Astro 5.x setup
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
  extends: ["../vue-starter-template"],  // or npm package
  // ... your customizations
});
```

**Component Inheritance** - All components from the base layer are automatically available:
- Pages (FrontendNavigationPage, FrontendDetailPage, etc.)
- Layouts (headers, footers, navigation)
- Forms (login, checkout, account)
- Shared components (modals, notifications)

**Component Overriding** - Create components in your `app/components/` to override base components:
```
your-project/
  app/
    components/
      SwProductCard.vue  # Overrides base SwProductCard
```

**App Config Customization** - Use `app.config.ts` to customize layer settings:
```typescript
// app/app.config.ts
export default defineAppConfig({
  imagePlaceholder: {
    color: "#B38A65",  // Brand color
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
- Includes `@shopware/cms-base-layer` for CMS components

### Template Configuration

All templates support:

**API Configuration** (`nuxt.config.ts` or equivalent):
```typescript
export default defineNuxtConfig({
  modules: ["@shopware/nuxt-module"],
  shopware: {
    endpoint: "https://your-shop.com/store-api",
    accessToken: "your-access-token",
  },
});
```

**Type Generation** (all Nuxt templates):
```bash
pnpm run generate-types
# Uses @shopware/api-gen to generate types from your Shopware instance
```

**Environment Variables**:
Create `.env` file (use `.env.template` as reference):
```bash
SHOPWARE_ENDPOINT=https://your-shop.com/store-api
SHOPWARE_ACCESS_TOKEN=your-access-token
```

### Choosing a Template

| Need | Template |
|------|----------|
| Learn all features | vue-demo-store |
| Start production project | vue-starter-template |
| Extend existing template | vue-starter-template-extended |
| Minimal Nuxt setup | vue-blank |
| No SSR/No Nuxt | vue-vite-blank |
| Use Astro | astro |

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

**Current Status**: Clean working directory (as of e06b2f32)

**Recent Activity**: Dependency updates, documentation improvements, feature additions

## Testing Strategy

### Unit Tests (Vitest)
- Located next to source files (`.test.ts`)
- Run with `pnpm test`
- Coverage with `pnpm run coverage` (in package directory)

### E2E Tests (Playwright)
- Located in `apps/e2e-tests/`
- Run with `pnpm run test:e2e`

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
- `unbuild.config.ts` - Build configuration
- `vitest.config.ts` - Test configuration
- `nuxt.config.ts` - Nuxt configuration
- `.changeset/*.md` - Changeset files

## API and Documentation

- **Documentation**: [frontends.shopware.com](https://frontends.shopware.com/)
- **Demo**: [frontends-demo.vercel.app](https://frontends-demo.vercel.app/)
- **Repository**: [github.com/shopware/frontends](https://github.com/shopware/frontends)
- **Discussions**: [GitHub Discussions](https://github.com/shopware/frontends/discussions)

## Environment

- **Node.js**: 20.x or 22.x required
- **pnpm**: 10.17.0 (managed by packageManager field)
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
pnpm run build --filter=api-client

# Run demo store
pnpm run dev --filter=vue-demo-store

# Run docs
pnpm run dev --filter=docs

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

**Last Updated**: 2025-09-30
**Repository Version**: Based on commit e06b2f32