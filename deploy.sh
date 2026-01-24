#!/bin/bash
set -e

echo "=== OpenNext + Cloudflare Deploy ==="

# 1. Build with OpenNext
echo "Building..."
npm run pages:build

# 2. Copy worker with correct name
echo "Preparing worker..."
cp .open-next/worker.js .open-next/_worker.js

# 3. Copy required folders to assets
echo "Copying assets..."
cp -r .open-next/cloudflare .open-next/assets/
cp -r .open-next/middleware .open-next/assets/
cp -r .open-next/server-functions .open-next/assets/
cp -r .open-next/.build .open-next/assets/
cp .open-next/_worker.js .open-next/assets/

# 4. Create _routes.json (CRITICAL for static assets)
echo "Creating _routes.json..."
cat > .open-next/assets/_routes.json << 'EOF'
{
  "version": 1,
  "include": ["/*"],
  "exclude": [
    "/_next/static/*",
    "/favicon.ico",
    "/*.png",
    "/*.jpg",
    "/*.jpeg",
    "/*.svg",
    "/*.webp",
    "/*.ico"
  ]
}
EOF

# 5. Deploy
echo "Deploying to Cloudflare..."
npx wrangler pages deploy .open-next/assets --project-name=marcomotion

echo "=== Deploy complete! ==="