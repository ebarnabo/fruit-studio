const STORE = "fruit-studio-v2";
const LEGACY = "fruit-studio-v1";

import { seedStory } from "./model";

export function load() {
  try {
    const raw = localStorage.getItem(STORE);
    if (raw) {
      const db = JSON.parse(raw);
      if (!db.stories) db.stories = [];
      if (!db.checks) db.checks = {};
      return db;
    }
  } catch {
    /* empty */
  }
  const seeded = { stories: [seedStory()], checks: {}, storyId: null };
  seeded.storyId = seeded.stories[0].id;
  try {
    const old = JSON.parse(localStorage.getItem(LEGACY) || "null");
    if (old?.checks) seeded.checks = old.checks;
  } catch {
    /* empty */
  }
  return seeded;
}

export function persist(db) {
  localStorage.setItem(STORE, JSON.stringify(db));
}

export { uid } from "./id";

export function compressImage(file, max = 480) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.72));
    };
    img.src = url;
  });
}
