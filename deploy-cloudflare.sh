#!/bin/bash
# deploy-cloudflare.sh — One-click: builds frontend + deploys everything to Cloudflare
set -e
cd "$(dirname "$0")"

echo "🔨 Building frontend..."
cd frontend && npm install --silent && npm run build && cd ..

echo "📦 Copying frontend to worker/public..."
rm -rf worker/public && mkdir -p worker/public
cp -r frontend/dist/* worker/public/

echo "🚀 Deploying to Cloudflare..."
cd worker && npx wrangler deploy

echo "✅ DONE! Frontend + Backend live on one Cloudflare URL."
