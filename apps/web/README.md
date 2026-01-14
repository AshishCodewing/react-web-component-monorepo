# @monorepo/web

Builds React widgets as Web Components (Custom Elements) for embedding in external applications.

## Scripts

```bash
pnpm dev           # Start development server with HMR
pnpm build         # Build for production
pnpm build:analyze # Build with bundle analysis (opens dist/stats.html)
pnpm lint          # Run ESLint
pnpm preview       # Preview production build
```

## Widget Structure

```
src/widgets/
└── my-widget/
    └── index.tsx    # Widget entry point
```

Vite automatically discovers widgets from `src/widgets/*/index.tsx`. Each widget becomes a separate bundle.

## Creating Widgets

Widgets wrap React components from `packages/ui` as Web Components using `WebComponentFactory`:

```tsx
// src/widgets/packages/index.tsx
import { defineWebComponent } from '@/core/WebComponentFactory'
import { Packages } from '@monorepo/ui/components/packages/Package'
import type { PackagesProps } from '@monorepo/ui/components/packages/Package'

defineWebComponent<PackagesProps>({
  tagName: 'packages-widget',
  component: Packages,
  observedAttributes: {
    'packages': 'packages',
    'translated-texts': 'translatedTexts',
  },
  jsonAttributes: ['packages', 'translatedTexts'],
  events: {
    onViewDetails: 'view-details',
  },
})
```

See [WEB_COMPONENT_FACTORY_PATTERN.md](../../docs/WEB_COMPONENT_FACTORY_PATTERN.md) for full API documentation.

## Build Output

- `dist/assets/` - Individual widget bundles
- `dist/shared/` - Vendor chunks (`react-vendor`, `base-ui-vendor`, `vendor`)
- `dist/manifest.json` - Asset manifest for discovery

## Path Aliases

- `@/` maps to `src/`

## Related Documentation

- [Creating Components](../../docs/CREATING_COMPONENTS.md) - How to create components in `packages/ui`
- [WebComponentFactory](../../docs/WEB_COMPONENT_FACTORY_PATTERN.md) - Full API reference
- [Packages & Dependencies](../../docs/PACKAGES_AND_DEPENDENCIES.md) - Monorepo structure
