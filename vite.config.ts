import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { developmentConfig } from "./scripts/lib/runtime.ts";
import { routes } from "./src/content/routes.ts";

const projectRoot = fileURLToPath(new URL("./", import.meta.url));
const pagesRoot = fileURLToPath(
  new URL("./.generated/pages/", import.meta.url),
);

// Every page is an HTML entry. The list comes from src/content/routes.ts, the same list that
// scripts/build-pages.ts writes the pages from, so a page is added in one place.
const input = Object.fromEntries(
  routes.map((route) => [
    route.key,
    fileURLToPath(new URL(`./.generated/pages/${route.file}`, import.meta.url)),
  ]),
);

const config = developmentConfig();
const proxy = { "/api/": `http://127.0.0.1:${config.mail}` };
// PHP source must never be served as a static public file by Vite. LAN mode blocks the API.
function configurePrivateApi(server: {
  middlewares: {
    use: (handler: import("vite").Connect.NextHandleFunction) => void;
  };
}) {
  server.middlewares.use((request, response, next) => {
    if (config.lan && request.url?.startsWith("/api/")) {
      response.statusCode = 503;
      response.setHeader("Content-Type", "application/json");
      response.end(
        JSON.stringify({
          ok: false,
          message:
            "Mail is unavailable in this LAN preview. Use the email links on the page.",
        }),
      );
    } else next();
  });
}
const privateApi = () => ({
  name: "harni-private-api",
  configureServer: configurePrivateApi,
  configurePreviewServer: configurePrivateApi,
});
export default defineConfig({
  root: pagesRoot,
  publicDir: fileURLToPath(new URL("./public/", import.meta.url)),
  resolve: {
    alias: { "/src": fileURLToPath(new URL("./src/", import.meta.url)) },
  },
  appType: "mpa",
  plugins: [react(), tailwindcss(), privateApi()],
  server: {
    fs: {
      allow: [projectRoot],
      // Setting deny replaces Vite's defaults, so they are repeated first. PHP source, agent
      // contracts, documentation and IDE files must not be reachable through /@fs/.
      deny: [
        ".env",
        ".env.*",
        "*.{crt,pem}",
        "**/.git/**",
        "**/*.php",
        "**/.agent/**",
        "**/.idea/**",
        "**/docs/**",
      ],
    },
    host: config.host,
    port: config.web,
    strictPort: true,
    allowedHosts: ["localhost", config.host],
    proxy,
  },
  preview: {
    host: config.host,
    port: config.web,
    strictPort: true,
    allowedHosts: ["localhost", config.host],
    proxy,
  },
  build: {
    outDir: fileURLToPath(new URL("./dist/", import.meta.url)),
    emptyOutDir: true,
    target: "es2022",
    cssTarget: "safari16",
    assetsInlineLimit: 2048,
    reportCompressedSize: false,
    rollupOptions: { input },
  },
});
