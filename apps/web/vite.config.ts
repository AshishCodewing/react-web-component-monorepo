import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { readdirSync, existsSync } from 'fs'

function getWidgetEntries(): Record<string, string> {
  const widgetsDir = path.resolve(__dirname, 'src/widgets')
  const entries: Record<string, string> = {}

  if (!existsSync(widgetsDir)) return entries

  for (const dir of readdirSync(widgetsDir, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue

    const entry = path.join(widgetsDir, dir.name, 'index.tsx')
    if (existsSync(entry)) {
      entries[dir.name] = entry
    }
  }

  return entries
}

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react({
        jsxRuntime: 'automatic',
      }),
      {
        name: 'remove-preamble-check',
        transform(code) {
          if (code.includes("can't detect preamble")) {
            // Remove the error throw for preamble detection
            return code.replace(
              /throw new Error\([^)]*can't detect preamble[^)]*\);?/g,
              'console.warn("Preamble detection skipped");'
            );
          }
        },
      },
      tailwindcss(),
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      dedupe: ['react', 'react-dom'],
    },

    server: {
      host: '0.0.0.0',
      port: 5175,
      cors: true,
    },

    esbuild: {
      jsxDev: isDev,
    },

    build: {
      target: 'es2020',
      minify: isDev ? false : 'terser',
      sourcemap: isDev,
      manifest: true,
      cssCodeSplit: true,

      rollupOptions: {
        input: getWidgetEntries(),

        /**
         * React is bundled in both dev and prod for standalone widgets
         * Widgets need to be self-contained web components
         */
        external: [],

        output: {
          format: 'es',
          dir: 'dist',
          entryFileNames: '[name]/[name].[hash].js',
          chunkFileNames: 'shared/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash][extname]',
        },
      },

      terserOptions: {
        compress: {
          drop_console: !isDev,
          drop_debugger: true,
        },
        format: {
          comments: false,
        },
      },
    },

    define: {
      'process.env.NODE_ENV': JSON.stringify(
        isDev ? 'development' : 'production'
      ),
      __DEV__: isDev,

      'import.meta.env.VITE_WIDGET_BASE_URL': JSON.stringify(
        env.VITE_WIDGET_BASE_URL
      ),
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(
        env.VITE_API_BASE_URL
      ),
    },
  }
})
