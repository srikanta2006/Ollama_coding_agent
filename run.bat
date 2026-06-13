@echo off
echo Starting backend server...
start cmd /k "cd backend && call venv\Scripts\activate.bat && uvicorn api:app --reload --port 8000"

echo Starting frontend server...
start cmd /k "cd frontend && npm start"

echo Both servers are starting in new windows.
