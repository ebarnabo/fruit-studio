const STORE = "fruit-studio-v1";

export function load() {
  try {
    return JSON.parse(localStorage.getItem(STORE)) || { items: [], checks: {} };
  } catch {
    return { items: [], checks: {} };
  }
}

export function persist(db) {
  localStorage.setItem(STORE, JSON.stringify(db));
}

export function uid() {
  return crypto.randomUUID?.() || String(Date.now());
}
