# PowerShell script to deploy firebase-config.js to InfinityFree hosting via FTP
# Usage: .\deploy-config.ps1

param(
    [string]$ConfigFile = "firebase-config.js"
)

# Check if ftp-config.json exists
if (-not (Test-Path "ftp-config.json")) {
    Write-Host "Error: ftp-config.json not found!" -ForegroundColor Red
    Write-Host "Please create ftp-config.json with your FTP credentials." -ForegroundColor Yellow
    exit 1
}

# Check if firebase-config.js exists
if (-not (Test-Path $ConfigFile)) {
    Write-Host "Error: $ConfigFile not found!" -ForegroundColor Red
    exit 1
}

# Read FTP config
$ftpConfig = Get-Content "ftp-config.json" | ConvertFrom-Json

Write-Host "Deploying $ConfigFile to FTP server..." -ForegroundColor Green
Write-Host "Host: $($ftpConfig.host)" -ForegroundColor Cyan
Write-Host "Remote Path: $($ftpConfig.remotePath)" -ForegroundColor Cyan

# Create FTP request
$ftpUri = "ftp://$($ftpConfig.host):$($ftpConfig.port)$($ftpConfig.remotePath)/$ConfigFile"
Write-Host "Uploading to: $ftpUri" -ForegroundColor Yellow

try {
    # Create FTP WebRequest
    $ftpRequest = [System.Net.FtpWebRequest]::Create($ftpUri)
    $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($ftpConfig.username, $ftpConfig.password)
    $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
    $ftpRequest.UseBinary = $true
    $ftpRequest.UsePassive = $true
    
    # Read file content
    $fileContent = [System.IO.File]::ReadAllBytes((Resolve-Path $ConfigFile))
    $ftpRequest.ContentLength = $fileContent.Length
    
    # Upload file
    $requestStream = $ftpRequest.GetRequestStream()
    $requestStream.Write($fileContent, 0, $fileContent.Length)
    $requestStream.Close()
    
    # Get response
    $response = $ftpRequest.GetResponse()
    Write-Host "Success! $ConfigFile uploaded successfully." -ForegroundColor Green
    Write-Host "Status: $($response.StatusDescription)" -ForegroundColor Green
    $response.Close()
    
} catch {
    Write-Host "Error uploading file: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
