# Web Component Factory Pattern

The `WebComponentFactory` is a utility for wrapping React components as Web Components (Custom Elements) with advanced features like attribute mapping, JSON parsing, and custom event dispatching.

## When to Use

| Pattern | Use Case |
|---------|----------|
| `@r2wc/react-to-web-component` | Simple widgets with basic props |
| `WebComponentFactory` | Complex widgets needing custom events, JSON attributes, or fine-grained control |

## API

### defineWebComponent

The simplest way to create and register a Web Component:

```tsx
import { defineWebComponent } from '@/core/WebComponentFactory'
import MyComponent from './MyComponent'

defineWebComponent({
  tagName: 'my-widget',
  component: MyComponent,
  observedAttributes: {
    'user-id': 'userId',
    'config': 'config',
  },
  jsonAttributes: ['config'],
  events: {
    onSubmit: 'submit',
    onChange: 'change',
  },
})
```

### Configuration Options

```typescript
interface WebComponentConfig<TProps> {
  // Required: Custom element tag name (must contain a hyphen)
  tagName: string

  // Required: React component to wrap
  component: React.ComponentType<TProps>

  // Required: Map attribute names (kebab-case) to prop names (camelCase)
  observedAttributes: Record<string, string>

  // Optional: Attributes to parse as JSON
  jsonAttributes?: string[]

  // Optional: Map callback props to custom event names
  events?: Record<string, string>

  // Optional: Transform event data before dispatching
  eventTransformers?: Record<string, (data: any) => any>

  // Optional: Use Shadow DOM (default: true)
  useShadowDom?: boolean

  // Optional: CSS to inject into Shadow DOM
  styles?: string
}
```

## Features

### Attribute Mapping

Automatically converts HTML attributes (kebab-case) to React props (camelCase):

```tsx
observedAttributes: {
  'trip-id': 'tripId',      // <my-widget trip-id="123"> → props.tripId = "123"
  'is-active': 'isActive',  // <my-widget is-active="true"> → props.isActive = "true"
}
```

### JSON Attributes

Parse complex data structures from attributes:

```tsx
jsonAttributes: ['config', 'items']

// Usage in HTML:
// <my-widget config='{"theme":"dark","size":"lg"}' items='[1,2,3]'>
// Results in:
// props.config = { theme: "dark", size: "lg" }
// props.items = [1, 2, 3]
```

### Custom Events

Convert React callback props to DOM Custom Events:

```tsx
events: {
  onDateSelect: 'date-selected',  // props.onDateSelect() → dispatches 'date-selected'
  onClose: 'widget-close',        // props.onClose() → dispatches 'widget-close'
}

// Listen in parent application:
document.querySelector('my-widget').addEventListener('date-selected', (e) => {
  console.log(e.detail) // Event data from the callback
})
```

### Event Transformers

Transform callback data before dispatching:

```tsx
events: {
  onSelect: 'item-selected',
},
eventTransformers: {
  onSelect: (item) => ({ id: item.id, name: item.name }), // Only expose specific fields
}
```

### Shadow DOM

By default, components render inside Shadow DOM for style isolation:

```tsx
useShadowDom: true,  // Default - isolated styles
useShadowDom: false, // Inherit parent page styles
```

### Custom Styles

Inject CSS directly into the Shadow DOM:

```tsx
styles: `
  :host {
    display: block;
    font-family: system-ui;
  }
  .container {
    padding: 1rem;
  }
`,
```

## Complete Example

```tsx
// src/widgets/date-picker/index.tsx
import { defineWebComponent } from '@/core/WebComponentFactory'
import DatePicker from './DatePicker'
import "@/styles/widget-base.css"

interface DatePickerProps {
  tripId: string
  selectedDate?: Date
  minDate?: Date
  maxDate?: Date
  onDateSelect: (date: Date) => void
  onClose: () => void
}

defineWebComponent<DatePickerProps>({
  tagName: 'date-picker-widget',
  component: DatePicker,
  observedAttributes: {
    'trip-id': 'tripId',
    'selected-date': 'selectedDate',
    'min-date': 'minDate',
    'max-date': 'maxDate',
  },
  jsonAttributes: ['selected-date', 'min-date', 'max-date'],
  events: {
    onDateSelect: 'date-selected',
    onClose: 'close',
  },
  eventTransformers: {
    onDateSelect: (date: Date) => ({
      date: date.toISOString(),
      timestamp: date.getTime(),
    }),
  },
})
```

### Usage in HTML

```html
<date-picker-widget
  trip-id="abc123"
  selected-date="\"2024-01-15T00:00:00.000Z\""
  min-date="\"2024-01-01T00:00:00.000Z\""
  max-date="\"2024-12-31T00:00:00.000Z\""
></date-picker-widget>

<script>
  const picker = document.querySelector('date-picker-widget')

  picker.addEventListener('date-selected', (e) => {
    console.log('Selected:', e.detail.date)
  })

  picker.addEventListener('close', () => {
    console.log('Picker closed')
  })
</script>
```

## Lifecycle

The factory handles the standard Web Component lifecycle:

| Method | Behavior |
|--------|----------|
| `constructor` | Creates Shadow DOM and mount point |
| `connectedCallback` | Injects styles and renders React component |
| `disconnectedCallback` | Unmounts React root to prevent memory leaks |
| `attributeChangedCallback` | Re-renders when observed attributes change |

## Debugging

In development mode, the factory logs:
- Component registration
- Render calls with props
- Custom events fired with their data

Check the browser console for `[tagName]` prefixed messages.

## Lower-Level API

For more control, use `createWebComponent` and `registerWebComponent` separately:

```tsx
import { createWebComponent, registerWebComponent } from '@/core/WebComponentFactory'

// Create the class
const MyWidgetElement = createWebComponent({
  tagName: 'my-widget',
  component: MyComponent,
  observedAttributes: { 'data-id': 'dataId' },
})

// Extend or modify if needed
class ExtendedWidget extends MyWidgetElement {
  // Add custom methods
}

// Register when ready
registerWebComponent('my-widget', ExtendedWidget)
```
