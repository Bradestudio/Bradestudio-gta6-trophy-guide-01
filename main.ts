// Leonida Trophy Atlas — make.fun entry for gta6-trophy-guide-01 (Node 22, stdlib only).
//
// The entry itself is the static web app in app/: index.html + app.js + style.css
// plus app/data/trophies.json (all 55 GTA VI PS5 trophies with a sourced guide each).
// It runs fully offline in a desktop browser — the only file it loads is its own
// local trophies.json, and it never makes a network request.
//
// This program is the handover: it copies app/ and screenshots/ from beside this
// file into the output directory and writes /output/dossier.json, the summary the
// judge reads (screenshots, first-load files and bytes, and the source outline).
// The dossier is built by the vendored make.fun library — vendor/makefun-frontend.ts
// must stay exactly as shipped, or the scorer rejects the dossier.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Serve the app for a browser with `node serve.ts` (http://localhost:8080).

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's caps, mirrored from the kit's reference/gate.json: text_max_bytes is
// the only one that shapes the dossier bytes. The rest refuse an entry the scorer
// would refuse anyway — at most 4 screenshots, none over 256 KiB; at most 993 files
// and directories in app/, and app/ under 48 MiB (app/ counts beside /output's own
// 1000-entry cap, its screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
