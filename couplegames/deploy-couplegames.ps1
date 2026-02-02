# PowerShell script to deploy couplegames files to InfinityFree hosting via FTP
# Usage: .\deploy-couplegames.ps1
# This script runs tests before deploying to ensure code quality

Write-Host "Running tests before deployment..." -ForegroundColor Cyan
npm run test:run
if ($LASTEXITCODE -ne 0) {
    Write-Host "Tests failed! Deployment aborted." -ForegroundColor Red
    exit 1
}
Write-Host "All tests passed! Proceeding with deployment..." -ForegroundColor Green
Write-Host ""

# Check if ftp-config.json exists (use the one from photoscavenger)
$ftpConfigPath = "../photoscavenger/ftp-config.json"
if (-not (Test-Path $ftpConfigPath)) {
    Write-Host "Error: $ftpConfigPath not found!" -ForegroundColor Red
    Write-Host "Please create ftp-config.json in photoscavenger folder with your FTP credentials." -ForegroundColor Yellow
    exit 1
}

# Read FTP config
$ftpConfig = Get-Content $ftpConfigPath | ConvertFrom-Json

Write-Host "Deploying couplegames files to FTP server..." -ForegroundColor Green
Write-Host "Host: $($ftpConfig.host)" -ForegroundColor Cyan
Write-Host "Remote Path: /htdocs/couplegames" -ForegroundColor Cyan

# Local directory to upload
$localDir = "../docs/couplegames"
$remotePath = "/htdocs/couplegames"

# Function to upload a file
function Upload-File {
    param(
        [string]$LocalFile,
        [string]$RemoteFile
    )
    
    $ftpUri = "ftp://$($ftpConfig.host):$($ftpConfig.port)$RemoteFile"
    
    try {
        $ftpRequest = [System.Net.FtpWebRequest]::Create($ftpUri)
        $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($ftpConfig.username, $ftpConfig.password)
        $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
        $ftpRequest.UseBinary = $true
        $ftpRequest.UsePassive = $true
        
        $fileContent = [System.IO.File]::ReadAllBytes((Resolve-Path $LocalFile))
        $ftpRequest.ContentLength = $fileContent.Length
        
        $requestStream = $ftpRequest.GetRequestStream()
        $requestStream.Write($fileContent, 0, $fileContent.Length)
        $requestStream.Close()
        
        $response = $ftpRequest.GetResponse()
        Write-Host "  Uploaded: $RemoteFile" -ForegroundColor Green
        $response.Close()
        return $true
    } catch {
        Write-Host "  Error uploading $RemoteFile : $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to create directory (if needed)
function Create-Directory {
    param([string]$RemoteDir)
    
    $ftpUri = "ftp://$($ftpConfig.host):$($ftpConfig.port)$RemoteDir"
    
    try {
        $ftpRequest = [System.Net.FtpWebRequest]::Create($ftpUri)
        $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($ftpConfig.username, $ftpConfig.password)
        $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
        $ftpRequest.UsePassive = $true
        
        try {
            $response = $ftpRequest.GetResponse()
            Write-Host "  Created directory: $RemoteDir" -ForegroundColor Yellow
            $response.Close()
        } catch {
            # Directory might already exist, that's okay
        }
    } catch {
        # Ignore directory creation errors
    }
}

# Create remote directories
Write-Host "Creating remote directories..." -ForegroundColor Cyan
Create-Directory -RemoteDir $remotePath
Create-Directory -RemoteDir "$remotePath/assets"

# Upload index.html (make sure it's the latest built version)
Write-Host ""
Write-Host "Uploading index.html..." -ForegroundColor Cyan
$indexHtmlPath = Resolve-Path "$localDir/index.html"
Write-Host "  Source: $indexHtmlPath" -ForegroundColor Gray
Upload-File -LocalFile $indexHtmlPath -RemoteFile "$remotePath/index.html"

# Upload all files in assets directory
Write-Host ""
Write-Host "Uploading assets..." -ForegroundColor Cyan
$assetFiles = Get-ChildItem -Path "$localDir/assets" -File
foreach ($file in $assetFiles) {
    $remoteFile = "$remotePath/assets/$($file.Name)"
    Upload-File -LocalFile $file.FullName -RemoteFile $remoteFile
}

Write-Host ""
Write-Host "Deployment complete!" -ForegroundColor Green
