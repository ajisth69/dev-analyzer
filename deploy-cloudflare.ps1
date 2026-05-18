# deploy-cloudflare.ps1 — One-click: builds frontend + deploys everything to Cloudflare
$ErrorActionPreference = "Stop"

Write-Host "`n🔨 Building frontend..." -ForegroundColor Yellow
Push-Location "$PSScriptRoot\frontend"
npm install --silent
npm run build
Pop-Location

Write-Host "📦 Copying frontend build to worker/public..." -ForegroundColor Yellow
$publicDir = "$PSScriptRoot\worker\public"
if (Test-Path $publicDir) { Remove-Item -Recurse -Force $publicDir }
New-Item -ItemType Directory -Path $publicDir -Force | Out-Null
Copy-Item -Recurse -Force "$PSScriptRoot\frontend\dist\*" $publicDir

Write-Host "🚀 Deploying to Cloudflare Workers..." -ForegroundColor Green
Push-Location "$PSScriptRoot\worker"
npx wrangler deploy
Pop-Location

Write-Host "`n✅ DONE! Frontend + Backend live on one Cloudflare URL.`n" -ForegroundColor Green
