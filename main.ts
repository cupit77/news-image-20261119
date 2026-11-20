// make.fun entry: "Sum up 19 November's world news in one image".
//
// The front page was drawn once from HTML in a headless browser and is stored
// beside this file as entry.png. This program's only job is to place that
// exact image at $MAKEFUN_OUTPUT_DIR/entry.png.
//
// Node 22, standard library only. No network, no randomness: every run
// writes the same bytes.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const IMAGE_NAME = "entry.png";
const MAX_BYTES = 1_048_576;

// A valid PNG always opens with these eight bytes.
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const image = readFileSync(new URL(`./${IMAGE_NAME}`, import.meta.url));
if (!image.subarray(0, PNG_MAGIC.length).equals(PNG_MAGIC)) {
  throw new Error(`${IMAGE_NAME} does not start with the PNG signature`);
}
if (image.length > MAX_BYTES) {
  throw new Error(`${IMAGE_NAME} is ${image.length} bytes, over the 1 MiB limit`);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
const destination = join(OUTPUT_DIR, IMAGE_NAME);
writeFileSync(destination, image);

// Read the copy back and confirm it is byte-for-byte the source image,
// so a partial or failed write can never pass silently.
if (!readFileSync(destination).equals(image)) {
  throw new Error(`written ${IMAGE_NAME} does not match the source image`);
}
