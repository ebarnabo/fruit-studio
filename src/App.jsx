import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Film, History, ListChecks, Plus, Sparkles } from "lucide-react";
import { TEMPLATES, buildScript } from "./data";
import { load, persist, uid } from "./storage";
import { NavBtn } from "./ui";
import { CheckView, HistoryView, PublishView, StudioView } from "./views";

export default function App() {
  const [tab, setTab] = useState("studio");
  const [db, setDb] = useState(load);
  const [templateId, setTemplateId] = useState(TEMPLATES[0].id);
  const [notes, setNotes] = useState("");
  const [title, setTitle] = useState("");
  const [toast, setToast] = useState("");
  const [active, setActive] = useState(null);

  const template = TEMPLATES.find((t) => t.id === templateId);
  const script = useMemo(() => buildScript(template, notes), [template, notes]);

  useEffect(() => persist(db), [db]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  const ping = (msg) => setToast(msg);

  function saveItem(status = "draft") {
    const item = {
      id: uid(),
      createdAt: Date.now(),
      title: title.trim() || template.title,
      templateId: template.id,
      hook: template.hook,
      twist: template.twist,
      notes,
      script,
      duration: template.duration,
      status,
    };
    setDb((d) => ({ ...d, items: [item, ...d.items] }));
    setActive(item);
    ping("Scénario enregistré");
    setTab("history");
  }

  function removeItem(id) {
    setDb((d) => ({ ...d, items: d.items.filter((i) => i.id !== id) }));
    if (active?.id === id) setActive(null);
  }

  function setStatus(id, status) {
    setDb((d) => ({ ...d, items: d.items.map((i) => (i.id === id ? { ...i, status } : i)) }));
    if (active?.id === id) setActive({ ...active, status });
  }

  function toggleCheck(id) {
    setDb((d) => ({ ...d, checks: { ...d.checks, [id]: !d.checks[id] } }));
  }

  async function copyText(text) {
    await navigator.clipboard.writeText(text);
    ping("Copié");
  }

  async function shareItem(item) {
    const payload = { title: item.title, text: `${item.hook}\n\n${item.script}\n\n#fruitloveisland #aifruit` };
    if (navigator.share) {
      try {
        await navigator.share(payload);
        setStatus(item.id, "shared");
        ping("Partage ouvert");
        return;
      } catch {
        /* cancelled */
      }
    }
    await copyText(payload.text);
  }

  return (
    <div className="relative min-h-dvh overflow-x-hidden">
      <div className="orb left-[-80px] top-[-40px] h-[280px] w-[280px] bg-berry/30" />
      <div className="orb right-[-60px] top-[180px] h-[240px] w-[240px] bg-mango/20" />
      <div className="orb bottom-[80px] left-[20%] h-[200px] w-[200px] bg-lime/10" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 pb-32 pt-8 sm:px-8">
        <header className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-[13px] font-semibold tracking-[0.18em] text-mango">FRUIT STUDIO</p>
            <h1 className="text-4xl font-extrabold tracking-tight text-cream sm:text-5xl">
              Villa<span className="text-berry">.</span>
            </h1>
            <p className="mt-2 max-w-md text-[15px] leading-6 text-cream/60">
              Scénarios, historique, checklist, export social. Tout en local.
            </p>
          </div>
          <button
            onClick={() => {
              setTab("studio");
              setTitle("");
              setNotes("");
            }}
            className="flex h-14 items-center gap-2 rounded-[24px] bg-berry px-5 text-sm font-bold text-white shadow-glow transition hover:scale-[1.03] active:scale-95"
          >
            <Plus size={18} />
            Nouveau
          </button>
        </header>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            {tab === "studio" && (
              <StudioView
                title={title}
                setTitle={setTitle}
                template={template}
                templateId={templateId}
                setTemplateId={setTemplateId}
                notes={notes}
                setNotes={setNotes}
                script={script}
                itemsCount={db.items.length}
                copyText={copyText}
                saveItem={saveItem}
              />
            )}
            {tab === "history" && (
              <HistoryView
                items={db.items}
                active={active}
                setActive={setActive}
                removeItem={removeItem}
                setStatus={setStatus}
                copyText={copyText}
                shareItem={shareItem}
              />
            )}
            {tab === "check" && <CheckView checks={db.checks} toggleCheck={toggleCheck} />}
            {tab === "publish" && (
              <PublishView item={active || db.items[0]} copyText={copyText} shareItem={shareItem} ping={ping} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 px-4 pb-5 pt-2">
        <div className="mx-auto flex max-w-lg items-center justify-between rounded-[32px] border border-white/10 bg-ink/85 p-2 shadow-glow backdrop-blur-xl">
          <NavBtn icon={Sparkles} label="Studio" on={() => setTab("studio")} active={tab === "studio"} />
          <NavBtn icon={History} label="Historique" on={() => setTab("history")} active={tab === "history"} />
          <NavBtn icon={ListChecks} label="Checklist" on={() => setTab("check")} active={tab === "check"} />
          <NavBtn icon={Film} label="Publier" on={() => setTab("publish")} active={tab === "publish"} />
        </div>
      </nav>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-28 left-1/2 z-30 -translate-x-1/2 rounded-full bg-cream px-5 py-3 text-sm font-extrabold text-ink"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
