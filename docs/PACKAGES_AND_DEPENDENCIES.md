# Packages and Dependencies Guide

This guide explains how `apps/web` and `packages/ui` are connected, how to manage dependencies, and how to add shadcn components if needed in the future.

## Package Structure

```
monorepo/
├── apps/
│   └── web/                 # Widget application
│       ├── src/
│       │   ├── widgets/     # Web Component widgets
│       │   ├── core/        # WebComponentFactory
│       │   └── styles/      # Widget-specific styles
│       └── components.json  # shadcn CLI configuration
│
└── packages/
    └── ui/                  # Shared UI component library
        └── src/
            ├── components/  # Reusable UI components
            ├── hooks/       # Shared React hooks
            ├── lib/         # Utilities (cn, etc.)
            └── styles/      # Global styles
```

## How apps/web and packages/ui Are Connected

The `apps/web` package depends on `packages/ui` as a workspace dependency:

```json
// apps/web/package.json
{
  "dependencies": {
    "@monorepo/ui": "workspace:^"
  }
}
```

This allows `apps/web` to import components and utilities from the UI package:

```tsx
import { Button } from "@monorepo/ui/components/button"
```

The UI package exports are defined in `packages/ui/package.json`:

```json
{
  "exports": {
    "./globals.css": "./src/styles/globals.css",
    "./tokens.css": "./src/styles/tokens.css",
    "./utilities.css": "./src/styles/utilities.css",
    "./postcss.config": "./postcss.config.mjs",
    "./lib/*": "./src/lib/*.ts",
    "./components/*": "./src/components/*.tsx",
    "./hooks/*": "./src/hooks/*.ts"
  }
}
```

## Managing Dependencies

**All dependencies should be added from the monorepo root directory.**

### Add Dependency to a Specific Package

```bash
# Add to apps/web
pnpm --filter @monorepo/web add <package-name>

# Add to packages/ui
pnpm --filter @monorepo/ui add <package-name>
```

### Add Dev Dependency

```bash
# Add dev dependency to apps/web
pnpm --filter @monorepo/web add -D <package-name>

# Add dev dependency to packages/ui
pnpm --filter @monorepo/ui add -D <package-name>
```

### Add Dependency to Root (shared tooling)

```bash
pnpm add -D -w <package-name>
```

### Examples

```bash
# Add a runtime dependency to the web app
pnpm --filter @monorepo/web add date-fns

# Add a UI library to the shared package
pnpm --filter @monorepo/ui add @radix-ui/react-tooltip

# Add a dev tool to root
pnpm add -D -w prettier
```

## Creating Components in packages/ui

The `packages/ui` package serves as the shared component library. Components are built using **Base UI** (`@base-ui/react`) for accessible primitives and **CSS Modules** for scoped styling.

See [CREATING_COMPONENTS.md](./CREATING_COMPONENTS.md) for detailed instructions on:
- Component file structure
- Using Base UI primitives
- Styling with CSS Modules and data attributes
- Available design tokens

## Adding shadcn Components (Optional)

While the current widgets use Base UI, the monorepo is configured to support shadcn/ui components if needed for future development.

### Prerequisites

The `apps/web/components.json` configures the shadcn CLI:

```json
{
  "style": "new-york",
  "tailwind": {
    "css": "../../packages/ui/src/styles/globals.css"
  },
  "aliases": {
    "utils": "@monorepo/ui/lib/utils",
    "ui": "@monorepo/ui/components"
  }
}
```

This configuration tells the CLI to:
- Install components to `packages/ui/src/components/`
- Use utilities from `@monorepo/ui/lib/utils`
- Apply styles to `packages/ui/src/styles/globals.css`

### Adding a shadcn Component

1. Navigate to the apps/web directory:

```bash
cd apps/web
```

2. Run the shadcn CLI:

```bash
pnpm dlx shadcn@latest add <component-name>
```

3. Examples:

```bash
# Add a single component
pnpm dlx shadcn@latest add button

# Add multiple components
pnpm dlx shadcn@latest add dialog dropdown-menu

# Add all components
pnpm dlx shadcn@latest add --all
```

The component will be added to `packages/ui/src/components/` and can then be imported in any package:

```tsx
import { Button } from "@monorepo/ui/components/button"
```

### Note on Tailwind

shadcn components require Tailwind CSS. If you plan to use shadcn components, ensure Tailwind is properly configured in your build pipeline. The current widget setup does not use Tailwind.
