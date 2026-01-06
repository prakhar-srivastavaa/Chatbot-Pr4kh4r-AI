@echo off
echo Starting Pr4kh4r AI Chatbot...
echo.

REM Start backend server in a new window
echo [1/2] Starting OAuth backend server (port 3031)...
start "OAuth Backend" cmd /k "node server.js"

REM Wait a moment for backend to start
timeout /t 2 /nobreak > nul

REM Start frontend dev server
echo [2/2] Starting frontend dev server (port 3030)...
npm run dev

echo.
echo Both servers are running!
echo Frontend: http://localhost:3030
echo Backend: http://localhost:3031
echo.
pause
