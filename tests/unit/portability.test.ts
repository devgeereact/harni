import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createServer } from "node:net";
import sharp from "sharp";
import { buildMedia } from "../../scripts/build-media.mjs";
import {
  developmentConfig,
  requireRuntime,
  checkPort,
} from "../../scripts/lib/runtime.ts";

test("startup rejects unsupported Node, unsafe binding and conflicting ports", () => {
  assert.throws(() => requireRuntime("22.20.0"));
  requireRuntime("24.21.0");
  for (const host of ["0.0.0.0", "::", "8.8.8.8", "localhost"])
    assert.throws(() => developmentConfig({ HARNI_HOST: host }));
  assert.throws(() => developmentConfig({ HARNI_WEB_PORT: "5153" }));
  assert.throws(() => developmentConfig({ HARNI_WEB_PORT: "invalid" }));
  assert.equal(developmentConfig({}).host, "127.0.0.1");
});
test("occupied ports are reported without stopping their owner", async () => {
  const server = createServer();
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    await assert.rejects(
      checkPort(address.port),
      /Existing processes are not stopped/,
    );
    assert.ok(server.listening);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});
test("portable image encoder works in paths with spaces and preserves output on bad input", async () => {
  const folder = await mkdtemp(join(tmpdir(), "harni media "));
  try {
    const input = join(folder, "source photo.png");
    const output = join(folder, "generated assets");
    await sharp({
      create: { width: 320, height: 160, channels: 3, background: "red" },
    })
      .png()
      .toFile(input);
    const names = await buildMedia(input, output, [160, 80]);
    assert.equal(names.length, 7);
    for (const width of [160, 80])
      for (const extension of ["jpg", "webp", "avif"]) {
        const metadata = await sharp(
          join(output, `shore-${width}.${extension}`),
        ).metadata();
        assert.equal(metadata.width, width);
        assert.equal(metadata.height, width / 2);
      }
    const before = await readFile(join(output, names[0]!));
    await writeFile(input, "invalid image");
    await assert.rejects(buildMedia(input, output, [160]));
    assert.deepEqual(await readFile(join(output, names[0]!)), before);
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});
