import React, { useState } from "react";
import Card from "../ui/Card";
import { packSchema } from "../utils/schema";
import type { PackSchema } from "../utils/schema";
import { useAuth } from "../state/AuthContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../utils/firebase";

function JsonPreview({ data }: { data: PackSchema }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{data.title}</h3>
        {data.description && (
          <p className="text-slate-700">{data.description}</p>
        )}
      </div>
      <div className="space-y-3">
        {data.items.map((it, idx) => (
          <div key={it.id} className="p-3 border rounded-lg">
            <div className="text-sm text-slate-500">
              #{idx + 1} · {it.type}
            </div>
            <div className="font-medium">{it.text}</div>
            {it.options && (
              <ul className="list-disc pl-5 text-slate-700">
                {it.options.map((o) => (
                  <li key={o.id}>
                    {o.text}{" "}
                    {o.correct ? (
                      <span className="text-green-600">(korrekt)</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ImportPack() {
  const [raw, setRaw] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsed, setParsed] = useState<PackSchema | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name);
    const text = await f.text();
    setRaw(text);
    setParsed(null);
    setError(null);
  }

  function tryParse() {
    try {
      const obj = JSON.parse(raw);
      const res = packSchema.parse(obj);
      setParsed(res);
      setError(null);
    } catch (e: any) {
      setParsed(null);

      // Provide more helpful error messages
      let errorMessage = String(e.message ?? e);

      if (errorMessage.includes("correct")) {
        errorMessage =
          'Fehler: Alle Optionen müssen ein "correct" Feld (true/false) haben.';
      } else if (errorMessage.includes("Invalid question type")) {
        errorMessage =
          "Fehler: Text-Fragen dürfen keine Optionen haben. Single/Multi-Fragen müssen Optionen haben.";
      } else if (errorMessage.includes("single")) {
        errorMessage =
          "Fehler: Single-Choice Fragen müssen genau eine richtige Antwort haben.";
      } else if (errorMessage.includes("multi")) {
        errorMessage =
          "Fehler: Multi-Choice Fragen müssen mindestens eine richtige Antwort haben.";
      } else if (errorMessage.includes("JSON")) {
        errorMessage =
          "Fehler: Ungültiges JSON Format. Bitte überprüfe die Syntax.";
      }

      setError(errorMessage);
    }
  }

  async function saveToFirestore() {
    if (!user || !parsed) return;
    setSaving(true);
    try {
      // Use the checkbox value to override any public setting in the JSON
      const dataToSave = {
        ...parsed,
        public: isPublic, // Use UI checkbox value instead of JSON value
        ownerUid: user.uid,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "packs"), dataToSave);
      setSaving(false);
      setParsed(null);
      setRaw("");
      setIsPublic(false);

      // More user-friendly success message
      const publicStatus = isPublic ? "öffentlich" : "privat";
      alert(
        `✅ "${parsed.title}" wurde erfolgreich ${publicStatus} gespeichert! Du findest es in deinem Dashboard.`
      );
    } catch (e: any) {
      setSaving(false);
      alert("Fehler beim Speichern: " + String(e.message ?? e));
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card>
        <h2 className="text-xl font-semibold mb-3">JSON importieren</h2>
        <div className="space-y-3">
          <input type="file" accept="application/json" onChange={handleFile} />
          {fileName && (
            <div className="text-sm text-slate-600">Datei: {fileName}</div>
          )}
          <textarea
            className="w-full h-52 p-3 border rounded-lg font-mono text-sm"
            placeholder="JSON einfügen…"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <button
              onClick={tryParse}
              className="bg-slate-900 text-white px-4 py-2 rounded"
            >
              Vorschau
            </button>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              Öffentlich speichern
            </label>
          </div>
          {error && <div className="text-red-600 text-sm">Fehler: {error}</div>}
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold mb-3">Vorschau</h2>
        {!parsed ? (
          <p className="text-slate-600">Noch nichts geparst.</p>
        ) : (
          <JsonPreview data={parsed} />
        )}
        <div className="mt-4">
          <button
            disabled={!parsed || saving}
            onClick={saveToFirestore}
            className="bg-emerald-600 disabled:opacity-60 text-white px-4 py-2 rounded"
          >
            {saving ? "Speichern…" : "In Firestore speichern"}
          </button>
        </div>
      </Card>
    </div>
  );
}
