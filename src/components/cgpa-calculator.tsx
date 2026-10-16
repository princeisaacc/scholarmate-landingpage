import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { DOWNLOAD_URL } from "@/lib/site";

type Scale = "4.0" | "5.0" | "7.0";

// Grades are stored by letter so that switching scale keeps what the student typed in.
const GRADES: Record<Scale, { letter: string; label: string; point: number }[]> = {
  "4.0": [
    { letter: "A", label: "A", point: 4.0 },
    { letter: "B+", label: "B+", point: 3.5 },
    { letter: "B", label: "B", point: 3.0 },
    { letter: "C+", label: "C+", point: 2.5 },
    { letter: "C", label: "C", point: 2.0 },
    { letter: "D", label: "D", point: 1.0 },
    { letter: "F", label: "F", point: 0.0 },
  ],
  "5.0": [
    { letter: "A", label: "A (70-100)", point: 5 },
    { letter: "B", label: "B (60-69)", point: 4 },
    { letter: "C", label: "C (50-59)", point: 3 },
    { letter: "D", label: "D (45-49)", point: 2 },
    { letter: "E", label: "E (40-44)", point: 1 },
    { letter: "F", label: "F (0-39)", point: 0 },
  ],
  "7.0": [
    { letter: "A", label: "A (70-100)", point: 7 },
    { letter: "B", label: "B (60-69)", point: 6 },
    { letter: "C", label: "C (50-59)", point: 5 },
    { letter: "D", label: "D (45-49)", point: 4 },
    { letter: "E", label: "E (40-44)", point: 3 },
    { letter: "F", label: "F (0-39)", point: 0 },
  ],
};

type Row = { id: number; name: string; units: number; grade: string | null };

const STORAGE_KEY = "scholarmate:cgpa";
const DEFAULT_SCALE: Scale = "5.0";
const DEFAULT_UNITS = 3;

let nextId = 1;
const newRow = (): Row => ({ id: nextId++, name: "", units: DEFAULT_UNITS, grade: null });

function load(): { scale: Scale; rows: Row[] } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { scale: Scale; rows: Row[] };
      if (parsed.scale in GRADES && Array.isArray(parsed.rows) && parsed.rows.length) {
        nextId = Math.max(...parsed.rows.map((r) => r.id), 0) + 1;
        return parsed;
      }
    }
  } catch {}
  return { scale: DEFAULT_SCALE, rows: [newRow(), newRow(), newRow()] };
}

export function CgpaCalculator() {
  const [{ scale, rows }, setState] = useState(load);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ scale, rows })); } catch {}
  }, [scale, rows]);

  const grades = GRADES[scale];

  const { cgpa, totalUnits, totalPoints, counted } = useMemo(() => {
    let tu = 0, tp = 0, n = 0;
    for (const r of rows) {
      const g = grades.find((x) => x.letter === r.grade);
      const u = Number(r.units) || 0;
      if (!g || u <= 0) continue;
      tu += u; tp += u * g.point; n += 1;
    }
    return { cgpa: tu > 0 ? tp / tu : null, totalUnits: tu, totalPoints: tp, counted: n };
  }, [rows, grades]);

  const update = (id: number, patch: Partial<Row>) =>
    setState((s) => ({ ...s, rows: s.rows.map((r) => (r.id === id ? { ...r, ...patch } : r)) }));
  const remove = (id: number) =>
    setState((s) => ({ ...s, rows: s.rows.length > 1 ? s.rows.filter((r) => r.id !== id) : s.rows }));
  const add = () => setState((s) => ({ ...s, rows: [...s.rows, newRow()] }));
  const clear = () => setState((s) => ({ ...s, rows: [newRow(), newRow(), newRow()] }));

  const changeScale = (next: Scale) =>
    setState((s) => ({
      scale: next,
      rows: s.rows.map((r) => ({ ...r, grade: GRADES[next].some((g) => g.letter === r.grade) ? r.grade : null })),
    }));

  const needRegrade = rows.filter((r) => r.grade === null && r.name.trim()).length;

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">CGPA calculator</h2>
      <p className="mt-2 text-sm text-slate-300 sm:text-base">
        Choose your school's grading scale, then add each course with its units and grade.
      </p>

      <div className="sm-card mt-6 rounded-lg p-4 sm:p-6">
        <fieldset className="flex flex-wrap items-center gap-2">
          <legend className="sr-only">Grading scale</legend>
          <span className="mr-1 text-sm font-semibold text-slate-300" aria-hidden>Grading scale</span>
          {(Object.keys(GRADES) as Scale[]).map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={scale === s}
              onClick={() => changeScale(s)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${scale === s ? "sm-btn-primary text-white" : "sm-btn-ghost text-slate-200"}`}
            >
              {s}
            </button>
          ))}
        </fieldset>

        <ul className="mt-5 space-y-3">
          {rows.map((r, i) => (
            <li key={r.id} className="grid grid-cols-[1fr_88px] gap-2 rounded-lg border border-white/10 p-3 sm:grid-cols-[1fr_88px_170px_40px]">
              <input
                type="text"
                value={r.name}
                onChange={(e) => update(r.id, { name: e.target.value })}
                placeholder={`Course ${i + 1} (optional)`}
                aria-label={`Course ${i + 1} name`}
                className="col-span-2 rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm text-white placeholder:text-slate-400 sm:col-span-1"
              />
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={12}
                value={r.units}
                onChange={(e) => update(r.id, { units: Number(e.target.value) })}
                aria-label={`Course ${i + 1} units`}
                className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm text-white"
              />
              <select
                value={r.grade ?? ""}
                onChange={(e) => update(r.id, { grade: e.target.value || null })}
                aria-label={`Course ${i + 1} grade`}
                className="rounded-lg border border-white/15 bg-[#0F172A] px-3 py-2 text-sm text-white"
              >
                <option value="">Select grade</option>
                {grades.map((g) => (
                  <option key={g.letter} value={g.letter}>{g.label} ({g.point})</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => remove(r.id)}
                disabled={rows.length === 1}
                aria-label={`Remove course ${i + 1}`}
                className="sm-btn-ghost grid place-items-center rounded-lg px-2 py-2 text-slate-300 disabled:opacity-40"
              >
                <X size={16} aria-hidden />
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={add} className="sm-btn-ghost inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-slate-100">
            <Plus size={16} aria-hidden /> Add course
          </button>
          <button type="button" onClick={clear} className="sm-btn-ghost inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-slate-300">
            <Trash2 size={16} aria-hidden /> Clear all
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3" aria-live="polite">
          <Stat label="Total units" value={String(totalUnits)} />
          <Stat label="Quality points" value={totalPoints.toFixed(2)} />
          <Stat label="CGPA" value={cgpa === null ? "Not yet" : cgpa.toFixed(2)} highlight />
        </div>
        <p className="mt-3 text-sm text-slate-300">
          {counted === 0
            ? "Pick a grade for at least one course to see your CGPA."
            : `Counting ${counted} of ${rows.length} ${rows.length === 1 ? "course" : "courses"}. Courses without a grade are left out.`}
          {needRegrade > 0 && ` ${needRegrade} named ${needRegrade === 1 ? "course needs" : "courses need"} a grade on the ${scale} scale.`}
        </p>

        <div className="mt-6 border-t border-white/10 pt-5">
          <p className="text-sm text-slate-300">
            Your courses stay on this device only. The app keeps a saved CGPA history and lets you share results.
          </p>
          <a href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer" className="sm-btn-primary mt-3 inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-semibold text-white">
            Download ScholarMate
          </a>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-lg border p-4 ${highlight ? "border-emerald-400/50 bg-emerald-500/10" : "border-white/10"}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">{label}</p>
      <p className="mt-1 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}
