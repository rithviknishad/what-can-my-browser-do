// Search + filter applied to rendered rows.

const state = { q: "", support: "all", category: "*" };

export function getFilterState() {
  return { ...state };
}

export function setSearch(q) {
  state.q = q.trim().toLowerCase();
  apply();
}
export function setSupport(s) {
  state.support = s;
  apply();
}
export function setCategory(c) {
  state.category = c;
  apply();
}

export function apply() {
  const sections = document.querySelectorAll(".category");
  let anyVisibleSection = false;
  for (const sec of sections) {
    const catId = sec.id.replace(/^cat-/, "");
    const catVisible = state.category === "*" || state.category === catId;
    if (!catVisible) {
      sec.style.display = "none";
      continue;
    }

    let visibleRows = 0;
    for (const row of sec.querySelectorAll(".row")) {
      const supported = row.dataset.supported;
      const matchSupport =
        state.support === "all" || supported === state.support;
      const hay = `${row.dataset.label} ${row.dataset.desc} ${row.dataset.tags}`;
      const matchSearch = !state.q || hay.includes(state.q);
      const show = matchSupport && matchSearch;
      row.classList.toggle("hidden", !show);
      if (show) visibleRows++;
    }
    sec.style.display = visibleRows === 0 ? "none" : "";
    if (visibleRows > 0) anyVisibleSection = true;
  }

  // Show/hide the "no results" hint if present.
  const hint = document.getElementById("no-results-hint");
  if (hint) hint.style.display = anyVisibleSection ? "none" : "";
}
