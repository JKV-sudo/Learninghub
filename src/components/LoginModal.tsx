import React, { useState } from "react";
import { useAuth } from "../state/AuthContext";
import { PhoneAuth } from "./PhoneAuth";
import { Button } from "../ui/Button";
import { LoadingSpinner } from "../ui/LoadingSpinner";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<"google" | "phone">("google");
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle } = useAuth();

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Google sign in failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSuccess = () => {
    onSuccess?.();
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking on the backdrop itself, not child elements
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        data-testid="modal-backdrop"
      />

      {/* Modal */}
      <div
        data-testid="login-modal"
        className="relative w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 animate-modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Anmelden
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100/80 rounded-full transition-colors"
              disabled={loading}
              aria-label="Close modal"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <p className="text-gray-600 mt-2">
            Wählen Sie Ihre bevorzugte Anmeldemethode
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200/50">
          <button
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "google"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50/50"
            }`}
            onClick={() => setActiveTab("google")}
            disabled={loading}
          >
            🚀 Google
          </button>
          <button
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "phone"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50/50"
            }`}
            onClick={() => setActiveTab("phone")}
            disabled={loading}
          >
            📱 Telefon
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "google" && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg">
                  🚀
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Mit Google anmelden
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Schnell und sicher mit Ihrem Google-Konto
                </p>
              </div>

              <Button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 py-3"
                size="lg"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Mit Google fortfahren
                  </>
                )}
              </Button>

              <div className="text-xs text-gray-500 text-center">
                Durch die Anmeldung stimmen Sie unseren Nutzungsbedingungen zu
              </div>
            </div>
          )}

          {activeTab === "phone" && (
            <PhoneAuth onSuccess={handlePhoneSuccess} onCancel={onClose} />
          )}
        </div>
      </div>
    </div>
  );
}

/* Add these animations to your CSS */
const modalStyles = `
  @keyframes modal-enter {
    from {
      opacity: 0;
      transform: scale(0.9) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  
  .animate-modal-enter {
    animation: modal-enter 0.3s ease-out;
  }
`;

// Inject styles into the document
if (typeof document !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.textContent = modalStyles;
  document.head.appendChild(styleElement);
}
