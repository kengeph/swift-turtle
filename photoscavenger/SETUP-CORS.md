# Setting Up CORS for Firebase Storage

Your Storage rules are correct, but you also need to configure CORS to allow requests from `swift-turtle.com`.

## Quick Setup Using gsutil

1. **Install Google Cloud SDK** (if not already installed):
   - Download from: https://cloud.google.com/sdk/docs/install
   - Or use: `winget install Google.CloudSDK` (Windows)

2. **Authenticate with Google Cloud**:
   ```bash
   gcloud auth login
   ```

3. **Set your project**:
   ```bash
   gcloud config set project photoscavenger-b16e2
   ```

4. **Apply CORS configuration**:
   ```bash
   cd photoscavenger
   gsutil cors set cors.json gs://photoscavenger-b16e2.firebasestorage.app
   ```

5. **Verify CORS is set**:
   ```bash
   gsutil cors get gs://photoscavenger-b16e2.firebasestorage.app
   ```

## Alternative: Using Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: `photoscavenger-b16e2`
3. Navigate to **Cloud Storage** → **Buckets**
4. Click on bucket: `photoscavenger-b16e2.firebasestorage.app`
5. Go to **Configuration** tab
6. Scroll to **CORS configuration**
7. Click **Edit CORS configuration**
8. Paste the contents of `cors.json`:
   ```json
   [
     {
       "origin": [
         "https://swift-turtle.com",
         "http://swift-turtle.com",
         "https://www.swift-turtle.com",
         "http://www.swift-turtle.com"
       ],
       "method": ["GET", "HEAD", "POST", "PUT", "DELETE"],
       "responseHeader": ["Content-Type", "Authorization"],
       "maxAgeSeconds": 3600
     }
   ]
   ```
9. Click **Save**

## What This Does

- **Storage Rules** (what you see in Firebase Console): Controls WHO can access files (authentication/authorization)
- **CORS Configuration**: Controls WHICH DOMAINS can make requests to your bucket (cross-origin policy)

Both need to be configured for your app to work from `swift-turtle.com`.

## Verify It's Working

After setting CORS, refresh your app. The CORS errors in the browser console should disappear, and `huntEndTime.json` should load successfully.
