import { unstable_vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    remix({
      ignoredRouteFiles: ["**/.*"],
    }),
    tsconfigPaths(),
  ],
  // Ensure that the server.host is set to "0.0.0.0" for proper port forwarding in WebContainers
  server: {
    host: "0.0.0.0",
    hmr: {
      port: 3001,
    },
  },
});