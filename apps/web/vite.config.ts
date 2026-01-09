import { defineConfig } from 'vite'
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
      // key = widget name
      entries[dir.name] = entry
    }
  }

  return entries
}

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    host: '0.0.0.0',
    port: 5175,
    cors: true
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
    sourcemap: false,
    cssCodeSplit: true,
    rollupOptions: {
      input: getWidgetEntries(),

      output: {
        format: 'es',
        entryFileNames: 'assets/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          // This helps keep CSS names tied to the widget name
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/[name].[hash][extname]';
          }
          return 'assets/[name].[hash][extname]';
        },

        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react-vendor'
            if (id.includes('@radix-ui')) return 'radix-vendor'
            return 'vendor'
          }
        }
      }
    }
  }
})

