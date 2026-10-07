import { spawn, spawnSync } from "node:child_process";
import { doctor } from "./doctor.mjs";
import { root } from "./lib/runtime.ts";
const children = [];
let stopping = false;
let timer;
function signal(child, value) {
  try {
    process.kill(-child.pid, value);
  } catch {
    /* Already stopped. */
  }
}
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  process.exitCode = code;
  for (const child of children) signal(child, "SIGTERM");
  timer = setTimeout(() => {
    for (const child of children) signal(child, "SIGKILL");
  }, 5000);
  timer.unref();
}
process.on("SIGINT", () => stop());
process.on("SIGTERM", () => stop());
function launch(name, command, args, env) {
  const child = spawn(command, args, {
    cwd: root,
    env,
    detached: true,
    stdio: ["ignore", "pipe", "pipe"],
  });
  children.push(child);
  for (const stream of [child.stdout, child.stderr])
    stream.on("data", (chunk) => process.stdout.write(`[${name}] ${chunk}`));
  child.on("error", () => {
    console.error(`${name} could not start.`);
    stop(1);
  });
  child.on("exit", (code) => {
    if (!stopping) stop(code || 1);
  });
  child.on("close", () => {
    if (
      children.every(
        (process) => process.exitCode !== null || process.signalCode !== null,
      )
    )
      clearTimeout(timer);
  });
}
try {
  const { config, php } = await doctor({ ports: true });
  const generated = spawnSync(
    process.execPath,
    ["--import", "tsx", "scripts/build-pages.ts"],
    { cwd: root, stdio: "inherit" },
  );
  if (generated.status !== 0) throw new Error("Page generation failed.");
  const env = { ...process.env, HARNI_MAIL_ENABLED: "0" };
  if (php)
    launch(
      "mail-disabled",
      php,
      ["-S", `127.0.0.1:${config.mail}`, "-t", "public"],
      env,
    );
  launch(
    "web",
    process.execPath,
    [
      "node_modules/vite/bin/vite.js",
      "--host",
      config.host,
      "--port",
      String(config.web),
      "--strictPort",
    ],
    env,
  );
  console.log(
    `Harni: http://${config.host}:${config.web}. Ctrl+C stops this launcher's processes.`,
  );
  if (!php)
    console.log(
      "Mail endpoint unavailable for this preview. Use the public email links; no mail will be sent.",
    );
} catch (error) {
  console.error(error.message);
  stop(1);
}
