// Leonida Trophy Atlas — hand-in program for the GTA 6 trophy guide bounty.
// Node 22, standard library only. It takes this folder's app/ and screenshots/
// and lays them out under the output directory, then writes the dossier the
// judge reads, using the vendored make.fun library (vendor/makefun-frontend.ts
// stays untouched — the scorer rebuilds the same dossier and compares bytes).
//
// Run it outside the grader with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// It must print the same bytes on every run.

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

// Folder this file lives in, and the folder the grader wants the output in.
const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const targetDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Copy the whole guide app, then the screenshots beside it.
mkdirSync(targetDir, { recursive: true });
cpSync(join(repoRoot, "app"), join(targetDir, "app"), { recursive: true });
mkdirSync(join(targetDir, "screenshots"), { recursive: true });
if (existsSync(join(repoRoot, "screenshots"))) {
  cpSync(join(repoRoot, "screenshots"), join(targetDir, "screenshots"), { recursive: true });
}

// The caps mirror the scorer's own limits: at most 4 screenshots, each at most
// 256 KiB, the app at most 993 files and 48 MiB, and the dossier text at most
// 160 KiB. An entry that breaks any of them is refused here first.
const dossierText = buildDossier(targetDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(targetDir, "dossier.json"), dossierText);
