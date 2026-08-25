import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FREE_COURSES, FREE_QUIZZES, type CourseCode } from "./free-content-data";

const DOWNLOAD_URL = "https://dub.sh/scholarmate-app";
const TAKEN_KEY = "scholarmate:freeQuizTaken";

function loadTaken(): Record<string, boolean> {
  try { return JSON.parse(localStorage.getItem(TAKEN_KEY) || "{}"); } catch { return {}; }
}
function markTaken(code: string) {
  const t = loadTaken();
  t[code] = true;
  try { localStorage.setItem(TAKEN_KEY, JSON.stringify(t)); } catch {}
}

export function FreeQuiz() {
  const [course, setCourse] = useState<CourseCode | null>(null);
  const [taken, setTaken] = useState<Record<string, boolean>>({});
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => { setTaken(loadTaken()); }, []);

  const questions = course ? FREE_QUIZZES[course] : [];
  const current = questions[idx];
  const score = answers.reduce((a, ans, i) => a + (ans === questions[i].answer ? 1 : 0), 0);

  const reset = () => {
    setCourse(null);
    setIdx(0);
    setSelected(null);
    setAnswers([]);
    setDone(false);
  };

  const pickCourse = (c: CourseCode) => {
    if (taken[c]) return;
    setCourse(c);
    setIdx(0);
    setSelected(null);
    setAnswers([]);
    setDone(false);
  };

  const submitAnswer = () => {
    if (selected === null) return;
    const next = [...answers, selected];
    setAnswers(next);
    setSelected(null);
    if (idx + 1 >= questions.length) {
      setDone(true);
      if (course) {
        markTaken(course);
        setTaken(loadTaken());
      }
    } else {
      setIdx(idx + 1);
    }
  };

  return (
    <div id="free-quiz" className="relative mt-6 sm:mt-10">
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
            📝 Free <span className="sm-gradient-text">Quiz</span>
          </h2>
          <p className="mt-4 text-base text-slate-300">Pick a course and try 5 free questions. AI-powered, instant feedback.</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!course && (
            <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {FREE_COURSES.map((c) => {
                const used = taken[c.code];
                return (
                  <button
                    key={c.code}
                    onClick={() => pickCourse(c.code)}
                    disabled={used}
                    className="sm-card group relative overflow-hidden rounded-2xl p-5 text-left transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${c.color} opacity-20 blur-2xl`} />
                    <div className={`inline-block rounded-lg bg-gradient-to-r ${c.color} px-3 py-1 text-xs font-bold text-white`}>{c.code}</div>
                    <h3 className="mt-3 text-base font-semibold text-white">{c.name}</h3>
                    <p className="mt-3 text-xs font-semibold text-violet-300">
                      {used ? "✓ Taken — download to retake" : "Start 5 questions →"}
                    </p>
                  </button>
                );
              })}
            </motion.div>
          )}

          {course && !done && current && (
            <motion.div key={`q-${course}-${idx}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="sm-card mt-8 rounded-3xl p-4 sm:mt-10 sm:p-8">
              <div className="mb-4 flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>{course} · Question {idx + 1} of {questions.length}</span>
                <button onClick={reset} className="text-slate-400 hover:text-white">Exit</button>
              </div>
              <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all" style={{ width: `${((idx) / questions.length) * 100}%` }} />
              </div>
              <h3 className="text-lg font-bold text-white sm:text-xl">{current.q}</h3>
              <div className="mt-5 space-y-2">
                {current.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setSelected(i)}
                    className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                      selected === i
                        ? "border-violet-400/60 bg-violet-500/10 text-white"
                        : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    <span className="mr-2 font-bold text-violet-300">{String.fromCharCode(65 + i)}.</span>{opt}
                  </button>
                ))}
              </div>
              <button
                onClick={submitAnswer}
                disabled={selected === null}
                className="sm-btn-primary mt-6 w-full rounded-xl px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
              >
                {idx + 1 === questions.length ? "Finish quiz" : "Next question →"}
              </button>
            </motion.div>
          )}

          {course && done && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="sm-card mt-8 rounded-3xl p-5 text-center sm:mt-10 sm:p-8">
              <div className="text-6xl">{score >= 4 ? "🏆" : score >= 2 ? "💪" : "📚"}</div>
              <h3 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
                You scored <span className="sm-gradient-text">{score}/{questions.length}</span>
              </h3>
              <p className="mt-2 text-slate-400">{course}</p>

              <div className="mt-6 space-y-3 text-left">
                {questions.map((q, i) => {
                  const correct = answers[i] === q.answer;
                  return (
                    <div key={i} className={`rounded-xl border p-4 ${correct ? "border-emerald-400/30 bg-emerald-500/5" : "border-rose-400/30 bg-rose-500/5"}`}>
                      <p className="text-sm font-semibold text-white">{i + 1}. {q.q}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        Your answer: <span className={correct ? "text-emerald-300" : "text-rose-300"}>{q.options[answers[i]]}</span>
                        {!correct && <> · Correct: <span className="text-emerald-300">{q.options[q.answer]}</span></>}
                      </p>
                      <p className="mt-1 text-xs italic text-slate-500">{q.explain}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 rounded-2xl border border-violet-400/30 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 p-6">
                <p className="text-base font-semibold text-white">
                  Want more questions with full difficulty levels, timers and score tracking?
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