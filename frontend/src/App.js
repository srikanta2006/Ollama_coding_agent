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
  const [pastChats, setPastChats] = useState(() => {
    const saved = localStorage.getItem("zapAiPastChats");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentChatId, setCurrentChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [backendReady, setBackendReady] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    let interval;
    if (!backendReady) {
      interval = setInterval(async () => {
        try {
          const res = await fetch("http://127.0.0.1:8000/");
          if (res.ok) {
            setBackendReady(true);
          }
        } catch (e) {
          // Keep polling
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [backendReady]);

  useEffect(() => {
    if (chat.length === 0) return;

    setPastChats((prev) => {
      let updated;
      if (!currentChatId) {
        const newId = Date.now().toString();
        setCurrentChatId(newId);
        updated = [{ id: newId, title: chat[0].text, messages: chat }, ...prev];
      } else {
        updated = prev.map((c) =>
          c.id === currentChatId ? { ...c, messages: chat } : c
        );
      }
      localStorage.setItem("zapAiPastChats", JSON.stringify(updated));
      return updated;
    });
  }, [chat, currentChatId]);

  const handleNewChat = () => {
    setChat([]);
    setCurrentChatId(null);
  };

  const loadChat = (chatItem) => {
    setCurrentChatId(chatItem.id);
    setChat(chatItem.messages);
  };

  const deleteChat = (e, chatId) => {
    e.stopPropagation();
    setPastChats((prev) => {
      const updated = prev.filter((c) => c.id !== chatId);
      localStorage.setItem("zapAiPastChats", JSON.stringify(updated));
      return updated;
    });
    if (currentChatId === chatId) {
      setChat([]);
      setCurrentChatId(null);
    }
  };

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
      {!backendReady && (
        <div className="loading-overlay">
          <div className="typing" style={{ justifyContent: "center", marginBottom: "24px" }}>
            <span style={{ width: "12px", height: "12px" }}></span>
            <span style={{ width: "12px", height: "12px" }}></span>
            <span style={{ width: "12px", height: "12px" }}></span>
          </div>
          <h2>Connecting to server...</h2>
          <p>Initializing AI environment and loading models.</p>
        </div>
      )}
      {/* Sidebar */}

      <aside className="sidebar">
        <div className="logo">
          🤖 Zap AI
        </div>

        <button className="new-chat-btn" onClick={handleNewChat}>
          + New Chat
        </button>

        {pastChats.length > 0 && (
          <div className="sidebar-section">
            <p className="section-title">Recent Chats</p>
            {pastChats.map(c => (
              <div 
                key={c.id} 
                className={`history-item ${c.id === currentChatId ? 'active' : ''}`}
                onClick={() => loadChat(c)}
              >
                <span>{c.title.length > 22 ? c.title.substring(0, 22) + '...' : c.title}</span>
                <button 
                  className="delete-btn" 
                  onClick={(e) => deleteChat(e, c.id)}
                  title="Delete Chat"
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        )}
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
