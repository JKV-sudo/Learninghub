# 🧪 Test Phone Number Setup (Rate Limit Fix)

## ⚡ Quick Fix für `auth/too-many-requests`

**Problem:** Zu viele SMS-Anfragen → Firebase blockiert weitere Versuche
**Lösung:** Testnummer einrichten (keine SMS, sofort funktionsfähig)

## 🚀 5-Minuten Setup

### Schritt 1: Firebase Console
1. **Öffnen:** [Firebase Console](https://console.firebase.google.com/)
2. **Projekt:** `dynamiclarning` auswählen
3. **Navigation:** **Authentication** → **Sign-in method**

### Schritt 2: Phone Provider öffnen
1. **Phone Provider** in der Liste finden
2. **Klick auf "Phone"** (nicht den Toggle, sondern das Wort)
3. **Settings öffnen sich**

### Schritt 3: Test Numbers hinzufügen
1. **Scroll runter zu "Test phone numbers for development"**
2. **"Add test phone number"** klicken
3. **Eingeben:**
   - **Phone number:** `+1234567890`
   - **Verification code:** `123456`
4. **"Add" klicken**
5. **"Save" klicken** (wichtig!)

## ✅ Sofort testen

**In Ihrer App:**
1. **Phone Tab öffnen**
2. **Nummer eingeben:** `+1234567890`
3. **"Code senden"** klicken
4. **Sofort Code eingeben:** `123456` (keine SMS Wartezeit!)
5. **✅ Login erfolgreich!**

## 🎯 Vorteile der Testnummer

- ✅ **Keine SMS-Kosten**
- ✅ **Keine Rate Limits** 
- ✅ **Sofort verfügbar**
- ✅ **Unlimited Tests**
- ✅ **Funktioniert offline**

## 📱 Weitere Testnummern (optional)

Sie können mehrere hinzufügen:
```
+1234567890 → 123456
+4915123456789 → 654321  
+33123456789 → 999888
```

## 🔄 Nach dem Setup

**Reload der App:**
- Browser refresh (F5 oder Cmd+R)
- Testnummer verwenden
- ✅ Kein `too-many-requests` mehr!

---

🎉 **Test Setup Complete!** Unlimited Phone Auth Testing verfügbar.