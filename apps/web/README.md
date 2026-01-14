# @monorepo/web

Main application that builds React widgets as Web Components (Custom Elements) for embedding in external applications.

## Scripts

```bash
pnpm dev          # Start development server with HMR
pnpm build        # Build for production
pnpm build:analyze # Build with bundle analysis (opens dist/stats.html)
pnpm lint         # Run ESLint
pnpm preview      # Preview production build
```

## Widget Build System

Vite automatically discovers widgets from `src/widgets/*/index.tsx`. Each widget directory becomes a separate entry point.

### Build Output

- Individual widget bundles in `dist/assets/`
- Manifest file for asset discovery
- Vendor chunks: `react-vendor`, `radix-vendor`, `vendor`

## Creating Widgets

Widgets are React components wrapped as Web Components using the `WebComponentFactory`.

```tsx
// src/widgets/{name}/index.tsx
import { defineWebComponent } from '@/core/WebComponentFactory'
import Component from './Component'
import "@/styles/widget-base.css"

defineWebComponent({
  tagName: 'widget-name',
  component: Component,
  observedAttributes: {
    'prop-name': 'propName',
  },
  jsonAttributes: ['prop-name'],
  events: {
    onChange: 'change',
    onSubmit: 'submit',
  },
})
```

## Styling

- **Tailwind CSS v4** with `@tailwindcss/vite` plugin
- CSS variables defined in both `:root` and `:host` for Shadow DOM compatibility
- `src/styles/widget-base.css` - Widget entry point (imports globals + host theme)
- `src/styles/base-theme.css` - Custom color palette using OKLCH

## UI Components

Import shared UI components from the `@monorepo/ui` package:

```tsx
import { Button } from "@monorepo/ui/components/button"
import { cn } from "@monorepo/ui/lib/utils"
```

## Path Aliases

- `@/` maps to `src/`
