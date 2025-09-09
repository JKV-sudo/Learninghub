# 🔧 Google Cloud API Key Fix - `invalid-app-credential`

## 🎯 Problem
reCAPTCHA funktioniert, aber `accounts:sendVerificationCode` API Call schlägt fehl mit `auth/invalid-app-credential`.

## ✅ Root Cause: API Key HTTP Referrer Restrictions

### Schritt 1: Google Cloud Console öffnen
1. **[Google Cloud Console](https://console.cloud.google.com)**
2. **Projekt auswählen:** `dynamiclarning` 
3. **Sidebar:** APIs & Services → **Credentials**

### Schritt 2: API Key finden und bearbeiten
1. **API Key finden:** `AIzaSyDRWkPOv-SDq7bKJaDrFIJ4RINu4Er2fCM`
2. **Auf API Key Name klicken** (nicht das Copy-Icon)
3. **"Edit API key" Seite öffnet sich**

### Schritt 3: Application restrictions (KRITISCH)

**Aktueller Zustand (wahrscheinlich):**
```
Application restrictions: HTTP referrers (web sites)
Accepted web sites: 
  - Sehr restriktive Regeln die localhost:3000 ausschließen
```

**FIX Option A - Quick (Development):**
```
Application restrictions: None
```
→ **Save** klicken

**FIX Option B - Secure (Production-ready):**
```
Application restrictions: HTTP referrers (web sites)
Accepted web sites:
  - localhost/*
  - localhost:3000/*
  - 127.0.0.1:3000/*
  - your-domain.vercel.app/*
  - your-domain.com/*
```
→ **Save** klicken

### Schritt 4: API restrictions prüfen

**Scroll runter zu "API restrictions":**
```
✅ Restrict key: Don't restrict key (für Development)

ODER für Production:
✅ Restrict key: Selected APIs
  - Identity Toolkit API ✅
  - Google Analytics Reporting API (optional)
  - reCAPTCHA Enterprise API (optional)
```

### Schritt 5: Speichern und testen

1. **Save** klicken
2. **1-2 Minuten warten** (API Änderungen brauchen Zeit)
3. **Browser Cache leeren** (Cmd+Shift+R / Ctrl+Shift+R)
4. **Phone Auth erneut testen**

## 🧪 Test nach dem Fix

**In Ihrer App:**
1. **Phone Tab öffnen**
2. **Testnummer:** `+1234567890`  
3. **"Code senden"** klicken

**Erfolgreiche Console Logs:**
```bash
✅ reCAPTCHA solved successfully
✅ Verification code sent successfully  
❌ KEIN "Invalid app credential" Error mehr
```

## 🚨 Warum passiert das?

**Google Cloud API Keys** haben standardmäßig sehr strikte HTTP referrer policies:
- Nur produktive Domains sind erlaubt
- `localhost` ist oft ausgeschlossen
- Development Ports sind nicht vorkonfiguriert

## 💡 Best Practice nach dem Fix

**Für Development:**
- API Key Restrictions: `None` (schnell & einfach)

**Für Production:**
- HTTP referrers mit spezifischen Domains
- API restrictions auf benötigte APIs begrenzen

---

🎯 **Nach diesem Fix sollte Phone Auth 100% funktionieren!**