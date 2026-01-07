import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { readdirSync, existsSync } from 'fs'

/**
 * Automatically discover all widgets in src/widgets/
 * Each widget must have an index.tsx file
 */
function getWidgetEntries() {
  const widgetsDir = path.resolve(__dirname, './src/widgets')
  const entries: Record<string, string> = {}

  try {
    const widgets = readdirSync(widgetsDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name)

    widgets.forEach(widget => {
      const entryPath = path.resolve(widgetsDir, widget, 'index.tsx')
      if (existsSync(entryPath)) {
        entries[widget] = `./src/widgets/${widget}/index.tsx`
        console.log(`✅ Found widget: ${widget}`)
      }
    })
  } catch (err) {
    console.error('❌ Error scanning widgets directory:', err)
  }

  return entries
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react({
        jsxRuntime: 'automatic',        // ✅ Correct JSX runtime
        babel: {
          plugins: [],
        },
      }),
      tailwindcss(),
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
      dedupe: ['react', 'react-dom'],   // ✅ Prevent duplicate React
    },

    server: {
      host: '0.0.0.0',
      port: 5175,
      watch: {
        usePolling: true,
      },
      cors: true,
    },

    esbuild: {
      jsxDev: false,                    // ✅ CRITICAL: disable jsxDEV
    },

    build: {
      target: 'es2019',                 // ✅ Safe for web components
      minify: 'terser',
      sourcemap: mode !== 'production',
      manifest: true,
      cssCodeSplit: false,

      rollupOptions: {
        input: getWidgetEntries(),
        output: {
          dir: 'dist',
          format: 'es',
          entryFileNames: '[name]/[name].[hash].js',
          chunkFileNames: 'shared/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash][extname]',
        },
      },

      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: true,
        },
        format: {
          comments: false,
        },
      },
    },

    define: {
      // ✅ Force production React runtime ALWAYS
      'process.env.NODE_ENV': JSON.stringify('production'),
      __DEV__: false,

      // Env passthrough
      'import.meta.env.VITE_WIDGET_BASE_URL': JSON.stringify(env.VITE_WIDGET_BASE_URL),
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL),
    },
  }
})
