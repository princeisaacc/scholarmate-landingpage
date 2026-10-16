import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { FREE_COURSES, FREE_QUIZZES, type CourseCode } from "./free-content-data";
import { DOWNLOAD_URL } from "@/lib/site";

const SCORES_KEY = "scholarmate:freeQuizScores";

type Scores = Record<string, { score: number; total: number }>;

function loadScores(): Scores {
  try { return JSON.parse(localStorage.getItem(SCORES_KEY) || "{}"); } catch { return {}; }
}
function saveScore(code: string, score: number, total: number) {
  const all = loadScores();
  all[code] = { score, total };
  try { localStorage.setItem(SCORES_KEY, JSON.stringify(all)); } catch {}
}

export function FreeQuiz() {
  const [course, setCourse] = useState<CourseCode | null>(null);
  const [scores, setScores] = useState<Scores>({});
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => { setScores(loadScores()); }, []);

  const questions = course ? FREE_QUIZZES[course] : [];
  const current = questions[idx];
  const score = answers.reduce((a, ans, i) => a + (ans === questions[i].answer ? 1 : 0), 0);
  const perCourse = FREE_QUIZZES[FREE_COURSES[0].code].length;

  const reset = () => {
    setCourse(null); setIdx(0); setSelected(null); setChecked(false); setAnswers([]); setDone(false);
  };
  const start = (c: CourseCode) => {
    setCourse(c); setIdx(0); setSelected(null); setChecked(false); setAnswers([]); setDone(false);
  };

  const check = () => { if (selected !== null) setChecked(true); };
  const next = () => {
    if (selected === null) return;
    const all = [...answers, selected];
    setAnswers(all);
    setSelected(null);
    setChecked(false);
    if (idx + 1 >= questions.length) {
      setDone(true);
      if (course) {
        const finalScore = all.reduce((a, ans, i) => a + (ans === questions[i].answer ? 1 : 0), 0);
        saveScore(course, finalScore, questions.length);
        setScores(loadScores());
      }
    } else {
      setIdx(idx + 1);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Practice quiz</h2>
      <p className="mt-2 text-sm text-slate-300 sm:text-base">
        Pick a course and answer {perCourse} questions. You see the correct answer and an explanation after each one. You can retake any course.
      </p>

      {!course && (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {FREE_COURSES.map((c) => {
            const s = scores[c.code];
            return (
              <li key={c.code}>
                <button onClick={() => start(c.code)} className="sm-card block h-full w-full rounded-lg p-4 text-left hover:border-white/25">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">{c.code}</span>
                  <span className="mt-1 block text-base font-semibold text-white">{c.name}</span>
                  <span className="mt-2 block text-sm text-slate-300">
                    {s ? `Last score ${s.score} of ${s.total}. Take it again` : `Start ${perCourse} questions`}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {course && !done && current && (
        <div className="sm-card mt-6 rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>{course}: question {idx + 1} of {questions.length}</span>
            <button onClick={reset} className="underline underline-offset-4 hover:text-white">Exit quiz</button>
          </div>
          <div
            className="mt-3 h-1.5 w-full overflow-hidden rounded bg-white/10"
            role="progressbar"
            aria-label="Quiz progress"
            aria-valuemin={0}
            aria-valuemax={questions.length}
            aria-valuenow={idx + (checked ? 1 : 0)}
          >
            <div className="h-full bg-emerald-400 transition-all" style={{ width: `${((idx + (checked ? 1 : 0)) / questions.length) * 100}%` }} />
          </div>

          <h3 className="mt-5 text-lg font-semibold text-white sm:text-xl">{current.q}</h3>
          <div className="mt-4 space-y-2" role="group" aria-label="Answer options">
            {current.options.map((opt, i) => {
              const isCorrect = i === current.answer;
              const isPicked = selected === i;
              let style = "border-white/15 text-slate-200 hover:bg-white/5";
              if (!checked && isPicked) style = "border-emerald-400 bg-emerald-500/10 text-white";
              if (checked && isCorrect) style = "border-emerald-400/70 bg-emerald-500/10 text-white";
              if (checked && isPicked && !isCorrect) style = "border-rose-400/70 bg-rose-500/10 text-white";
              return (
                <button
                  key={i}
                  onClick={() => !checked && setSelected(i)}
                  aria-pressed={isPicked}
                  disabled={checked}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left text-sm ${style}`}
                >
                  <span><span className="mr-2 font-bold text-emerald-300">{String.fromCharCode(65 + i)}.</span>{opt}</span>
                  {checked && isCorrect && <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-emerald-300"><Check size={14} aria-hidden /> Correct</span>}
                  {checked && isPicked && !isCorrect && <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-rose-300"><X size={14} aria-hidden /> Your answer</span>}
                </button>
              );
            })}
          </div>

          <div aria-live="polite">
            {checked && <p className="mt-4 rounded-lg border border-white/10 p-3 text-sm text-slate-200">{current.explain}</p>}
          </div>

          {!checked ? (
            <button onClick={check} disabled={selected === null} className="sm-btn-primary mt-5 w-full rounded-lg px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">
              Check answer
            </button>
          ) : (
            <button onClick={next} className="sm-btn-primary mt-5 w-full rounded-lg px-4 py-3 text-sm font-semibold text-white">
              {idx + 1 === questions.length ? "See my score" : "Next question"}
            </button>
          )}
        </div>
      )}

      {course && done && (
        <div className="sm-card mt-6 rounded-lg p-4 sm:p-6">
          <h3 className="text-2xl font-bold text-white">You scored {score} out of {questions.length}</h3>
          <p className="mt-1 text-sm text-slate-300">{course}. Your score is saved on this device only.</p>

          <ul className="mt-5 space-y-3">
            {questions.map((q, i) => {
              const correct = answers[i] === q.answer;
              return (
                <li key={i} className="rounded-lg border border-white/10 p-4">
                  <p className="text-sm font-semibold text-white">{i + 1}. {q.q}</p>
                  <p className="mt-1 text-sm text-slate-300">
                    <span className={correct ? "font-semibold text-emerald-300" : "font-semibold text-rose-300"}>{correct ? "Correct" : "Incorrect"}.</span>{" "}
                    You chose {q.options[answers[i]]}.{!correct && <> The answer is {q.options[q.answer]}.</>}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">{q.explain}</p>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => course && start(course)} className="sm-btn-primary rounded-lg px-5 py-2.5 text-sm font-semibold text-white">Retake {course}</button>
            <button onClick={reset} className="sm-btn-ghost rounded-lg px-5 py-2.5 text-sm font-semibold text-slate-100">Choose another course</button>
          </div>

          <div className="mt-6 border-t border-white/10 pt-5">
            <p className="text-sm text-slate-300">The app also has practice quizzes and a Final Boss quiz.</p>
            <a href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-semibold text-emerald-300 underline underline-offset-4 hover:text-emerald-200">
              Download ScholarMate
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
