import { useEffect, useState } from "react";
import { Calculator, Layers, ListChecks } from "lucide-react";
import { CgpaCalculator } from "./cgpa-calculator";
import { FreeQuiz } from "./free-quiz";
import { FreeFlashcards } from "./free-flashcards";
import { FREE_COURSES } from "./free-content-data";
import { TRY_TAB_KEY } from "@/lib/site";

type Tab = "cgpa" | "quiz" | "flashcards";

const TABS: { id: Tab; label: string; icon: typeof Calculator }[] = [
  { id: "cgpa", label: "CGPA", icon: Calculator },
  { id: "quiz", label: "Quiz", icon: ListChecks },
  { id: "flashcards", label: "Flashcards", icon: Layers },
];

function initialTab(): Tab {
  try {
    const saved = localStorage.getItem(TRY_TAB_KEY);
    if (saved === "cgpa" || saved === "quiz" || saved === "flashcards") return saved;
  } catch {}
  return "cgpa";
}

export function TryItFreeTabs() {
  const [tab, setTab] = useState<Tab>(initialTab);

  useEffect(() => {
    try { localStorage.setItem(TRY_TAB_KEY, tab); } catch {}
  }, [tab]);

  return (
    <section className="px-4 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Try ScholarMate free</h1>
          <p className="mt-3 text-base text-slate-300">
            Three tools, no account needed. The quiz and flashcards cover {FREE_COURSES.length} courses: {FREE_COURSES.map((c) => c.code).join(", ")}.
          </p>

          <div role="tablist" aria-label="Free tools" className="mt-8 flex gap-2 border-b border-white/10">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                id={`tool-tab-${t.id}`}
                aria-selected={tab === t.id}
                aria-controls="tool-panel"
                onClick={() => setTab(t.id)}
                className={`-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold ${
                  tab === t.id ? "border-emerald-400 text-white" : "border-transparent text-slate-300 hover:text-white"
                }`}
              >
                <t.icon size={16} aria-hidden />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div id="tool-panel" role="tabpanel" aria-labelledby={`tool-tab-${tab}`} className="mt-8">
          {tab === "cgpa" && <CgpaCalculator />}
          {tab === "quiz" && <FreeQuiz />}
          {tab === "flashcards" && <FreeFlashcards />}
        </div>
      </div>
    </section>
  );
}
