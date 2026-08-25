import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const DOWNLOAD_URL = "https://dub.sh/scholarmate-app";

type Scale = "4.0" | "5.0" | "7.0";

const GRADES: Record<Scale, { label: string; point: number }[]> = {
  "4.0": [
    { label: "A", point: 4.0 },
    { label: "B+", point: 3.5 },
    { label: "B", point: 3.0 },
    { label: "C+", point: 2.5 },
    { label: "C", point: 2.0 },
    { label: "D", point: 1.0 },
    { label: "F", point: 0.0 },
  ],
  "5.0": [
    { label: "A (70-100)", point: 5 },
    { label: "B (60-69)", point: 4 },
    { label: "C (50-59)", point: 3 },
    { label: "D (45-49)", point: 2 },
    { label: "E (40-44)", point: 1 },
    { label: "F (0-39)", point: 0 },
  ],
  "7.0": [
    { label: "A (70-100)", point: 7 },
    { label: "B (60-69)", point: 6 },
    { label: "C (50-59)", point: 5 },
    { label: "D (45-49)", point: 4 },
    { label: "E (40-44)", point: 3 },
    { label: "F (0-39)", point: 0 },
  ],
};

type Row = { id: number; name: string; units: number; grade: number };

let nextId = 1;
const newRow = (): Row => ({ id: nextId++, name: "", units: 3, grade: GRADES["5.0"][0].point });

export function CgpaCalculator() {
  const [scale, setScale] = useState<Scale>("5.0");
  const [rows, setRows] = useState<Row[]>(() => [newRow(), newRow(), newRow()]);

  const grades = GRADES[scale];

  const { cgpa, totalUnits, totalPoints } = useMemo(() => {
    const tu = rows.reduce((a, r) => a + (Number(r.units) || 0), 0);
    const tp = rows.reduce((a, r) => a + (Number(r.units) || 0) * (Number(r.grade) || 0), 0);
    return { cgpa: tu > 0 ? tp / tu : 0, totalUnits: tu, totalPoints: tp };
  }, [rows]);

  const updateRow = (id: number, patch: Partial<Row>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const removeRow = (id: number) => setRows((rs) => rs.filter((r) => r.id !== id));
  const addRow = () => setRows((rs) => [...rs, { ...newRow(), grade: grades[0].point }]);

  return (
    <div id="cgpa" className="relative mt-6 sm:mt-10">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">Free tool</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl">
            🧮 <span className="sm-gradient-text">CGPA</span> Calculator
          </h2>
          <p className="mt-4 text-base text-slate-300">Supports 4.0, 5.0 and 7.0 grading systems. No login required.</p>
        </motion.div>

        <div className="sm-card mt-8 rounded-3xl p-4 sm:mt-10 sm:p-8">
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-slate-300">Grading scale:</span>
            {(Object.keys(GRADES) as Scale[]).map((s) => (
              <button
                key={s}
                onClick={() => {
                  setScale(s);
                  setRows((rs) => rs.map((r) => ({ ...r, grade: GRADES[s][0].point })));
                }}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  scale === s
                    ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white"
                    : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {rows.map((r, i) => (
              <div key={r.id} className="grid grid-cols-[1fr_auto] gap-2 rounded-xl border border-white/10 bg-white/5 p-3 sm:grid-cols-[1fr_100px_140px_40px]">
                <input
                  type="text"
                  value={r.name}
                  onChange={(e) => updateRow(r.id, { name: e.target.value })}
                  placeholder={`Course ${i + 1}`}
                  className="col-span-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-violet-400/60 sm:col-span-1"
                />
                <input
                  type="number"
                  min={0}
                  max={12}
                  value={r.units}
                  onChange={(e) => updateRow(r.id, { units: Number(e.target.value) })}
                  placeholder="Units"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-violet-400/60"
                />
                <select
                  value={r.grade}
                  onChange={(e) => updateRow(r.id, { grade: Number(e.target.value) })}
                  className="col-span-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-violet-400/60"
                >
                  {grades.map((g) => (
                    <option key={g.label} value={g.point} className="bg-[#0F172A]">
                      {g.label} ({g.point})
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => removeRow(r.id)}
                  className="rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-sm text-slate-400 hover:bg-rose-500/20 hover:text-rose-300"
                  aria-label="Remove course"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addRow}
            className="mt-4 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
          >
            + Add course
          </button>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Stat label="Total units" value={String(totalUnits)} />
            <Stat label="Quality points" value={totalPoints.toFixed(2)} />
            <Stat label="CGPA" value={cgpa.toFixed(2)} highlight />
          </div>

          <a
            href={DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="sm-btn-primary mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-center text-xs font-bold text-white sm:w-auto sm:px-6 sm:text-sm"
          >
            📱 Save your results in the app → Download ScholarMate
          </a>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={`rounded-2xl border p-4 text-center ${
        highlight
          ? "border-violet-400/40 bg-gradient-to-br from-indigo-500/20 to-violet-500/20"
          : "border-white/10 bg-white/5"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p className={`mt-1 text-3xl font-extrabold ${highlight ? "sm-gradient-text" : "text-white"}`}>{value}</p>
    </div>
  );
}