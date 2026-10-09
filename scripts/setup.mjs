import { spawnSync } from "node:child_process";
import { requireRuntime, root } from "./lib/runtime.ts";
try {
  requireRuntime();
  for (const [command, args] of [
    ["npm", ["ci", "--include=optional", "--no-audit", "--no-fund"]],
    [
      process.execPath,
      ["node_modules/playwright/cli.js", "install", "chromium"],
    ],
    [process.execPath, ["scripts/doctor.mjs"]],
  ]) {
    const result = spawnSync(command, args, { cwd: root, stdio: "inherit" });
    if (result.status !== 0)
      throw new Error(
        "Setup failed. Resolve the preceding prerequisite error and retry.",
      );
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
