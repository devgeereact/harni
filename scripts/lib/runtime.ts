import { createServer } from "node:net";
import { networkInterfaces } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
export const root = fileURLToPath(new URL("../../", import.meta.url));

export function requireRuntime(version = process.versions.node): void {
  const [major = 0, minor = 0] = version.split(".").map(Number);
  if (major < 24 || (major === 24 && minor < 21))
    throw new Error(
      "Harni requires Node 24.21+. Run mise install and use mise exec -- npm run dev.",
    );
}
export function developmentConfig(env: NodeJS.ProcessEnv = process.env) {
  const port = (name: string, fallback: number) => {
    const value = env[name] ?? String(fallback);
    if (!/^\d+$/.test(value) || Number(value) < 1 || Number(value) > 65535)
      throw new Error(`${name} must be a valid TCP port.`);
    return Number(value);
  };
  const web = port("HARNI_WEB_PORT", 5152);
  const mail = port("HARNI_MAIL_PORT", 5153);
  if (web === mail) throw new Error("Web and mail ports must differ.");
  const host = env.HARNI_HOST ?? "127.0.0.1";
  const lan = host !== "127.0.0.1";
  if (lan) {
    const privateAddress = /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(
      host,
    );
    const local = Object.values(networkInterfaces())
      .flat()
      .some(
        (address) => address?.family === "IPv4" && address.address === host,
      );
    if (!privateAddress || !local)
      throw new Error(
        "HARNI_HOST must be 127.0.0.1 or an explicit private IPv4 address assigned to this computer. Wildcard/public binding is not allowed.",
      );
  }
  return { web, mail, host, lan };
}
export async function checkPort(
  port: number,
  host = "127.0.0.1",
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const server = createServer();
    server.once("error", (error: NodeJS.ErrnoException) =>
      reject(
        new Error(
          `Cannot bind ${host}:${port} (${error.code}). Existing processes are not stopped.`,
        ),
      ),
    );
    server.listen(port, host, () => server.close(() => resolve()));
  });
}
export function phpBinary(env: NodeJS.ProcessEnv = process.env): string | null {
  const binary = env.HARNI_PHP_BIN ?? "php";
  const result = spawnSync(binary, ["-r", "echo PHP_VERSION;"], {
    encoding: "utf8",
    timeout: 5000,
  });
  if (result.status !== 0) return null;
  const [major = 0, minor = 0] = result.stdout.split(".").map(Number);
  return major > 8 || (major === 8 && minor >= 1) ? binary : null;
}
