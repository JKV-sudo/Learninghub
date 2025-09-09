import React, { useState, useEffect } from "react";
import { useAuthStore } from "../state/authStore";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { LoadingSpinner } from "../ui/LoadingSpinner";

interface PhoneAuthProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PhoneAuth({ onSuccess, onCancel }: PhoneAuthProps) {
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isValidPhone, setIsValidPhone] = useState(false);
  const [recaptchaId] = useState(
    () => `recaptcha-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  );

  const {
    phoneAuthLoading,
    phoneAuthError,
    confirmationResult,
    initializePhoneAuth,
    sendPhoneVerification,
    verifyPhoneCode,
    clearPhoneAuth,
  } = useAuthStore();

  // Initialize reCAPTCHA when component mounts
  useEffect(() => {
    // Small delay to ensure DOM element is rendered
    const timer = setTimeout(() => {
      console.log("Initializing reCAPTCHA with ID:", recaptchaId);
      initializePhoneAuth(recaptchaId);
    }, 200);

    // Cleanup when component unmounts
    return () => {
      clearTimeout(timer);
      clearPhoneAuth();
    };
  }, [initializePhoneAuth, clearPhoneAuth, recaptchaId]);

  // Validate phone number format
  useEffect(() => {
    // More flexible validation for international format (+XX XXXXXXXXX)
    const phoneRegex = /^\+[1-9]\d{8,14}$/;
    const cleanPhone = phoneNumber.replace(/\s/g, ""); // Remove spaces for validation
    setIsValidPhone(phoneRegex.test(cleanPhone));
  }, [phoneNumber]);

  // Move to code step when verification is sent
  useEffect(() => {
    if (confirmationResult) {
      setStep("code");
    }
  }, [confirmationResult]);

  const handleSendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPhone) return;

    try {
      const cleanPhone = phoneNumber.replace(/\s/g, ""); // Remove spaces for API call
      await sendPhoneVerification(cleanPhone);
    } catch (error) {
      console.error("Failed to send verification:", error);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) return;

    try {
      await verifyPhoneCode(verificationCode);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to verify code:", error);
    }
  };

  const handleCancel = () => {
    clearPhoneAuth();
    setStep("phone");
    setPhoneNumber("");
    setVerificationCode("");
    onCancel?.();
  };

  const handleBack = () => {
    setStep("phone");
    setVerificationCode("");
    clearPhoneAuth();
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* reCAPTCHA container (invisible) */}
      <div id={recaptchaId} style={{ display: "none" }}></div>

      {step === "phone" && (
        <form onSubmit={handleSendVerification} className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Anmeldung mit Telefonnummer
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Geben Sie Ihre Telefonnummer im internationalen Format ein (z.B.
              +49 123 456789)
            </p>
          </div>

          <div>
            <Input
              type="tel"
              placeholder="+49 123 456789"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={phoneAuthLoading}
              required
            />
            {phoneNumber && !isValidPhone && (
              <p className="text-sm text-red-600 mt-1">
                Bitte geben Sie eine gültige Telefonnummer im internationalen
                Format ein
              </p>
            )}
          </div>

          {phoneAuthError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{phoneAuthError}</p>
            </div>
          )}

          <div className="flex space-x-3">
            <Button
              type="submit"
              disabled={!isValidPhone || phoneAuthLoading}
              className="flex-1"
            >
              {phoneAuthLoading ? <LoadingSpinner size="sm" /> : "Code senden"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={phoneAuthLoading}
            >
              Abbrechen
            </Button>
          </div>
        </form>
      )}

      {step === "code" && (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Verifizierungscode eingeben
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Wir haben einen 6-stelligen Code an <strong>{phoneNumber}</strong>{" "}
              gesendet
            </p>
          </div>

          <div>
            <Input
              type="text"
              placeholder="123456"
              value={verificationCode}
              onChange={(e) =>
                setVerificationCode(
                  e.target.value.replace(/\D/g, "").slice(0, 6)
                )
              }
              disabled={phoneAuthLoading}
              maxLength={6}
              required
            />
          </div>

          {phoneAuthError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{phoneAuthError}</p>
            </div>
          )}

          <div className="flex space-x-3">
            <Button
              type="submit"
              disabled={verificationCode.length !== 6 || phoneAuthLoading}
              className="flex-1"
            >
              {phoneAuthLoading ? <LoadingSpinner size="sm" /> : "Verifizieren"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={phoneAuthLoading}
            >
              Zurück
            </Button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => sendPhoneVerification(phoneNumber)}
              disabled={phoneAuthLoading}
              className="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400"
            >
              Code erneut senden
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
