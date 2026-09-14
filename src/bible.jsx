import { useMemo, useState } from "react";
import { Copy } from "lucide-react";
import { compressImage } from "./storage";
import { makeCharacter } from "./model";
import { VISUAL_STYLES, characterVisualPrompt } from "./styles";

export function BibleView({ story, patchStory, ping, copyText }) {
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState(story.characters[0]?.id || null);
  const [styleId, setStyleId] = useState("pixar");
  const style = VISUAL_STYLES.find((s) => s.id === styleId) || VISUAL_STYLES[0];

  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return story.characters;
    return story.characters.filter((c) => [c.name, c.fruit, c.personality].join(" ").toLowerCase().includes(n));
  }, [story.characters, q]);

  const current = story.characters.find((c) => c.id === openId) || list[0] || null;

  function addChar() {
    const c = makeCharacter({ name: `Perso ${story.characters.length + 1}` });
    patchStory({ ...story, characters: [...story.characters, c] });
    setOpenId(c.id);
    ping("Perso ajouté");
  }

  function updateChar(id, patch) {
    patchStory({ ...story, characters: story.characters.map((c) => (c.id === id ? { ...c, ...patch } : c)) });
  }

  async function onImage(id, file) {
    if (!file) return;
    updateChar(id, { image: await compressImage(file) });
    ping("Image lockée");
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[280px_1fr]">
      <aside className="h-fit rounded-[28px] border border-white/8 bg-pulp/80 p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-sm font-extrabold">Persos · {story.characters.length}</h2>
          <button onClick={addChar} className="h-10 rounded-[14px] bg-cream px-3 text-xs font-extrabold text-ink">+ Perso</button>
        </div>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filtrer…" className="mb-3 h-11 w-full rounded-[14px] bg-ink px-3 text-sm outline-none" />
        <div className="max-h-[58vh] space-y-2 overflow-auto pr-1">
          {list.length === 0 && <p className="p-3 text-xs text-cream/40">Aucun perso. Clique + Perso.</p>}
          {list.map((c) => (
            <button key={c.id} onClick={() => setOpenId(c.id)} className={`flex w-full items-center gap-3 rounded-[18px] p-2 text-left ${current?.id === c.id ? "bg-berry text-white" : "bg-ink/50 hover:bg-ink"}`}>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-peel">
                {c.image ? <img src={c.image} alt="" className="h-full w-full object-cover" /> : <span>{c.emoji}</span>}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-extrabold">{c.name || "Sans nom"}</span>
                <span className={`block truncate text-[11px] ${current?.id === c.id ? "text-white/70" : "text-cream/40"}`}>{c.fruit || "fruit"} · {c.personality || "à définir"}</span>
              </span>
            </button>
          ))}
        </div>
      </aside>

      {!current && (
        <div className="flex flex-col items-start justify-center rounded-[28px] border border-dashed border-white/15 p-10">
          <p className="mb-4 text-cream/50">La bible est vide.</p>
          <button onClick={addChar} className="h-12 rounded-[18px] bg-berry px-5 text-sm font-extrabold text-white">Ajouter le premier perso</button>
        </div>
      )}

      {current && (
        <article className="rounded-[28px] border border-white/8 bg-pulp/80 p-6">
          <div className="mb-5 flex flex-wrap items-start gap-4">
            <label className="relative flex h-28 w-28 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[24px] bg-ink">
              {current.image ? <img src={current.image} alt="" className="h-full w-full object-cover" /> : <span className="text-center text-[11px] font-bold text-cream/40">{current.emoji}<br />+ photo</span>}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onImage(current.id, e.target.files?.[0])} />
            </label>
            <div className="grid min-w-[200px] flex-1 gap-2">
              <input value={current.name} onChange={(e) => updateChar(current.id, { name: e.target.value })} className="h-12 rounded-[16px] bg-ink px-3 text-base font-extrabold outline-none" placeholder="Nom du personnage" />
              <input value={current.fruit} onChange={(e) => updateChar(current.id, { fruit: e.target.value })} className="h-11 rounded-[16px] bg-ink px-3 text-sm outline-none" placeholder="Fruit / espèce" />
            </div>
          </div>
          <Field label="Look lock" value={current.look} onChange={(v) => updateChar(current.id, { look: v })} />
          <Field label="Caractère" value={current.personality} onChange={(v) => updateChar(current.id, { personality: v })} />
          <Field label="Manière de parler" value={current.speech} onChange={(v) => updateChar(current.id, { speech: v })} />
          <Field label="Comportement" value={current.behavior} onChange={(v) => updateChar(current.id, { behavior: v })} />
          <div className="mt-6 rounded-[24px] bg-ink/70 p-4">
            <p className="mb-3 text-[11px] font-extrabold uppercase tracking-wider text-mango">Prompt visuel</p>
            <div className="mb-3 flex flex-wrap gap-2">
              {VISUAL_STYLES.map((s) => (
                <button key={s.id} onClick={() => setStyleId(s.id)} className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${styleId === s.id ? "bg-lime text-ink" : "bg-white/8 text-cream/60"}`}>{s.label}</button>
              ))}
            </div>
            <button onClick={() => copyText(characterVisualPrompt(current, style))} className="flex h-12 w-full items-center justify-center gap-2 rounded-[16px] bg-cream text-sm font-extrabold text-ink">
              <Copy size={16} /> Prompt visuel · {current.name || "perso"} · {style.label}
            </button>
          </div>
          <button onClick={() => { const next = story.characters.filter((x) => x.id !== current.id); patchStory({ ...story, characters: next }); setOpenId(next[0]?.id || null); }} className="mt-4 text-xs font-bold text-berry">Retirer le perso</button>
        </article>
      )}
    </section>
  );
}

function Field({ label, value, onChange }) {
  return (
    <label className="mb-3 block">
      <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-cream/40">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={2} className="w-full resize-none rounded-[16px] bg-ink px-3 py-2 text-sm leading-5 outline-none" />
    </label>
  );
}
