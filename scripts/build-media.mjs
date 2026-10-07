import { mkdtemp, mkdir, rename, rm } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("../", import.meta.url));
/** Regenerate derived assets with destination-OS native libraries, never macOS shell tools. */
export async function buildMedia(
  input,
  output,
  widths = [1920, 1280, 800, 480],
) {
  if (
    !widths.length ||
    widths.some(
      (width) => !Number.isInteger(width) || width < 1 || width > 10000,
    )
  )
    throw new Error("Media widths must be positive integers up to 10000.");
  await sharp(input).metadata();
  await mkdir(dirname(output), { recursive: true });
  const staging = await mkdtemp(join(dirname(output), ".harni-media-"));
  const names = [];
  try {
    for (const width of widths) {
      const image = () =>
        sharp(input)
          .autoOrient()
          .resize({
            width,
            height: width,
            fit: "inside",
            withoutEnlargement: true,
          });
      for (const [extension, encode] of [
        ["jpg", (pipeline) => pipeline.jpeg({ quality: 62 })],
        ["webp", (pipeline) => pipeline.webp({ quality: 78 })],
        ["avif", (pipeline) => pipeline.avif({ quality: 55, effort: 4 })],
      ]) {
        const name = `shore-${width}.${extension}`;
        await encode(image()).toFile(join(staging, name));
        names.push(name);
      }
    }
    await sharp(input)
      .autoOrient()
      .resize({
        width: 16,
        height: 16,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 30 })
      .toFile(join(staging, "shore-lqip.jpg"));
    names.push("shore-lqip.jpg");
    await mkdir(output, { recursive: true });
    for (const name of names)
      await rename(join(staging, name), join(output, name));
    return names;
  } finally {
    await rm(staging, { recursive: true, force: true });
  }
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const args = process.argv.slice(2);
  const argument = (name, fallback) => {
    const index = args.indexOf(name);
    if (index < 0) return fallback;
    if (!args[index + 1] || args[index + 1].startsWith("--"))
      throw new Error(`Missing value for ${name}`);
    return resolve(args[index + 1]);
  };
  try {
    const names = await buildMedia(
      argument("--input", join(root, "docs/IMG_3620.jpeg")),
      argument("--output", join(root, "public/media")),
    );
    console.log(`PASS: generated ${names.length} JPEG/WebP/AVIF media assets.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
