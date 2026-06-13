Write-Host "Starting backend server..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\venv\Scripts\python -m uvicorn api:app --reload --port 8000"

Write-Host "Starting frontend server..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm start"

Write-Host "Both servers are starting in new windows."
