#!/bin/bash

# Zero-Bot.net — Local Development Runner
# Starts backend (php artisan serve) + frontend (pnpm dev) in parallel

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

# Fix permissions if needed (common after sudo pnpm build)
if [ ! -w "storage/logs" ] || [ ! -w "node_modules" ]; then
    echo "⚠️  Fixing directory permissions (need sudo)..."
    sudo chown -R $USER:$USER storage bootstrap/cache public/build node_modules
fi

# Cleanup function to kill both servers on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}
trap cleanup INT TERM

echo "🚀 Starting Zero-Bot.net locally..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Start PHP backend
php artisan serve --host=127.0.0.1 --port=8000 &
BACKEND_PID=$!
echo "✅ Backend  → http://127.0.0.1:8000"

# Start Vite frontend (HMR)
pnpm dev &
FRONTEND_PID=$!
echo "✅ Frontend → http://localhost:5173 (Vite HMR)"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "👤 Login: admin / admin123"
echo "🌐 Open:  http://127.0.0.1:8000"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Press Ctrl+C to stop both servers."
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
