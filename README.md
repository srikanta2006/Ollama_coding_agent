# Zap AI - Coding Assistant

Zap AI is a full-stack AI-powered coding assistant application. It features a React frontend and a Python (FastAPI) backend integrated with a TinyLlama-based local AI model (`tinyllama-coding-model`).

## Project Structure

- **`/frontend`**: The React-based chat UI.
- **`/backend`**: The FastAPI server that handles AI requests using a locally fine-tuned language model.

## Prerequisites

Make sure you have the following installed on your system:
- **Node.js** and **npm**
- **Python 3.8+**

## Setup

First, ensure your Python virtual environment in `backend/venv` is correctly configured with all required backend dependencies (like `fastapi`, `uvicorn`, `torch`, `transformers`, etc.).

Then, install the root dependencies which will allow you to run both the frontend and backend concurrently:

```bash
npm install
```

*(Note: You will also need to run `npm install` inside the `frontend` folder if you haven't already).*

## How to Run

You can start both the frontend and backend simultaneously using any of the three provided methods:

### Option 1: Using NPM (Recommended)
From the root directory, simply run:
```bash
npm start
```
This will start both servers in the same terminal window using `concurrently`.

### Option 2: Using the Batch Script (Windows)
Double-click the `run.bat` file in the root directory. This will open two new command prompt windows for the frontend and backend.

### Option 3: Using PowerShell (Windows)
Run the PowerShell script from your terminal:
```powershell
.\run.ps1
```
This will open two new PowerShell windows.

## UI Features

The frontend includes a smart loader that will display a "Connecting to server..." screen and periodically ping the backend. Once the backend server (and its AI model) finishes loading, the chat interface will automatically become available.
