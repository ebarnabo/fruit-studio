import { uid } from "./id";
import { CAST, STYLE_SUFFIX } from "./data";

export function makeCharacter(partial = {}) {
  return {
    id: uid(),
    name: "",
    fruit: "",
    personality: "",
    speech: "",
    behavior: "",
    look: "",
    emoji: "🍓",
    image: "",
    ...partial,
  };
}

export function makeShot(partial = {}) {
  return {
    id: uid(),
    duration: 5,
    plan: "",
    action: "",
    how: "",
    characterIds: [],
    overlay: "",
    ...partial,
  };
}

export function makeScene(partial = {}) {
  return {
    id: uid(),
    title: "Nouvelle scène",
    music: "",
    overlays: [],
    characterIds: [],
    shots: [makeShot({ duration: 3, plan: "Hook close-up", action: "Regarde caméra", how: "Overacting, larme unique" })],
    ...partial,
  };
}

export function makeEpisode(partial = {}) {
  return {
    id: uid(),
    title: "Épisode 1",
    hook: "",
    status: "draft",
    createdAt: Date.now(),
    scenes: [],
    ...partial,
  };
}

export function makeStory(partial = {}) {
  return {
    id: uid(),
    name: "Nouvelle série",
    plot: "",
    createdAt: Date.now(),
    characters: [],
    episodes: [],
    ...partial,
  };
}

export function seedStory() {
  const characters = CAST.map((c) =>
    makeCharacter({
      name: c.name,
      fruit: c.fruit,
      personality: c.trait,
      speech: c.voice,
      behavior: `${c.trait}, réactions TV réalité, jamais calme`,
      look: `Human body, ${c.fruit.toLowerCase()} skin, Pixar 3D, identity lock: ${c.name}`,
      emoji: c.emoji,
    })
  );
  const byName = Object.fromEntries(characters.map((c) => [c.name, c.id]));
  const ep = makeEpisode({
    title: "Recoupling",
    hook: "IL LA QUITTE EN DIRECT",
    scenes: [
      makeScene({
        title: "Hook villa",
        music: "Love Island sting, low",
        overlays: ["IL LA QUITTE EN DIRECT"],
        characterIds: [byName.Strawberrina, byName.Bananito],
        shots: [
          makeShot({
            duration: 3,
            plan: "Close-up Strawberrina, villa nuit",
            action: "Yeux écarquillés vers Bananito",
            how: "Handheld, larme, overacting",
            characterIds: [byName.Strawberrina],
            overlay: "IL LA QUITTE EN DIRECT",
          }),
          makeShot({
            duration: 5,
            plan: "Two-shot pool deck",
            action: "Bananito tourne le dos",
            how: "Lent, arrogant, pas de morph",
            characterIds: [byName.Strawberrina, byName.Bananito],
            overlay: "",
          }),
        ],
      }),
    ],
  });
  return makeStory({
    name: "Fruit Love Island",
    plot: "Dating show absurde. Fruits humanoïdes se couple, trahissent, recouplent. Cliffhanger chaque épisode.",
    characters,
    episodes: [ep],
  });
}

export function episodeDuration(ep) {
  return (ep.scenes || []).reduce(
    (acc, sc) => acc + (sc.shots || []).reduce((a, s) => a + Number(s.duration || 0), 0),
    0
  );
}

export function charMap(story) {
  return Object.fromEntries((story?.characters || []).map((c) => [c.id, c]));
}

export function namesOf(ids, map) {
  return (ids || []).map((id) => map[id]?.name || "?").join(", ") || "—";
}

export function buildEpisodePack(story, episode) {
  const map = charMap(story);
  const bible = (story.characters || [])
    .map(
      (c) => `### ${c.name} (${c.fruit || "fruit"})
LOOK LOCK: ${c.look || c.emoji}
PERSONNALITÉ: ${c.personality}
PAROLE: ${c.speech}
COMPORTEMENT: ${c.behavior}
NE PAS CHANGER le visage, la couleur de peau, les proportions.`
    )
    .join("\n\n");

  const scenes = (episode.scenes || [])
    .map((sc, i) => {
      const shots = (sc.shots || [])
        .map((sh, j) => {
          const present = namesOf(sh.characterIds.length ? sh.characterIds : sc.characterIds, map);
          const image = [
            present,
            sh.plan,
            STYLE_SUFFIX,
            "KEEP character identity locked to bible above",
          ]
            .filter(Boolean)
            .join(", ");
          const motion = [
            sh.action,
            sh.how,
            `duration ${sh.duration}s`,
            "subtle talking mouth, natural blinks, handheld reality-TV, no morphing",
          ]
            .filter(Boolean)
            .join(", ");
          return `PLAN ${i + 1}.${j + 1} · ${sh.duration}s
PERSOS: ${present}
PLAN: ${sh.plan}
ACTION: ${sh.action}
MANIÈRE: ${sh.how}
OVERLAY: ${sh.overlay || (sc.overlays || []).join(" / ") || "—"}
IMAGE PROMPT:
${image}
MOTION PROMPT:
${motion}`;
        })
        .join("\n\n");
      return `## SCÈNE ${i + 1} · ${sc.title}
MUSIQUE: ${sc.music || "—"}
TEXTES INCRUSTÉS: ${(sc.overlays || []).join(" | ") || "—"}
CAST SCÈNE: ${namesOf(sc.characterIds, map)}

${shots}`;
    })
    .join("\n\n---\n\n");

  const total = episodeDuration(episode);
  return `SÉRIE: ${story.name}
TRAME: ${story.plot}
ÉPISODE: ${episode.title}
HOOK ON-SCREEN: ${episode.hook || "—"}
DURÉE TOTALE: ${total}s
FORMAT: 9:16 1080x1920 · Pixar 3D fruit humanoïde · identity lock

======= BIBLE PERSOS =======
${bible || "(aucun perso)"}

======= PLANS À GÉNÉRER =======
${scenes || "(aucune scène)"}

RÈGLES
- 1 image keyframe par plan, puis image-to-video
- Même look que la bible, zéro redesign
- Overlay jaune + contour si texte
- Label Contains AI-generated media`;
}

export function buildEpisodeJSON(story, episode) {
  const map = charMap(story);
  return {
    series: { id: story.id, name: story.name, plot: story.plot },
    episode: {
      id: episode.id,
      title: episode.title,
      hook: episode.hook,
      duration: episodeDuration(episode),
      scenes: (episode.scenes || []).map((sc) => ({
        title: sc.title,
        music: sc.music,
        overlays: sc.overlays,
        characters: namesOf(sc.characterIds, map),
        shots: (sc.shots || []).map((sh) => ({
          duration: sh.duration,
          plan: sh.plan,
          action: sh.action,
          how: sh.how,
          overlay: sh.overlay,
          characters: namesOf(sh.characterIds.length ? sh.characterIds : sc.characterIds, map),
        })),
      })),
    },
    characters: story.characters.map((c) => ({
      name: c.name,
      fruit: c.fruit,
      personality: c.personality,
      speech: c.speech,
      behavior: c.behavior,
      look: c.look,
    })),
  };
}
