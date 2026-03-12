#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
BACKEND_LOG="$ROOT/backend.log"
FRONTEND_LOG="$ROOT/frontend.log"

echo "Working dir: $ROOT"

echo "Starting backend... (logs -> $BACKEND_LOG)"
cd "$ROOT/backend"
mvn -DskipTests spring-boot:run > "$BACKEND_LOG" 2>&1 &
BACKEND_PID=$!

echo "Starting frontend... (logs -> $FRONTEND_LOG)"
cd "$ROOT/frontend"
if [ ! -d "node_modules" ]; then
  echo "Installing frontend dependencies..."
  npm install --no-audit --no-fund
fi
npm run dev > "$FRONTEND_LOG" 2>&1 &
FRONTEND_PID=$!

echo "Backend PID=$BACKEND_PID, Frontend PID=$FRONTEND_PID"

trap 'echo "Stopping..."; kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true; exit 0' INT TERM

echo "Tailing logs (press Ctrl-C to stop). Backend then Frontend logs will appear below."
tail -n +1 -f "$BACKEND_LOG" "$FRONTEND_LOG"
