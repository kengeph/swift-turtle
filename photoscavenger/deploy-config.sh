#!/bin/bash
# Bash script to deploy firebase-config.js to InfinityFree hosting via FTP
# Usage: ./deploy-config.sh

CONFIG_FILE="firebase-config.js"

# Check if ftp-config.json exists
if [ ! -f "ftp-config.json" ]; then
    echo "Error: ftp-config.json not found!"
    echo "Please create ftp-config.json with your FTP credentials."
    exit 1
fi

# Check if firebase-config.js exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo "Error: $CONFIG_FILE not found!"
    exit 1
fi

# Read FTP config (requires jq - install with: brew install jq or apt-get install jq)
if ! command -v jq &> /dev/null; then
    echo "Error: jq is required. Install it with: brew install jq (Mac) or apt-get install jq (Linux)"
    exit 1
fi

HOST=$(jq -r '.host' ftp-config.json)
PORT=$(jq -r '.port' ftp-config.json)
USERNAME=$(jq -r '.username' ftp-config.json)
PASSWORD=$(jq -r '.password' ftp-config.json)
REMOTE_PATH=$(jq -r '.remotePath' ftp-config.json)

echo "Deploying $CONFIG_FILE to FTP server..."
echo "Host: $HOST"
echo "Remote Path: $REMOTE_PATH"

# Use curl to upload via FTP
curl -T "$CONFIG_FILE" \
     --ftp-ssl \
     --user "$USERNAME:$PASSWORD" \
     "ftp://$HOST:$PORT$REMOTE_PATH/$CONFIG_FILE"

if [ $? -eq 0 ]; then
    echo "Success! $CONFIG_FILE uploaded successfully."
else
    echo "Error uploading file."
    exit 1
fi
