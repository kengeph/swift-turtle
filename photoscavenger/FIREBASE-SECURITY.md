# Firebase Security Best Practices

## Understanding Firebase API Keys

**Important:** Firebase API keys are **designed to be public** in client-side applications. They identify your Firebase project, not authorize access. The key will always be visible in the browser - this is normal and expected.

## Real Security: Firebase Security Rules

The actual security comes from **Firebase Security Rules**, not from hiding the API key. Your Storage rules should be properly configured:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.resource.size < 5 * 1024 * 1024; // Max 5MB
      allow delete: if true;
    }
  }
}
```

## Additional Security: API Key Restrictions

You can add restrictions to your Firebase API key to limit where it can be used:

### Step 1: Go to Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `photoscavenger-b16e2`
3. Go to **APIs & Services** → **Credentials**

### Step 2: Find Your API Key
1. Look for your API key: `AIzaSyBt729lCe079bhuUag00Pq6itpIlHQ4qlA`
2. Click on it to edit

### Step 3: Add Restrictions
1. **Application restrictions:**
   - Select "HTTP referrers (web sites)"
   - Add your domains:
     - `https://swift-turtle.com/*`
     - `https://www.swift-turtle.com/*`
     - `http://swift-turtle.com/*` (if you use HTTP)

2. **API restrictions:**
   - Select "Restrict key"
   - Choose only the Firebase APIs you need:
     - Firebase Storage API
     - Firebase Realtime Database API (if used)
     - etc.

3. Click **Save**

## Why This Matters

- **API Key Restrictions** prevent the key from being used on unauthorized domains
- **Security Rules** prevent unauthorized access to your data
- Together, they provide defense in depth

## Current Setup

- ✅ `firebase-config.js` is in `.gitignore` (keeps it out of git)
- ✅ File is manually uploaded to server (not in repo)
- ⚠️ **Recommended:** Add API key restrictions in Google Cloud Console
- ⚠️ **Recommended:** Review and tighten Firebase Security Rules if needed

## Note on git-secret

Using git-secret would keep the file encrypted in git, but:
- It still needs to be decrypted and uploaded to the server
- The key will still be visible in the browser (this is unavoidable)
- It adds complexity without improving client-side security

**Recommendation:** Keep using `.gitignore` + manual upload, and add API key restrictions for better security.
