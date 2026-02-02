# PowerShell script to generate firebase-config.js from template using GitHub secret or environment variable
# Usage: .\generate-firebase-config.ps1
# Or with API key: $env:FIREBASE_API_KEY="your-key"; .\generate-firebase-config.ps1

param(
    [string]$ApiKey = $env:FIREBASE_API_KEY
)

if (-not $ApiKey) {
    Write-Host "Error: Firebase API key not provided!" -ForegroundColor Red
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  `$env:FIREBASE_API_KEY='your-key'; .\generate-firebase-config.ps1" -ForegroundColor Cyan
    Write-Host "  Or: .\generate-firebase-config.ps1 -ApiKey 'your-key'" -ForegroundColor Cyan
    exit 1
}

$templateFile = "firebase-config.template.js"
$outputFile = "firebase-config.js"

if (-not (Test-Path $templateFile)) {
    Write-Host "Error: Template file $templateFile not found!" -ForegroundColor Red
    exit 1
}

Write-Host "Generating $outputFile from template..." -ForegroundColor Cyan

# Read template
$templateContent = Get-Content $templateFile -Raw

# Replace placeholder with actual API key
$configContent = $templateContent -replace '\{\{FIREBASE_API_KEY\}\}', $ApiKey

# Write output file
$configContent | Out-File -FilePath $outputFile -Encoding utf8 -NoNewline

Write-Host "Success! $outputFile generated with API key." -ForegroundColor Green
Write-Host "Note: $outputFile is gitignored and won't be committed." -ForegroundColor Yellow
