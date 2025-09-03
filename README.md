# smallbyte (React + Vite + TS)

A dynamic learning app where you can import AI‑generated JSON packs, preview them, and save them to Firebase (Auth + Firestore). Includes a public feed, dashboard, and an interactive quiz view.

## Features
- JSON import (file or paste), validated with **Zod**
- **Firebase Auth (Google)** and **Firestore**
- Save packs with `public` flag, owner scoping & Firestore rules
- Public list on Home, personal **Dashboard**
- Interactive quiz page with scoring and explanations
- Clean **Tailwind CSS** UI

## Quickstart
1. Create a Firebase project and enable:
   - **Authentication → Google**
   - **Firestore Database**
2. Copy `.env.example` to `.env` and fill your Firebase config:
   ```bash
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```
3. (Recommended) Set Firestore rules from `firestore.rules`.
4. Install deps & run:
   ```bash
   npm i
   npm run dev
   ```
5. Login with Google → Import a JSON in **/import** → Save → Manage in **/dashboard**.

## JSON Format (example)
See `examples/pack.json`. The schema is roughly:
```json
{
  "title": "string",
  "description": "string (optional)",
  "public": true,
  "items": [
    {
      "id": "string",
      "text": "string",
      "type": "single | multi | text",
      "options": [{ "id": "string", "text": "string", "correct": true }]
    }
  ]
}
```

## Scripts
- `npm run dev` – start Vite dev server (http://localhost:5173)
- `npm run build` – production build
- `npm run preview` – preview build

## Notes
- Packs are stored in collection `packs` with fields: `title`, `description`, `items`, `public`, `ownerUid`, `createdAt`.
- Only owners can update/delete their packs. Public packs can be read by anyone.