import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./App.css";

function CodeBlock({ inline, className, children }) {
  const match = /language-(\w+)/.exec(className || "");
  const code = String(children).replace(/\n$/, "");

  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  if (!inline && match) {
    return (
      <div className="code-block-wrapper">
        <div className="code-header">
          <span>{match[1]}</span>

          <button onClick={copyCode}>
            Copy
          </button>
        </div>

        <SyntaxHighlighter
          language={match[1]}
          style={oneDark}
          PreTag="div"
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );
  }

  return (
    <code className="inline-code">
      {children}
    </code>
  );
}

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  const suggestions = [
    "Explain Binary Search",
    "Generate React Interview Questions",
    "Teach Dynamic Programming",
    "Solve Leetcode Two Sum",
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chat, loading]);

  const sendMessage = async (
    customMessage = null
  ) => {
    const text =
      customMessage || message;

    if (!text.trim()) return;

    const userMessage = {
      sender: "user",
      text,
      time: new Date().toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      ),
    };

    const updatedChat = [
      ...chat,
      userMessage,
    ];

    setChat(updatedChat);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/ask",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            prompt: text,
          }),
        }
      );

      const data = await res.json();

      const aiMessage = {
        sender: "ai",
        text:
          data.response ||
          "No response received.",
        time: new Date().toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        ),
      };

      setChat([
        ...updatedChat,
        aiMessage,
      ]);
    } catch (error) {
      setChat([
        ...updatedChat,
        {
          sender: "ai",
          text:
            "⚠ Unable to connect to backend.",
          time: new Date().toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          ),
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="app">
      {/* Sidebar */}

      <aside className="sidebar">
        <div className="logo">
          🤖 Zap AI
        </div>

        <button className="new-chat-btn">
          + New Chat
        </button>

        <div className="sidebar-section">
          <p className="section-title">
            Recent Chats
          </p>

          <div className="history-item">
            ⚛ React Interview
          </div>

          <div className="history-item">
            🌳 Binary Trees
          </div>

          <div className="history-item">
            ☁ System Design
          </div>

          <div className="history-item">
            🐍 Python Debugging
          </div>
        </div>
      </aside>

      {/* Main Content */}

      <main className="main-content">
        {chat.length === 0 ? (
          <div className="hero">
            <div className="hero-icon">
              🤖
            </div>

            <h1>Zap AI</h1>

            <p>
              Your Coding Interview
              Assistant
            </p>

            <div className="prompt-grid">
              {suggestions.map(
                (prompt) => (
                  <div
                    key={prompt}
                    className="prompt-card"
                    onClick={() =>
                      sendMessage(
                        prompt
                      )
                    }
                  >
                    {prompt}
                  </div>
                )
              )}
            </div>
          </div>
        ) : (
          <div className="chat-container">
            {chat.map(
              (msg, index) => (
                <div
                  key={index}
                  className={`message ${msg.sender}`}
                >
                  <div className="avatar">
                    {msg.sender ===
                    "user"
                      ? "🧑"
                      : "🤖"}
                  </div>

                  <div className="message-content">
                    <div className="bubble">
                      {msg.sender ===
                      "ai" ? (
                        <ReactMarkdown
                          components={{
                            code: CodeBlock,
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      ) : (
                        msg.text
                      )}
                    </div>

                    <div className="timestamp">
                      {msg.time}
                    </div>
                  </div>
                </div>
              )
            )}

            {loading && (
              <div className="message ai">
                <div className="avatar">
                  🤖
                </div>

                <div className="bubble typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            <div ref={chatEndRef}></div>
          </div>
        )}

        {/* Input */}

        <div className="input-wrapper">
          <button className="icon-btn">
            📎
          </button>

          <input
            type="text"
            placeholder="Ask anything about coding..."
            value={message}
            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }
            onKeyDown={(e) => {
              if (
                e.key === "Enter"
              ) {
                sendMessage();
              }
            }}
          />

          <button className="icon-btn">
            🎤
          </button>

          <button
            className="send-btn"
            onClick={() =>
              sendMessage()
            }
          >
            🚀
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
