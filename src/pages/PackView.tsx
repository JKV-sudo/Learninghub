import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import Card from "../ui/Card";
import SwipeQuiz from "../ui/SwipeQuiz";
import type { Pack } from "../types";

export default function PackView() {
  const { id } = useParams<{ id: string }>();
  const [pack, setPack] = useState<Pack | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"swipe" | "traditional">("swipe");

  useEffect(() => {
    const run = async () => {
      if (!id) return;
      const snap = await getDoc(doc(db, "packs", id));
      const data = snap.data();
      if (data)
        setPack({
          title: data.title,
          description: data.description,
          items: data.items,
          tags: data.tags,
          public: data.public,
        });
      setLoading(false);
    };
    run();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Lade Lernpaket...</p>
        </div>
      </div>
    );
  }

  if (!pack) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <span className="text-6xl mb-4 block">😕</span>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Lernpaket nicht gefunden
          </h2>
          <p className="text-gray-600">
            Das angeforderte Lernpaket existiert nicht oder wurde entfernt.
          </p>
        </div>
      </div>
    );
  }

  const hasQuizItems = pack.items.some(
    (item) => item.type !== "text" && item.options && item.options.length > 0
  );

  return (
    <div className="space-y-6">
      {/* Pack Header */}
      <Card>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {pack.title}
          </h1>
          {pack.description && (
            <p className="text-gray-600 mb-4">{pack.description}</p>
          )}
          {pack.tags && pack.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {pack.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {hasQuizItems && (
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setViewMode("swipe")}
                className={`px-6 py-2 rounded-2xl font-medium transition-all duration-200 ${
                  viewMode === "swipe"
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                🎯 Swipe-Quiz
              </button>
              <button
                onClick={() => setViewMode("traditional")}
                className={`px-6 py-2 rounded-2xl font-medium transition-all duration-200 ${
                  viewMode === "traditional"
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                📝 Klassisch
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* Quiz Content */}
      {viewMode === "swipe" ? (
        <SwipeQuiz pack={pack} />
      ) : (
        <TraditionalQuiz pack={pack} />
      )}
    </div>
  );
}

// Traditional quiz component (original implementation)
function TraditionalQuiz({ pack }: { pack: Pack }) {
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [submitted, setSubmitted] = useState(false);

  function toggleAnswer(qid: string, optionId: string, multi: boolean) {
    setAnswers((prev) => {
      const current = prev[qid] ?? [];
      if (multi) {
        return {
          ...prev,
          [qid]: current.includes(optionId)
            ? current.filter((x) => x !== optionId)
            : [...current, optionId],
        };
      } else {
        return { ...prev, [qid]: [optionId] };
      }
    });
  }

  const score = React.useMemo(() => {
    if (!pack) return { correct: 0, total: 0 };
    let correct = 0;
    let total = 0;
    for (const it of pack.items) {
      if (it.type === "text") continue;
      total += 1;
      const userSel = answers[it.id] ?? [];
      const correctSet = new Set(
        (it.options ?? []).filter((o) => o.correct).map((o) => o.id)
      );
      const userSet = new Set(userSel);
      if (
        correctSet.size === userSet.size &&
        [...correctSet].every((id) => userSet.has(id))
      )
        correct += 1;
    }
    return { correct, total };
  }, [answers, pack]);

  return (
    <div className="space-y-4">
      {pack.items.map((it, idx) => {
        const multi = it.type === "multi";
        return (
          <Card key={it.id}>
            <div className="text-sm text-slate-500 mb-1">
              Aufgabe {idx + 1} · {it.type}
            </div>
            <div className="font-medium mb-3">{it.text}</div>
            {it.type !== "text" ? (
              <ul className="space-y-2">
                {(it.options ?? []).map((o) => {
                  const chosen = answers[it.id]?.includes(o.id) ?? false;
                  const isCorrect = submitted && o.correct;
                  const isWrongSelected = submitted && chosen && !o.correct;
                  return (
                    <li key={o.id}>
                      <label
                        className={`flex items-center gap-2 p-2 border rounded-md cursor-pointer ${
                          chosen && !submitted
                            ? "border-slate-900"
                            : isCorrect
                            ? "border-emerald-600 bg-emerald-50"
                            : isWrongSelected
                            ? "border-red-600 bg-red-50"
                            : "border-gray-200"
                        }`}
                      >
                        <input
                          type={multi ? "checkbox" : "radio"}
                          name={it.id}
                          checked={chosen}
                          onChange={() => toggleAnswer(it.id, o.id, multi)}
                        />
                        <span>{o.text}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <textarea
                className="w-full h-28 border rounded p-2"
                placeholder="Antwort…"
                onChange={(e) =>
                  setAnswers((a) => ({ ...a, [it.id]: [e.target.value] }))
                }
              />
            )}
            {submitted && it.explanation && (
              <div className="mt-3 text-sm text-slate-700">
                <strong>Erklärung:</strong> {it.explanation}
              </div>
            )}
          </Card>
        );
      })}

      <Card>
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSubmitted(true)}
            className="bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-800 transition-colors"
          >
            Auswerten
          </button>
          {submitted && (
            <div className="text-slate-700">
              Score: {score.correct} / {score.total}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
