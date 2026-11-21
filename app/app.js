// Leonida Trophy Atlas — tracker logic. Plain module, no network calls at run
// time beyond loading the trophy file that ships with this app.

const STORE_KEY = "leonida-atlas-v3";
const DATA_URL = "data/trophies.json";

const listEl = document.getElementById("cardList");
const emptyEl = document.getElementById("emptyNote");
const noteEl = document.getElementById("resultNote");
const queryEl = document.getElementById("queryBox");
const kindEl = document.getElementById("kindBox");
const gradeEl = document.getElementById("gradeBox");
const stageEl = document.getElementById("stageBox");
const spoilerEl = document.getElementById("spoilerBox");
const unearnedEl = document.getElementById("unearnedBox");
const earnedNum = document.getElementById("tallyEarned");
const pctNum = document.getElementById("tallyPct");
const fillBar = document.getElementById("tallyFill");

let atlas = [];
let earned = new Set();

function readStored() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((n) => Number.isInteger(n)));
  } catch {
    return new Set();
  }
}

function keepStored() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
  } catch {
    // Storage may be unavailable in a private window; the tracker still works in memory.
  }
}

function esc(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function gradeWord(grade) {
  return grade === "platinum" ? "Platinum" : grade === "gold" ? "Gold" : grade === "silver" ? "Silver" : "Bronze";
}

function kindWord(kind) {
  const words = {
    platinum: "Platinum",
    story: "Story",
    activities: "Activities",
    collectibles: "Collectibles",
    strangers: "Strangers",
    partner: "Partner",
    "open-world": "Open world",
    secret: "Secret",
  };
  return words[kind] || kind;
}

function isConcealed(trophy) {
  return spoilerEl.checked && trophy.hidden && trophy.kind === "story" && !earned.has(trophy.id);
}

function trophyMatches(trophy) {
  const q = queryEl.value.trim().toLowerCase();
  if (q) {
    const hay = [trophy.name, trophy.description, trophy.guide, ...(trophy.steps || [])].join(" ").toLowerCase();
    if (!hay.includes(q)) return false;
  }
  const kind = kindEl.value;
  if (kind === "missable") {
    if (!trophy.missable) return false;
  } else if (kind === "hidden") {
    if (!trophy.hidden) return false;
  } else if (kind === "online") {
    return false;
  } else if (kind !== "all" && trophy.kind !== kind) {
    return false;
  }
  if (gradeEl.value !== "all" && trophy.grade !== gradeEl.value) return false;
  if (stageEl.value !== "all" && String(trophy.stage) !== stageEl.value) return false;
  if (unearnedEl.checked && earned.has(trophy.id)) return false;
  return true;
}

function paintTally() {
  const got = earned.size;
  const total = atlas.length || 55;
  earnedNum.textContent = String(got);
  pctNum.textContent = Math.round((got / total) * 100) + "%";
  fillBar.style.width = (got / total) * 100 + "%";
  for (let stage = 1; stage <= 4; stage++) {
    const slot = document.querySelector('[data-stage-count="' + stage + '"]');
    if (!slot) continue;
    const inStage = atlas.filter((t) => t.stage === stage);
    slot.textContent = String(inStage.filter((t) => earned.has(t.id)).length);
  }
}

function paintCards() {
  const shown = atlas.filter(trophyMatches);
  listEl.innerHTML = "";
  emptyEl.hidden = shown.length > 0;
  noteEl.textContent =
    "Showing " + shown.length + " of " + atlas.length + " trophies — " + earned.size + " earned.";
  for (const trophy of shown) {
    const item = document.createElement("li");
    item.className = "trophy-card" + (earned.has(trophy.id) ? " earned" : "") + (trophy.missable ? " missable-flag" : "");
    item.dataset.trophyId = String(trophy.id);

    const concealed = isConcealed(trophy);
    const shownName = concealed ? "Hidden story trophy #" + trophy.id : trophy.name;
    const shownDesc = concealed
      ? "Earn this trophy to reveal its official description."
      : trophy.description;

    const tags = [];
    tags.push('<span class="tag">' + esc(kindWord(trophy.kind)) + "</span>");
    tags.push('<span class="tag">Stage ' + trophy.stage + "</span>");
    if (trophy.hidden) tags.push('<span class="tag shh">Hidden</span>');
    if (trophy.missable) tags.push('<span class="tag hot">Missable</span>');
    if (trophy.count) tags.push('<span class="tag">' + Number(trophy.count).toLocaleString("en-US") + " needed</span>");

    const sources = (trophy.sources || [])
      .map((s) => '<a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.label) + "</a>")
      .join(" &middot; ");

    item.innerHTML =
      '<div class="card-top">' +
      '<label class="card-check"><input type="checkbox" data-earn="' + trophy.id + '"' + (earned.has(trophy.id) ? " checked" : "") + "> Earned</label>" +
      '<div class="card-head">' +
      '<h3 class="card-name">' + esc(shownName) +
      '<span class="grade-chip grade-' + trophy.grade + '">' + gradeWord(trophy.grade) + "</span></h3>" +
      '<p class="card-desc">' + esc(shownDesc) + "</p>" +
      '<div class="tag-row">' + tags.join("") + "</div>" +
      "</div></div>" +
      '<button type="button" class="card-toggle" data-open="' + trophy.id + '">' +
      (concealed ? "Guide hidden until earned" : "Read the guide") +
      "</button>" +
      '<div class="card-detail" data-detail="' + trophy.id + '" hidden>' +
      (concealed
        ? "<p class=\"card-guide\">This story trophy is hidden until you earn it. Turn spoiler mode off to peek, or earn it in game first.</p>"
        : "<p class=\"card-guide\"><strong>Guide:</strong> " + esc(trophy.guide) + "</p>" +
          "<ol class=\"step-list\">" + (trophy.steps || []).map((s) => "<li>" + esc(s) + "</li>").join("") + "</ol>" +
          '<p class="source-line">Sources: ' + sources + "</p>") +
      "</div>";

    listEl.appendChild(item);
  }

  listEl.querySelectorAll("[data-earn]").forEach((box) => {
    box.addEventListener("change", () => {
      const id = Number(box.dataset.earn);
      if (box.checked) earned.add(id);
      else earned.delete(id);
      keepStored();
      paintTally();
      paintCards();
    });
  });

  listEl.querySelectorAll("[data-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const detail = listEl.querySelector('[data-detail="' + btn.dataset.open + '"]');
      if (!detail) return;
      const opening = detail.hidden;
      detail.hidden = !opening;
      btn.textContent = opening ? "Hide the guide" : "Read the guide";
    });
  });
}

function paintAll() {
  paintTally();
  paintCards();
}

function downloadJson() {
  const payload = { app: "Leonida Trophy Atlas", earned: [...earned].sort((a, b) => a - b), savedAt: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "leonida-trophy-atlas-progress.json";
  link.click();
  URL.revokeObjectURL(url);
}

function importJson(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      const ids = Array.isArray(parsed) ? parsed : parsed.earned;
      if (!Array.isArray(ids)) throw new Error("bad file");
      earned = new Set(ids.filter((n) => Number.isInteger(n) && n >= 1 && n <= 55));
      keepStored();
      paintAll();
    } catch {
      noteEl.textContent = "That file could not be imported. Export a progress file from this atlas and try again.";
    }
  };
  reader.readAsText(file);
}

async function boot() {
  earned = readStored();
  const params = new URLSearchParams(location.search);
  if (params.get("demo") === "1") {
    for (const id of [2, 3, 8, 15, 28]) earned.add(id);
    keepStored();
  }
  if (params.get("kind")) kindEl.value = params.get("kind");
  if (params.get("grade")) gradeEl.value = params.get("grade");
  if (params.get("stage")) stageEl.value = params.get("stage");
  if (params.get("spoiler") === "off") spoilerEl.checked = false;

  const response = await fetch(DATA_URL);
  const data = await response.json();
  atlas = Array.isArray(data) ? data : data.trophies;
  paintAll();

  if (params.get("open")) {
    const id = params.get("open");
    const btn = listEl.querySelector('[data-open="' + id + '"]');
    if (btn) btn.click();
    const card = listEl.querySelector('[data-trophy-id="' + id + '"]');
    if (card) card.scrollIntoView({ block: "start" });
  }
  if (params.get("view") === "roadmap") {
    document.getElementById("roadBox").scrollIntoView({ block: "start" });
  }
  if (params.get("view") === "list") {
    listEl.scrollIntoView({ block: "start" });
  }
}

for (const el of [queryEl, kindEl, gradeEl, stageEl, spoilerEl, unearnedEl]) {
  el.addEventListener("input", paintCards);
  el.addEventListener("change", paintCards);
}

document.getElementById("exportBtn").addEventListener("click", downloadJson);
document.getElementById("importBtn").addEventListener("click", () => {
  document.getElementById("importFile").click();
});
document.getElementById("importFile").addEventListener("change", (event) => {
  const file = event.target.files && event.target.files[0];
  if (file) importJson(file);
  event.target.value = "";
});
document.getElementById("resetBtn").addEventListener("click", () => {
  if (!window.confirm("Clear all earned trophies in this tracker?")) return;
  earned = new Set();
  keepStored();
  paintAll();
});

boot();
