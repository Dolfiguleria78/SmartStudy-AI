import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const ChatPage = () => {
  const { tripId } = useParams();

  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");

  const token = localStorage.getItem("token");

  // Decode user id from JWT (base64url-safe)
  const decodeTokenId = (tok) => {
    if (!tok) return null;
    try {
      const payload = tok.split(".")[1];
      if (!payload) return null;
      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      const json = atob(base64);
      const decoded = JSON.parse(json);
      return decoded?.id ?? null;
    } catch {
      return null;
    }
  };

  const myUserId = decodeTokenId(token);

  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/chat/${tripId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages(res.data.messages);
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async () => {
    if (!content.trim()) return;

    try {
      await axios.post(
        `${API_BASE_URL}/api/chat/send/${tripId}`,
        { content },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setContent("");
      fetchMessages();
    } catch (error) {
      console.log(error);
    }
  };

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Polling (refresh every 2 sec)
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [tripId]);

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-3">💬 Trip Chat</h3>

      {/* Chat Box */}
      <div
        className="border rounded p-3 mb-3"
        style={{ height: "400px", overflowY: "auto", background: "#f8f9fa" }}
      >
        {messages.map((msg) => {
          const isMe = myUserId && msg.senderId._id === myUserId;

          return (
            <div
              key={msg._id}
              className={`d-flex mb-2 ${
                isMe ? "justify-content-end" : "justify-content-start"
              }`}
            >
              <div
                className={`p-2 rounded ${
                  isMe ? "bg-primary text-white" : "bg-light"
                }`}
                style={{ maxWidth: "60%" }}
              >
                {!isMe && (
                  <small className="fw-bold">
                    {msg.senderId.name}
                  </small>
                )}
                <div>{msg.content}</div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="d-flex">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Type message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button className="btn btn-primary" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;