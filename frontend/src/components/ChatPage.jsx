// src/components/ChatPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomNavbar from "../shared/Navbar";
import { Container, Card, ListGroup, Image, Badge } from "react-bootstrap";
import "./ChatPage.css"; // Add this CSS file

const ChatPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [partners, setPartners] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

const fetchPartners = async () => {
  if (!user) return;

  try {
    const [partnersRes, unreadRes] = await Promise.all([
      axios.get(`${API_URL}/chat/messages/user_chats/`, {
        params: { user_id: user.id },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }),
      axios.get(`${API_URL}/chat/messages/unread_count/`, {
        params: { user_id: user.id },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }),
    ]);

    const unreadCounts = unreadRes.data;

    // 🔥 ADD THIS PART
    const updatedPartners = await Promise.all(
      partnersRes.data.map(async (p) => {
        try {
          const emailEncoded = encodeURIComponent(p.email);

          const res = await fetch(
            `${API_URL}/api/users/profile-picture/${emailEncoded}/`
          );

          const data = await res.json();

          return {
            ...p,
            profile_picture: data.profile_picture
              ? `${API_URL}${data.profile_picture}`
              : null,
            unread_count: unreadCounts[p.id] || 0,
          };
        } catch {
          return {
            ...p,
            profile_picture: null,
            unread_count: unreadCounts[p.id] || 0,
          };
        }
      })
    );

    setPartners(updatedPartners);
  } catch (error) {
    console.error("Error fetching chat partners:", error);
  }
};


  useEffect(() => {
    fetchPartners();
  }, [user]);

  return (
    <>
      <CustomNavbar />
      <Container className="mt-5 chatpage-container">
        <Card className="p-3 shadow chat-card">
          <h3 className="chat-header">💬 Your Chats</h3>
          <ListGroup variant="flush" className="chat-list">
            {partners.length === 0 && (
              <p className="text-center text-muted mt-3">No chats yet</p>
            )}
            {partners.map((partner) => (
              <ListGroup.Item
                key={partner.id}
                action
                className="chat-item d-flex align-items-center"
                onClick={() => navigate(`/chat/${partner.id}`)}
              >
                <Image
  src={
    partner.profile_picture
      ? partner.profile_picture
      : `https://ui-avatars.com/api/?name=${partner.full_name}&background=6A38C2&color=fff`
  }
  roundedCircle
  className="me-3 chat-avatar"
/>
                <div className="chat-info">
                  <div className="chat-name">{partner.full_name || partner.email}</div>
                  {partner.unread_count > 0 && (
                    <Badge bg="danger" pill className="ms-2 unread-badge">
                      {partner.unread_count}
                    </Badge>
                  )}
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      </Container>
    </>
  );
};

export default ChatPage;
