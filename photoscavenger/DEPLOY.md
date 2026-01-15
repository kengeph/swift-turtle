# Deploying firebase-config.js to InfinityFree

The `firebase-config.js` file contains sensitive Firebase credentials and is gitignored. To deploy it to your InfinityFree hosting:

## Setup (One-time)

1. Create `ftp-config.json` in this folder with your FTP credentials:
```json
{
  "host": "ftpupload.net",
  "port": 21,
  "username": "if0_37706923",
  "password": "YOUR_PASSWORD",
  "remotePath": "/htdocs/photoscavenger"
}
```

**Note:** `ftp-config.json` is gitignored and will NOT be committed to GitHub.

## Deploying

### Windows (PowerShell)
```powershell
cd photoscavenger
.\deploy-config.ps1
```

### Mac/Linux (Bash)
```bash
cd photoscavenger
chmod +x deploy-config.sh
./deploy-config.sh
```

**Note:** Bash script requires `jq` to be installed:
- Mac: `brew install jq`
- Linux: `apt-get install jq` or `yum install jq`

## What it does

The deployment script uploads `firebase-config.js` to your InfinityFree hosting server via FTP, placing it in the `photoscavenger` folder so the website can load it.

## Security

- `firebase-config.js` - Contains Firebase API keys (gitignored)
- `ftp-config.json` - Contains FTP credentials (gitignored)
- Both files are excluded from GitHub for security
