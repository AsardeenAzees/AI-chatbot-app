import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../CSS/Chat.css";
import { marked } from "marked";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false); // ⬅️ Loading state
  const chatRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true); // ⬅️ Start loading

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: input,
      });

      const aiMessage = { type: "ai", text: res.data.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { type: "ai", text: "⚠️ Error fetching response." },
      ]);
    } finally {
      setLoading(false); // ⬅️ Stop loading
    }
  };

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const renderMessage = (msg) => {
    if (msg.type === "user") {
      return <div className="bubble">{msg.text}</div>;
    } else {
      const html = marked.parse(msg.text || "");
      return <div className="bubble" dangerouslySetInnerHTML={{ __html: html }} />;
    }
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-header">AI Chat Assistant 🤖</div>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.type}`}>
            {renderMessage(msg)}
          </div>
        ))}

        {/* ⏳ Typing indicator */}
        {loading && (
          <div className="message ai">
            <div className="bubble typing">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}

        <div ref={chatRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Chat;
