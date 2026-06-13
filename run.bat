@echo off
echo Starting backend server...
start cmd /k "cd backend && venv\Scripts\python -m uvicorn api:app --reload --port 8000"

echo Starting frontend server...
start cmd /k "cd frontend && npm start"

echo Both servers are starting in new windows.
