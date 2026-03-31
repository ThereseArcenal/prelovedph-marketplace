#!/bin/bash

# PrelovedPH Marketplace - Development Server Startup Guide

echo "🚀 Starting PrelovedPH Marketplace..."
echo ""
echo "Starting Backend Server (Port 5000)..."
cd "$(dirname "$0")"
npm start &
BACKEND_PID=$!

echo ""
echo "Starting Frontend Dev Server (Port 3000)..."
cd frontend/public
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Servers started!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔌 Backend:  http://localhost:5000"
echo "📊 API:      http://localhost:5000/api"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait
