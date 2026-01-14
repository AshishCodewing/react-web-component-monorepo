# @monorepo/ui

Shared UI component library built with shadcn/ui patterns, Radix UI primitives, and Tailwind CSS v4.

## Usage

Import components and utilities via package exports:

```tsx
import { Button } from "@monorepo/ui/components/button"
import { Dialog } from "@monorepo/ui/components/dialog"
import { cn } from "@monorepo/ui/lib/utils"
```

## Styling

Uses shadcn/ui "new-york" style with:
- Radix UI primitives for accessibility
- `class-variance-authority` for component variants
- `tailwind-merge` via the `cn()` utility for class merging
- CSS variables for theming (`:root` and `:host` for Shadow DOM)

### Global Styles

Import the global stylesheet in your application:

```tsx
import "@monorepo/ui/globals.css"
```

## Package Exports

```json
{
  "./globals.css": "./src/styles/globals.css",
  "./postcss.config": "./postcss.config.mjs",
  "./lib/*": "./src/lib/*.ts",
  "./components/*": "./src/components/*.tsx",
  "./hooks/*": "./src/hooks/*.ts"
}
```
