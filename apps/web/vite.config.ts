import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
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
      // key = widget name
      entries[dir.name] = entry
    }
  }

  return entries
}

export default defineConfig(({ mode }) => ({
  plugins: [react()],

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
    manifest: true,
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
      },
      format: {
        comments: false,
      },
    },
  }
}))

