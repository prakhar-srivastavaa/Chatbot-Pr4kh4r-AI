#!/bin/bash

echo "Starting Pr4kh4r AI Chatbot..."
echo ""

# Start backend server in background
echo "[1/2] Starting OAuth backend server (port 3031)..."
node server.js &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start frontend dev server
echo "[2/2] Starting frontend dev server (port 3030)..."
npm run dev

# When frontend stops, also stop backend
kill $BACKEND_PID
