// vite.config.js
export default {
  // 基本公共路径
  base: './',
  // 构建配置
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // 生产环境移除console和debugger
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  // 服务器配置
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true,
  },
  // 解析配置
  resolve: {
    alias: {
      '@': '/src',
    },
  },
};