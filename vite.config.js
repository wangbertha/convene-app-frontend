export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/profiles': {
        target: 'http://localhost:3000', // Correct backend port
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
