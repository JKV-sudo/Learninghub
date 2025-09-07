#!/usr/bin/env node

// Script to add test data to Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDRWkPOv-SDq7bKJaDrFIJ4RINu4Er2fCM",
  authDomain: "dynamiclarning.firebaseapp.com",
  projectId: "dynamiclarning",
  storageBucket: "dynamiclarning.firebasestorage.app",
  messagingSenderId: "307108843657",
  appId: "1:307108843657:web:86041ab2fa1055d8b97658",
  measurementId: "G-W2FW5JT7GQ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Test pack data
const testPack = {
  title: "JavaScript Fundamentals",
  description: "Essential JavaScript concepts for modern web development",
  tags: ["JavaScript", "Web Development", "Programming", "Frontend"],
  public: true,
  ownerUid: "test-user-123",
  createdAt: serverTimestamp(),
  items: [
    {
      id: "1",
      text: "Was ist JavaScript?",
      type: "single",
      options: [
        { id: "a", text: "Eine Programmiersprache für Web-Browser", correct: true },
        { id: "b", text: "Ein CSS-Framework", correct: false },
        { id: "c", text: "Eine Datenbank", correct: false }
      ],
      explanation: "JavaScript ist eine vielseitige Programmiersprache, die ursprünglich für Web-Browser entwickelt wurde."
    }
  ]
};

async function addTestData() {
  try {
    console.log('🔥 Adding test pack to Firestore...');
    const docRef = await addDoc(collection(db, 'packs'), testPack);
    console.log('✅ Test pack added with ID:', docRef.id);
    console.log('🎯 You can now test the public packs query on the homepage');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding test pack:', error);
    process.exit(1);
  }
}

addTestData();