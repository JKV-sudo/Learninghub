import React, { createContext, useContext } from "react";
import { User } from "firebase/auth";
import { useAuthStore } from "./authStore";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  // Phone auth methods
  phoneAuthLoading: boolean;
  phoneAuthError: string | null;
  initializePhoneAuth: (elementId: string) => void;
  sendPhoneVerification: (phoneNumber: string) => Promise<void>;
  verifyPhoneCode: (code: string) => Promise<void>;
  clearPhoneAuth: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOutUser: async () => {},
  phoneAuthLoading: false,
  phoneAuthError: null,
  initializePhoneAuth: () => {},
  sendPhoneVerification: async () => {},
  verifyPhoneCode: async () => {},
  clearPhoneAuth: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const authStore = useAuthStore();

  return (
    <AuthContext.Provider value={authStore}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
