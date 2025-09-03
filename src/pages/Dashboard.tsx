import React, { useEffect, useState } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import LoadingSpinner from "../ui/LoadingSpinner";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import { useAuth } from "../state/AuthContext";
import { Link } from "react-router-dom";

type Pack = {
  id: string;
  title: string;
  description?: string;
  public: boolean;
  createdAt?: any;
  tags?: string[];
};

export default function Dashboard() {
  const { user } = useAuth();
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const run = async () => {
      try {
        const ref = collection(db, "packs");
        const q = query(
          ref,
          where("ownerUid", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        setPacks(
          snap.docs.map((d) => ({
            id: d.id,
            title: d.get("title"),
            description: d.get("description"),
            public: !!d.get("public"),
            createdAt: d.get("createdAt"),
            tags: d.get("tags") || [],
          }))
        );
      } catch (error) {
        console.error("Fehler beim Laden der Pakete:", error);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [user]);

  async function togglePublic(id: string, value: boolean) {
    setToggling(id);
    try {
      await updateDoc(doc(db, "packs", id), { public: value });
      setPacks((s) =>
        s.map((r) => (r.id === id ? { ...r, public: value } : r))
      );
    } catch (error) {
      console.error("Fehler beim Aktualisieren:", error);
    } finally {
      setToggling(null);
    }
  }

  async function remove(id: string) {
    const pack = packs.find((p) => p.id === id);
    if (
      !pack ||
      !confirm(
        `"${pack.title}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`
      )
    )
      return;

    setDeleting(id);
    try {
      await deleteDoc(doc(db, "packs", id));
      setPacks((s) => s.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
      alert("Fehler beim Löschen des Pakets. Bitte versuche es erneut.");
    } finally {
      setDeleting(null);
    }
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp?.toDate) return "Unbekannt";
    return new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(timestamp.toDate());
  };

  const publicPacks = packs.filter((p) => p.public);
  const privatePacks = packs.filter((p) => !p.public);

  if (loading) {
    return (
      <div className="py-12">
        <LoadingSpinner message="Lade deine Lernpakete..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Verwalte deine Lernpakete und teile sie mit der Community
          </p>
        </div>
        <Link to="/import">
          <Button size="lg">📥 Neues Paket importieren</Button>
        </Link>
      </div>

      {/* AI Prompt Helper */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="text-4xl">🤖</div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              🎯 KI-Lernpaket Generator
            </h2>
            <p className="text-gray-700 mb-4">
              Kopiere diesen Text und füge ihn in ChatGPT, Claude oder eine
              andere KI ein, um kompatible Lernpakete zu erstellen:
            </p>

            <div className="bg-white rounded-lg border border-blue-200 p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  📋 Kopiere diesen Prompt:
                </span>
                <button
                  onClick={() => {
                    const prompt = `Erstelle ein JSON-Lernpaket für smallbyte mit folgendem Schema:

{
  "title": "Dein Titel",
  "description": "Detaillierte Beschreibung des Lernpakets",
  "tags": ["tag1", "tag2", "tag3"],
  "public": true,
  "items": [
    {
      "id": "q1",
      "text": "Deine Frage",
      "type": "single",
      "options": [
        {"id": "a", "text": "Antwort A", "correct": false},
        {"id": "b", "text": "Antwort B", "correct": true},
        {"id": "c", "text": "Antwort C", "correct": false}
      ],
      "explanation": "Erklärung der Antwort"
    }
  ]
}

WICHTIGE REGELN:
- "type" kann sein: "single" (genau eine richtige), "multi" (mehrere richtige), "text" (keine Optionen)
- Jede Option MUSS "id", "text" und "correct" (true/false) haben - NIEMALS weglassen!
- Single-Fragen: Genau eine Option mit "correct": true
- Multi-Fragen: Mindestens eine Option mit "correct": true
- Text-Fragen: Keine "options" verwenden
- Mindestens 3 Fragen pro Paket
- Deutsche Sprache verwenden
- Gründliche Erklärungen hinzufügen

Thema: [HIER DEIN THEMA EINFÜGEN]`;
                    navigator.clipboard.writeText(prompt);
                    // Show feedback
                    const btn = document.activeElement as HTMLButtonElement;
                    const original = btn.textContent;
                    btn.textContent = "✅ Kopiert!";
                    btn.className = btn.className.replace(
                      "bg-blue-500",
                      "bg-green-500"
                    );
                    setTimeout(() => {
                      btn.textContent = original;
                      btn.className = btn.className.replace(
                        "bg-green-500",
                        "bg-blue-500"
                      );
                    }, 2000);
                  }}
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md transition-colors flex items-center gap-1"
                >
                  📋 Kopieren
                </button>
              </div>

              <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-800 font-mono whitespace-pre-wrap overflow-x-auto max-h-32 overflow-y-auto">
                {`Erstelle ein JSON-Lernpaket für smallbyte mit folgendem Schema:

{
  "title": "Dein Titel",
  "description": "Detaillierte Beschreibung des Lernpakets",
  "tags": ["tag1", "tag2", "tag3"],
  "public": true,
  "items": [
    {
      "id": "q1",
      "text": "Deine Frage",
      "type": "single",
      "options": [
        {"id": "a", "text": "Antwort A", "correct": false},
        {"id": "b", "text": "Antwort B", "correct": true}
      ],
      "explanation": "Erklärung der Antwort"
    }
  ]
}

WICHTIGE REGELN:
- "type": "single" (genau eine richtige), "multi" (mehrere richtige), "text" (keine Optionen)
- Jede Option MUSS "correct" (true/false) haben - NIEMALS weglassen!
- Single: Genau eine "correct": true
- Multi: Mindestens eine "correct": true
- Text: Keine "options"
- Mindestens 3 Fragen pro Paket
- Deutsche Sprache verwenden

Thema: [HIER DEIN THEMA EINFÜGEN]`}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                💡 Einfach zu verwenden
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                🎯 100% kompatibel
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                🚀 Sofort einsatzbereit
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Gesamt</p>
              <p className="text-2xl font-bold text-gray-900">{packs.length}</p>
            </div>
            <div className="text-3xl">📚</div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Öffentlich</p>
              <p className="text-2xl font-bold text-success-600">
                {publicPacks.length}
              </p>
            </div>
            <div className="text-3xl">🌍</div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Privat</p>
              <p className="text-2xl font-bold text-gray-600">
                {privatePacks.length}
              </p>
            </div>
            <div className="text-3xl">🔒</div>
          </div>
        </Card>
      </div>

      {/* Content */}
      {packs.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Noch keine Lernpakete
          </h3>
          <p className="text-gray-600 mb-6">
            Importiere dein erstes JSON-Lernpaket und starte deine Lernreise!
          </p>
          <Link to="/import">
            <Button>📥 Erstes Paket importieren</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Deine Lernpakete ({packs.length})
              </h2>
            </div>

            <div className="space-y-4">
              {packs.map((pack) => (
                <div
                  key={pack.id}
                  className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                >
                  <div className="flex-1 min-w-0 mb-4 lg:mb-0">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">📖</div>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/packs/${pack.id}`}
                          className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors block truncate"
                        >
                          {pack.title}
                        </Link>
                        {pack.description && (
                          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                            {pack.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>Erstellt: {formatDate(pack.createdAt)}</span>
                          {pack.tags && pack.tags.length > 0 && (
                            <div className="flex gap-1">
                              {pack.tags.slice(0, 2).map((tag, index) => (
                                <Badge key={index} variant="gray" size="sm">
                                  {tag}
                                </Badge>
                              ))}
                              {pack.tags.length > 2 && (
                                <Badge variant="gray" size="sm">
                                  +{pack.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={pack.public ? "success" : "gray"}
                        size="sm"
                      >
                        {pack.public ? "🌍 Öffentlich" : "🔒 Privat"}
                      </Badge>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={pack.public}
                          disabled={toggling === pack.id}
                          onChange={(e) =>
                            togglePublic(pack.id, e.target.checked)
                          }
                          className="sr-only"
                        />
                        <div
                          className={`relative w-10 h-6 rounded-full transition-colors ${
                            pack.public ? "bg-success-500" : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                              pack.public ? "transform translate-x-4" : ""
                            }`}
                          />
                        </div>
                        <span className="sr-only">
                          {pack.public ? "Öffentlich machen" : "Privat machen"}
                        </span>
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link to={`/packs/${pack.id}`}>
                        <Button variant="secondary" size="sm">
                          Öffnen
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => remove(pack.id)}
                        isLoading={deleting === pack.id}
                        disabled={deleting === pack.id}
                      >
                        Löschen
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
