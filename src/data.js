export const CAST = [
  { id: "strawberrina", name: "Strawberrina", fruit: "Fraise", trait: "Dramatique", voice: "Alto criard", emoji: "🍓" },
  { id: "bananito", name: "Bananito", fruit: "Banane", trait: "Arrogant", voice: "Ténor velours", emoji: "🍌" },
  { id: "cherrita", name: "Cherrita", fruit: "Cerise", trait: "Manipulative", voice: "Soprano douce", emoji: "🍒" },
  { id: "plumero", name: "Plumero", fruit: "Prune", trait: "Romantique", voice: "Baryton chaud", emoji: "🍇" },
  { id: "watermelina", name: "Watermelina", fruit: "Pastèque", trait: "Bombshell", voice: "Alto profond", emoji: "🍉" },
  { id: "mangolo", name: "Mangolo", fruit: "Mangue", trait: "Coach toxique", voice: "Motivational", emoji: "🥭" },
];

export const TEMPLATES = [
  {
    id: "recoupling",
    title: "Recoupling surprise",
    hook: "IL LA QUITTE EN DIRECT",
    twist: "Bananito choisit Cherrita au recoupling. Strawberrina reste seule.",
    duration: 75,
  },
  {
    id: "secret-garden",
    title: "Secret garden",
    hook: "ILS SE SONT EMBRASSÉS",
    twist: "Plumero surprend Watermelina et Mangolo dans le secret garden.",
    duration: 80,
  },
  {
    id: "zucchini",
    title: "Le bébé zucchini",
    hook: "ELLE EST ENCEINTE… CE N’EST PAS UNE CERISE",
    twist: "Cherrita accouche d’un zucchini. Il ressemble au boss.",
    duration: 70,
  },
  {
    id: "bombshell",
    title: "Bombshell entrée",
    hook: "UNE NOUVELLE ENTRE DANS LA VILLA",
    twist: "Watermelina débarque de Barcelone et cible Bananito.",
    duration: 75,
  },
  {
    id: "confession",
    title: "Confession cam",
    hook: "JE SAIS QUI TRICHE",
    twist: "Strawberrina balance tout. Cliffhanger : quelqu’un écoute derrière la porte.",
    duration: 65,
  },
];

export const CHECKLIST = [
  { id: "script", group: "Préprod", label: "Script 65–90s, 6 scènes max, hook 3s" },
  { id: "cast", group: "Préprod", label: "Cast figé (mêmes looks + voix par perso)" },
  { id: "hook-text", group: "Préprod", label: "Hook texte + hashtags prêts" },
  { id: "keyframes", group: "Image", label: "1 keyframe / scène, suffixe Pixar 3D 9:16" },
  { id: "identity", group: "Image", label: "Corps humain, peau fruitée — pas de tête-fruit flottante" },
  { id: "i2v", group: "Vidéo", label: "Image-to-video 5–8s, bouche + blinks, no morph" },
  { id: "cuts", group: "Vidéo", label: "10–12 plans, cut toutes les 1.5–2.5s" },
  { id: "voices", group: "Audio", label: "Voix lockées ElevenLabs / Dubdub par perso" },
  { id: "subs", group: "Montage", label: "Sous-titres gros, jaune + contour, mot à mot" },
  { id: "stickers", group: "Montage", label: "Stickers BOMBSHELL / RECCOUPLING / CONFESSION" },
  { id: "ai-label", group: "Montage", label: "Label Contains AI-generated media" },
  { id: "safe", group: "Montage", label: "Export 9:16 H.264, 1080x1920, < 3 min" },
  { id: "caption", group: "Publi", label: "Caption + CTA commentaires (suggérer la suite)" },
  { id: "post", group: "Publi", label: "Poster le soir, série quotidienne, cliffhanger" },
];

export const CHANNELS = [
  {
    id: "tiktok",
    name: "TikTok",
    free: true,
    method: "Télécharger + partager via l’app. API officielle gratuite mais audit obligatoire.",
    url: "https://www.tiktok.com/upload",
  },
  {
    id: "capcut",
    name: "CapCut",
    free: true,
    method: "Import + auto captions + publish TikTok/Reels depuis CapCut (gratuit).",
    url: "https://www.capcut.com/",
  },
  {
    id: "reels",
    name: "Instagram Reels",
    free: true,
    method: "Partage natif depuis le téléphone ou CapCut.",
    url: "https://www.instagram.com/reels/create/",
  },
  {
    id: "shorts",
    name: "YouTube Shorts",
    free: true,
    method: "Upload studio YouTube, format vertical.",
    url: "https://studio.youtube.com/",
  },
];

export const STYLE_SUFFIX =
  "Pixar 3D animation, human body proportions, fruit-colored skin and fruit features (not floating fruit heads), glossy skin, cinematic villa pool lighting, shallow depth of field, 9:16 vertical";

export function buildScript(template, notes) {
  return `ÉPISODE · ${template.title.toUpperCase()}
DURÉE CIBLE · ${template.duration}s
HOOK ON-SCREEN · ${template.hook}

TWIST
${template.twist}
${notes ? `\nNOTES\n${notes}` : ""}

SCÈNES
1. Hook 3s — villa nuit, zoom visage. Texte ${template.hook}.
2. Clash pool — 2 persos, dialogue 8s.
3. Cutaway groupe — réactions overacting 6s.
4. Confession cam — close-up, 12s.
5. Twist reveal — insert + réaction 10s.
6. Cliffhanger — regard caméra, freeze 4s.

PROMPT IMAGE (suffixe à coller)
${STYLE_SUFFIX}

PROMPT MOTION
subtle talking mouth, slight head tilt, natural blinks, handheld reality-TV camera, no morphing, keep character identity`;
}
