# 🔥 Firebase Firestore Setup Guide

Your Firebase backend is configured but the Firestore database needs to be initialized. Follow these steps:

## ✅ **Step 1: Create Firestore Database**

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `dynamiclarning`
3. **Navigate to Firestore Database**
4. **Click "Create database"**
5. **Choose location**: Select a region close to your users
6. **Security rules**: Start in **test mode** (we'll deploy proper rules later)

## 🔧 **Step 2: Install Firebase CLI (Optional)**

```bash
npm install -g firebase-tools
firebase login
firebase init firestore
```

## 🚀 **Step 3: Deploy Security Rules (Recommended)**

If you installed Firebase CLI:
```bash
firebase deploy --only firestore:rules
```

## 📋 **Step 4: Initialize with Sample Data**

Once Firestore is created, run:
```bash
npm run init-firestore
```

## 🛡️ **Current Security Rules**

The app uses these security rules (in `firestore.rules`):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(resourceData) {
      return isSignedIn() && resourceData.ownerUid == request.auth.uid;
    }
    
    match /packs/{packId} {
      allow read: if resource.data.public == true || isOwner(resource.data);
      allow create: if isSignedIn() && request.resource.data.ownerUid == request.auth.uid;
      allow update, delete: if isOwner(resource.data);
    }
  }
}
```

## 🎯 **Expected Database Structure**

After initialization, your Firestore will have:

```
/packs (collection)
  ├── {packId} (document)
      ├── title: string
      ├── description: string
      ├── tags: array
      ├── public: boolean
      ├── ownerUid: string
      ├── createdAt: timestamp
      └── items: array
          └── [questions with options]
```

## 🚨 **Troubleshooting**

### "NOT_FOUND" Error
- **Cause**: Firestore database not created
- **Solution**: Follow Step 1 above

### "Permission Denied" Error  
- **Cause**: Security rules too restrictive
- **Solution**: Temporarily start in test mode, then deploy proper rules

### "Invalid Configuration" Error
- **Cause**: Wrong project ID or API keys
- **Solution**: Check `src/utils/firebase.ts` configuration

## ✨ **After Setup**

1. Run `npm run dev` to start the development server
2. Sign in with Google authentication  
3. Import learning packs via the dashboard
4. Test the JSON upload functionality

---

**Next Steps**: Once Firestore is initialized, the JSON upload functionality will work perfectly with the improved schema validation we implemented!