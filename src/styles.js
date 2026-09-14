export const VISUAL_STYLES = [
  {
    id: "pixar",
    label: "Pixar 3D",
    suffix:
      "Pixar 3D animation, human body proportions, fruit-colored glossy skin, cinematic studio key light, 9:16 vertical, identity lock",
  },
  {
    id: "dreamworks",
    label: "DreamWorks",
    suffix: "DreamWorks 3D, exaggerated expressions, peach-fuzz skin, warm rim light, 9:16",
  },
  {
    id: "clay",
    label: "Claymation",
    suffix: "Aardman claymation, fingerprint texture, stop-motion lighting, 9:16",
  },
  {
    id: "anime",
    label: "Anime",
    suffix: "high-end anime film still, clean line, cel shading, fruit palette skin, 9:16",
  },
  {
    id: "editorial",
    label: "Editorial",
    suffix: "fashion editorial 3D, luxury villa, glossy skin, Vogue lighting, 9:16",
  },
  {
    id: "felt",
    label: "Feutrine",
    suffix: "felt stop-motion character, handmade textile, tactile fibers, 9:16",
  },
];

export function characterVisualPrompt(c, style) {
  const s = style || VISUAL_STYLES[0];
  return `Character portrait of ${c.name || "Unnamed"}, a ${c.fruit || "fruit"} humanoid.
LOOK: ${c.look || "human body, fruit skin, not a floating fruit head"}
PERSONALITY FACE: ${c.personality || "expressive"}
${s.suffix}
Facing camera, mid-shot, single character, no extra people, consistent design sheet.
Name on-screen optional: ${c.name || ""}`;
}
