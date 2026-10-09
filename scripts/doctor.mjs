import { pathToFileURL } from "node:url";
import sharp from "sharp";
import {
  checkPort,
  developmentConfig,
  phpBinary,
  requireRuntime,
} from "./lib/runtime.ts";
export async function doctor({ ports = false, mail = false } = {}) {
  requireRuntime();
  const config = developmentConfig();
  await import("vite");
  await import("react-dom/client");
  await sharp({
    create: { width: 1, height: 1, channels: 3, background: "white" },
  })
    .webp()
    .toBuffer();
  const php = config.lan ? null : phpBinary();
  if (mail && !php)
    throw new Error(
      "PHP 8.1+ is unavailable. Install/provide PHP privately on this machine or set HARNI_PHP_BIN. LAN previews do not run mail.",
    );
  if (ports) {
    await checkPort(config.web, config.host);
    if (php) await checkPort(config.mail);
  }
  return { config, php };
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    const result = await doctor({
      ports: process.argv.includes("--ports"),
      mail: process.argv.includes("--mail"),
    });
    console.log(
      "PASS: Node, React, Vite and destination-OS Sharp native encoder.",
    );
    console.log(
      result.php
        ? "PASS: PHP 8.1+ is available; development mail sending stays disabled."
        : "PARTIAL: frontend is available; PHP mail endpoint is not configured for this preview.",
    );
    console.log("No private environment files or mail state were inspected.");
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
