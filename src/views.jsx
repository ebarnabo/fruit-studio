import { Copy, Share2, Trash2, Upload } from "lucide-react";
import { CAST, CHANNELS, CHECKLIST, TEMPLATES } from "./data";
import { CheckRow, StatusBadge } from "./ui";

export function StudioView({ title, setTitle, template, templateId, setTemplateId, notes, setNotes, script, itemsCount, copyText, saveItem }) {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[32px] border border-white/8 bg-pulp/80 p-6 backdrop-blur">
        <h2 className="mb-4 text-lg font-extrabold">Scénario</h2>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-cream/40">Titre épisode</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={`Ep. ${itemsCount + 1} — ${template.title}`}
          className="mb-6 h-14 w-full rounded-[20px] border border-white/8 bg-ink px-4 text-sm outline-none ring-berry/40 focus:ring-2"
        />
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-cream/40">Template</p>
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplateId(t.id)}
              className={`rounded-[24px] border p-4 text-left transition ${
                templateId === t.id ? "border-berry bg-berry/15" : "border-white/8 bg-ink/40 hover:border-white/20"
              }`}
            >
              <div className="mb-2 text-sm font-extrabold">{t.title}</div>
              <div className="text-xs leading-5 text-cream/50">{t.hook}</div>
              <div className="mt-3 text-[11px] font-bold text-mango">{t.duration}s</div>
            </button>
          ))}
        </div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-cream/40">Twist / notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Ex: le bébé est un zucchini, recoupling à 22h…"
          className="mb-6 w-full resize-none rounded-[20px] border border-white/8 bg-ink px-4 py-3 text-sm leading-6 outline-none ring-berry/40 focus:ring-2"
        />
        <div className="flex flex-wrap gap-3">
          <button onClick={() => saveItem("draft")} className="h-12 rounded-[20px] bg-cream px-5 text-sm font-extrabold text-ink transition hover:scale-[1.03] active:scale-95">
            Sauver le scénario
          </button>
          <button onClick={() => saveItem("ready")} className="h-12 rounded-[20px] border border-white/10 px-5 text-sm font-bold text-cream">
            Marquer prêt à filmer
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <div className="rounded-[32px] border border-white/8 bg-pulp/80 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-extrabold">Script généré</h2>
            <button onClick={() => copyText(script)} className="flex h-10 items-center gap-2 rounded-full bg-white/8 px-3 text-xs font-bold">
              <Copy size={14} /> Copier
            </button>
          </div>
          <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap text-[13px] leading-6 text-cream/75">{script}</pre>
        </div>
        <div className="rounded-[32px] border border-white/8 bg-pulp/80 p-6">
          <h2 className="mb-4 text-lg font-extrabold">Cast locké</h2>
          <div className="grid grid-cols-2 gap-3">
            {CAST.map((c) => (
              <div key={c.id} className="rounded-[20px] bg-ink/70 p-3">
                <div className="text-lg">{c.emoji}</div>
                <div className="mt-1 text-sm font-extrabold">{c.name}</div>
                <div className="text-xs text-cream/45">{c.trait} · {c.voice}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function HistoryView({ items, active, setActive, removeItem, setStatus, copyText, shareItem }) {
  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
      <div>
        <h2 className="mb-4 text-lg font-extrabold">Historique · {items.length}</h2>
        {items.length === 0 && (
          <div className="rounded-[32px] border border-dashed border-white/15 p-10 text-cream/50">Aucun épisode. Crée un scénario dans Studio.</div>
        )}
        <div className="grid gap-4">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item)}
              className={`rounded-[28px] border p-5 text-left transition ${
                active?.id === item.id ? "border-berry bg-berry/10" : "border-white/8 bg-pulp/80 hover:border-white/20"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-base font-extrabold">{item.title}</div>
                  <div className="mt-1 text-xs text-cream/45">{new Date(item.createdAt).toLocaleString("fr-FR")} · {item.duration}s</div>
                </div>
                <StatusBadge status={item.status} />
              </div>
              <p className="mt-3 text-sm text-cream/70">{item.hook}</p>
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-[32px] border border-white/8 bg-pulp/80 p-6">
        {!active && <p className="text-cream/50">Sélectionne un épisode.</p>}
        {active && (
          <>
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-extrabold">{active.title}</h3>
                <p className="mt-1 text-sm text-mango">{active.hook}</p>
              </div>
              <button onClick={() => removeItem(active.id)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/8 text-cream/70">
                <Trash2 size={16} />
              </button>
            </div>
            <pre className="mb-5 max-h-[280px] overflow-auto whitespace-pre-wrap text-[13px] leading-6 text-cream/70">{active.script}</pre>
            <div className="mb-5 flex flex-wrap gap-2">
              {["draft", "ready", "filmed", "shared"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(active.id, s)}
                  className={`rounded-full px-3 py-2 text-xs font-bold ${active.status === s ? "bg-lime text-ink" : "bg-white/8 text-cream/70"}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => copyText(active.script)} className="flex h-12 items-center gap-2 rounded-[20px] bg-cream px-4 text-sm font-extrabold text-ink">
                <Copy size={16} /> Script
              </button>
              <button onClick={() => shareItem(active)} className="flex h-12 items-center gap-2 rounded-[20px] bg-berry px-4 text-sm font-extrabold text-white">
                <Share2 size={16} /> Partager
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export function CheckView({ checks, toggleCheck }) {
  const doneCount = CHECKLIST.filter((c) => checks[c.id]).length;
  const groups = [...new Set(CHECKLIST.map((c) => c.group))];
  return (
    <section>
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-lg font-extrabold">Checklist production</h2>
        <span className="rounded-full bg-lime px-3 py-1 text-xs font-extrabold text-ink">{doneCount}/{CHECKLIST.length}</span>
      </div>
      <div className="mb-6 h-3 overflow-hidden rounded-full bg-peel">
        <div className="h-full bg-gradient-to-r from-berry to-mango transition-all" style={{ width: `${(doneCount / CHECKLIST.length) * 100}%` }} />
      </div>
      <div className="grid gap-6">
        {groups.map((g) => (
          <div key={g} className="rounded-[32px] border border-white/8 bg-pulp/80 p-6">
            <h3 className="mb-4 text-sm font-extrabold tracking-wide text-mango">{g}</h3>
            <div className="grid gap-3">
              {CHECKLIST.filter((c) => c.group === g).map((c) => (
                <CheckRow key={c.id} done={!!checks[c.id]} label={c.label} onClick={() => toggleCheck(c.id)} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function PublishView({ item, copyText, shareItem, ping }) {
  const hook = item?.hook || "ELLE EST ENCEINTE… ET CE N’EST PAS UNE CERISE";
  const caption = `${hook}\nÉpisode suivant dans les commentaires.\n#fruitloveisland #aifruit #brainrot`;
  return (
    <section className="grid gap-6">
      <div className="rounded-[32px] border border-lime/20 bg-lime/10 p-6">
        <p className="text-sm font-bold text-lime">Voie gratuite (recommandée)</p>
        <p className="mt-2 text-sm leading-6 text-cream/75">
          Pas d’API TikTok à auditer. Exporte le MP4, ouvre CapCut ou l’app native, colle la caption. Web Share API si dispo.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {CHANNELS.map((ch) => (
          <a key={ch.id} href={ch.url} target="_blank" rel="noreferrer" className="rounded-[28px] border border-white/8 bg-pulp/80 p-5 transition hover:-translate-y-0.5 hover:border-berry/40">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-extrabold">{ch.name}</h3>
              {ch.free && <span className="rounded-full bg-lime/20 px-2 py-1 text-[10px] font-extrabold text-lime">GRATUIT</span>}
            </div>
            <p className="text-sm leading-6 text-cream/55">{ch.method}</p>
          </a>
        ))}
      </div>
      <div className="rounded-[32px] border border-white/8 bg-pulp/80 p-6">
        <h3 className="mb-3 font-extrabold">Caption type</h3>
        <p className="mb-4 whitespace-pre-wrap text-sm leading-6 text-cream/70">{caption}</p>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => copyText(caption)} className="flex h-12 items-center gap-2 rounded-[20px] bg-cream px-4 text-sm font-extrabold text-ink">
            <Copy size={16} /> Caption
          </button>
          <button
            onClick={() => (item ? shareItem(item) : ping("Crée un scénario d’abord"))}
            className="flex h-12 items-center gap-2 rounded-[20px] bg-berry px-4 text-sm font-extrabold text-white"
          >
            <Upload size={16} /> Share sheet
          </button>
        </div>
      </div>
    </section>
  );
}
