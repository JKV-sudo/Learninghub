import React, { useState } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import SwipeQuiz from "../ui/SwipeQuiz";
import { packSchema } from "../utils/schema";
import type { PackSchema } from "../utils/schema";

// Embedded demo data for immediate showcase
const REACT_DEMO: PackSchema = {
  title: "React Fundamentals - Grundlagen für Einsteiger",
  description:
    "Umfassendes Lernpaket zu React.js Grundlagen, Components, Props, State Management und Hooks. Ideal für Frontend-Entwickler die React lernen wollen.",
  tags: [
    "React",
    "JavaScript",
    "Frontend",
    "Webentwicklung",
    "Components",
    "Hooks",
  ],
  public: true,
  items: [
    {
      id: "react-001",
      text: "Was ist React.js?",
      type: "single",
      options: [
        {
          id: "a",
          text: "Eine JavaScript-Bibliothek zum Erstellen von Benutzeroberflächen",
          correct: true,
          explanation:
            "React ist eine deklarative, effiziente und flexible JavaScript-Bibliothek zum Erstellen von Benutzeroberflächen, entwickelt von Facebook.",
        },
        {
          id: "b",
          text: "Ein CSS-Framework für responsive Designs",
        },
        {
          id: "c",
          text: "Eine Backend-Technologie für APIs",
        },
        {
          id: "d",
          text: "Ein Datenbank-Management-System",
        },
      ],
      explanation:
        "React revolutionierte die Frontend-Entwicklung durch das Component-Based Architecture und Virtual DOM.",
    },
    {
      id: "react-002",
      text: "Welche der folgenden sind React Hooks?",
      type: "multi",
      options: [
        {
          id: "a",
          text: "useState",
          correct: true,
          explanation:
            "useState ist der grundlegende Hook für State-Management in funktionalen Komponenten.",
        },
        {
          id: "b",
          text: "useEffect",
          correct: true,
          explanation:
            "useEffect ermöglicht Side-Effects in funktionalen Komponenten.",
        },
        {
          id: "c",
          text: "componentDidMount",
          explanation:
            "componentDidMount ist eine Lifecycle-Methode von Class Components, kein Hook.",
        },
        {
          id: "d",
          text: "useContext",
          correct: true,
          explanation:
            "useContext ermöglicht den Zugriff auf React Context in funktionalen Komponenten.",
        },
      ],
      explanation:
        "React Hooks wurden in Version 16.8 eingeführt und ermöglichen State und andere React-Features in funktionalen Komponenten.",
    },
    {
      id: "react-005",
      text: "Erklären Sie den Unterschied zwischen Props und State in React.",
      type: "text",
      explanation:
        "Props sind Eingabeparameter einer Komponente (unveränderlich, von außen übergeben). State ist der interne Zustand einer Komponente (veränderlich, wird intern verwaltet). Props fließen von Parent zu Child, State wird lokal in der Komponente verwaltet.",
    },
  ],
};

const PYTHON_DEMO: PackSchema = {
  title: "Python Basics - Programmieren lernen",
  description:
    "Grundlegendes Lernpaket für Python-Einsteiger. Behandelt Datentypen, Kontrollstrukturen, Funktionen und Object-Oriented Programming.",
  tags: ["Python", "Programming", "Basics", "OOP", "Data Types"],
  public: true,
  items: [
    {
      id: "python-001",
      text: "Welche der folgenden sind Python-Datentypen?",
      type: "multi",
      options: [
        {
          id: "a",
          text: "int (Integer)",
          correct: true,
          explanation:
            "int ist ein eingebauter numerischer Datentyp für ganze Zahlen.",
        },
        {
          id: "b",
          text: "string (String)",
          explanation:
            "In Python heißt der String-Datentyp 'str', nicht 'string'.",
        },
        {
          id: "c",
          text: "list (Liste)",
          correct: true,
          explanation:
            "list ist ein eingebauter Container-Datentyp für veränderbare Sequenzen.",
        },
        {
          id: "d",
          text: "dict (Dictionary)",
          correct: true,
          explanation:
            "dict ist ein eingebauter Mapping-Datentyp für Key-Value-Paare.",
        },
      ],
    },
    {
      id: "python-002",
      text: "Wie definiert man eine Funktion in Python?",
      type: "single",
      options: [
        {
          id: "a",
          text: "def function_name():",
          correct: true,
          explanation:
            "Das 'def' Keyword definiert eine Funktion, gefolgt vom Namen und Parametern.",
        },
        {
          id: "b",
          text: "function function_name() {}",
        },
        {
          id: "c",
          text: "create function_name()",
        },
      ],
    },
  ],
};

function JsonPreview({ data }: { data: PackSchema }) {
  return (
    <Card glass="medium" glow className="animate-slide-up">
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">{data.title}</h3>
          {data.description && (
            <p className="text-white/70 text-lg">{data.description}</p>
          )}
          {data.tags && data.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {data.tags.map((tag, index) => (
                <Badge key={index} variant="primary" size="sm" glow>
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">
            {data.items.length} Fragen/Aufgaben:
          </h4>
          {data.items.map((item, idx) => (
            <Card key={item.id} glass="light" className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="glass" size="sm">
                    #{idx + 1}
                  </Badge>
                  <Badge
                    variant={
                      item.type === "single"
                        ? "primary"
                        : item.type === "multi"
                        ? "success"
                        : "warning"
                    }
                    size="sm"
                  >
                    {item.type === "single"
                      ? "Single Choice"
                      : item.type === "multi"
                      ? "Multiple Choice"
                      : "Text Input"}
                  </Badge>
                </div>
                <div className="font-medium text-white">{item.text}</div>
                {item.options && (
                  <ul className="space-y-1 ml-4">
                    {item.options.map((option) => (
                      <li
                        key={option.id}
                        className={`text-sm ${
                          option.correct ? "text-green-300" : "text-white/70"
                        }`}
                      >
                        <span className="inline-flex items-center gap-2">
                          {option.correct ? "✅" : "🔘"} {option.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                {item.explanation && (
                  <div className="mt-3 p-3 bg-blue-500/20 rounded-lg border border-blue-400/30">
                    <p className="text-blue-200 text-sm">
                      <strong>Erklärung:</strong> {item.explanation}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default function DemoSimple() {
  const [selectedDemo, setSelectedDemo] = useState<PackSchema | null>(null);
  const [currentTab, setCurrentTab] = useState<"demo" | "features" | "quiz">(
    "demo"
  );

  const demoPacks = [
    { id: "react", title: "React Fundamentals", data: REACT_DEMO, icon: "⚛️" },
    { id: "python", title: "Python Basics", data: PYTHON_DEMO, icon: "🐍" },
  ];

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            🎮 Live Demo
          </span>
        </h1>
        <p className="text-xl text-white/70 max-w-3xl mx-auto">
          Erlebe die glassmorphe smallbyte Platform mit echten Lernpaketen
        </p>
      </div>

      {/* Tab Navigation */}
      <Card glass="strong" glow className="p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentTab("demo")}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
              currentTab === "demo"
                ? "bg-blue-500/30 text-white shadow-glow"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            🎯 Lernpakete Demo
          </button>
          <button
            onClick={() => setCurrentTab("features")}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
              currentTab === "features"
                ? "bg-purple-500/30 text-white shadow-glow"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            🚀 Features
          </button>
          {selectedDemo && (
            <button
              onClick={() => setCurrentTab("quiz")}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                currentTab === "quiz"
                  ? "bg-green-500/30 text-white shadow-glow"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              🎮 Swipe Quiz
            </button>
          )}
        </div>
      </Card>

      {currentTab === "demo" ? (
        <>
          {/* Demo Pack Selection */}
          <Card glass="strong" glow className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Wähle ein Demo-Lernpaket
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {demoPacks.map((pack) => (
                <Card
                  key={pack.id}
                  glass="medium"
                  className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                    selectedDemo?.title === pack.data.title
                      ? "ring-2 ring-blue-400"
                      : ""
                  }`}
                  onClick={() => setSelectedDemo(pack.data)}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl">{pack.icon}</div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {pack.title}
                      </h3>
                      <p className="text-white/70 text-sm">
                        {pack.data.items.length} Fragen
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="glass"
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDemo(pack.data);
                    }}
                  >
                    {selectedDemo?.title === pack.data.title
                      ? "✅ Geladen"
                      : "Laden"}
                  </Button>
                </Card>
              ))}
            </div>
          </Card>

          {/* Loaded Pack Preview */}
          {selectedDemo && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">
                  📋 Paket-Vorschau
                </h2>
                <p className="text-white/60">
                  Hier siehst du die Struktur und Inhalte des Lernpakets
                </p>
              </div>
              <JsonPreview data={selectedDemo} />

              {/* Action Buttons */}
              <div className="flex justify-center gap-4">
                <Button
                  variant="glass"
                  glow
                  onClick={() => setCurrentTab("quiz")}
                >
                  🎯 Interaktives Quiz starten
                </Button>
                <Button variant="glass">📊 Zu Dashboard hinzufügen</Button>
                <Button variant="glass" onClick={() => setSelectedDemo(null)}>
                  🔄 Anderes Paket wählen
                </Button>
              </div>
            </div>
          )}
        </>
      ) : currentTab === "features" ? (
        /* Features Tab */
        <Card glass="strong" glow className="p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            ✨ Glassmorphic Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🎨",
                title: "Glassmorphismus Design",
                description:
                  "Modernste UI mit Backdrop-Blur, Transparenzen und Glow-Effekten",
              },
              {
                icon: "⚡",
                title: "Animationen",
                description:
                  "Flüssige Übergänge, Hover-Effekte und interaktive Transformationen",
              },
              {
                icon: "📱",
                title: "Responsive",
                description: "Perfekte Anpassung an Desktop, Tablet und Mobile",
              },
              {
                icon: "🔍",
                title: "JSON Schema Validation",
                description:
                  "Zod-basierte Validierung für sichere Datenstrukturen",
              },
              {
                icon: "🎯",
                title: "Multiple Fragetypen",
                description: "Single Choice, Multiple Choice und Texteingabe",
              },
              {
                icon: "🏷️",
                title: "Tag-System",
                description:
                  "Kategorisierung und Filterfunktionen für Lernpakete",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                glass="medium"
                className="p-6 hover:scale-105 transition-all duration-300"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/70 text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </Card>
      ) : currentTab === "quiz" && selectedDemo ? (
        /* Quiz Tab */
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">
              🎮 Swipe Quiz
            </h2>
            <p className="text-white/60">
              Swipe nach rechts für richtige, nach links für falsche Antworten
            </p>
          </div>
          <SwipeQuiz
            pack={selectedDemo}
            onComplete={() => setCurrentTab("demo")}
          />
        </div>
      ) : null}
    </div>
  );
}
