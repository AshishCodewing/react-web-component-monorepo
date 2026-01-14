import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { readdirSync, existsSync } from 'fs'
import { visualizer } from 'rollup-plugin-visualizer'

function getWidgetEntries(): Record<string, string> {
  const widgetsDir = path.resolve(__dirname, 'src/widgets')
  const entries: Record<string, string> = {}

  if (!existsSync(widgetsDir)) return entries

  for (const dir of readdirSync(widgetsDir, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue

    const entry = path.join(widgetsDir, dir.name, 'index.tsx')
    if (existsSync(entry)) {
      // key = widget name
      entries[dir.name] = entry
    }
  }

  return entries
}

export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
    {
      name: 'remove-preamble-check',
      transform(code: string) {
        if (code.includes("can't detect preamble")) {
          // Remove the error throw for preamble detection
          return code.replace(
            /throw new Error\([^)]*can't detect preamble[^)]*\);?/g,
            'console.warn("Preamble detection skipped");'
          );
        }
      },
    },
    // Bundle analyzer - generates stats.html after build
    mode === 'production' && visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),

  server: {
    host: '0.0.0.0', // Required for Docker - allows external access
    port: 5175,
    // Use polling only if file watching doesn't work in Docker
    // Uncomment if you experience HMR issues in Docker:
    // watch: {
    //   usePolling: true,
    // },
    cors: {
      origin: '*', // Allow all origins for Web Components/widgets
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      // Note: credentials cannot be true with origin: '*'
      // Set to true only if you need cookies/auth and specify exact origins
      credentials: false,
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },

  build: {
    target: 'es2020',
    outDir: 'dist',
    emptyOutDir: true,
    manifest: 'manifest.json', // Outputs to dist/manifest.json (accessible via preview server)
    sourcemap: mode === 'production' ? false : true,
    cssCodeSplit: true,
    rollupOptions: {
      input: getWidgetEntries(),

      output: {
        format: 'es',
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'shared/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]',

        manualChunks(id) {
          if (id.includes('node_modules')) {
            // React core libraries (react, react-dom, react/jsx-runtime)
            if (id.includes('react')) {
              return 'react-vendor'
            }
            if (id.includes('@base-ui')) {
              return 'base-ui-vendor'
            }
            if (id.includes('lucide-react')) {
              return 'lucide-vendor'
            }
            if (id.includes('clsx') || id.includes('class-variance-authority')) {
              return 'utils-vendor'
            }
            // Everything else
            return 'vendor'
          }
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
        // Aggressive optimizations
        passes: 2, // Multiple compression passes
        pure_getters: true, // Assume getters have no side effects
        unsafe_arrows: true, // Convert functions to arrows where safe
        unsafe_methods: true, // Optimize method calls
        ecma: 2020,
      },
      mangle: {
        // Shorten property names (careful with external APIs)
        properties: false,
      },
      format: {
        comments: false,
        ecma: 2020,
      },
    },
  }
}))

