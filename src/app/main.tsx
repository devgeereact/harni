import { hydrateRoot } from "react-dom/client";
import "@fontsource-variable/fraunces/opsz.css";
import "@fontsource-variable/fraunces/opsz-italic.css";
import "@fontsource-variable/inter/index.css";
import "../styles/tailwind.css";
import "../styles/site.css";
import "../styles/game.css";
import { Application } from "./Application";
import type { ContentNode } from "./tree";

const root = document.getElementById("harni-root");
const payload = document.getElementById("harni-page");
if (!root || !payload?.textContent)
  throw new Error(
    "The pre-rendered page payload is missing. Run npm run pages.",
  );
const tree = JSON.parse(payload.textContent) as ContentNode[];
hydrateRoot(root, <Application tree={tree} />, {
  onRecoverableError: (error) => console.error("Page hydration failed", error),
});
