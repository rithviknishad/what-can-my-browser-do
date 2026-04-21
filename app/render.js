// app/render.js — generic renderer. Builds DOM from registry once; results update
// per-row via data-* attributes as they arrive. Matches markup in index.html.

import { getAllResults, subscribe } from "./state.js";

const ICON = {
  true: "\u2713",
  false: "\u2715",
  partial: "~",
  pending: "\u2026",
};
const ARIA = {
  true: "supported",
  false: "not supported",
  partial: "partial support",
  pending: "pending",
};

function iconFor(supported) {
  return ICON[String(supported)] ?? "\u2026";
}

function rowEl(check) {
  const row = document.createElement("div");
  row.className = "row";
  row.dataset.id = check.id;
  row.dataset.supported = "pending";
  row.dataset.label = check.label.toLowerCase();
  row.dataset.desc = (check.description || "").toLowerCase();
  row.dataset.tags = (check.tags || []).join(" ").toLowerCase();

  const status = document.createElement("span");
  status.className = "status";
  status.textContent = "\u2026";
  status.setAttribute("aria-label", "pending");
  status.title = "pending";

  const main = document.createElement("div");
  const label = document.createElement("div");
  label.className = "label";
  label.textContent = check.label;
  if (check.mdnUrl) {
    const a = document.createElement("a");
    a.className = "mdn";
    a.href = check.mdnUrl;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = "docs";
    a.title = "MDN docs";
    label.appendChild(a);
  }
  const ciUrl = check.caniuseId
    ? `https://caniuse.com/${encodeURIComponent(check.caniuseId)}`
    : `https://caniuse.com/?search=${encodeURIComponent(check.label)}`;
  const ci = document.createElement("a");
  ci.className = "caniuse";
  ci.href = ciUrl;
  ci.target = "_blank";
  ci.rel = "noopener noreferrer";
  ci.textContent = "caniuse";
  ci.title = check.caniuseId
    ? `caniuse.com/${check.caniuseId}`
    : `Search caniuse.com for “${check.label}”`;
  label.appendChild(ci);
  main.appendChild(label);
  if (check.description) {
    const desc = document.createElement("div");
    desc.className = "desc";
    desc.textContent = check.description;
    main.appendChild(desc);
  }

  const meta = document.createElement("div");
  meta.className = "meta";

  row.append(status, main, meta);
  return row;
}

export function renderCategories(categories, root) {
  root.innerHTML = "";
  for (const cat of categories) {
    const section = document.createElement("section");
    section.className = "category";
    section.id = "cat-" + cat.id;

    const h = document.createElement("h2");
    const icon = document.createElement("span");
    icon.className = "icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = cat.icon || "\u2022";
    const counter = document.createElement("span");
    counter.style.cssText =
      "font-weight:400;color:var(--fg-faint);letter-spacing:0;text-transform:none;";
    counter.textContent = ` (${cat.checks.length})`;
    h.append(icon, document.createTextNode(" " + cat.label), counter);
    section.appendChild(h);

    const rows = document.createElement("div");
    rows.className = "rows";
    for (const c of cat.checks) rows.appendChild(rowEl(c));
    section.appendChild(rows);

    root.appendChild(section);
  }
}

function updateRow(id, res) {
  const row = document.querySelector(`.row[data-id="${CSS.escape(id)}"]`);
  if (!row) return;
  const s = String(res.supported);
  row.dataset.supported = s;
  const status = row.querySelector(".status");
  status.textContent = iconFor(res.supported);
  status.setAttribute("aria-label", ARIA[s] || "pending");
  status.title = ARIA[s] || "pending";

  const meta = row.querySelector(".meta");
  meta.innerHTML = "";
  if (res.value) {
    const v = document.createElement("span");
    v.className = "value";
    v.textContent = res.value;
    v.title = res.value;
    meta.appendChild(v);
  }
  if (res.note) {
    const n = document.createElement("span");
    n.className = "note";
    n.textContent = res.note;
    meta.appendChild(n);
  }
}

export function bindResultUpdates(summaryEl, categories) {
  subscribe((id) => {
    if (id) {
      const res = getAllResults().get(id);
      if (res) updateRow(id, res);
    } else {
      for (const [k, v] of getAllResults()) updateRow(k, v);
    }
    renderSummary(categories, summaryEl);
  });
}

export function renderSummary(categories, el) {
  const results = getAllResults();
  let total = 0,
    ok = 0,
    partial = 0,
    no = 0,
    pending = 0;
  for (const cat of categories) {
    for (const c of cat.checks) {
      total++;
      const r = results.get(c.id);
      if (!r) {
        pending++;
        continue;
      }
      if (r.supported === true) ok++;
      else if (r.supported === "partial") partial++;
      else no++;
    }
  }
  el.innerHTML = "";
  const chip = (cls, html) => {
    const s = document.createElement("span");
    s.className = "chip" + (cls ? " " + cls : "");
    s.innerHTML = html;
    return s;
  };
  el.append(
    chip("ok", `<strong>${ok}</strong> supported`),
    chip("warn", `<strong>${partial}</strong> partial`),
    chip("err", `<strong>${no}</strong> unsupported`),
    chip("", `<strong>${total}</strong> total`),
  );
  if (pending) el.append(chip("", `<strong>${pending}</strong> pending`));
}

export function renderPillNav(categories, el, onSelect) {
  el.innerHTML = "";
  const mk = (id, label, count, pressed) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-pressed", pressed ? "true" : "false");
    b.dataset.cat = id;
    b.innerHTML = `${label} <span class="count">${count}</span>`;
    b.addEventListener("click", () => {
      for (const btn of el.querySelectorAll("button"))
        btn.setAttribute("aria-pressed", btn === b ? "true" : "false");
      onSelect(id);
    });
    return b;
  };
  const total = categories.reduce((n, c) => n + c.checks.length, 0);
  el.appendChild(mk("*", "All", total, true));
  for (const c of categories) {
    el.appendChild(
      mk(c.id, `${c.icon || ""} ${c.label}`, c.checks.length, false),
    );
  }
}
