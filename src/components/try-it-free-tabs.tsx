import { useState } from "react";
import { motion } from "framer-motion";
import { CgpaCalculator } from "./cgpa-calculator";
import { FreeQuiz } from "./free-quiz";
import { FreeFlashcards } from "./free-flashcards";
import { FREE_COURSES } from "./free-content-data";

type Tab = "cgpa" | "quiz" | "flashcards";

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "cgpa", label: "CGPA", emoji: "🧮" },
  { id: "quiz", label: "Quiz", emoji: "📝" },
  { id: "flashcards", label: "Flashcards", emoji: "🃏" },
];

export function TryItFreeTabs() {
  const [tab, setTab] = useState<Tab>("cgpa");

  return (
    <section id="try-it-free" className="relative px-4 py-14 sm:px-8 sm:py-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">No login required</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Try It <span className="sm-gradient-text">Free</span>
          </h2>
          <p className="mt-5 text-base text-slate-300 sm:text-lg">
            Try before you download — no login, no stress. Just a taste of what's waiting for you in the app.
          </p>
        </motion.div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          <span className="w-full text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:w-auto sm:text-xs">7 courses covered:</span>
          {FREE_COURSES.map((c) => (
            <span
              key={c.code}
              className={`rounded-full bg-gradient-to-r ${c.color} px-2.5 py-1 text-[10px] font-bold text-white shadow-sm sm:px-3 sm:text-xs`}
              title={c.name}
            >
              {c.code}
            </span>
          ))}
        </div>

        <div className="mt-8 flex justify-center sm:mt-10">
          <div className="inline-flex w-full max-w-md rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-sm sm:w-auto sm:p-1.5">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold transition sm:flex-none sm:px-6 sm:text-sm ${
                  tab === t.id
                    ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <span className="mr-1 sm:mr-1.5">{t.emoji}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          {tab === "cgpa" && <CgpaCalculator />}
          {tab === "quiz" && <FreeQuiz />}
          {tab === "flashcards" && <FreeFlashcards />}
        </div>
      </div>
    </section>
  );
}