import { Copy, Download } from "lucide-react";
import { CHANNELS } from "./data";
import { buildEpisodeJSON, buildEpisodePack, episodeDuration } from "./model";
import { CheckRow } from "./ui";

export function SeriesView({ stories, storyId, select, patchStory, removeStory }) {
  return (
    <section className="grid gap-4">
      {stories.length === 0 && (
        <div className="rounded-[28px] border border-dashed border-white/15 p-10 text-cream/50">Aucune série.</div>
      )}
      {stories.map((s) => (
        <article
          key={s.id}
          className={`rounded-[28px] border p-6 ${s.id === storyId ? "border-berry bg-berry/10" : "border-white/8 bg-pulp/80"}`}
        >
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <button onClick={() => select(s.id)} className="text-left">
              <h3 className="text-xl font-extrabold">{s.name}</h3>
              <p className="mt-1 text-xs text-cream/45">
                {s.episodes.length} épisodes · {s.characters.length} persos
              </p>
            </button>
            <button onClick={() => removeStory(s.id)} className="text-xs font-bold text-berry">
              Supprimer
            </button>
          </div>
          <input
            value={s.name}
            onChange={(e) => patchStory({ ...s, name: e.target.value })}
            className="mb-3 h-12 w-full rounded-[16px] bg-ink px-4 text-sm font-extrabold outline-none"
          />
          <textarea
            value={s.plot}
            onChange={(e) => patchStory({ ...s, plot: e.target.value })}
            rows={3}
            placeholder="Trame de la série"
            className="w-full resize-none rounded-[16px] bg-ink px-4 py-3 text-sm leading-6 outline-none"
          />
        </article>
      ))}
    </section>
  );
}

export function ExportView({ story, episode, setEpId, copyText, ping }) {
  if (!episode) {
    return <p className="rounded-[28px] border border-dashed border-white/15 p-10 text-cream/50">Ajoute un épisode.</p>;
  }
  const pack = buildEpisodePack(story, episode);
  const json = JSON.stringify(buildEpisodeJSON(story, episode), null, 2);

  function download(name, content, type) {
    const blob = new Blob([content], { type });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    ping("Fichier téléchargé");
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <aside className="h-fit rounded-[28px] border border-white/8 bg-pulp/80 p-4">
        {story.episodes.map((e) => (
          <button
            key={e.id}
            onClick={() => setEpId(e.id)}
            className={`mb-2 w-full rounded-[16px] px-3 py-3 text-left text-sm font-bold ${
              e.id === episode.id ? "bg-berry text-white" : "bg-ink/60"
            }`}
          >
            {e.title}
            <div className="text-[10px] opacity-70">{episodeDuration(e)}s</div>
          </button>
        ))}
      </aside>
      <div className="grid gap-5">
        <div className="rounded-[28px] border border-lime/20 bg-lime/10 p-5 text-sm leading-6 text-cream/80">
          Colle le pack dans Kling / Veo / Grok Imagine. Bible lock look + comportement. 1 image + 1 motion par plan.
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => copyText(pack)} className="flex h-12 items-center gap-2 rounded-[18px] bg-cream px-4 text-sm font-extrabold text-ink">
            <Copy size={16} /> Pack IA
          </button>
          <button
            onClick={() => download(`${slug(story.name)}-${slug(episode.title)}.txt`, pack, "text/plain")}
            className="flex h-12 items-center gap-2 rounded-[18px] border border-white/10 px-4 text-sm font-bold"
          >
            <Download size={16} /> .txt
          </button>
          <button
            onClick={() => download(`${slug(story.name)}-${slug(episode.title)}.json`, json, "application/json")}
            className="flex h-12 items-center gap-2 rounded-[18px] border border-white/10 px-4 text-sm font-bold"
          >
            .json
          </button>
        </div>
        <pre className="max-h-[480px] overflow-auto whitespace-pre-wrap rounded-[28px] border border-white/8 bg-pulp/80 p-5 text-[13px] leading-6 text-cream/75">
          {pack}
        </pre>
        <div className="grid gap-3 sm:grid-cols-2">
          {CHANNELS.map((ch) => (
            <a
              key={ch.id}
              href={ch.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-[24px] border border-white/8 bg-pulp/80 p-4 text-sm text-cream/60"
            >
              <span className="font-extrabold text-cream">{ch.name}</span>
              <p className="mt-1">{ch.method}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CheckView({ checks, toggleCheck, items }) {
  const done = items.filter((c) => checks[c.id]).length;
  const groups = [...new Set(items.map((c) => c.group))];
  return (
    <section>
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-lg font-extrabold">Checklist</h2>
        <span className="rounded-full bg-lime px-3 py-1 text-xs font-extrabold text-ink">
          {done}/{items.length}
        </span>
      </div>
      <div className="mb-6 h-3 overflow-hidden rounded-full bg-peel">
        <div className="h-full bg-gradient-to-r from-berry to-mango" style={{ width: `${(done / items.length) * 100}%` }} />
      </div>
      <div className="grid gap-6">
        {groups.map((g) => (
          <div key={g} className="rounded-[28px] border border-white/8 bg-pulp/80 p-6">
            <h3 className="mb-4 text-sm font-extrabold text-mango">{g}</h3>
            <div className="grid gap-3">
              {items
                .filter((c) => c.group === g)
                .map((c) => (
                  <CheckRow key={c.id} done={!!checks[c.id]} label={c.label} onClick={() => toggleCheck(c.id)} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function slug(s) {
  return (s || "episode")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|$)/g, "");
}
