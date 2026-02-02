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

# Create FTP request - ensure remote path doesn't have leading slash for URI
$remotePath = $ftpConfig.remotePath.TrimStart('/')
$ftpUri = "ftp://$($ftpConfig.host):$($ftpConfig.port)/$remotePath/$ConfigFile"
Write-Host "Uploading to: $ftpUri" -ForegroundColor Yellow

try {
    # Create FTP WebRequest
    $ftpRequest = [System.Net.FtpWebRequest]::Create($ftpUri)
    $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($ftpConfig.username, $ftpConfig.password)
    $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
    $ftpRequest.UseBinary = $true
    $ftpRequest.UsePassive = $true
    $ftpRequest.EnableSsl = $false
    
    # Read file content
    $filePath = (Resolve-Path $ConfigFile).Path
    $fileContent = [System.IO.File]::ReadAllBytes($filePath)
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
    Write-Host "Trying alternative method..." -ForegroundColor Yellow
    
    # Try alternative: change directory first, then upload
    try {
        $ftpUri = "ftp://$($ftpConfig.host):$($ftpConfig.port)/$ConfigFile"
        $ftpRequest = [System.Net.FtpWebRequest]::Create($ftpUri)
        $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($ftpConfig.username, $ftpConfig.password)
        $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
        $ftpRequest.UseBinary = $true
        $ftpRequest.UsePassive = $true
        $ftpRequest.EnableSsl = $false
        
        # Set working directory
        $ftpRequest.UseBinary = $true
        $filePath = (Resolve-Path $ConfigFile).Path
        $fileContent = [System.IO.File]::ReadAllBytes($filePath)
        $ftpRequest.ContentLength = $fileContent.Length
        
        $requestStream = $ftpRequest.GetRequestStream()
        $requestStream.Write($fileContent, 0, $fileContent.Length)
        $requestStream.Close()
        
        $response = $ftpRequest.GetResponse()
        Write-Host "Success! $ConfigFile uploaded successfully (alternative method)." -ForegroundColor Green
        $response.Close()
    } catch {
        Write-Host "Alternative method also failed: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Please upload manually via FTP client to: $($ftpConfig.remotePath)/$ConfigFile" -ForegroundColor Yellow
        exit 1
    }
}
