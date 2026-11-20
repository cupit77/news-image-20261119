// News-image entry for make.fun: "Sum up 19 November's world news in one image".
// The image is rendered once (HTML + headless Chromium) and shipped in this
// repository as entry.png; the program copies it to the grader's output
// directory. Node 22, standard library only, no network.
//
// The copy is byte-for-byte, so two runs always write identical bytes.

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// The grader sets MAKEFUN_OUTPUT_DIR; outside the grader it defaults to /output.
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const source = new URL("./entry.png", import.meta.url);

// Fail loudly instead of copying a corrupt file: a PNG starts with this
// eight-byte signature.
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const bytes = readFileSync(source);
if (!bytes.subarray(0, 8).equals(PNG_SIGNATURE)) {
  throw new Error("entry.png is not a PNG file");
}

mkdirSync(outputDir, { recursive: true });
copyFileSync(source, join(outputDir, "entry.png"));
