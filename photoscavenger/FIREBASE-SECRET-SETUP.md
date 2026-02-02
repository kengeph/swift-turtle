# Firebase API Key Secret Setup

This project uses GitHub Secrets to securely store the Firebase API key instead of hardcoding it in the repository.

## Setup

1. **GitHub Secret** (already created):
   - Secret name: `FIREBASEAPIKEY`
   - Value: Your Firebase API key

## Usage Options

### Option 1: GitHub Actions Workflow (Recommended)

The GitHub Actions workflow (`.github/workflows/generate-firebase-config.yml`) will automatically generate `firebase-config.js` from the template using the secret:

1. Go to **Actions** tab in GitHub
2. Run the **"Generate Firebase Config"** workflow manually, or it will run automatically on pushes
3. Download the artifact containing `firebase-config.js`
4. Deploy it using `deploy-config.ps1`

### Option 2: Local PowerShell Script

Generate the config file locally using the PowerShell script:

```powershell
# Set the API key from environment variable
$env:FIREBASE_API_KEY = "your-api-key-here"

# Generate the config file
cd photoscavenger
.\generate-firebase-config.ps1

# Or in one line:
$env:FIREBASE_API_KEY = "your-api-key-here"; .\generate-firebase-config.ps1
```

### Option 3: Deploy Script with Auto-Generation

The deploy script can automatically generate the config if it doesn't exist:

```powershell
# Set API key and deploy
$env:FIREBASE_API_KEY = "your-api-key-here"
cd photoscavenger
.\deploy-config.ps1
```

## File Structure

- **`firebase-config.template.js`** - Template file (committed to git) with `{{FIREBASE_API_KEY}}` placeholder
- **`firebase-config.js`** - Generated file (gitignored) with actual API key
- **`.gitignore`** - Excludes `firebase-config.js` from git

## Security Notes

- ✅ The actual API key is never committed to git
- ✅ The template file uses a placeholder that's safe to commit
- ✅ GitHub Secrets are encrypted and only accessible in GitHub Actions
- ⚠️ Remember: Firebase API keys in client-side code are still visible in the browser. Security relies on Firebase Security Rules and API key restrictions, not obfuscation.

## Troubleshooting

**GitHub keeps flagging the API key:**
- Make sure `firebase-config.js` is in `.gitignore`
- Ensure the template file uses `{{FIREBASE_API_KEY}}` placeholder, not the actual key
- Regenerate the config file if you accidentally committed it

**Config file not generating:**
- Check that the secret `FIREBASEAPIKEY` exists in GitHub repository settings
- Verify the template file exists and has the correct placeholder format
- Check GitHub Actions logs for errors
