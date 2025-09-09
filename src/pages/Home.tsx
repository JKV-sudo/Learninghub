import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import LoadingSpinner from "../ui/LoadingSpinner";
import { Link } from "react-router-dom";
import { useAuth } from "../state/AuthContext";
import { LoginModal } from "../components/LoginModal";

type PublicPack = {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
};

export default function Home() {
  const [packs, setPacks] = useState<PublicPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const run = async () => {
      try {
        const ref = collection(db, "packs");
        const q = query(
          ref,
          where("public", "==", true),
          orderBy("createdAt", "desc"),
          limit(12)
        );
        const snap = await getDocs(q);
        setPacks(
          snap.docs.map((d) => ({
            id: d.id,
            title: d.get("title"),
            description: d.get("description"),
            tags: d.get("tags") || [],
          }))
        );
      } catch (error) {
        console.error("Fehler beim Laden der öffentlichen Pakete:", error);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="text-center py-20 relative">
        {/* Floating glass orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full backdrop-blur-3xl border border-white/20 animate-float" />
        <div
          className="absolute top-40 right-20 w-20 h-20 bg-gradient-to-r from-pink-400/20 to-blue-400/20 rounded-full backdrop-blur-3xl border border-white/20 animate-float"
          style={{ animationDelay: "2s" }}
        />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Lernen mit{" "}
              </span>
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-glow">
                KI-generierten
              </span>
              <br />
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Lernpaketen
              </span>
            </h1>
          </div>

          <p
            className="text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            Importiere JSON-Lernpakete, erstelle interaktive Quizzes und teile
            Wissen mit der Community. Personalisiertes Lernen war nie einfacher.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            {!user ? (
              <>
                <Button
                  size="lg"
                  variant="glass"
                  glow
                  onClick={() => setLoginModalOpen(true)}
                  className="text-lg px-10 py-4"
                >
                  🚀 Jetzt starten
                </Button>
                <Button
                  variant="glass"
                  size="lg"
                  className="text-lg px-10 py-4"
                >
                  📚 Entdecken
                </Button>
              </>
            ) : (
              <>
                <Link to="/import">
                  <Button
                    size="lg"
                    variant="glass"
                    glow
                    className="text-lg px-10 py-4"
                  >
                    📥 Paket importieren
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button
                    variant="glass"
                    size="lg"
                    className="text-lg px-10 py-4"
                  >
                    📊 Dashboard
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Animated Stats */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 animate-slide-up"
            style={{ animationDelay: "0.6s" }}
          >
            <Card glass="strong" glow className="text-center p-8 group">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                {packs.length}+
              </div>
              <div className="text-white/80 font-medium">
                Öffentliche Lernpakete
              </div>
            </Card>
            <Card glass="strong" glow className="text-center p-8 group">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                100%
              </div>
              <div className="text-white/80 font-medium">KI-generiert</div>
            </Card>
            <Card glass="strong" glow className="text-center p-8 group">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                ∞
              </div>
              <div className="text-white/80 font-medium">Lernmöglichkeiten</div>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="relative">
        {/* Background decoration */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-2 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full blur-sm" />

        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              So funktioniert's
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            In nur vier einfachen Schritten zu deinem personalisierten
            Lernerlebnis
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              step: "01",
              title: "Anmelden",
              description: "Mit Google-Account anmelden und sofort loslegen",
              icon: "🔐",
              gradient: "from-blue-400 to-cyan-400",
            },
            {
              step: "02",
              title: "JSON parsen",
              description:
                "KI-generierte Lernpakete hochladen oder direkt einfügen",
              icon: "📥",
              gradient: "from-purple-400 to-pink-400",
            },
            {
              step: "03",
              title: "Vorschau & Speichern",
              description: "Inhalte prüfen und in deiner Bibliothek speichern",
              icon: "💾",
              gradient: "from-green-400 to-blue-400",
            },
            {
              step: "04",
              title: "Lernen & Teilen",
              description: "Interaktive Quizzes lösen und öffentlich teilen",
              icon: "🎯",
              gradient: "from-yellow-400 to-orange-400",
            },
          ].map((item, index) => (
            <Card
              key={index}
              glass="medium"
              className="text-center relative overflow-hidden group hover:scale-105 transition-all duration-500"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Step number with glass effect */}
              <div className="relative mb-6">
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${item.gradient} rounded-2xl flex items-center justify-center text-white font-bold mx-auto text-xl shadow-glow group-hover:shadow-glow-lg transition-all duration-300`}
                >
                  {item.step}
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white/20 rounded-full backdrop-blur-xl animate-pulse" />
              </div>

              <div className="text-4xl mb-4 animate-bounce-gentle">
                {item.icon}
              </div>

              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors">
                {item.title}
              </h3>

              <p className="text-white/70 text-sm leading-relaxed group-hover:text-white/90 transition-colors">
                {item.description}
              </p>

              {/* Connecting line for larger screens */}
              {index < 3 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-white/30 to-transparent" />
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* Public Packs */}
      <section className="relative">
        <div className="flex items-center justify-between mb-12 animate-fade-in">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Öffentliche Lernpakete
              </span>
            </h2>
            <p className="text-xl text-white/70">
              Entdecke von der Community geteilte Lernpakete
            </p>
          </div>
          {user && (
            <Link to="/import">
              <Button variant="glass" glow>
                ✨ Eigenes Paket erstellen
              </Button>
            </Link>
          )}
        </div>

        {loading ? (
          <div className="py-20">
            <LoadingSpinner
              glass
              glow
              size="lg"
              message="Lade öffentliche Lernpakete..."
            />
          </div>
        ) : packs.length === 0 ? (
          <Card
            glass="strong"
            glow
            className="text-center py-16 animate-slide-up"
          >
            <div className="text-8xl mb-6 animate-float">📚</div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Noch keine öffentlichen Pakete
            </h3>
            <p className="text-white/70 text-lg mb-8 max-w-md mx-auto">
              Sei der erste und teile dein Lernpaket mit der Community!
            </p>
            {!user ? (
              <Button
                variant="glass"
                glow
                size="lg"
                onClick={() => setLoginModalOpen(true)}
              >
                🚀 Anmelden
              </Button>
            ) : (
              <Link to="/import">
                <Button variant="glass" glow size="lg">
                  ✨ Erstes Paket erstellen
                </Button>
              </Link>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packs.map((pack, index) => (
              <Card
                key={pack.id}
                glass="medium"
                className="h-full hover:scale-105 hover:shadow-glow-lg transition-all duration-500 relative overflow-hidden group animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500" />

                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-white text-lg leading-tight flex-1 group-hover:text-blue-200 transition-colors">
                      {pack.title}
                    </h3>
                    <div className="text-3xl ml-3 group-hover:scale-110 transition-transform">
                      📖
                    </div>
                  </div>

                  {pack.description && (
                    <p className="text-white/70 text-sm mb-6 line-clamp-3 group-hover:text-white/90 transition-colors">
                      {pack.description}
                    </p>
                  )}

                  {pack.tags && pack.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {pack.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="primary" size="sm" glow>
                          {tag}
                        </Badge>
                      ))}
                      {pack.tags.length > 3 && (
                        <Badge variant="glass" size="sm">
                          +{pack.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="mt-auto space-y-3">
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <Badge variant="success" size="sm" glow>
                        🌍 Öffentlich
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/packs/${pack.id}?mode=swipe`}
                        className="flex-1"
                      >
                        <Button
                          variant="glass"
                          size="sm"
                          glow
                          className="w-full text-sm"
                        >
                          🎯 Swipe Quiz
                        </Button>
                      </Link>
                      <Link to={`/packs/${pack.id}`} className="flex-1">
                        <Button
                          variant="glass"
                          size="sm"
                          className="w-full text-sm"
                        >
                          📖 Öffnen
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="relative">
        <Card glass="strong" glow className="p-12 md:p-16 animate-slide-up">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Warum smallbyte?
              </span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Moderne Lernplattform mit innovativen Features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🤖",
                title: "KI-Integration",
                description:
                  "Nahtlose Integration von KI-generierten Lernpaketen mit automatischer Validierung",
                gradient: "from-blue-400 to-cyan-400",
              },
              {
                icon: "🔥",
                title: "Firebase Backend",
                description:
                  "Sichere Authentifizierung und Datenspeicherung mit Google Firebase",
                gradient: "from-red-400 to-pink-400",
              },
              {
                icon: "📱",
                title: "Responsive Design",
                description:
                  "Optimiert für alle Geräte - von Desktop bis Smartphone",
                gradient: "from-green-400 to-blue-400",
              },
              {
                icon: "⚡",
                title: "Schnell & Intuitiv",
                description:
                  "Blitzschnelle Performance mit React und modernen Web-Technologien",
                gradient: "from-yellow-400 to-orange-400",
              },
              {
                icon: "🌍",
                title: "Community-basiert",
                description:
                  "Teile Lernpakete und profitiere von der Schwarmintelligenz",
                gradient: "from-purple-400 to-pink-400",
              },
              {
                icon: "🎯",
                title: "Interaktiv",
                description:
                  "Multiple-Choice, Single-Choice und Text-Antworten für abwechslungsreiches Lernen",
                gradient: "from-indigo-400 to-purple-400",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center group hover:scale-105 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative mb-6">
                  <div
                    className={`w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-3xl flex items-center justify-center mx-auto shadow-glow group-hover:shadow-glow-lg transition-all duration-300`}
                  >
                    <div className="text-4xl animate-bounce-gentle">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-8 w-4 h-4 bg-white/20 rounded-full animate-pulse" />
                </div>

                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-200 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="text-center relative animate-slide-up">
          <Card
            glass="strong"
            glow
            className="p-12 md:p-16 text-center relative overflow-hidden"
          >
            {/* Background animation */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />

            {/* Floating elements */}
            <div className="absolute top-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full backdrop-blur-xl animate-float" />
            <div
              className="absolute bottom-8 left-8 w-12 h-12 bg-gradient-to-r from-pink-400/20 to-blue-400/20 rounded-full backdrop-blur-xl animate-float"
              style={{ animationDelay: "1s" }}
            />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Bereit für dein Lernabenteuer?
                </span>
              </h2>

              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
                Melde dich kostenlos an und starte noch heute mit
                personalisierten Lernpaketen
              </p>

              <Button
                variant="glass"
                size="lg"
                glow
                onClick={() => setLoginModalOpen(true)}
                className="text-xl px-12 py-6 font-bold"
              >
                🚀 Kostenlos anmelden
              </Button>
            </div>
          </Card>
        </section>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSuccess={() => setLoginModalOpen(false)}
      />
    </div>
  );
}
