# Lighthouse Audit Script for Windows
# Requires Lighthouse CLI and Chrome to be installed
# Usage: .\lighthouse-audit.ps1

$ErrorActionPreference = "Stop"

Write-Host "🔍 Starting Lighthouse Audit..." -ForegroundColor Cyan
Write-Host ""

# Check if lighthouse is installed
try {
    $lighthouseVersion = lighthouse --version
    Write-Host "✅ Lighthouse found: $lighthouseVersion"
} catch {
    Write-Host "⚠️  Installing Lighthouse CLI..."
    npm install -g @lhci/cli@latest lighthouse
}

# Check if dev server is running
$port = 5173
$serverRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:$port" -ErrorAction SilentlyContinue -TimeoutSec 2
    $serverRunning = $true
} catch {
    Write-Host ""
    Write-Host "⚠️  Dev server not running. Starting it now..."
    Write-Host "Please run in another terminal: npm run dev"
    Write-Host ""
    Write-Host "Press any key to continue when the server is ready..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

Write-Host ""
Write-Host "📊 Running Lighthouse audit on http://localhost:$port..." -ForegroundColor Cyan
Write-Host ""

# Create reports directory
if (!(Test-Path "./lighthouse-reports")) {
    New-Item -ItemType Directory -Path "./lighthouse-reports" -Force | Out-Null
}

# Run Lighthouse for desktop
& lighthouse "http://localhost:$port" `
    --output html `
    --output json `
    --output-path "./lighthouse-reports/desktop" `
    --preset=desktop `
    --chrome-flags="--headless"

Write-Host ""
Write-Host "✅ Audit complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📄 Reports generated:" -ForegroundColor Cyan
Write-Host "  - lighthouse-reports/desktop.html (view in browser)"
Write-Host "  - lighthouse-reports/desktop.json (raw data)"
Write-Host ""
Write-Host "🎯 Opening report in browser..." -ForegroundColor Cyan

if (Test-Path "./lighthouse-reports/desktop.html") {
    & ".\lighthouse-reports\desktop.html"
} else {
    Write-Host "📝 Report saved. Open this file in your browser:"
    Write-Host "   $PWD\lighthouse-reports\desktop.html"
}
