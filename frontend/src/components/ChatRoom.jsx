// src/components/ChatRoom.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CustomNavbar from "../shared/Navbar";
import { Container, Card, Form, Button, Image } from "react-bootstrap";
import EmojiPicker from "emoji-picker-react";
import "./ChatRoom.css";

const ChatRoom = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { receiverId } = useParams();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [attachment, setAttachment] = useState(null);
  const messagesEndRef = useRef(null);
  const [allUsers, setAllUsers] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setAllUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Get logged-in user
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const getUserName = (id) => {
    const userObj = allUsers.find((u) => u.id === parseInt(id));
    return userObj ? userObj.full_name : "User";
  };

  const getUserPic = (id) => {
    const userObj = allUsers.find((u) => u.id === parseInt(id));
    return userObj ? userObj.profile_picture : "User";
  };

  // Fetch messages
  const fetchMessages = async () => {
    if (!user) return;
    try {
      const response = await axios.get(`${API_URL}/chat/messages/user_chat/`, {
        params: { user1: user.id, user2: receiverId },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMessages(response.data);
      scrollToBottom();
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !attachment) return;

    const formData = new FormData();
    formData.append("sender", user.id);
    formData.append("receiver", receiverId);
    formData.append("message", newMessage);
    if (attachment) formData.append("attachment", attachment);

    try {
      await axios.post(`${API_URL}/chat/messages/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNewMessage("");
      setAttachment(null);
      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch messages periodically
  useEffect(() => {
    if (user) fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [user, receiverId]);

  // Handle emoji click
  const onEmojiClick = (emojiData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
  };

  return (
    <>
      <CustomNavbar />
      <img
        src="/images/carr.png" // put your gif in public folder
        alt="cute car"
        className="moving-car"
      />
      <Container className="chat-container mt-4">
        <Card className="chat-card shadow">
          {/* Header */}
          <Card.Header className="chat-header d-flex align-items-center">
            <Image
              src={getUserPic(receiverId)}
              roundedCircle
              className="me-2"
              style={{ width: "45px", height: "45px", objectFit: "cover" }}
            />
            <div className="fw-bold">{getUserName(receiverId)}</div>
          </Card.Header>

          {/* Messages */}
          <Card.Body className="chat-body">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender === user.id ? "sent" : "received"}`}
              >
                {msg.attachment && (
                  <div className="attachment mb-1">
                    {msg.attachment.match(/\.(jpeg|jpg|png|gif)$/) ? (
                      <Image src={`${API_URL}${msg.attachment}`} className="attachment-img" />
                    ) : (
                      <a href={`${API_URL}${msg.attachment}`} target="_blank" rel="noreferrer">
                        View Attachment
                      </a>
                    )}
                  </div>
                )}
                {msg.message && <div className="text">{msg.message}</div>}
                <div className="timestamp">
                  {msg.timestamp
                    ? new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </Card.Body>

          {/* Input */}
          <Card.Footer className="chat-input p-3">
            <Form onSubmit={sendMessage} className="d-flex gap-2 align-items-center position-relative">
              <Button
                variant="light"
                className="emoji-btn"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                😊
              </Button>
              {showEmojiPicker && (
                <div className="emoji-picker-container" style={{ position: "absolute", bottom: "60px", left: "10px", zIndex: 1000 }}>
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
              )}
              <Form.Control
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="rounded-pill"
              />
              <Form.Control
                type="file"
                onChange={(e) => setAttachment(e.target.files[0])}
                className="form-control-file"
              />
              <Button type="submit" className="btn-send rounded-pill">
                Send
              </Button>
            </Form>
            {attachment && <small className="text-muted mt-1 d-block">Selected: {attachment.name}</small>}
          </Card.Footer>
        </Card>
      </Container>
    </>
  );
};

export default ChatRoom;
