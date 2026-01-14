# Creating Components with Base UI and CSS Modules

This guide explains how to create reusable UI components in `packages/ui` using Base UI primitives and CSS Modules.

## Overview

Components are built with:
- **Base UI** (`@base-ui/react`) - Unstyled, accessible primitives
- **CSS Modules** - Scoped styling without Tailwind

## Component Structure

```
packages/ui/src/components/
└── my-component/
    ├── MyComponent.tsx      # Component logic
    └── index.module.css     # Component styles
```

## Creating a Component

### 1. Create the Component File

```tsx
// packages/ui/src/components/select/Select.tsx
import { Select } from '@base-ui/react/select';
import "@monorepo/ui/tokens.css";
import styles from './index.module.css';

export interface SelectProps {
  options: { value: string; label: string }[];
  placeholder?: string;
  onChange?: (value: string) => void;
}

export function MySelect({ options, placeholder, onChange }: SelectProps) {
  return (
    <Select.Root onValueChange={onChange}>
      <Select.Trigger className={styles.Trigger}>
        <Select.Value placeholder={placeholder} />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner>
          <Select.Popup className={styles.Popup}>
            {options.map((option) => (
              <Select.Item key={option.value} value={option.value} className={styles.Item}>
                <Select.ItemText>{option.label}</Select.ItemText>
                <Select.ItemIndicator className={styles.Indicator}>
                  ✓
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
```

### 2. Create the CSS Module

```css
/* packages/ui/src/components/select/index.module.css */
.Trigger {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--base-clr-30);
  border-radius: var(--radius-md);
  background: transparent;
  cursor: pointer;
}

.Trigger:focus-visible {
  outline: 2px solid var(--primary-clr-100);
  outline-offset: 2px;
}

.Popup {
  background: var(--base-clr-0);
  border: 1px solid var(--base-clr-30);
  border-radius: var(--radius-md);
  padding: var(--spacing-xs);
}

.Item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.Item[data-highlighted] {
  background: var(--base-clr-10);
}

.Item[data-selected] {
  color: var(--primary-clr-100);
}

.Indicator[data-unchecked] {
  display: none;
}
```

### 3. Import in apps/web

The wildcard export in `packages/ui/package.json` automatically exposes all components:

```json
{
  "exports": {
    "./components/*": "./src/components/*.tsx"
  }
}
```

Import directly without updating package.json:

```tsx
import { MySelect } from "@monorepo/ui/components/select/Select";
```

## Base UI Data Attributes

Base UI exposes data attributes for styling component states:

| Attribute | Description |
|-----------|-------------|
| `[data-checked]` | Element is checked/selected |
| `[data-unchecked]` | Element is not checked |
| `[data-disabled]` | Element is disabled |
| `[data-highlighted]` | Keyboard-focused or hovered |
| `[data-pressed]` | Element is being pressed |
| `[data-open]` | Popup/dialog is open |
| `[data-closed]` | Popup/dialog is closed |

Example usage:

```css
.Radio {
  border: 1px solid var(--base-clr-30);
}

.Radio[data-checked] {
  border-color: var(--primary-clr-100);
  background: var(--primary-clr-10);
}

.Radio[data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
```

## Design Tokens

Import tokens for consistent styling:

```tsx
import "@monorepo/ui/tokens.css";
```

Available tokens:

| Category | Tokens |
|----------|--------|
| Spacing | `--spacing-xs`, `--spacing-sm`, `--spacing-md`, `--spacing-lg` |
| Colors | `--base-clr-*`, `--primary-clr-*` |
| Typography | `--font-size-*`, `--font-weight-*`, `--line-height-*` |
| Borders | `--radius-sm`, `--radius-md`, `--radius-lg` |
| Transitions | `--transition-base` |

## Available Base UI Primitives

Common primitives from `@base-ui/react`:

- `Checkbox` - Checkbox input
- `Dialog` - Modal dialogs
- `Menu` - Dropdown menus
- `Popover` - Popovers and tooltips
- `Radio` / `RadioGroup` - Radio buttons
- `Select` - Select dropdowns
- `Slider` - Range sliders
- `Switch` - Toggle switches
- `Tabs` - Tabbed interfaces
- `Tooltip` - Tooltips

Import pattern:

```tsx
import { Select } from '@base-ui/react/select';
import { Radio } from '@base-ui/react/radio';
import { RadioGroup } from '@base-ui/react/radio-group';
```

See [Base UI documentation](https://base-ui.com/) for full API reference.
