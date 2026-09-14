import { compressImage } from "./storage";
import { makeCharacter } from "./model";

export function BibleView({ story, patchStory, ping }) {
  function updateChar(id, patch) {
    patchStory({
      ...story,
      characters: story.characters.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    });
  }

  async function onImage(id, file) {
    if (!file) return;
    const data = await compressImage(file);
    updateChar(id, { image: data });
    ping("Image lockée");
  }

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-extrabold">Bible persos</h2>
        <button
          onClick={() => patchStory({ ...story, characters: [...story.characters, makeCharacter({ name: "Nouveau" })] })}
          className="h-11 rounded-[18px] bg-cream px-4 text-sm font-extrabold text-ink"
        >
          + Perso
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {story.characters.map((c) => (
          <article key={c.id} className="rounded-[28px] border border-white/8 bg-pulp/80 p-5">
            <div className="mb-4 flex gap-4">
              <label className="relative flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[24px] bg-ink">
                {c.image ? (
                  <img src={c.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-3xl">{c.emoji || "+"}</span>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => onImage(c.id, e.target.files?.[0])} />
              </label>
              <div className="grid flex-1 gap-2">
                <input
                  value={c.name}
                  onChange={(e) => updateChar(c.id, { name: e.target.value })}
                  className="h-11 rounded-[16px] bg-ink px-3 text-sm font-extrabold outline-none"
                  placeholder="Nom"
                />
                <input
                  value={c.fruit}
                  onChange={(e) => updateChar(c.id, { fruit: e.target.value })}
                  className="h-11 rounded-[16px] bg-ink px-3 text-sm outline-none"
                  placeholder="Fruit / espèce"
                />
              </div>
            </div>
            <Field label="Look lock" value={c.look} onChange={(v) => updateChar(c.id, { look: v })} />
            <Field label="Caractère" value={c.personality} onChange={(v) => updateChar(c.id, { personality: v })} />
            <Field label="Manière de parler" value={c.speech} onChange={(v) => updateChar(c.id, { speech: v })} />
            <Field label="Comportement" value={c.behavior} onChange={(v) => updateChar(c.id, { behavior: v })} />
            <button
              onClick={() => patchStory({ ...story, characters: story.characters.filter((x) => x.id !== c.id) })}
              className="mt-2 text-xs font-bold text-berry"
            >
              Retirer
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function Field({ label, value, onChange }) {
  return (
    <label className="mb-3 block">
      <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-cream/40">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="w-full resize-none rounded-[16px] bg-ink px-3 py-2 text-sm leading-5 outline-none"
      />
    </label>
  );
}
