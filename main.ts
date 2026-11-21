// Leonida Trophy Atlas — make.fun entry for gta6-trophy-guide-01, round 2.
// Runs on Node 22 with the standard library only; nothing is installed.
//
// What this entry is: a static offline web app in app/ — index.html, app.js,
// style.css and app/data/trophies.json (all 55 GTA VI PS5 trophies, each with
// its official name, description and grade, a guide in our own words, steps
// and cited sources). A desktop browser opens it with the network off; the
// only file it loads at run time is its own local trophies.json.
//
// What this file does: it gathers app/ and screenshots/ from beside itself
// into the output directory and writes dossier.json there, using the
// vendored make.fun library. The dossier is what the scorer and the judge
// read: the screenshots, the first-load files and bytes, and the source
// outline. vendor/makefun-frontend.ts must stay exactly as shipped —
// changing it makes the scorer reject the dossier.
//
// Local run:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// The program must write byte-identical output on both of its runs.
// To try the app itself in a browser: `node serve.ts` (http://localhost:8080).

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// The repository root is the directory this file sits in.
const here = fileURLToPath(new URL('.', import.meta.url));
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output.
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
// The whole app goes over as-is: pages, scripts, styles and the trophy data.
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's caps, mirrored from the kit's reference/gate.json. Of these,
// text_max_bytes is the one that shapes the dossier bytes; the rest refuse
// an entry the scorer would refuse anyway — at most 4 screenshots, none over
// 256 KiB; at most 993 files and directories in app/, and app/ under 48 MiB
// (app/ counts beside /output's own 1000-entry cap, its screenshots/ and
// dossier.json, so the app is kept well under those limits).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
