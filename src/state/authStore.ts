import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { 
  User, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  PhoneAuthProvider,
  signInWithCredential
} from 'firebase/auth'
import { auth } from '../utils/firebase'

interface AuthState {
  // State
  user: User | null
  loading: boolean
  phoneVerificationId: string | null
  confirmationResult: ConfirmationResult | null
  recaptchaVerifier: RecaptchaVerifier | null
  phoneAuthLoading: boolean
  phoneAuthError: string | null

  // Actions
  signInWithGoogle: () => Promise<void>
  signOutUser: () => Promise<void>
  initializePhoneAuth: (elementId: string) => void
  sendPhoneVerification: (phoneNumber: string) => Promise<void>
  verifyPhoneCode: (code: string) => Promise<void>
  clearPhoneAuth: () => void
  initializeAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    user: null,
    loading: true,
    phoneVerificationId: null,
    confirmationResult: null,
    recaptchaVerifier: null,
    phoneAuthLoading: false,
    phoneAuthError: null,

    // Initialize authentication listener
    initializeAuth: () => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        set({ user, loading: false })
      })
      
      // Store unsubscribe function for cleanup
      ;(window as any).__authUnsubscribe = unsubscribe
    },

    // Google Sign In
    signInWithGoogle: async () => {
      try {
        const provider = new GoogleAuthProvider()
        await signInWithPopup(auth, provider)
      } catch (error) {
        console.error('Google sign in error:', error)
        throw error
      }
    },

    // Sign Out
    signOutUser: async () => {
      try {
        await signOut(auth)
        // Clear phone auth state
        get().clearPhoneAuth()
      } catch (error) {
        console.error('Sign out error:', error)
        throw error
      }
    },

    // Initialize Phone Authentication
    initializePhoneAuth: (elementId: string) => {
      try {
        // Clear any existing verifier first
        const currentVerifier = get().recaptchaVerifier
        if (currentVerifier) {
          try {
            currentVerifier.clear()
          } catch (e) {
            console.warn('Error clearing existing verifier:', e)
          }
        }

        // Check if element exists
        const element = document.getElementById(elementId)
        if (!element) {
          throw new Error(`reCAPTCHA container element with ID "${elementId}" not found`)
        }

        console.log('Creating reCAPTCHA verifier for element:', elementId)
        console.log('Current URL:', window.location.href)
        console.log('Current Origin:', window.location.origin)
        console.log('Current Hostname:', window.location.hostname)
        console.log('Current Port:', window.location.port)
        
        const recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
          size: 'invisible',
          callback: () => {
            console.log('reCAPTCHA solved successfully')
          },
          'expired-callback': () => {
            console.warn('reCAPTCHA expired')
            set({ phoneAuthError: 'reCAPTCHA ist abgelaufen. Bitte versuchen Sie es erneut.' })
          }
        })

        set({ 
          recaptchaVerifier,
          phoneAuthError: null
        })
        console.log('reCAPTCHA verifier initialized successfully')
      } catch (error) {
        console.error('Phone auth initialization error:', error)
        set({ 
          phoneAuthError: `Fehler bei der Initialisierung: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`
        })
      }
    },

    // Send Phone Verification
    sendPhoneVerification: async (phoneNumber: string) => {
      set({ phoneAuthLoading: true, phoneAuthError: null })
      
      try {
        const { recaptchaVerifier } = get()
        if (!recaptchaVerifier) {
          throw new Error('reCAPTCHA ist nicht initialisiert')
        }

        const confirmationResult = await signInWithPhoneNumber(
          auth, 
          phoneNumber, 
          recaptchaVerifier
        )

        set({
          confirmationResult,
          phoneVerificationId: confirmationResult.verificationId,
          phoneAuthLoading: false
        })
      } catch (error: any) {
        console.error('Phone verification error:', error)
        let errorMessage = 'Fehler beim Senden des Verifizierungscodes'
        
        if (error.code === 'auth/invalid-phone-number') {
          errorMessage = 'Ungültige Telefonnummer. Verwenden Sie das Format: +49123456789'
        } else if (error.code === 'auth/too-many-requests') {
          errorMessage = 'Zu viele SMS-Anfragen. Verwenden Sie eine Testnummer (+1234567890) oder warten Sie 15 Minuten.'
        } else if (error.code === 'auth/quota-exceeded') {
          errorMessage = 'SMS-Quota überschritten. Bitte versuchen Sie es später erneut.'
        } else if (error.code === 'auth/billing-not-enabled') {
          errorMessage = 'Phone Authentication ist nicht aktiviert. Bitte aktivieren Sie es in der Firebase Console.'
        } else if (error.code === 'auth/project-not-whitelisted') {
          errorMessage = 'Projekt ist nicht für Phone Authentication autorisiert.'
        } else if (error.code === 'auth/invalid-app-credential') {
          console.error('Invalid app credential details:', {
            currentURL: window.location.href,
            currentOrigin: window.location.origin,
            projectId: 'dynamiclarning',
            authDomain: 'dynamiclarning.firebaseapp.com'
          })
          errorMessage = `Domain nicht autorisiert: ${window.location.origin}. Prüfen Sie Firebase Console: Authentication → Settings → Authorized domains`
        } else if (error.code === 'auth/app-not-authorized') {
          errorMessage = 'App nicht autorisiert für diese Domain. Überprüfen Sie Firebase authorized domains.'
        }

        set({
          phoneAuthLoading: false,
          phoneAuthError: errorMessage
        })
        throw error
      }
    },

    // Verify Phone Code
    verifyPhoneCode: async (code: string) => {
      set({ phoneAuthLoading: true, phoneAuthError: null })
      
      try {
        const { confirmationResult } = get()
        if (!confirmationResult) {
          throw new Error('Kein Verifizierungscode verfügbar')
        }

        await confirmationResult.confirm(code)
        
        // Clear phone auth state after successful verification
        get().clearPhoneAuth()
        set({ phoneAuthLoading: false })
      } catch (error: any) {
        console.error('Phone code verification error:', error)
        let errorMessage = 'Ungültiger Verifizierungscode'
        
        if (error.code === 'auth/invalid-verification-code') {
          errorMessage = 'Ungültiger Verifizierungscode'
        } else if (error.code === 'auth/code-expired') {
          errorMessage = 'Verifizierungscode ist abgelaufen'
        }

        set({
          phoneAuthLoading: false,
          phoneAuthError: errorMessage
        })
        throw error
      }
    },

    // Clear Phone Auth State
    clearPhoneAuth: () => {
      const { recaptchaVerifier } = get()
      if (recaptchaVerifier) {
        recaptchaVerifier.clear()
      }
      
      set({
        phoneVerificationId: null,
        confirmationResult: null,
        recaptchaVerifier: null,
        phoneAuthLoading: false,
        phoneAuthError: null
      })
    }
  }))
)

// Initialize auth when the store is created
useAuthStore.getState().initializeAuth()

// Cleanup function for the auth listener
export const cleanupAuth = () => {
  if ((window as any).__authUnsubscribe) {
    (window as any).__authUnsubscribe()
  }
}