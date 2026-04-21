// Detection driver and helpers.
// All detects returning a SupportResult: { supported: true|false|'partial', value?, note? }

/** Normalize any return value to a SupportResult. */
function normalize(r) {
  if (r && typeof r.supported !== "undefined") return r;
  if (typeof r === "boolean") return { supported: r };
  return { supported: false, note: "detect returned no result" };
}

/** Run a single check's detect(), never throw. */
export async function safeDetect(check) {
  try {
    const out = await check.detect();
    return normalize(out);
  } catch (err) {
    return {
      supported: false,
      note: "threw: " + (err && err.message ? err.message : String(err)),
    };
  }
}

/** Run every check across every category concurrently. */
export async function runAll(categories, onResult) {
  const tasks = [];
  for (const cat of categories) {
    for (const check of cat.checks) {
      tasks.push(
        safeDetect(check).then((r) => {
          onResult?.(check.id, r);
          return [check.id, r];
        }),
      );
    }
  }
  const settled = await Promise.allSettled(tasks);
  const map = new Map();
  for (const s of settled)
    if (s.status === "fulfilled") map.set(s.value[0], s.value[1]);
  return map;
}

// Helpers used by registry modules.

export function hasGlobal(path) {
  try {
    const parts = path.split(".");
    let cur = globalThis;
    for (const p of parts) {
      if (cur == null) return false;
      cur = cur[p];
    }
    return cur != null;
  } catch {
    return false;
  }
}

export function cssSupports(a, b) {
  try {
    return b === undefined ? CSS.supports(a) : CSS.supports(a, b);
  } catch {
    return false;
  }
}

export function mediaSupports(q) {
  try {
    const m = matchMedia(q);
    return !!m && m.media !== "not all";
  } catch {
    return false;
  }
}

export function mediaMatches(q) {
  try {
    return matchMedia(q).matches;
  } catch {
    return false;
  }
}

export function syntaxOk(src) {
  try {
    new Function(src);
    return true;
  } catch {
    return false;
  }
}

export function withTimeout(promise, ms, onTimeout) {
  return Promise.race([
    Promise.resolve(promise),
    new Promise((resolve) => setTimeout(() => resolve(onTimeout), ms)),
  ]);
}

export function decodeImage(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.naturalWidth > 0 && img.naturalHeight > 0);
    img.onerror = () => resolve(false);
    img.src = dataUrl;
  });
}

// Compatibility namespace used by some registry modules.
export const H = {
  supportsCss: cssSupports,
  hasGlobal,
  matchMedia: mediaMatches,
  mediaSupported: mediaSupports,
  syntaxOk,
  withTimeout,
  decodeImage,
};
