# 🐛 DEBUG: `auth/invalid-app-credential` Troubleshooting

## 🎯 Problem
`invalid-app-credential` error trotz authorized domains in Firebase Console.

## 🔍 Step-by-Step Debug Process

### Schritt 1: Current URL identifizieren

**Öffnen Sie die Browser Console (F12) und schauen Sie nach:**
```bash
Current URL: http://localhost:3000/
Current Origin: http://localhost:3000  
Current Hostname: localhost
Current Port: 3000
```

### Schritt 2: Firebase Console - Exakte Domain Check

**WICHTIG:** Domain muss EXAKT übereinstimmen!

1. **Firebase Console:** [console.firebase.google.com](https://console.firebase.google.com)
2. **Projekt:** `dynamiclarning` 
3. **Authentication → Settings → Authorized domains**

**Überprüfen Sie ALLE diese Varianten:**
- [ ] `localhost`
- [ ] `localhost:3000`
- [ ] `http://localhost` ❌ (FALSCH - kein http://)
- [ ] `http://localhost:3000` ❌ (FALSCH - kein http://)

### Schritt 3: Google Cloud Console Check

**Identity Toolkit API aktiviert?**

1. **Google Cloud Console:** [console.cloud.google.com](https://console.cloud.google.com)
2. **Projekt auswählen:** `dynamiclarning`
3. **APIs & Services → Library**
4. **Suchen:** "Identity Toolkit API"
5. **Status:** Muss "ENABLED" sein

### Schritt 4: Browser Cache Nuclear Option

```bash
# Chrome/Edge:
1. F12 → Application → Storage → "Clear site data"
2. Oder: Inkognito-Fenster testen

# Firefox:  
1. F12 → Storage → "Clear All"

# Safari:
1. Develop → Empty Caches
```

### Schritt 5: Alternative Domains testen

**Firebase Console → Authorized domains hinzufügen:**
```
127.0.0.1
127.0.0.1:3000
0.0.0.0:3000
localhost.localdomain
```

### Schritt 6: Firebase Project Settings Check

**Projekt-Integrität prüfen:**

1. **Firebase Console → Project Settings → General**
2. **Verify:**
   - Project ID: `dynamiclarning`
   - Project Name: Korrekt?
   - Default GCP resource location: Gesetzt?

3. **Web Apps Sektion:**
   - App nickname: Vorhanden?
   - App ID: `1:307108843657:web:86041ab2fa1055d8b97658`
   - SDK setup korrekt?

### Schritt 7: API Key Validation

**Google Cloud Console:**
1. **APIs & Services → Credentials**
2. **Finden Sie Ihren API Key:** `AIzaSyDRWkPOv-SDq7bKJaDrFIJ4RINu4Er2fCM`
3. **Edit API Key:**
   - Application restrictions: "HTTP referrers"
   - Website restrictions: 
     - `localhost/*`
     - `localhost:3000/*`
     - `127.0.0.1:3000/*`

### Schritt 8: Last Resort - New Web App

**Wenn alles fehlschlägt:**

1. **Firebase Console → Project Settings → General**
2. **"Add app" → Web (</> Icon)**
3. **App nickname:** `smallbyte-debug`
4. **New Config generieren**
5. **Neue Config in firebase.ts einsetzen**

## 🧪 Quick Test Commands

**Im Browser Console ausführen:**

```javascript
// Firebase Config Check
console.log('Firebase Config:', {
  apiKey: "AIzaSyDRWkPOv-SDq7bKJaDrFIJ4RINu4Er2fCM",
  authDomain: "dynamiclarning.firebaseapp.com",
  projectId: "dynamiclarning"
});

// Current Environment
console.log('Environment:', {
  url: window.location.href,
  origin: window.location.origin,
  hostname: window.location.hostname,
  port: window.location.port
});

// Test reCAPTCHA Element
console.log('reCAPTCHA Element:', document.querySelector('[id^="recaptcha"]'));
```

## ✅ Success Indicators

**Sie wissen, dass es funktioniert wenn:**

```bash
✅ Console: "reCAPTCHA verifier initialized successfully"
✅ Console: "reCAPTCHA solved successfully"  
✅ Keine Console-Fehler beim "Code senden"
✅ Fehlermeldung ändert sich zu "too-many-requests" (= Domain funktioniert!)
```

## 🆘 If Nothing Works

**Als letzte Lösung - Emulator verwenden:**

```bash
# Terminal:
npm install -g firebase-tools
firebase login
firebase init emulators
firebase emulators:start --only auth

# Dann in firebase.ts:
import { connectAuthEmulator } from 'firebase/auth'
if (location.hostname === 'localhost') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099')
}
```

---

🎯 **Nach diesem Debug-Prozess sollten Sie die exakte Ursache identifizieren können!**