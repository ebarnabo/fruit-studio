import { AnimatePresence, motion } from "framer-motion";

const STEPS = [
  { n: "01", title: "Série", body: "Nom + trame. Une villa, une guerre, un couple qui explose." },
  { n: "02", title: "Bible", body: "Lock chaque perso : photo, look, voix, tic. Plus jamais de visage qui mute." },
  { n: "03", title: "Prompt IA", body: "Copie le prompt maître. L’IA sort la série entière en JSON. Les durées sont lockées." },
  { n: "04", title: "Import", body: "Colle le JSON. L’app snap les plans à 3 / 4 / 5 / 6 / 8 s." },
  { n: "05", title: "Export", body: "Pack plan par plan → Imagine puis Kling/Veo. CapCut. TikTok." },
];

export function Onboard({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/70 p-4 backdrop-blur-md sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="max-h-[86dvh] w-full max-w-lg overflow-auto rounded-[36px] border border-white/10 bg-pulp p-6 shadow-glow"
          >
            <p className="mb-2 text-[12px] font-extrabold tracking-[0.2em] text-mango">MODE D’EMPLOI</p>
            <h2 className="mb-6 text-3xl font-extrabold tracking-tight">
              5 gestes.<span className="text-berry"> C’est tout.</span>
            </h2>
            <ol className="grid gap-3">
              {STEPS.map((s, i) => (
                <motion.li
                  key={s.n}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * i }}
                  className="flex gap-4 rounded-[24px] bg-ink/70 p-4"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-berry text-sm font-extrabold">
                    {s.n}
                  </span>
                  <div>
                    <div className="text-sm font-extrabold">{s.title}</div>
                    <p className="mt-1 text-[13px] leading-5 text-cream/55">{s.body}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
            <button
              onClick={onClose}
              className="mt-6 h-14 w-full rounded-[22px] bg-cream text-sm font-extrabold text-ink transition hover:scale-[1.02] active:scale-95"
            >
              C’est clair
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
