import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FREE_COURSES, FREE_FLASHCARDS, type CourseCode } from "./free-content-data";
import { DOWNLOAD_URL } from "@/lib/site";

export function FreeFlashcards() {
  const [course, setCourse] = useState<CourseCode | null>(null);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const cards = course ? FREE_FLASHCARDS[course] : [];
  const card = cards[idx];
  const finished = course !== null && idx >= cards.length;
  const perCourse = FREE_FLASHCARDS[FREE_COURSES[0].code].length;

  const reset = () => { setCourse(null); setIdx(0); setFlipped(false); };
  const pick = (c: CourseCode) => { setCourse(c); setIdx(0); setFlipped(false); };
  const next = () => { setFlipped(false); setIdx((i) => i + 1); };
  const prev = () => { if (idx > 0) { setFlipped(false); setIdx((i) => i - 1); } };

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Flashcards</h2>
      <p className="mt-2 text-sm text-slate-300 sm:text-base">
        {perCourse} cards per course. Read the question, say your answer, then flip the card to check.
      </p>

      {!course && (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {FREE_COURSES.map((c) => (
            <li key={c.code}>
              <button onClick={() => pick(c.code)} className="sm-card block h-full w-full rounded-lg p-4 text-left hover:border-white/25">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">{c.code}</span>
                <span className="mt-1 block text-base font-semibold text-white">{c.name}</span>
                <span className="mt-2 block text-sm text-slate-300">{perCourse} cards</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {course && !finished && card && (
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>{course}: card {idx + 1} of {cards.length}</span>
            <button onClick={reset} className="underline underline-offset-4 hover:text-white">Exit</button>
          </div>
          <div
            className="mt-3 h-1.5 w-full overflow-hidden rounded bg-white/10"
            role="progressbar"
            aria-label="Cards completed"
            aria-valuemin={0}
            aria-valuemax={cards.length}
            aria-valuenow={idx}
          >
            <div className="h-full bg-emerald-400 transition-all" style={{ width: `${(idx / cards.length) * 100}%` }} />
          </div>

          <button
            onClick={() => setFlipped((f) => !f)}
            aria-pressed={flipped}
            className="sm-card mt-5 flex min-h-[16rem] w-full flex-col items-center justify-center rounded-lg p-6 text-center sm:min-h-[20rem]"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">{flipped ? "Answer" : "Question"}</span>
            <span className={`mt-4 ${flipped ? "text-base text-slate-100 sm:text-lg" : "text-xl font-semibold text-white sm:text-2xl"}`}>
              {flipped ? card.back : card.front}
            </span>
            <span className="mt-6 text-sm text-slate-400">{flipped ? "Select to see the question again" : "Select to reveal the answer"}</span>
          </button>

          <div className="mt-4 flex items-center justify-between gap-2">
            <button onClick={prev} disabled={idx === 0} className="sm-btn-ghost inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-100 disabled:opacity-40">
              <ArrowLeft size={16} aria-hidden /> Previous
            </button>
            <button onClick={next} className="sm-btn-primary inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold text-white">
              {idx + 1 === cards.length ? "Finish" : "Next card"} <ArrowRight size={16} aria-hidden />
            </button>
          </div>
        </div>
      )}

      {finished && (
        <div className="sm-card mt-6 rounded-lg p-4 sm:p-6">
          <h3 className="text-2xl font-bold text-white">You went through all {cards.length} cards</h3>
          <p className="mt-1 text-sm text-slate-300">{course}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => course && pick(course)} className="sm-btn-primary rounded-lg px-5 py-2.5 text-sm font-semibold text-white">Go through them again</button>
            <button onClick={reset} className="sm-btn-ghost rounded-lg px-5 py-2.5 text-sm font-semibold text-slate-100">Choose another course</button>
          </div>
          <div className="mt-6 border-t border-white/10 pt-5">
            <p className="text-sm text-slate-300">In the app you can generate 1 to 50 flashcards for any topic.</p>
            <a href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-semibold text-emerald-300 underline underline-offset-4 hover:text-emerald-200">
              Download ScholarMate
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
