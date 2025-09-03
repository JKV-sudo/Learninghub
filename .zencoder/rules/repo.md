---
description: Repository Information Overview
alwaysApply: true
---

# smallbyte Information

## Summary
smallbyte ist eine interaktive Lern-App, die auf React, Vite und TypeScript basiert. Sie ermöglicht das Importieren von KI-generierten JSON-Lernpaketen, deren Vorschau und Speicherung in Firebase (Auth + Firestore). Die Anwendung bietet einen öffentlichen Feed, ein Dashboard und eine interaktive Quiz-Ansicht.

## Struktur
- **src/**: Hauptquellcode der Anwendung
  - **pages/**: React-Komponenten für die verschiedenen Seiten (Home, Dashboard, ImportPack, PackView)
  - **state/**: Zustandsverwaltung und Kontexte (AuthContext)
  - **ui/**: Wiederverwendbare UI-Komponenten (AppLayout, Card)
  - **utils/**: Hilfsfunktionen und Konfigurationen (firebase.ts, schema.ts)
- **public/**: Statische Assets
- **examples/**: Beispiel-JSON-Dateien für Lernpakete

## Language & Runtime
**Language**: TypeScript, JavaScript (React)
**Version**: TypeScript 5.4.5, React 18.2.0
**Build System**: Vite 5.4.2
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- react: ^18.2.0
- react-dom: ^18.2.0
- react-router-dom: ^6.26.1
- firebase: ^10.13.0
- zod: ^3.23.8
- clsx: ^2.1.1

**Development Dependencies**:
- typescript: ^5.4.5
- vite: ^5.4.2
- @vitejs/plugin-react: ^4.3.1
- tailwindcss: ^3.4.10
- postcss: ^8.4.47
- autoprefixer: ^10.4.20

## Build & Installation
```bash
# Installation der Abhängigkeiten
npm i

# Entwicklungsserver starten
npm run dev

# Produktions-Build erstellen
npm run build

# Build-Vorschau
npm run preview
```

## Firebase Integration
**Konfiguration**: Die App verwendet Firebase für Authentifizierung, Datenspeicherung und Analytics
**Authentifizierung**: Google-Login über Firebase Auth
**Datenbank**: Firestore für die Speicherung von Lernpaketen
**Analytics**: Firebase Analytics für Nutzungsstatistiken
**Umgebungsvariablen**: Konfiguration über .env-Datei (siehe .env.example)
**Sicherheitsregeln**: Definiert in firestore.rules mit folgenden Zugriffskontrollen:
  - Lesen: Nur öffentliche Pakete oder eigene Pakete
  - Erstellen: Nur authentifizierte Benutzer (mit eigener UID)
  - Aktualisieren/Löschen: Nur Besitzer des Pakets

## Datenmodell
**Schema**: Zod-Schema für Lernpakete mit folgender Struktur:
- Pack: title, description, tags, items, public
- Item: id, text, type (single/multi/text), options, explanation
- Option: id, text, correct, explanation
**Firestore**: Pakete werden in der Collection 'packs' gespeichert mit zusätzlichen Feldern:
  - ownerUid: UID des Erstellers
  - createdAt: Erstellungszeitpunkt

## Anwendungsfunktionen
- JSON-Import (Datei oder Einfügen), validiert mit Zod
- Firebase Auth (Google) und Firestore-Integration
- Speichern von Paketen mit öffentlichem Flag und Besitzerbeschränkung
- Öffentliche Liste auf der Startseite, persönliches Dashboard
- Interaktive Quiz-Seite mit Bewertung und Erklärungen
- Saubere Tailwind CSS-Benutzeroberfläche

## Testing
targetFramework: Playwright