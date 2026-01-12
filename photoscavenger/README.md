# Photo Scavenger Hunt - Cloud Storage Setup

This app supports cloud storage using Firebase Storage. Follow these steps to enable cloud photo storage:

## Firebase Setup (Recommended)

### Step 1: Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

### Step 2: Enable Firebase Storage
1. In your Firebase project, go to "Storage" in the left sidebar
2. Click "Get started"
3. Start in "Test mode" (for development) or set up security rules for production
4. Choose a storage location (closest to your users)

### Step 3: Get Your Firebase Config
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (`</>`) to add a web app
4. Register your app (give it a nickname)
5. Copy the Firebase configuration object

### Step 4: Configure the App
1. Open `firebase-config.js` in this folder
2. Replace the placeholder values with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 5: Set Up Storage Security Rules
In Firebase Console > Storage > Rules, use these rules for development:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /photos/{allPaths=**} {
      allow read, write: if true;  // Open for development
    }
  }
}
```

**For production**, use more restrictive rules:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /photos/{allPaths=**} {
      allow read: if true;
      allow write: if request.resource.size < 5 * 1024 * 1024; // Max 5MB
    }
  }
}
```

## Alternative: Cloudinary Setup

If you prefer Cloudinary:

1. Sign up at [Cloudinary](https://cloudinary.com/) (free tier available)
2. Get your Cloud Name, API Key, and API Secret from the dashboard
3. Update the code to use Cloudinary's upload API instead of Firebase

## Current Behavior

- **Without Firebase**: Photos are stored in browser localStorage (limited to ~5-10MB total)
- **With Firebase**: Photos are stored in the cloud and accessible from any device

## Notes

- Photos are organized by hunt session ID (you can add this feature)
- Each photo is stored with metadata: itemId, team, timestamp
- Free tier limits apply (Firebase: 5GB storage, Cloudinary: 25GB storage)
