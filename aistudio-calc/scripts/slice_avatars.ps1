
Add-Type -AssemblyName System.Drawing

$imagePath = "public\Gemini_Generated_Image_8dnzqo8dnzqo8dnz.png"
$jsonPath = "scripts\ultramen.json"
$outputDir = "public\avatars"

# Absolute paths to avoid issues
$baseDir = Get-Location
$imagePath = Join-Path $baseDir $imagePath
$jsonPath = Join-Path $baseDir $jsonPath
$outputDir = Join-Path $baseDir $outputDir

Write-Host "Image Path: $imagePath"

if (-not (Test-Path $imagePath)) {
    Write-Error "Image file not found!"
    exit 1
}

# Load JSON
$jsonContent = Get-Content $jsonPath -Raw -Encoding UTF8
$ultramen = $jsonContent | ConvertFrom-Json

# Load Image
try {
    $srcImage = [System.Drawing.Bitmap]::FromFile($imagePath)
} catch {
    Write-Error "Failed to load image: $_"
    exit 1
}

$width = $srcImage.Width
$height = $srcImage.Height

Write-Host "Image Size: $width x $height"

$cols = 10
$rows = 5
$cellW = [int][Math]::Floor($width / $cols)
$cellH = [int][Math]::Floor($height / $rows)

Write-Host "Cell Size: $cellW x $cellH"

# Ensure output dir exists
if (-not (Test-Path $outputDir)) { New-Item -ItemType Directory -Force -Path $outputDir }

$count = 0
for ($r = 0; $r -lt $rows; $r++) {
    for ($c = 0; $c -lt $cols; $c++) {
        if ($count -ge $ultramen.Count) { break }
        
        $name = $ultramen[$count].name
        $x = $c * $cellW
        $y = $r * $cellH
        
        # Write-Host "Processing $name at $x, $y"
        
        $rect = New-Object System.Drawing.Rectangle $x, $y, $cellW, $cellH
        
        try {
            $destImage = $srcImage.Clone($rect, $srcImage.PixelFormat)
            $destPath = Join-Path $outputDir "$name.png"
            $destImage.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
            $destImage.Dispose()
            Write-Host "Saved $name.png"
        } catch {
             Write-Error "Failed to save $name : $_"
        }
        
        $count++
    }
    if ($count -ge $ultramen.Count) { break }
}

$srcImage.Dispose()
Write-Host "Done!"
