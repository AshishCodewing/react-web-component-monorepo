import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path';
import { readdirSync, existsSync } from 'fs';


/**
 * Automatically discover all widgets in src/widgets/ directory
 * Each widget must have an index.tsx file
 *
 * @returns Object mapping widget names to their entry points
 * @example { 'date-picker': './src/widgets/date-picker/index.tsx' }
 */
function getWidgetEntries() {
  const widgetsDir = path.resolve(__dirname, './src/widgets');
  const entries: Record<string, string> = {};

  try {
    // Read all directories in src/widgets/
    const widgets = readdirSync(widgetsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    // For each widget directory, check if index.tsx exists
    widgets.forEach(widget => {
      const entryPath = path.resolve(widgetsDir, widget, 'index.tsx');
      if (existsSync(entryPath)) {
        entries[widget] = `./src/widgets/${widget}/index.tsx`;
        console.log(`✅ Found widget: ${widget}`);
      } else {
        console.warn(`⚠️  Widget directory "${widget}" found but missing index.tsx`);
      }
    });

    if (Object.keys(entries).length === 0) {
      console.warn('⚠️  No widgets found in src/widgets/');
    }
  } catch (error) {
    console.error('❌ Error scanning widgets directory:', error);
  }

  return entries;
}

export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tailwindcss(),
      // Remove preamble error checks from transformed code
      {
        name: 'remove-preamble-check',
        transform(code, _id) {
          if (code.includes("can't detect preamble")) {
            // Remove the error throw for preamble detection
            return code.replace(
              /throw new Error\([^)]*can't detect preamble[^)]*\);?/g,
              'console.warn("Preamble detection skipped");'
            );
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5175,
      watch: {
        usePolling: true, // Needed for Docker file watching
      },
      cors: {
        origin: '*', // Allow all origins in development
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
      },
    },
    build: {
      rollupOptions: {
        input: getWidgetEntries(), // ✅ Auto-discover all widgets
        output: {
          dir: 'dist',
          format: 'es', // Use ES modules for code splitting
          entryFileNames: '[name]/[name].[hash].js',
          chunkFileNames: 'shared/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash][extname]',
          manualChunks(id) {
            // React and React-DOM in separate vendor chunk
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
              return 'react-vendor';
            }
            // Shadcn UI components and dependencies
            if (id.includes('@tripcart/ui-components') ||
                id.includes('class-variance-authority') ||
                id.includes('date-fns') ||
                id.includes('react-day-picker')) {
              return 'shadcn-ui';
            }
            // Everything else goes into the main widget chunk
          },
        },
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: true,
          pure_funcs: mode === 'production' ? ['console.log', 'console.debug'] : [],
        },
        format: {
          comments: false,
        },
      },
      sourcemap: mode !== 'production',
      manifest: true, // Generate manifest.json for CDN deployment
      cssCodeSplit: false, // Inline CSS into JS for IIFE format
    },
    define: {
      // Expose env variables to client code
      'import.meta.env.VITE_WIDGET_BASE_URL': JSON.stringify(env.VITE_WIDGET_BASE_URL),
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL),
      // Ensure React is in production mode for smaller bundle
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
  };
});