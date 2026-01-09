# PowerShell Script to generate TTS Audio files locally
Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer

# Configure Voice (Try to find a Chinese voice)
$voices = $synth.GetInstalledVoices()
$zhVoice = $voices | Where-Object { $_.VoiceInfo.Culture.Name -like "zh-*" } | Select-Object -First 1

if ($zhVoice) {
    $synth.SelectVoice($zhVoice.VoiceInfo.Name)
    Write-Host "Using Voice: $($zhVoice.VoiceInfo.Name)"
} else {
    Write-Host "Warning: No Chinese voice found. Using default." -ForegroundColor Yellow
}

$synth.Rate = 0
$synth.Volume = 100

$scriptPath = $PSScriptRoot
$outDir = Join-Path $scriptPath "../public/audio"
if (!(Test-Path $outDir)) { New-Item -ItemType Directory -Force -Path $outDir | Out-Null }

# Map filename to text to speak
$jsonPath = Join-Path $scriptPath "audio_map.json"
if (!(Test-Path $jsonPath)) {
    Write-Error "Audio map not found: $jsonPath"
    exit 1
}

# Reading JSON properly with UTF8 encoding
$jsonContent = Get-Content $jsonPath -Encoding UTF8 | Out-String
$audioMap = ConvertFrom-Json $jsonContent

Write-Host "🎙️ Generating Audio Files..." -ForegroundColor Cyan

# PSObject from JSON behaves like an object, not a hashtable
foreach ($key in $audioMap.PSObject.Properties.Name) {
    $text = $audioMap.$key
    $file = Join-Path $outDir "$key.wav"
    
    try {
        $synth.SetOutputToWaveFile($file)
        $synth.Speak($text)
        $synth.SetOutputToNull()
        Write-Host " ✅ Generated $key.wav" -ForegroundColor Green
    } catch {
        Write-Host " ❌ Failed to generate $key.wav: $_" -ForegroundColor Red
    }
}

Write-Host "🎉 Audio generation complete!" -ForegroundColor Cyan
