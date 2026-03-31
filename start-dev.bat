@echo off
REM PrelovedPH Marketplace - Development Server Startup Guide

echo.
echo 🚀 Starting PrelovedPH Marketplace...
echo.

echo Starting Backend Server (Port 5000)...
start cmd /k "npm start"

timeout /t 2 /nobreak

echo.
echo Starting Frontend Dev Server (Port 3000)...
cd frontend\public
start cmd /k "npm run dev"

echo.
echo ✅ Servers started!
echo.
echo 📱 Frontend: http://localhost:3000
echo 🔌 Backend:  http://localhost:5000
echo 📊 API:      http://localhost:5000/api
echo.
echo Open http://localhost:3000 in your browser
