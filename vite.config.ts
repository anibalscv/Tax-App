import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import netlify from '@netlify/vite-plugin';
import { build as esbuild } from 'esbuild';
import fs from 'fs';

// Custom plugin to bundle Netlify functions alongside the Vite output
function netlifyFunctionsPlugin() {
  return {
    name: 'netlify-functions-build',
    async closeBundle() {
      const functionsDir = path.resolve(__dirname, 'netlify/functions');
      const outDir = path.resolve(__dirname, 'dist/netlify/functions');
      if (!fs.existsSync(functionsDir)) return;

      fs.mkdirSync(outDir, { recursive: true });

      const files = fs.readdirSync(functionsDir).filter(f => f.endsWith('.mts') || f.endsWith('.ts'));
      for (const file of files) {
        const outName = file.replace(/\.mts?$/, '.mjs');
        await esbuild({
          entryPoints: [path.join(functionsDir, file)],
          outfile: path.join(outDir, outName),
          bundle: true,
          platform: 'node',
          format: 'esm',
          target: 'node20',
          external: ['@netlify/functions'],
        });
        console.log(`  ✓ Bundled Netlify function: ${outName}`);
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react(), netlify(), netlifyFunctionsPlugin()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      '__BUILD_TIMESTAMP__': JSON.stringify(Date.now().toString()),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
