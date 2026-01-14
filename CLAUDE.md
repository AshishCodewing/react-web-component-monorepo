# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a pnpm monorepo that builds React components as Web Components (Custom Elements) for embedding in external applications. The primary use case is creating standalone widget bundles that can be consumed by any web application.

## Build & Development Commands

```bash
# Install dependencies
pnpm install

# Development (all packages)
pnpm dev

# Build all packages
pnpm build

# Lint all packages
pnpm lint

# Run specific package
pnpm --filter @monorepo/web dev
pnpm --filter @monorepo/web build

# Docker development
docker compose up        # Development with HMR on port 5175
docker compose --profile production up  # Production build on port 8080
```

## Architecture

### Package Structure
- `apps/web` - Main application that builds widgets as Web Components
- `packages/ui` - Shared UI component library (shadcn/ui style with Radix primitives)

### Web Component Pattern

Widgets are React components wrapped as Web Components using `WebComponentFactory`:

```tsx
// apps/web/src/widgets/{name}/index.tsx
import { defineWebComponent } from '@/core/WebComponentFactory'
import Component from './Component'
import "@/styles/widget-base.css"

defineWebComponent({
  tagName: 'widget-name',
  component: Component,
  observedAttributes: {
    'prop-name': 'propName',
  },
  jsonAttributes: ['propName'],
  events: {
    onSelect: 'select',
  },
})
```

The factory (`apps/web/src/core/WebComponentFactory.tsx`) provides:
- Attribute mapping (kebab-case to camelCase)
- JSON attribute parsing
- Custom event dispatching
- Optional Shadow DOM

### Widget Build System

Vite automatically discovers widgets from `apps/web/src/widgets/*/index.tsx`. Each widget directory becomes a separate entry point. The build outputs:
- Individual widget bundles in `apps/web/dist/assets/`
- Manifest file for asset discovery
- Vendor chunks: `react-vendor`, `radix-vendor`, `vendor`

### Styling Architecture

- **Tailwind CSS v4** with `@tailwindcss/vite` plugin
- CSS variables defined in both `:root` and `:host` for Shadow DOM compatibility
- `packages/ui/src/styles/globals.css` - Base shadcn theme tokens
- `apps/web/src/styles/widget-base.css` - Widget entry point (imports globals + host theme)
- `apps/web/src/styles/base-theme.css` - Custom color palette using OKLCH

### UI Components

Uses shadcn/ui "new-york" style with:
- Radix UI primitives (@radix-ui/react-*)
- class-variance-authority for variants
- `cn()` utility from `@monorepo/ui/lib/utils` for class merging

Import UI components via package exports:
```tsx
import { Button } from "@monorepo/ui/components/button"
import { cn } from "@monorepo/ui/lib/utils"
```

## Key Conventions

- Widgets use Shadow DOM for style isolation
- Path alias `@/` maps to `apps/web/src/`
- TypeScript strict mode enabled
- ESLint with typescript-eslint and react-hooks plugins
