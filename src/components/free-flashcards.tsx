import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FREE_COURSES, FREE_FLASHCARDS, type CourseCode } from "./free-content-data";

const DOWNLOAD_URL = "https://dub.sh/scholarmate-app";

export function FreeFlashcards() {
  const [course, setCourse] = useState<CourseCode | null>(null);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const cards = course ? FREE_FLASHCARDS[course] : [];
  const card = cards[idx];
  const finished = course && idx >= cards.length;

  const reset = () => { setCourse(null); setIdx(0); setFlipped(false); };
  const pick = (c: CourseCode) => { setCourse(c); setIdx(0); setFlipped(false); };
  const next = () => { setFlipped(false); setIdx((i) => i + 1); };
  const prev = () => { if (idx > 0) { setFlipped(false); setIdx((i) => i - 1); } };

  return (
    <div id="free-flashcards" className="relative mt-6 sm:mt-10">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">No login required</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl">
            🃏 Free <span className="sm-gradient-text">Flashcards</span>
          </h2>
          <p className="mt-4 text-base text-slate-300">5 cards per course. Tap to flip.</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!course && (
            <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {FREE_COURSES.map((c) => (
                <button
                  key={c.code}
                  onClick={() => pick(c.code)}
                  className="sm-card group relative overflow-hidden rounded-2xl p-5 text-left transition hover:-translate-y-1"
                >
                  <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${c.color} opacity-20 blur-2xl`} />
                  <div className={`inline-block rounded-lg bg-gradient-to-r ${c.color} px-3 py-1 text-xs font-bold text-white`}>{c.code}</div>
                  <h3 className="mt-3 text-base font-semibold text-white">{c.name}</h3>
                  <p className="mt-3 text-xs font-semibold text-violet-300">5 free cards →</p>
                </button>
              ))}
            </motion.div>
          )}

          {course && !finished && card && (
            <motion.div key={`f-${course}-${idx}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-10">
              <div className="mb-4 flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>{course} · Card {idx + 1} of {cards.length}</span>
                <button onClick={reset} className="text-slate-400 hover:text-white">Exit</button>
              </div>

              <div
                onClick={() => setFlipped((f) => !f)}
                className="relative mx-auto h-64 max-w-xl cursor-pointer select-none sm:h-80"
                style={{ perspective: "1200px" }}
              >
                <motion.div
                  className="relative h-full w-full"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{ rotateY: flipped ? 180 : 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div
                    className="sm-card absolute inset-0 flex flex-col items-center justify-center rounded-3xl p-8 text-center"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">Question</p>
                    <p className="mt-4 text-xl font-bold text-white sm:text-2xl">{card.front}</p>
                    <p className="mt-6 text-xs text-slate-500">Tap to reveal answer</p>
                  </div>
                  <div
                    className="sm-card absolute inset-0 flex flex-col items-center justify-center rounded-3xl p-8 text-center"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "linear-gradient(135deg, rgba(79,70,229,0.15), rgba(124,58,237,0.15))" }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">Answer</p>
                    <p className="mt-4 text-base text-slate-100 sm:text-lg">{card.back}</p>
                  </div>
                </motion.div>
              </div>

              <div className="mx-auto mt-5 flex max-w-xl items-center justify-between gap-2">
                <button onClick={prev} disabled={idx === 0} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-40 sm:px-5 sm:text-sm">← Prev</button>
                <span className="hidden text-xs text-slate-500 sm:inline">{flipped ? "Showing answer" : "Showing question"}</span>
                <button onClick={next} className="sm-btn-primary rounded-full px-3 py-2 text-xs font-bold text-white sm:px-5 sm:text-sm">
                  {idx + 1 === cards.length ? "Finish →" : "Next →"}
                </button>
              </div>
            </motion.div>
          )}

          {finished && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="sm-card mt-8 rounded-3xl p-5 text-center sm:mt-10 sm:p-8">
              <div className="text-6xl">🃏</div>
              <h3 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
                You finished all <span className="sm-gradient-text">{cards.length} cards</span>
              </h3>
              <div className="mt-6 rounded-2xl border border-violet-400/30 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 p-6">
                <p className="text-base font-semibold text-white">
                  Want up to 50 flashcards per topic with full caching and offline access?
                </p>
                <p className="mt-1 text-sm text-slate-300">Download ScholarMate 📱</p>
                <a
                  href={DOWNLOAD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sm-btn-primary mt-4 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white"
                >
                  ⬇ Download ScholarMate
                </a>
              </div>
              <button onClick={reset} className="mt-4 text-sm text-slate-400 hover:text-white">← Try another course</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}