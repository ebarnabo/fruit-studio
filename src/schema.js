import { STYLE_SUFFIX } from "./data";
import { makeCharacter, makeEpisode, makeScene, makeShot, makeStory } from "./model";

export const LOCKS = {
  format: "9:16 1080x1920",
  style: STYLE_SUFFIX,
  episodeTarget: [70, 90],
  maxScenes: 6,
  maxShotsPerScene: 4,
  durations: [3, 4, 5, 6, 8],
  roles: {
    hook: 3,
    clash: 5,
    reaction: 4,
    confession: 8,
    twist: 6,
    cliff: 4,
  },
};

export function snapDuration(n) {
  const v = Number(n) || 5;
  return LOCKS.durations.reduce((best, d) => (Math.abs(d - v) < Math.abs(best - v) ? d : best), LOCKS.durations[0]);
}

export function extractJSON(text) {
  const raw = (text || "").trim();
  const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = fence ? fence[1] : raw;
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error("JSON introuvable");
  return JSON.parse(body.slice(start, end + 1));
}

export function importPayload(payload) {
  const data = typeof payload === "string" ? extractJSON(payload) : payload;
  const story = makeStory({
    name: data.name || data.series || "Série importée",
    plot: data.plot || data.trame || "",
  });
  const chars = (data.characters || data.persos || []).map((c) =>
    makeCharacter({
      name: c.name || "",
      fruit: c.fruit || "",
      personality: c.personality || c.caractere || "",
      speech: c.speech || c.parole || "",
      behavior: c.behavior || c.comportement || "",
      look: c.look || "",
      emoji: c.emoji || "🍓",
    })
  );
  story.characters = chars;
  const byName = Object.fromEntries(chars.map((c) => [c.name.toLowerCase(), c.id]));

  function idsFrom(list) {
    return (list || []).map((n) => byName[String(n).toLowerCase()]).filter(Boolean);
  }

  story.episodes = (data.episodes || []).slice(0, 24).map((ep) =>
    makeEpisode({
      title: ep.title || "Épisode",
      hook: ep.hook || "",
      scenes: (ep.scenes || []).slice(0, LOCKS.maxScenes).map((sc) =>
        makeScene({
          title: sc.title || "Scène",
          music: sc.music || "",
          overlays: sc.overlays || [],
          characterIds: idsFrom(sc.characters),
          shots: (sc.shots || []).slice(0, LOCKS.maxShotsPerScene).map((sh) =>
            makeShot({
              duration: snapDuration(sh.duration),
              plan: sh.plan || "",
              action: sh.action || "",
              how: sh.how || "",
              overlay: sh.overlay || "",
              characterIds: idsFrom(sh.characters),
            })
          ),
        })
      ),
    })
  );
  return story;
}

export function masterPrompt({ idea = "", episodeCount = 5 } = {}) {
  return `Tu es showrunner d'une série TikTok "fruit slop" style Pixar 3D (fruits humanoïdes, corps humain, peau fruitée).

IDÉE UTILISATEUR
${idea || "(invente une série dating-show absurde avec trahisons + cliffhangers)"}

GÉNÈRE ${episodeCount} ÉPISODES COMPLETS.

======= PARAMÈTRES LOCKÉS — INTERDIT DE LES MODIFIER =======
- Format vidéo: ${LOCKS.format}
- Style visuel: ${LOCKS.style}
- Durée épisode cible: ${LOCKS.episodeTarget[0]}–${LOCKS.episodeTarget[1]} secondes
- Max ${LOCKS.maxScenes} scènes / épisode
- Max ${LOCKS.maxShotsPerScene} plans / scène
- Durées de plan AUTORISÉES UNIQUEMENT: ${LOCKS.durations.join(", ")} secondes
- Rôles de plan (utilise ces durées, ne les change pas):
  hook=${LOCKS.roles.hook}s | clash=${LOCKS.roles.clash}s | reaction=${LOCKS.roles.reaction}s | confession=${LOCKS.roles.confession}s | twist=${LOCKS.roles.twist}s | cliff=${LOCKS.roles.cliff}s
- Identity lock: chaque perso a un look figé. Ne redesign jamais un visage entre épisodes.
- Overlay: phrases COURTES, caps, punchy.
- Pas de contenu sexuel explicite. Absurde + soap opera only.

======= FORMAT DE SORTIE — JSON PUR, RIEN AUTOUR =======
{
  "name": "Nom de la série",
  "plot": "Trame en 3-5 phrases",
  "characters": [{ "name": "Strawberrina", "fruit": "Fraise", "emoji": "🍓", "look": "Human body, strawberry-red glossy skin, Pixar 3D", "personality": "Dramatique", "speech": "Alto criard", "behavior": "Overacting" }],
  "episodes": [{ "title": "Recoupling", "hook": "IL LA QUITTE EN DIRECT", "scenes": [{ "title": "Hook villa", "music": "sting low", "overlays": ["IL LA QUITTE EN DIRECT"], "characters": ["Strawberrina"], "shots": [{ "duration": 3, "plan": "Close-up", "action": "Regarde cam", "how": "Handheld", "overlay": "IL LA QUITTE EN DIRECT", "characters": ["Strawberrina"] }] }] }]
}

RÈGLES JSON
- duration = uniquement ${LOCKS.durations.join(" | ")}
- characters = noms EXACTS du tableau characters
- 4 à 8 persos max
- cliffhanger chaque épisode
- réponds UNIQUEMENT avec le JSON`;
}
