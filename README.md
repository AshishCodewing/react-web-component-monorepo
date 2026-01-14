# Monorepo

A pnpm monorepo that builds React components as Web Components (Custom Elements) for embedding in external applications.

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build all packages
pnpm build
```

## Package Structure

| Package | Description |
|---------|-------------|
| `apps/web` | Main application that builds widgets as Web Components |
| `packages/ui` | Shared UI component library (shadcn/ui style with Radix primitives) |

## Development

```bash
pnpm dev      # Development (all packages)
pnpm build    # Build all packages
pnpm lint     # Lint all packages
pnpm test     # Run tests
pnpm clean    # Clean build artifacts
```

### Run Specific Package

```bash
pnpm --filter @monorepo/web dev
pnpm --filter @monorepo/web build
```

## Docker

```bash
# Development with HMR (port 5175)
docker compose up

# Production build (port 8080)
docker compose --profile production up
```

## Architecture

### Web Components

Widgets are React components wrapped as Web Components using the `WebComponentFactory`, which provides attribute mapping, JSON parsing, and custom event dispatching.

### Widget Discovery

Vite automatically discovers widgets from `apps/web/src/widgets/*/index.tsx`. Each widget directory becomes a separate entry point with its own bundle.

### Styling

- **Tailwind CSS v4** with `@tailwindcss/vite` plugin
- CSS variables in both `:root` and `:host` for Shadow DOM compatibility
- shadcn/ui "new-york" style components

## Requirements

- Node.js >= 20.0.0
- pnpm >= 9.0.0
