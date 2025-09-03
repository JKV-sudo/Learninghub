import React from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { Link } from "react-router-dom";

// Demo component to showcase the AI prompt helper
export default function DashboardDemo() {
  // Mock data for demo
  const mockPacks = [
    {
      id: "1",
      title: "React Fundamentals",
      description: "Learn the basics of React.js",
      public: true,
      createdAt: new Date(),
      tags: ["React", "JavaScript", "Frontend"],
    },
    {
      id: "2",
      title: "Python Basics",
      description: "Introduction to Python programming",
      public: false,
      createdAt: new Date(),
      tags: ["Python", "Programming"],
    },
  ];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const publicPacks = mockPacks.filter((p) => p.public);
  const privatePacks = mockPacks.filter((p) => !p.public);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Demo</h1>
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
              <p className="text-2xl font-bold text-gray-900">
                {mockPacks.length}
              </p>
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
      <div className="space-y-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Deine Lernpakete ({mockPacks.length})
            </h2>
          </div>

          <div className="space-y-4">
            {mockPacks.map((pack) => (
              <div
                key={pack.id}
                className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
              >
                <div className="flex-1 min-w-0 mb-4 lg:mb-0">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">📖</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors block truncate">
                        {pack.title}
                      </div>
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
                    <Badge variant={pack.public ? "success" : "gray"} size="sm">
                      {pack.public ? "🌍 Öffentlich" : "🔒 Privat"}
                    </Badge>
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
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm">
                      Öffnen
                    </Button>
                    <Button variant="danger" size="sm">
                      Löschen
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
