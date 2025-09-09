# Firebase Authorized Domains Setup

## 🚫 Problem: `auth/invalid-app-credential` Error

Dieser Fehler tritt auf, wenn Ihre Domain nicht in Firebase's authorized domains Liste steht.

## ✅ Lösung: Development Domain hinzufügen

### Schritt 1: Firebase Console - Authorized Domains

1. **Firebase Console öffnen:** [console.firebase.google.com](https://console.firebase.google.com/)
2. **Ihr Projekt auswählen:** `dynamiclarning`
3. **Navigation:** **Authentication** → **Settings** Tab
4. **Scroll zu "Authorized domains"**

### Schritt 2: Development Domains hinzufügen

**Fügen Sie folgende Domains hinzu:**

```
localhost
127.0.0.1
localhost:5173
localhost:5174  
localhost:5175
localhost:3000
localhost:8080
```

**So geht's:**
1. **Klick auf "Add domain"**
2. **Domain eingeben** (z.B. `localhost`)
3. **"Add"** klicken
4. **Wiederholen** für alle Domains oben

### Schritt 3: Production Domain (später)

Für Production fügen Sie hinzu:
- Ihre Vercel URL: `your-app.vercel.app`  
- Custom Domain falls vorhanden

## ⚡ Quick Fix für Development

**Alternative:** Verwenden Sie Port 3000:

```bash
# In Ihrem Terminal:
npm run dev -- --port 3000
```

Dann öffnen Sie: `http://localhost:3000`

## 🔍 Verification

Nach dem Setup:
1. **Browser-Cache leeren** (Cmd+Shift+R / Ctrl+Shift+R)
2. **App neu laden**
3. **Phone Auth testen**

Sollten Sie sehen:
- ✅ Keine `auth/invalid-app-credential` Fehler mehr
- ✅ reCAPTCHA funktioniert
- ✅ SMS wird versendet

## 📱 Test mit Testnummer

**In Firebase Console:**
1. **Authentication** → **Sign-in method** → **Phone**
2. **"Test phone numbers" hinzufügen:**
   - Phone: `+1234567890`
   - Code: `123456`

**In der App testen:**
- Nummer eingeben: `+1234567890`
- Code wird nicht per SMS gesendet
- Direkt Code `123456` eingeben
- ✅ Login erfolgreich!

## 🐛 Troubleshooting

### Problem: Domain nicht gefunden
- **Lösung:** Exakte URL aus Browser kopieren
- **Format:** Ohne `http://` oder `https://`
- **Beispiel:** `localhost:5175` statt `http://localhost:5175`

### Problem: Immer noch Fehler
1. **Warten:** Änderungen brauchen 1-2 Minuten
2. **Cache leeren:** Browser komplett neu starten
3. **Inkognito:** Private/Inkognito-Fenster testen

---

🎉 **Setup complete!** Phone Authentication sollte jetzt funktionieren.