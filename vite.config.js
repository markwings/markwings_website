import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        marketing: path.resolve(__dirname, "services/marketing.html"),
        development: path.resolve(__dirname, "services/development.html"),
        graphics: path.resolve(__dirname, "services/graphics.html"),
        portfolio: path.resolve(__dirname, "portfolio.html"),
      },
    },
  },
});
