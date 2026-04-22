// app/main.js — orchestrator: bootstraps registry, runs detections, wires UI.

import { categories } from "../registry/index.js";
import { runAll } from "./detect.js";
import { setResult, setAll } from "./state.js";
import {
  renderCategories,
  renderPillNav,
  renderSummary,
  bindResultUpdates,
} from "./render.js";
import { setSearch, setSupport, setCategory } from "./search.js";
import { downloadJson, copyShareUrl, readSharedFromHash } from "./export.js";
import { createReporter } from "./report.js";

const $ = (sel) => document.querySelector(sel);

let toastTimer = null;
function toast(msg, ms = 1800) {
  const t = $("#toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), ms);
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem("wcmbd:theme", theme);
  } catch {}
}

function initTheme() {
  let t = "auto";
  try {
    t = localStorage.getItem("wcmbd:theme") || "auto";
  } catch {}
  applyTheme(t);
}

function cycleTheme() {
  const order = ["auto", "light", "dark"];
  const cur = document.documentElement.dataset.theme || "auto";
  const next = order[(order.indexOf(cur) + 1) % order.length];
  applyTheme(next);
  toast(`Theme: ${next}`);
}

async function runDetections() {
  for (const row of document.querySelectorAll(".row")) {
    row.dataset.supported = "pending";
    const s = row.querySelector(".status");
    s.textContent = "\u2026";
    s.setAttribute("aria-label", "pending");
    s.title = "pending";
    row.querySelector(".meta").innerHTML = "";
  }
  await runAll(categories, (id, res) => setResult(id, res));
}

async function maybeLoadShared() {
  const shared = await readSharedFromHash();
  if (shared && shared.results) {
    const entries = Object.entries(shared.results);
    setAll(entries);
    toast("Loaded shared snapshot from URL");
    return true;
  }
  return false;
}

function wireUI() {
  $("#search").addEventListener("input", (e) => setSearch(e.target.value));
  $("#filter-support").addEventListener("change", (e) =>
    setSupport(e.target.value),
  );
  $("#btn-theme").addEventListener("click", cycleTheme);
  $("#btn-rerun").addEventListener("click", async () => {
    toast("Re-running...");
    if (location.hash.includes("s="))
      history.replaceState(null, "", location.pathname);
    await runDetections();
    toast("Done");
  });
  $("#btn-export").addEventListener("click", () => {
    downloadJson();
    toast("JSON snapshot downloaded");
  });
  $("#btn-share").addEventListener("click", async () => {
    const { url, copied } = await copyShareUrl();
    history.replaceState(null, "", url);
    toast(
      copied ? "Share URL copied to clipboard" : "Share URL set in address bar",
    );
  });

  document.addEventListener("keydown", (e) => {
    const ae = document.activeElement;
    if (
      e.key === "/" &&
      ae &&
      ae.tagName !== "INPUT" &&
      ae.tagName !== "TEXTAREA"
    ) {
      e.preventDefault();
      $("#search").focus();
    }
  });
}

async function main() {
  initTheme();
  $("#ua").textContent = navigator.userAgent;

  renderCategories(categories, $("#results"));
  renderPillNav(categories, $("#pillnav"), (catId) => setCategory(catId));
  renderSummary(categories, $("#summary"));
  bindResultUpdates($("#summary"), categories);
  wireUI();
  const reporter = createReporter(toast);
  const loadedShared = await maybeLoadShared();
  if (!loadedShared) await runDetections();
  if (reporter.enabled) await reporter.send();
}

main();
