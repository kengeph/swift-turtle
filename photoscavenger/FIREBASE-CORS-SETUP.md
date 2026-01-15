# Firebase Storage CORS Configuration

The app is getting CORS errors when trying to access Firebase Storage from `swift-turtle.com`. You need to configure CORS in Firebase Storage.

## Option 1: Configure CORS in Firebase Console (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`photoscavenger-b16e2`)
3. Go to **Storage** in the left sidebar
4. Click on the **Rules** tab
5. The rules should already allow read access, but you may need to configure CORS

## Option 2: Use gsutil to Configure CORS

If you have `gsutil` installed (part of Google Cloud SDK):

1. Create a CORS configuration file `cors.json`:
```json
[
  {
    "origin": ["https://swift-turtle.com", "http://swift-turtle.com"],
    "method": ["GET", "HEAD"],
    "responseHeader": ["Content-Type"],
    "maxAgeSeconds": 3600
  }
]
```

2. Apply the CORS configuration:
```bash
gsutil cors set cors.json gs://photoscavenger-b16e2.firebasestorage.app
```

## Option 3: Use Firebase Storage Rules

Make sure your Storage rules allow public read access:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.resource.size < 5 * 1024 * 1024; // Max 5MB
    }
  }
}
```

## Note

The CORS configuration is separate from Storage rules. Even if rules allow read access, CORS must be configured to allow cross-origin requests from your domain.
