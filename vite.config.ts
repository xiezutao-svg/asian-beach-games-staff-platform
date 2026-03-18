import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    // GitHub Pages 需要设置 base
    base: env.VITE_BASE_URL || '/asian-beach-games-staff-platform/',
    plugins: [vue()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 自动导入 SCSS 变量
          additionalData: `@use "@/assets/styles/variables.scss" as *;`
        }
      }
    },
    build: {
      outDir: 'dist',
      // 确保资源路径正确
      assetsDir: 'assets',
      minify: 'esbuild',
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
        }
      }
    },
    server: {
      port: 3000,
      host: '0.0.0.0'
    }
  }
})
