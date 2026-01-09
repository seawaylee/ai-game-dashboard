# PowerShell Script to generate REAL Ultraman avatars using Google Gemini API
# Requires API Key in .env.local

$ErrorActionPreference = "Stop"

$scriptPath = $PSScriptRoot

# 1. Load Data from JSON
$jsonPath = Join-Path $scriptPath "ultramen.json"
if (!(Test-Path $jsonPath)) {
    Write-Error "Data file not found: $jsonPath"
    exit 1
}
$ultramen = Get-Content $jsonPath -Encoding UTF8 | ConvertFrom-Json

# 2. Load Config from .env.local
$envFile = Join-Path $scriptPath "../.env.local"
$apiKey = $null
$baseUrlHost = "https://generativelanguage.googleapis.com" # Default

if (Test-Path $envFile) {
    $lines = Get-Content $envFile
    foreach ($line in $lines) {
        if ($line -match "^GEMINI_API_KEY=(.*)") {
            $apiKey = $matches[1].Trim()
        } elseif ($line -match "^API_KEY=(.*)") {
            $apiKey = $matches[1].Trim()
        } elseif ($line -match "^GEMINI_BASE_URL=(.*)") {
            # Trim and remove any potential hidden newlines
            $baseUrlHost = $matches[1].Trim() -replace "[\r\n]", ""
        }
    }
}

# Fallback to process env if not in file
if ([string]::IsNullOrWhiteSpace($apiKey)) { $apiKey = $env:GEMINI_API_KEY }
if ([string]::IsNullOrWhiteSpace($baseUrlHost) -and $env:GEMINI_BASE_URL) { $baseUrlHost = $env:GEMINI_BASE_URL }

if ([string]::IsNullOrWhiteSpace($apiKey) -or $apiKey -eq "PLACEHOLDER_API_KEY") {
    Write-Host "❌ Error: API Key not found." -ForegroundColor Red
    exit 1
}

Write-Host "Configuration:" -ForegroundColor Cyan
Write-Host "  API Key:  ***" 
Write-Host "  Base URL: $baseUrlHost"

# 3. Setup Output Directory
$outDir = Join-Path $scriptPath "../public/avatars"
if (!(Test-Path $outDir)) { 
    New-Item -ItemType Directory -Force -Path $outDir | Out-Null 
}

# 4. Generation Loop
$model = "gemini-2.5-flash-image" 
# Construct full URL. Assumes local service mimics Google API path structure.
# If local service is openai-compatible, this might fail, but user said "Gemini Service".
# Ensure no trailing slash in host
if ($baseUrlHost.EndsWith("/")) { $baseUrlHost = $baseUrlHost.Substring(0, $baseUrlHost.Length - 1) }

$baseUrl = "$baseUrlHost/v1beta/models/$($model):generateContent"

# Debug URI
Write-Host "DEBUG: Constructing Request..." -ForegroundColor DarkGray
Write-Host "DEBUG: URL = '$baseUrl'" -ForegroundColor DarkGray
try {
    $uriTest = [System.Uri]$baseUrl
    Write-Host "DEBUG: URI Host = '$($uriTest.Host)' Port = '$($uriTest.Port)'" -ForegroundColor DarkGray
} catch {
    Write-Host "❌ FATAL: Constructed URL is invalid: $_" -ForegroundColor Red
    exit 1
}

Write-Host "🚀 Starting generation for $($ultramen.Count) Ultramen..." -ForegroundColor Cyan

foreach ($u in $ultramen) {
    $name = $u.name
    # $u also has 'color', but we don't need it for AI generation prompt necessarily, but good for context if needed.
    
    $outFile = Join-Path $outDir "$name.png"
    if (Test-Path $outFile) {
        # Optional: Check if it's an SVG (from previous run) and overwrite it?
        # Actually file extension is .png, so .svg won't conflict, but App.tsx will look for .png
        Write-Host "⏩ Skipping $name (Exists)" -ForegroundColor Gray
        continue
    }

    Write-Host "🎨 Generating $name..." -NoNewline

    $prompt = "A high-quality, photorealistic close-up headshot of Ultraman $name. Metallic texture, glowing eyes, cinematic lighting, dark background, 3D render style, heroic pose, facing forward. High resolution icon."

    $body = @{
        contents = @(
            @{ parts = @( @{ text = $prompt } ) }
        )
        generationConfig = @{
            response_mime_type = "image/jpeg"
        }
    } | ConvertTo-Json -Depth 10

    try {
        $response = Invoke-RestMethod -Uri "$baseUrl?key=$apiKey" -Method Post -Body $body -ContentType "application/json"
        
        $base64 = $null
        if ($response.candidates -and $response.candidates[0].content.parts) {
            foreach ($part in $response.candidates[0].content.parts) {
                if ($part.inlineData) {
                    $base64 = $part.inlineData.data
                    break
                }
            }
        }

        if ($base64) {
            $bytes = [Convert]::FromBase64String($base64)
            [IO.File]::WriteAllBytes($outFile, $bytes)
            Write-Host " ✅ Done" -ForegroundColor Green
        } else {
            Write-Host " ⚠️ No image data returned." -ForegroundColor Yellow
        }
    } catch {
        Write-Host " ❌ Failed" -ForegroundColor Red
        Write-Host "   $($_.Exception.Message)" -ForegroundColor DarkGray
        
        # Fallback to gemini-2.0-flash-exp
        if ($model -ne "gemini-2.0-flash-exp") {
             Write-Host "   Retrying with gemini-2.0-flash-exp..." -NoNewline
             $fallbackUrl = "$baseUrlHost/v1beta/models/gemini-2.0-flash-exp:generateContent?key=$apiKey"
             try {
                $response = Invoke-RestMethod -Uri $fallbackUrl -Method Post -Body $body -ContentType "application/json"
                 if ($response.candidates[0].content.parts[0].inlineData) {
                    $b64 = $response.candidates[0].content.parts[0].inlineData.data
                    $bytes = [Convert]::FromBase64String($b64)
                    [IO.File]::WriteAllBytes($outFile, $bytes)
                    Write-Host " ✅ Saved (Fallback)" -ForegroundColor Green
                 } else {
                    Write-Host " ❌ Failed (Fallback)" -ForegroundColor Red
                 }
             } catch {
                Write-Host " ❌ Failed (Fallback)" -ForegroundColor Red
             }
        }
    }

    Start-Sleep -Seconds 1
}

Write-Host "🎉 All Done!" -ForegroundColor Cyan
