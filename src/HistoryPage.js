import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style/ChatPage.css";
import "./style/history.css";

const sampleData = [
  { question: "Hi, what is the weather?", answer: "The weather is sunny." },
  { question: "Hi, what is my location?", answer: "You are in New York." },
  {
    question: "Hi, what is the temperature?",
    answer: "The temperature is 25°C.",
  },
  { question: "Hi, how are you?", answer: "I am fine, thank you!" },
];

function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [predefined, SetpreDefined] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("chats") || "[]");
    setHistory(saved);
  }, []);

  const handleAsk = (e) => {
    e.preventDefault();
    SetpreDefined(false);
    if (!input.trim()) return;

    const userMsg = {
      text: input,
      sender: "user",
      time: getCurrentTime(),
    };

    const found = sampleData.find((item) => item.question === input.trim());
    const aiMsg = {
      text: found ? found.answer : "Sorry, Did not understand your query!",
      sender: "ai",
      liked: null,
      image: "/images/ai.png",
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput("");
  };

  // thumbs up / down
  const handleThumbs = (index, like) => {
    setMessages((prev) =>
      prev.map((msg, i) => (i === index ? { ...msg, liked: like } : msg))
    );
  };

  const handleSave = () => {
    const saved = JSON.parse(localStorage.getItem("chats") || "[]");
    saved.push({ messages, rating, feedbackText, date: new Date() });
    localStorage.setItem("chats", JSON.stringify(saved));
    setHistory(saved);
    navigate("/history");
  };

  const handleSampleClick = (item) => {
    SetpreDefined(false);
    const userMsg = {
      text: item.question,
      sender: "user",
      time: getCurrentTime(),
    };
    const aiMsg = {
      text: item.answer,
      sender: "ai",
      liked: null,
      image: "/images/ai.png",
      time: getCurrentTime(),
    };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput("");
  };

  return (
    <div className="chat-container">
      {/* Left Sidebar */}
      <div className={`chat-history ${showHistory ? "openBar" : "closeBar"} `}>
        <Link to="/" className="new-chat-link">
          <img src={"./botai-logo.png"} alt="logo" width={32} height={32} />
          <span
            onClick={() => {
              setShowHistory(false);
            }}
          >
            New Chat
          </span>
          <img src={"./write.png"} alt="logo" width={32} height={32} />
          <span
            onClick={() => {
              setShowHistory(false);
            }}
          >
            {showHistory && "✖"}
          </span>
        </Link>

        <h3 className="past">
          <Link to="/history" className="history-link">
            Past Conversations
          </Link>
        </h3>

        {history.map((chat, idx) => (
          <div
            key={idx}
            className="history-item"
            onClick={() => setMessages(chat.messages)}
          >
            <p>{chat.messages[0]?.text}</p>
            <small>{new Date(chat.date).toLocaleString()}</small>
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        <header className="header">
          <button
            className="menu-toggle"
            onClick={() => setShowHistory((prev) => !prev)}
          >
            <span className="bar">{showHistory ? "✖" : "☰"}</span>
          </button>
          <h1>Bot AI</h1>
        </header>

        {predefined && (
          <div className="chat-header">
            <h2 className="title">Conversation History</h2>
          </div>
        )}
        <h3 className="chats-title">Today's Chats</h3>
        {history.length === 0 ? (
          <p>No conversations found.</p>
        ) : (
          history.map((chat, idx) => (
            <div key={idx} className="history-chat">
              <div className="messages">
                {chat.messages.map((msg, i) => (
                  <p key={i}>
                    <strong>
                      {msg.sender === "user" ? (
                        <div className="you-message message">
                          <img
                            src={"./me.png"}
                            alt="our image"
                            width={30}
                            height={30}
                          />
                          <span>You</span>
                        </div>
                      ) : (
                        <div className="Ai-message message">
                          <img
                            src={"./botai-logo.png"}
                            alt="AI illustration"
                            width={30}
                            height={30}
                          />
                          <span>Soul AI</span>
                        </div>
                      )}
                    </strong>
                    <div className="history-msg">
                      <p> {msg.text}</p>
                      <div className="chat-time">{msg.time}</div>
                    </div>
                    {msg.sender === "ai" && msg.liked !== null && (
                      <span> {msg.liked ? "👍" : "👎"}</span>
                    )}
                  </p>
                ))}
              </div>
            </div>
          ))
        )}

        <div className="chat-messages">
          {history.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.sender}`}>
              <div className="msg-title">
                {msg.sender === "ai" ? (
                  <div className="Ai-message message">
                    <img
                      src={"./botai-logo.png"}
                      alt="AI illustration"
                      width={30}
                      height={30}
                    />
                    <span>Soul AI</span>
                  </div>
                ) : (
                  <div className="you-message message">
                    <img
                      src={"./me.png"}
                      alt="our image"
                      width={30}
                      height={30}
                    />
                    <span>You</span>
                  </div>
                )}
              </div>

              <p>{msg.text}</p>

              {msg.sender === "ai" && (
                <div className="thumbs">
                  <button
                    type="button"
                    className={`thumb ${msg.liked === true ? "liked" : ""}`}
                    onClick={() => handleThumbs(i, true)}
                  >
                    👍
                  </button>
                  <button
                    type="button"
                    className={`thumb ${msg.liked === false ? "disliked" : ""}`}
                    onClick={() => handleThumbs(i, false)}
                  >
                    👎
                  </button>
                </div>
              )}

              <div className="msg-time">{msg.time}</div>
            </div>
          ))}
        </div>

        <form className="chat-input" onSubmit={handleAsk}>
          <input
            type="text"
            placeholder="Message Bot AI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">Ask</button>
          <button type="button" onClick={handleSave}>
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
