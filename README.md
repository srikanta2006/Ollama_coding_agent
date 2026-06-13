# Zap AI - Intelligent Coding Assistant

Zap AI is a full-stack, locally-hosted AI coding companion designed to provide developers with instant programming assistance. Powered by a fine-tuned TinyLlama model, it offers a secure, offline alternative to cloud-based APIs without compromising on the user experience.

---

## 🏗️ Architecture & Tech Stack

The application is built on a decoupled, modern architecture:

### Frontend (Client Layer)
- **Framework:** React.js
- **Styling:** Custom CSS with a premium Dark Mode, Glassmorphism elements, and smooth micro-animations.
- **Typography:** `Inter` for UI clarity and `JetBrains Mono` for developer-friendly code blocks.
- **Key Libraries:** `react-markdown` (for parsing AI output), `react-syntax-highlighter` (for IDE-like code rendering).

### Backend (AI / Server Layer)
- **Framework:** Python / FastAPI
- **Server:** Uvicorn (ASGI)
- **Machine Learning Core:** PyTorch (`torch`) and Hugging Face Transformers (`transformers`).
- **Model:** A locally loaded `tinyllama-coding-model` using `AutoModelForCausalLM` and `AutoTokenizer`.

---

## ✨ Key Features

- **Premium UI/UX:** A stunning, industry-grade interface featuring frosted glass sidebars, dynamic hover states, glowing gradients, and animated typing indicators.
- **Persistent Chat History:** Conversations are automatically saved to browser `localStorage`. Users can seamlessly switch between past sessions, start new chats, or delete individual history records.
- **Smart Connection Polling:** A dynamic "Connecting to server..." overlay gracefully handles backend startup latency by pinging the FastAPI server every 2 seconds until the LLM is fully loaded into memory.
- **Unified CI/CD Pipeline:** A custom `package.json` setup automates the installation of Node modules, Python virtual environments, and PyTorch dependencies simultaneously.
- **Code Highlighting & Extraction:** AI responses containing code are automatically formatted into isolated blocks with one-click "Copy" functionality.

---

## 🛠️ Installation & Setup

### Prerequisites
Before installing, ensure your machine has the following:
- **Node.js** (v14+ recommended)
- **npm** (Node Package Manager)
- **Python 3.8+** (Added to your System PATH)

### Automated Pipeline Setup
We have engineered a unified setup script to configure the entire environment with a single command. 

From the root directory, run:
```bash
npm run setup
```

**What this script does in the background:**
1. Installs the root dependencies (like `concurrently`).
2. Navigates to the frontend and installs React dependencies.
3. Provisions a Python Virtual Environment (`venv`) in the `/backend` folder.
4. Uses `pip` to securely install all Machine Learning and Server dependencies listed in `backend/requirements.txt`.

---

## 🚀 Running the Application

You can spin up both the React frontend and the FastAPI backend simultaneously using the integrated launcher.

### Recommended Method (All Platforms)
From the root directory, run:
```bash
npm start
```
*This uses `concurrently` to run both services in the exact same terminal window, prefixing the output for easy monitoring.*

### Alternative Methods (Windows)
If you prefer separate console windows for your services, you can use the native scripts provided in the root directory:
- **Batch Script:** Double-click `run.bat` or execute `.\run.bat` in the command line.
- **PowerShell:** Execute `.\run.ps1` from your PowerShell terminal.

---

## 📂 Project Structure

```text
Ollama_coding_agent/
├── backend/
│   ├── tinyllama-coding-model/   # The locally fine-tuned LLM
│   ├── venv/                     # Python virtual environment (generated during setup)
│   ├── api.py                    # Core FastAPI server and LLM inference engine
│   ├── train.py                  # Model training/fine-tuning script
│   └── requirements.txt          # Python dependencies
├── frontend/
│   ├── public/                   # Static assets and index.html
│   ├── src/
│   │   ├── App.js                # Main React logic, LocalStorage handling, API polling
│   │   └── App.css               # Premium design system and animations
│   └── package.json              # React dependencies
├── package.json                  # Root configurations and pipeline scripts
├── run.bat                       # Windows Command Prompt launcher
└── run.ps1                       # Windows PowerShell launcher
```
