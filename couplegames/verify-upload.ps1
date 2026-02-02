# Quick script to verify what's on the FTP server
$ftpConfigPath = "../photoscavenger/ftp-config.json"
$ftpConfig = Get-Content $ftpConfigPath | ConvertFrom-Json

$ftpUri = "ftp://$($ftpConfig.host):$($ftpConfig.port)/htdocs/couplegames/index.html"

try {
    $ftpRequest = [System.Net.FtpWebRequest]::Create($ftpUri)
    $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($ftpConfig.username, $ftpConfig.password)
    $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::DownloadFile
    $ftpRequest.UsePassive = $true
    
    $response = $ftpRequest.GetResponse()
    $responseStream = $response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($responseStream)
    $content = $reader.ReadToEnd()
    
    Write-Host "Current index.html on server:" -ForegroundColor Cyan
    Write-Host $content
    
    $reader.Close()
    $response.Close()
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
