// Tiny observable state store.

const results = new Map();
const listeners = new Set();

export function setResult(id, res) {
  results.set(id, res);
  for (const l of listeners) l(id, res);
}

export function setAll(entries) {
  results.clear();
  for (const [k, v] of entries) results.set(k, v);
  for (const l of listeners) l(null, null);
}

export function getResult(id) {
  return results.get(id);
}
export function getAllResults() {
  return results;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
