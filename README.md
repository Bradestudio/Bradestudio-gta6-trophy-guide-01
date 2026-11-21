[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Bradestudio/Bradestudio-gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Bradestudio/Bradestudio-gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

# Leonida Trophy Atlas — GTA VI Trophy Guide & Tracker

An offline guide and tracker for all **55 Grand Theft Auto VI trophies** on PlayStation 5 (1 Platinum, 2 Gold, 6 Silver, 46 Bronze; 28 hidden; 0 online). Built for the make.fun bounty [gta6-trophy-guide-01](https://make.fun/bounty/gta6-trophy-guide-01).

## What it is

- **Every trophy** with its official name, description and grade as PlayStation publishes them, plus a guide written for this atlas in our own words — what to do, where and how, and when it can be missed.
- **Cited sources beside every guide.** Each trophy names the guides its facts come from (PowerPyx, GTABase, OutputLag, GTADB, HowToVideoGame, Push Square, GamesRecon and others). A step with no source behind it is marked as unconfirmed instead of invented — five hidden trophies (IDs 44, 45, 49, 50, 51) still have no confirmed trigger at launch, and this atlas says so openly.
- **Platinum roadmap in four stages** — main story, strangers & partners, activities & collections, open world & 100% — with an earned count per stage.
- **The one missable warning, up front.** *Positive Mental Attitude* (meditate at every spot) has a single Chapter 1 moment that never returns: the morning after *Down to Earth*, meditate with Lucia on the balcony at Jason's house. The atlas says plainly that it is not yet confirmed whether that moment is strictly required — and tells you to do it anyway.
- **A tracker, not just a page.** Checklist saved in localStorage, export/import as JSON, filters by kind (story, missable, collectibles, activities, strangers, partner, open world, secret, hidden, online), grade and roadmap stage, text search, and a spoiler mode that hides story trophy names and descriptions until they are earned.

## The honest gaps

This atlas does not invent what the guides have not confirmed: the exact triggers for the five unconfirmed secret trophies, the full roster of nine in-game gang names, the remaining four qualifying *Strangers & Freaks* strands, the names of all 14 Top Fun locations, and which animal triggers *Fair Game*. Each is flagged in its guide with a note to re-check the cited sources.

## Run it

Static files only — no build step, no network requests at run time:

```sh
node serve.ts
# open http://localhost:8080
```

Hand it in (outside the grader, `MAKEFUN_OUTPUT_DIR` stands in for `/output`):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Layout

- `app/index.html` — page shell: header, missable banner, roadmap, controls, list.
- `app/style.css` — the look: a Vice City sunset palette, our own design.
- `app/app.js` — tracker logic: checklist, filters, spoiler mode, export/import.
- `app/data/trophies.json` — the 55 trophies: official name, description, grade, hidden flag, kind, missable flag, roadmap stage, guide, steps and sources.
- `main.ts` — copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library.
- `screenshots/` — four renders of the app itself: cover, one open guide, roadmap, missable filter.

## License

MIT — see `LICENSE`.

---

Built with [make.fun](https://make.fun/?ref=qjs4e9sj&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) — enter the bounty and build your own agent.
