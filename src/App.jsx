import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookUser, Clapperboard, Download, ListChecks, Plus, Rows3 } from "lucide-react";
import { CHECKLIST } from "./data";
import { load, persist } from "./storage";
import { makeEpisode, makeStory } from "./model";
import { NavBtn } from "./ui";
import { BibleView } from "./bible.jsx";
import { BoardView } from "./board.jsx";
import { CheckView, ExportView, SeriesView } from "./views.jsx";

export default function App() {
  const [tab, setTab] = useState("series");
  const [db, setDb] = useState(load);
  const [toast, setToast] = useState("");
  const [epId, setEpId] = useState(null);

  const story = useMemo(
    () => db.stories.find((s) => s.id === db.storyId) || db.stories[0] || null,
    [db]
  );
  const episode = useMemo(
    () => story?.episodes.find((e) => e.id === epId) || story?.episodes[0] || null,
    [story, epId]
  );

  useEffect(() => persist(db), [db]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 1600);
    return () => clearTimeout(t);
  }, [toast]);

  const ping = (m) => setToast(m);

  function patchStory(next) {
    setDb((d) => ({
      ...d,
      stories: d.stories.map((s) => (s.id === next.id ? next : s)),
    }));
  }

  function addStory() {
    const s = makeStory({ name: `Série ${db.stories.length + 1}` });
    setDb((d) => ({ ...d, stories: [s, ...d.stories], storyId: s.id }));
    setEpId(null);
    setTab("series");
    ping("Série créée");
  }

  function addEpisode() {
    if (!story) return;
    const ep = makeEpisode({ title: `Épisode ${story.episodes.length + 1}` });
    patchStory({ ...story, episodes: [...story.episodes, ep] });
    setEpId(ep.id);
    setTab("board");
    ping("Épisode ajouté");
  }

  function toggleCheck(id) {
    setDb((d) => ({ ...d, checks: { ...d.checks, [id]: !d.checks[id] } }));
  }

  async function copyText(text) {
    await navigator.clipboard.writeText(text);
    ping("Copié");
  }

  return (
    <div className="relative min-h-dvh overflow-x-hidden">
      <div className="orb left-[-80px] top-[-40px] h-[280px] w-[280px] bg-berry/30" />
      <div className="orb right-[-60px] top-[160px] h-[240px] w-[240px] bg-mango/20" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-32 pt-8 sm:px-8">
        <header className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-[13px] font-semibold tracking-[0.18em] text-mango">FRUIT STUDIO</p>
            <h1 className="text-4xl font-extrabold tracking-tight text-cream sm:text-5xl">
              Villa<span className="text-berry">.</span>
            </h1>
            <p className="mt-2 max-w-lg text-[15px] leading-6 text-cream/60">
              {story
                ? `${story.name} · ${story.episodes.length} ép. · ${story.characters.length} persos`
                : "Crée une série, lock le cast, découpe les plans, exporte le pack IA."}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={addEpisode}
              disabled={!story}
              className="flex h-12 items-center gap-2 rounded-[20px] border border-white/10 px-4 text-sm font-bold disabled:opacity-40"
            >
              + Épisode
            </button>
            <button
              onClick={addStory}
              className="flex h-12 items-center gap-2 rounded-[20px] bg-berry px-4 text-sm font-extrabold text-white shadow-glow transition hover:scale-[1.03] active:scale-95"
            >
              <Plus size={16} /> Série
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            {tab === "series" && (
              <SeriesView
                stories={db.stories}
                storyId={db.storyId}
                select={(id) => {
                  setDb((d) => ({ ...d, storyId: id }));
                  setEpId(null);
                }}
                patchStory={patchStory}
                removeStory={(id) =>
                  setDb((d) => {
                    const stories = d.stories.filter((s) => s.id !== id);
                    return { ...d, stories, storyId: stories[0]?.id || null };
                  })
                }
              />
            )}
            {tab === "bible" && story && <BibleView story={story} patchStory={patchStory} ping={ping} />}
            {tab === "board" && story && (
              <BoardView story={story} episode={episode} setEpId={setEpId} patchStory={patchStory} ping={ping} />
            )}
            {tab === "export" && story && (
              <ExportView story={story} episode={episode} setEpId={setEpId} copyText={copyText} ping={ping} />
            )}
            {tab === "check" && <CheckView checks={db.checks} toggleCheck={toggleCheck} items={CHECKLIST} />}
            {(tab === "bible" || tab === "board" || tab === "export") && !story && (
              <p className="rounded-[28px] border border-dashed border-white/15 p-10 text-cream/50">Crée une série d’abord.</p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 px-4 pb-5 pt-2">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-1 rounded-[32px] border border-white/10 bg-ink/85 p-2 shadow-glow backdrop-blur-xl">
          <NavBtn icon={Rows3} label="Séries" on={() => setTab("series")} active={tab === "series"} />
          <NavBtn icon={BookUser} label="Bible" on={() => setTab("bible")} active={tab === "bible"} />
          <NavBtn icon={Clapperboard} label="Plans" on={() => setTab("board")} active={tab === "board"} />
          <NavBtn icon={Download} label="Export" on={() => setTab("export")} active={tab === "export"} />
          <NavBtn icon={ListChecks} label="Check" on={() => setTab("check")} active={tab === "check"} />
        </div>
      </nav>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-28 left-1/2 z-30 -translate-x-1/2 rounded-full bg-cream px-5 py-3 text-sm font-extrabold text-ink"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
