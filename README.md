# Bradestudio-gta6-trophy-guide-01

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Bradestudio/Bradestudio-gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Bradestudio/Bradestudio-gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

**Leonida Trophy Atlas** — an offline guide & tracker for all 55 PlayStation 5
trophies in Grand Theft Auto VI, built for the make.fun bounty
"Build the best GTA 6 trophy guide". Every trophy's name, description and
grade is copied exactly from the official list (verified 2026-11-19 against
the live TrueAchievements list, PowerPyx and GTABase: 1 Platinum, 2 Gold,
6 Silver, 46 Bronze, 28 hidden, 0 online, all single-player). Every trophy
has a guide written in our own words, with its sources cited next to the
guide — including an honest "not yet confirmed" note for the five hidden
trophies whose triggers no guide had verified at launch.

## What it does

- **Checklist tracker** — tick trophies off; progress is saved in the browser
  (localStorage) and survives reloads. Export it as JSON and import it back.
- **Filters** — by type (Story, Side quests, Activities, Collectibles,
  Open world, Hidden / secret, Hidden trophies, Missable, Online — there
  are no online trophies, and the filter says so), by grade, by roadmap
  stage, by earned status, plus free-text search.
- **Spoiler setting** — hides the names, descriptions and guides of story
  trophies until you have earned them.
- **Roadmap to the Platinum** — four stages in order (story → side quests &
  partner trophies → activities & collectibles → cleanup & 100% Completion),
  each with its own earned count and a button to show that stage's trophies.
- **Missable warning** — exactly one trophy is flagged as potentially
  missable: Positive Mental Attitude, the Chapter 1 balcony meditation
  (unconfirmed whether it is strictly required, so the guide says to do it
  anyway and keep a Chapter 1 manual save). No other trophy is marked
  missable, because no other one is.
- **Offline** — the app loads only its own local `data/trophies.json` and
  makes no network request. Source links are shown for the reader; nothing
  is fetched unless the reader clicks.

## Run it

Serve the app locally (it needs HTTP for the local JSON fetch; opening the
file directly also works in browsers that allow it):

```sh
node serve.ts
```

then open http://localhost:8080.

Build the submission dossier (what the make.fun scorer reads):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Files

- `main.ts` — the entry program (Node 22, standard library only): copies
  `app/` and `screenshots/` to the output directory and writes
  `dossier.json` with the vendored make.fun library.
- `serve.ts` — tiny static server for local testing.
- `app/index.html` — the guide page.
- `app/app.js` — tracker logic: filters, spoiler setting, localStorage
  progress, export/import.
- `app/style.css` — original styling (no Rockstar logos or official artwork).
- `app/data/trophies.json` — all 55 trophies: official name, description
  and grade, plus kind, hidden/story flags, missable flag, roadmap stage,
  guide steps and cited sources.
- `screenshots/` — 4 renders of the app itself (1280×720 JPEG):
  1. cover (checklist + progress + filters + spoiler toggle),
  2. one trophy guide open with its sources,
  3. roadmap to the Platinum with the missable trophy flagged,
  4. missable filter with export/import.
- `shots.json` — what each screenshot shows.
- `vendor/makefun-frontend.ts` — vendored make.fun library, unmodified.
- `LICENSE` — MIT.

## Sources

Trophy list and guide facts were verified against the live tracker lists and
the launch-day guides: TrueAchievements, PowerPyx (trophy guide & roadmap,
100% checklist, card sets), GTABase (trophy list, 100% checklist), OutputLag,
GTADB (shooting ranges, cards, bank jobs), HowToVideoGame (WAiNK, meditation
spots, drones, challenges, car registration), Push Square (Bret's hunting
decks), GamesRecon (garage prices), eso.jffk.org (Strangers &amp; Freaks),
gtasix.how (trophy list, UFO lead), KeenGamer and Insider Gaming. Each
trophy's entry in `data/trophies.json` lists the exact sources its guide
was written from.

---

<sub>Entered on [make.fun](https://make.fun/?ref=qjs4e9sj&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
