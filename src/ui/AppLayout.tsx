import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../state/AuthContext";
import { clsx } from "clsx";
import Button from "./Button";
import { LoginModal } from "../components/LoginModal";

export default function AppLayout() {
  const { user, signOutUser } = useAuth();
  const { pathname } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const navigation = [
    { name: "Startseite", href: "/", icon: "🏠" },
    { name: "Dashboard", href: "/dashboard", icon: "📊", requiresAuth: true },
    { name: "Importieren", href: "/import", icon: "📥", requiresAuth: true },
  ];

  const isActivePage = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900" />

        {/* Floating animated shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-20 w-80 h-80 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 32 32\\" width=\\"32\\" height=\\"32\\" fill=\\"none\\" stroke=\\"rgb(148 163 184 / 0.05)\\"><path d=\\"m0 .5h32m-32 32v-32m32 0v32m-32-16h32m-16-16v32\\"/></svg>")',
          }}
        />
      </div>

      {/* Header */}
      <header
        className={clsx(
          "sticky top-0 z-50 w-full transition-all duration-500",
          scrolled
            ? "backdrop-blur-2xl bg-white/10 border-white/20 shadow-glass-xl"
            : "backdrop-blur-xl bg-white/5 border-white/10",
          "border-b"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-3 text-xl font-bold text-white hover:text-blue-200 transition-all duration-300 group animate-slide-in"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold shadow-glow group-hover:scale-110 group-hover:shadow-glow-lg transition-all duration-300 animate-float">
                S
              </div>
              <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                smallbyte
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav
              className="hidden md:flex items-center space-x-2 animate-slide-in"
              style={{ animationDelay: "0.2s" }}
            >
              {navigation.map((item) => {
                if (item.requiresAuth && !user) return null;
                const isActive = isActivePage(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={clsx(
                      "flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 relative group overflow-hidden",
                      isActive
                        ? "bg-white/20 text-white backdrop-blur-xl border border-white/30 shadow-glass"
                        : "text-white/80 hover:text-white hover:bg-white/10 hover:backdrop-blur-lg hover:border hover:border-white/20 hover:shadow-glass"
                    )}
                  >
                    {/* Glass shine effect */}
                    <div className="absolute inset-0 bg-gradient-glass opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10 text-lg">{item.icon}</span>
                    <span className="relative z-10">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Menu / Auth Button */}
            <div
              className="flex items-center space-x-3 animate-slide-in"
              style={{ animationDelay: "0.4s" }}
            >
              {!user ? (
                <Button
                  onClick={() => setLoginModalOpen(true)}
                  variant="glass"
                  size="sm"
                  icon={<span>🚀</span>}
                  glow
                >
                  Anmelden
                </Button>
              ) : (
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:flex items-center space-x-3 bg-white/10 backdrop-blur-xl rounded-2xl px-4 py-2 border border-white/20">
                    <img
                      src={user.photoURL ?? ""}
                      alt={user.displayName ?? ""}
                      className="w-8 h-8 rounded-full ring-2 ring-white/30 shadow-glow"
                    />
                    <div className="text-sm">
                      <div className="font-medium text-white">
                        {user.displayName}
                      </div>
                      <div className="text-white/60 text-xs">Lernender</div>
                    </div>
                  </div>
                  <Button variant="glass" size="sm" onClick={signOutUser}>
                    Abmelden
                  </Button>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2.5 rounded-2xl text-white/80 hover:text-white hover:bg-white/10 hover:backdrop-blur-lg transition-all duration-300 border border-white/10 hover:border-white/20"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      mobileMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-white/10 py-4 backdrop-blur-2xl bg-white/5 rounded-b-2xl mt-2 animate-slide-up">
              <nav className="flex flex-col space-y-2">
                {navigation.map((item) => {
                  if (item.requiresAuth && !user) return null;
                  const isActive = isActivePage(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={clsx(
                        "flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 mx-2",
                        isActive
                          ? "bg-white/20 text-white backdrop-blur-xl border border-white/30"
                          : "text-white/80 hover:text-white hover:bg-white/10 hover:backdrop-blur-lg"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-black/20 backdrop-blur-2xl border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4 animate-fade-in">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold shadow-glow animate-float">
                  S
                </div>
                <span className="text-lg font-semibold text-white">
                  smallbyte
                </span>
              </div>
              <p
                className="text-white/70 mb-4 max-w-md animate-fade-in"
                style={{ animationDelay: "0.2s" }}
              >
                Interaktive Lernplattform für KI-generierte Lernpakete.
                Importiere, teile und lerne mit personalisierten Quiz-Formaten.
              </p>
              <div
                className="flex space-x-4 animate-fade-in"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="text-2xl hover:scale-110 transition-transform cursor-pointer">
                  📚
                </div>
                <div className="text-2xl hover:scale-110 transition-transform cursor-pointer">
                  🧠
                </div>
                <div className="text-2xl hover:scale-110 transition-transform cursor-pointer">
                  🚀
                </div>
              </div>
            </div>

            <div className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Plattform
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/"
                    className="text-white/70 hover:text-white hover:bg-white/5 px-2 py-1 rounded-lg transition-all duration-300"
                  >
                    Startseite
                  </Link>
                </li>
                {user && (
                  <>
                    <li>
                      <Link
                        to="/dashboard"
                        className="text-white/70 hover:text-white hover:bg-white/5 px-2 py-1 rounded-lg transition-all duration-300"
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/import"
                        className="text-white/70 hover:text-white hover:bg-white/5 px-2 py-1 rounded-lg transition-all duration-300"
                      >
                        Importieren
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div className="animate-fade-in" style={{ animationDelay: "0.8s" }}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Funktionen
              </h3>
              <ul className="space-y-3 text-white/70">
                <li className="hover:text-white transition-colors cursor-pointer">
                  JSON-Import
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Interaktive Quizzes
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Firebase-Integration
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Öffentliche Pakete
                </li>
              </ul>
            </div>
          </div>

          <div
            className="border-t border-white/10 pt-8 mt-8 animate-fade-in"
            style={{ animationDelay: "1s" }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-white/50 text-sm">
                © {new Date().getFullYear()} smallbyte. Entwickelt für
                interaktives Lernen.
              </p>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <span className="text-white/40 text-sm">Powered by</span>
                <div className="flex space-x-2 text-xs text-white/50">
                  <span className="hover:text-white transition-colors cursor-pointer">
                    React
                  </span>
                  <span>•</span>
                  <span className="hover:text-white transition-colors cursor-pointer">
                    Firebase
                  </span>
                  <span>•</span>
                  <span className="hover:text-white transition-colors cursor-pointer">
                    Tailwind
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSuccess={() => setLoginModalOpen(false)}
      />
    </div>
  );
}
