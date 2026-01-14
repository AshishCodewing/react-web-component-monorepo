# Build System and Widget Loading

This guide explains how the build system works, the difference between development and production builds, and how to load widgets in a host application.

## Build Modes

### Development Mode

In development, Vite serves source files directly with Hot Module Replacement (HMR):

```
http://localhost:5175/src/widgets/packages/index.tsx
```

- No bundling or chunking
- Source TypeScript/TSX served directly
- Vite transforms files on-demand
- CSS handled automatically by Vite
- Fast refresh on file changes

### Production Mode

Production builds are optimized and chunked:

```
dist/
├── assets/
│   └── packages.[hash].js       # Widget entry bundle
├── shared/
│   ├── react-vendor.[hash].js   # React + ReactDOM
│   ├── base-ui-vendor.[hash].js # Base UI components
│   ├── lucide-vendor.[hash].js  # Icons
│   ├── utils-vendor.[hash].js   # clsx, cva utilities
│   └── vendor.[hash].js         # Other dependencies
└── manifest.json                # Asset manifest
```

## Chunking Strategy

The build splits code into chunks for optimal caching and loading:

| Chunk | Contents | Caching |
|-------|----------|---------|
| `react-vendor` | React, ReactDOM, jsx-runtime | Rarely changes |
| `base-ui-vendor` | @base-ui/react primitives | Rarely changes |
| `lucide-vendor` | Icon library | Rarely changes |
| `utils-vendor` | clsx, class-variance-authority | Rarely changes |
| `vendor` | Other node_modules | Occasionally changes |
| `[widget]` | Widget-specific code | Changes with updates |

**Benefits:**
- Vendor chunks are cached long-term by browsers
- Widget updates only invalidate widget chunks
- Multiple widgets share the same vendor chunks

## Manifest File

The `manifest.json` maps source files to built assets:

```json
{
  "src/widgets/packages/index.tsx": {
    "file": "assets/packages.B83hV8k1.js",
    "css": ["assets/packages.6YDAr3BB.css"],
    "imports": ["react-vendor", "base-ui-vendor"]
  },
  "react-vendor": {
    "file": "shared/react-vendor.DGjhmOiu.js"
  }
}
```

## Widget Loader

Use the `WidgetLoader` script to dynamically load widgets in your host application.

### Configuration

```javascript
WidgetLoader.configure({
  baseUrl: 'https://widgets.example.com',  // Production CDN/server
  isDev: false,
});

// Or for development
WidgetLoader.configure({
  baseUrl: 'http://localhost:5175',
  isDev: true,
});
```

### Loading Widgets

```javascript
// Load a single widget
await WidgetLoader.load('packages');

// Load multiple widgets
await WidgetLoader.loadAll(['packages', 'date-picker', 'booking-form']);

// Preload manifest without loading widgets
await WidgetLoader.preload();

// Check if widget is loaded
if (WidgetLoader.isLoaded('packages')) {
  // Widget is ready
}
```

### How Loading Works

**Development:**
```javascript
// Loads directly from Vite dev server
// No manifest, no chunks, no separate CSS
<script type="module" src="http://localhost:5175/src/widgets/packages/index.tsx">
```

**Production:**
```javascript
// 1. Fetches manifest.json
// 2. Loads CSS files in parallel
// 3. Loads vendor chunks in parallel
// 4. Loads widget entry point
<link href="/assets/packages.6YDAr3BB.css">
<script type="module" src="/shared/react-vendor.DGjhmOiu.js">
<script type="module" src="/shared/base-ui-vendor.xyz123.js">
<script type="module" src="/assets/packages.B83hV8k1.js">
```

## Laravel Integration

### Blade Helper

```php
// config/widgets.php
return [
    'base_url' => env('WIDGET_BASE_URL', 'http://localhost:5175'),
    'is_dev' => env('WIDGET_DEV_MODE', true),
];
```

```blade
{{-- resources/views/layouts/app.blade.php --}}
<script src="{{ asset('js/widget-loader.js') }}"></script>
<script>
    WidgetLoader.configure({
        baseUrl: '{{ config('widgets.base_url') }}',
        isDev: {{ config('widgets.is_dev') ? 'true' : 'false' }},
    });
</script>
```

### Loading Widgets in Blade

```blade
{{-- Load widget on page --}}
<packages-widget
    packages='@json($packages)'
    translated-texts='@json($translations)'
></packages-widget>

<script>
    WidgetLoader.load('packages');
</script>
```

### Alpine.js Integration

```blade
<div x-data="{ loaded: false }" x-init="WidgetLoader.load('packages').then(() => loaded = true)">
    <template x-if="loaded">
        <packages-widget packages='@json($packages)'></packages-widget>
    </template>
    <template x-if="!loaded">
        <div>Loading...</div>
    </template>
</div>
```

## Environment Variables

```env
# .env.production
WIDGET_BASE_URL=https://widgets.example.com
WIDGET_DEV_MODE=false

# .env.local
WIDGET_BASE_URL=http://localhost:5175
WIDGET_DEV_MODE=true
```

## Optimizing Production Loading

### Preload Critical Chunks

```html
<link rel="modulepreload" href="/shared/react-vendor.[hash].js">
<link rel="modulepreload" href="/shared/base-ui-vendor.[hash].js">
```

### Preload Manifest

```javascript
// Preload manifest on page load
document.addEventListener('DOMContentLoaded', () => {
    WidgetLoader.preload();
});
```

### Load Widgets on Visibility

```javascript
// Load widget when it enters viewport
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const widgetName = entry.target.dataset.widget;
            WidgetLoader.load(widgetName);
            observer.unobserve(entry.target);
        }
    });
});

document.querySelectorAll('[data-widget]').forEach(el => {
    observer.observe(el);
});
```
