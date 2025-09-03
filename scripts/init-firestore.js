// Firebase Firestore Initialization Script
// This script populates the database with example learning packs

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

// Firebase configuration (same as in the app)
const firebaseConfig = {
  apiKey: "AIzaSyDRWkPOv-SDq7bKJaDrFIJ4RINu4Er2fCM",
  authDomain: "dynamiclarning.firebaseapp.com",
  projectId: "dynamiclarning",
  storageBucket: "dynamiclarning.firebasestorage.app",
  messagingSenderId: "307108843657",
  appId: "1:307108843657:web:86041ab2fa1055d8b97658",
  measurementId: "G-W2FW5JT7GQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Example learning packs to initialize the database
const examplePacks = [
  {
    title: "Willkommen bei smallbyte! 🎉",
    description: "Ein schneller Einstieg in die Lernplattform mit den wichtigsten Features und Funktionen.",
    tags: ["Tutorial", "Onboarding", "Grundlagen"],
    public: true,
    ownerUid: "system", // System-generated pack
    items: [
      {
        id: "welcome-1",
        text: "Was ist smallbyte?",
        type: "single",
        options: [
          {
            id: "a",
            text: "Eine Plattform für KI-generierte Lernpakete",
            correct: true,
            explanation: "Richtig! smallbyte ermöglicht das Importieren und Teilen von JSON-Lernpaketen."
          },
          {
            id: "b",
            text: "Ein Social Media Network",
            correct: false
          },
          {
            id: "c",
            text: "Ein Online-Shop",
            correct: false
          }
        ],
        explanation: "smallbyte ist eine moderne Lernplattform für interaktive, KI-generierte Quizzes."
      },
      {
        id: "welcome-2",
        text: "Welche Fragetypen unterstützt smallbyte?",
        type: "multi",
        options: [
          {
            id: "a",
            text: "Single Choice (eine richtige Antwort)",
            correct: true
          },
          {
            id: "b",
            text: "Multiple Choice (mehrere richtige Antworten)",
            correct: true
          },
          {
            id: "c",
            text: "Text-Antworten",
            correct: true
          },
          {
            id: "d",
            text: "Video-Uploads",
            correct: false
          }
        ],
        explanation: "smallbyte unterstützt Single Choice, Multiple Choice und Text-Antworten."
      },
      {
        id: "welcome-3",
        text: "Beschreiben Sie kurz, was Sie von smallbyte erwarten.",
        type: "text",
        explanation: "Vielen Dank für Ihr Feedback! Ihre Erwartungen helfen uns, die Plattform zu verbessern."
      }
    ]
  }
];

async function initializeFirestore() {
  try {
    console.log('🚀 Initialisiere Firestore-Datenbank...');
    
    // Add example packs to the database
    for (const packData of examplePacks) {
      const docRef = await addDoc(collection(db, 'packs'), {
        ...packData,
        createdAt: serverTimestamp()
      });
      
      console.log(`✅ Lernpaket "${packData.title}" hinzugefügt mit ID: ${docRef.id}`);
    }
    
    console.log('');
    console.log('🎉 Firestore-Datenbank erfolgreich initialisiert!');
    console.log('');
    console.log('📋 Hinzugefügte Lernpakete:');
    examplePacks.forEach((pack, index) => {
      console.log(`   ${index + 1}. ${pack.title}`);
      console.log(`      - ${pack.items.length} Fragen`);
      console.log(`      - ${pack.public ? 'Öffentlich' : 'Privat'}`);
      console.log('');
    });
    
    console.log('🔧 Nächste Schritte:');
    console.log('   1. Starte die App mit: npm run dev');
    console.log('   2. Melde dich mit Google an');
    console.log('   3. Importiere weitere Lernpakete über das Dashboard');
    console.log('');
    
  } catch (error) {
    console.error('❌ Fehler beim Initialisieren der Datenbank:', error);
  }
}

// Run the initialization
initializeFirestore();