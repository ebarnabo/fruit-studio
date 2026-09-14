import { useMemo, useState } from "react";
import { makeEpisode, makeScene, makeShot, episodeDuration } from "./model";

export function BoardView({ story, episode, setEpId, patchStory }) {
  const [q, setQ] = useState("");
  const [openScene, setOpenScene] = useState(episode?.scenes?.[0]?.id || null);
  const eps = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return story.episodes;
    return story.episodes.filter((e) => `${e.title} ${e.hook}`.toLowerCase().includes(n));
  }, [story.episodes, q]);

  function patchEp(next) {
    patchStory({ ...story, episodes: story.episodes.map((e) => (e.id === next.id ? next : e)) });
  }
  function patchScene(sid, patch) {
    patchEp({ ...episode, scenes: episode.scenes.map((s) => (s.id === sid ? { ...s, ...patch } : s)) });
  }
  function patchShot(sid, shotId, patch) {
    const sc = episode.scenes.find((s) => s.id === sid);
    patchScene(sid, { shots: sc.shots.map((sh) => (sh.id === shotId ? { ...sh, ...patch } : sh)) });
  }
  function toggleChar(list, id) {
    return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
  }

  if (!episode) {
    return (
      <div className="rounded-[28px] border border-dashed border-white/15 p-10">
        <p className="mb-4 text-cream/50">Aucun épisode.</p>
        <button onClick={() => { const ep = makeEpisode({ title: "Épisode 1" }); patchStory({ ...story, episodes: [ep] }); setEpId(ep.id); }} className="h-12 rounded-[18px] bg-cream px-5 text-sm font-extrabold text-ink">Créer l’épisode 1</button>
      </div>
    );
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <aside className="h-fit rounded-[28px] border border-white/8 bg-pulp/80 p-4">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-cream/40">Épisodes · {story.episodes.length}</p>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filtrer…" className="mb-3 h-10 w-full rounded-[12px] bg-ink px-3 text-sm outline-none" />
        <div className="grid max-h-[52vh] gap-2 overflow-auto pr-1">
          {eps.map((e, i) => (
            <button key={e.id} onClick={() => setEpId(e.id)} className={`rounded-[16px] px-3 py-3 text-left text-sm font-bold ${e.id === episode.id ? "bg-berry text-white" : "bg-ink/60 text-cream/70"}`}>
              {e.title || `Ép. ${i + 1}`}
              <div className="mt-1 text-[10px] font-semibold opacity-70">{episodeDuration(e)}s</div>
            </button>
          ))}
        </div>
        <button onClick={() => { const ep = makeEpisode({ title: `Épisode ${story.episodes.length + 1}` }); patchStory({ ...story, episodes: [...story.episodes, ep] }); setEpId(ep.id); }} className="mt-3 w-full rounded-[16px] border border-white/10 py-3 text-xs font-bold">+ Épisode</button>
      </aside>
      <div className="grid gap-4">
        <div className="rounded-[28px] border border-white/8 bg-pulp/80 p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <input value={episode.title} onChange={(e) => patchEp({ ...episode, title: e.target.value })} className="h-12 w-full rounded-[16px] bg-ink px-3 text-sm font-extrabold outline-none" />
            <input value={episode.hook} onChange={(e) => patchEp({ ...episode, hook: e.target.value })} placeholder="Hook" className="h-12 w-full rounded-[16px] bg-ink px-3 text-sm outline-none" />
          </div>
          <p className="mt-3 text-xs font-bold text-mango">Durée {episodeDuration(episode)}s · {episode.scenes.length} scènes</p>
        </div>
        {episode.scenes.map((sc, idx) => (
          <article key={sc.id} className="rounded-[24px] border border-white/8 bg-pulp/80 p-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setOpenScene(openScene === sc.id ? null : sc.id)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-ink text-xs font-extrabold text-mango">{idx + 1}</button>
              <input value={sc.title} onChange={(e) => patchScene(sc.id, { title: e.target.value })} className="h-11 flex-1 rounded-[16px] bg-ink px-3 text-sm font-extrabold outline-none" />
              <span className="text-[11px] font-bold text-cream/35">{sc.shots.length}p</span>
              <button onClick={() => patchEp({ ...episode, scenes: episode.scenes.filter((s) => s.id !== sc.id) })} className="text-xs font-bold text-berry">X</button>
            </div>
            {openScene === sc.id && (
              <div className="mt-4">
                <div className="mb-4 grid gap-3 sm:grid-cols-2">
                  <input value={sc.music} onChange={(e) => patchScene(sc.id, { music: e.target.value })} placeholder="Musique" className="h-11 rounded-[16px] bg-ink px-3 text-sm outline-none" />
                  <input value={(sc.overlays || []).join(" | ")} onChange={(e) => patchScene(sc.id, { overlays: e.target.value.split("|").map((x) => x.trim()).filter(Boolean) })} placeholder="Incrusts | " className="h-11 rounded-[16px] bg-ink px-3 text-sm outline-none" />
                </div>
                <Chips characters={story.characters} selected={sc.characterIds} onToggle={(id) => patchScene(sc.id, { characterIds: toggleChar(sc.characterIds, id) })} />
                <div className="mt-4 grid gap-3">
                  {sc.shots.map((sh, j) => (
                    <div key={sh.id} className="rounded-[20px] bg-ink/70 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-extrabold text-mango">Plan {idx + 1}.{j + 1}</span>
                        <div className="flex items-center gap-2">
                          <input type="number" min="1" max="20" value={sh.duration} onChange={(e) => patchShot(sc.id, sh.id, { duration: Number(e.target.value) })} className="h-9 w-16 rounded-[12px] bg-peel px-2 text-center text-sm font-bold outline-none" />
                          <span className="text-xs text-cream/40">s</span>
                          <button onClick={() => patchScene(sc.id, { shots: sc.shots.filter((x) => x.id !== sh.id) })} className="text-[11px] font-bold text-berry">X</button>
                        </div>
                      </div>
                      <input value={sh.plan} onChange={(e) => patchShot(sc.id, sh.id, { plan: e.target.value })} placeholder="Plan" className="mb-2 h-10 w-full rounded-[12px] bg-peel px-3 text-sm outline-none" />
                      <input value={sh.action} onChange={(e) => patchShot(sc.id, sh.id, { action: e.target.value })} placeholder="Action" className="mb-2 h-10 w-full rounded-[12px] bg-peel px-3 text-sm outline-none" />
                      <input value={sh.how} onChange={(e) => patchShot(sc.id, sh.id, { how: e.target.value })} placeholder="Manière" className="mb-2 h-10 w-full rounded-[12px] bg-peel px-3 text-sm outline-none" />
                      <input value={sh.overlay} onChange={(e) => patchShot(sc.id, sh.id, { overlay: e.target.value })} placeholder="Overlay" className="mb-3 h-10 w-full rounded-[12px] bg-peel px-3 text-sm outline-none" />
                      <Chips characters={story.characters} selected={sh.characterIds} onToggle={(id) => patchShot(sc.id, sh.id, { characterIds: toggleChar(sh.characterIds, id) })} />
                    </div>
                  ))}
                  <button onClick={() => patchScene(sc.id, { shots: [...sc.shots, makeShot({ characterIds: sc.characterIds })] })} className="h-11 rounded-[16px] border border-white/10 text-xs font-bold">+ Plan</button>
                </div>
              </div>
            )}
          </article>
        ))}
        <button onClick={() => { const sc = makeScene(); patchEp({ ...episode, scenes: [...episode.scenes, sc] }); setOpenScene(sc.id); }} className="h-14 rounded-[24px] bg-cream text-sm font-extrabold text-ink">+ Scène</button>
      </div>
    </section>
  );
}

function Chips({ characters, selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {characters.map((c) => (
        <button key={c.id} onClick={() => onToggle(c.id)} className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${selected.includes(c.id) ? "bg-lime text-ink" : "bg-white/8 text-cream/60"}`}>
          {c.emoji} {c.name}
        </button>
      ))}
    </div>
  );
}
