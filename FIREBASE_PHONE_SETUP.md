# Firebase Phone Authentication Setup Guide

## 🚫 Problem: `auth/billing-not-enabled` Error

Wenn Sie den Fehler `Firebase: Error (auth/billing-not-enabled)` sehen, ist Phone Authentication in Firebase noch nicht korrekt aktiviert.

## ✅ Lösung: Phone Authentication aktivieren (KOSTENLOS)

### Schritt 1: Firebase Console
1. **Öffnen Sie die [Firebase Console](https://console.firebase.google.com/)**
2. **Wählen Sie Ihr Projekt** aus
3. **Navigation:** Gehen Sie zu **Authentication** → **Sign-in method**

### Schritt 2: Phone Provider aktivieren
4. **Suchen Sie den "Phone" Provider** in der Liste
5. **Klicken Sie auf "Phone"** um ihn zu konfigurieren
6. **Toggle "Enable"** auf AN
7. **Klicken Sie "Save"**

### Schritt 3: Google Cloud Console (für kostenlose Quota)
8. **Gehen Sie zur [Google Cloud Console](https://console.cloud.google.com/)**
9. **Wählen Sie dasselbe Projekt** wie in Firebase
10. **Navigation:** **APIs & Services** → **Library**
11. **Suchen Sie nach:** "Identity Toolkit API"
12. **Klicken Sie auf "Identity Toolkit API"**
13. **Klicken Sie "Enable"** (falls noch nicht aktiviert)

### Schritt 4: Quota prüfen (optional)
14. **Navigation:** **APIs & Services** → **Quotas**
15. **Filter:** Suchen Sie nach "Identity Toolkit"
16. **Quota:** SMS-Nachrichten sind auf 10/Tag kostenlos begrenzt

## 🧪 Test Setup (optional aber empfohlen)

Für Entwicklung und Tests können Sie Testnummern hinzufügen:

1. **Firebase Console** → **Authentication** → **Sign-in method** → **Phone**
2. **Scroll zu "Test phone numbers"**
3. **Beispiel Testnummer hinzufügen:**
   - **Phone Number:** `+1234567890`
   - **Verification Code:** `123456`
4. **Save**

Diese Testnummern funktionieren ohne echte SMS und verbrauchen keine Quota.

## 🔧 reCAPTCHA Configuration

Phone Authentication benötigt reCAPTCHA für Web-Apps:

1. **Firebase Console** → **Authentication** → **Settings** tab
2. **Scroll zu "reCAPTCHA Enforcement"**
3. **Stellen Sie sicher, dass es aktiviert ist**

## ✅ Verification

Nach dem Setup sollten Sie in der Firebase Console sehen:

- ✅ **Authentication** → **Sign-in method** → **Phone** ist "Enabled"
- ✅ **Google Cloud Console** → **APIs & Services** → "Identity Toolkit API" ist enabled
- ✅ Keine `auth/billing-not-enabled` Fehler mehr

## 📱 Kosten

- **KOSTENLOS:** Bis zu 10 SMS pro Tag
- **Bezahlt:** Nach 10 SMS/Tag, etwa $0.01 pro SMS
- **Testnummern:** Verbrauchen keine Quota

## 🐛 Häufige Probleme

### Problem: reCAPTCHA funktioniert nicht
**Lösung:** 
- Überprüfen Sie, ob die Domain in Firebase authorized ist
- Stellen Sie sicher, dass reCAPTCHA v3 aktiviert ist
- Browser-Cache leeren

### Problem: "Invalid phone number"
**Lösung:**
- Verwenden Sie internationales Format: `+49123456789`
- Deutsche Nummern: `+49` gefolgt von der Nummer ohne führende 0

### Problem: "Too many requests"
**Lösung:**
- Warten Sie einige Minuten
- Verwenden Sie Testnummern für Development

## 🚀 Nach dem Setup

1. **Testen Sie mit einer Testnummer** (empfohlen)
2. **Testen Sie mit Ihrer echten Nummer** (verbraucht 1 SMS)
3. **Implementieren Sie Error Handling** für Produktionsumgebung

---

🎉 **Setup complete!** Phone Authentication sollte jetzt funktionieren.