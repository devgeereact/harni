import { spawn } from "node:child_process";
import { doctor } from "./doctor.mjs";
import { root, checkPort } from "./lib/runtime.ts";
try {
  const { config, php } = await doctor({ mail: true });
  await checkPort(config.mail);
  const child = spawn(php, ["-S", `127.0.0.1:${config.mail}`, "-t", "backend/public"], {
    cwd: root,
    env: { ...process.env, HARNI_MAIL_ENABLED: "0" },
    stdio: "inherit",
  });
  for (const signal of ["SIGINT", "SIGTERM"])
    process.on(signal, () => child.kill(signal));
  child.on("error", () => {
    console.error("PHP could not start.");
    process.exitCode = 1;
  });
  child.on("exit", (code) => {
    process.exitCode = code ?? 0;
  });
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
