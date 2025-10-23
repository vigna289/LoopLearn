// src/pages/AboutUs.jsx
import React from "react";
import CustomNavbar from "../shared/Navbar";
import { Container, Row, Col, Card, Button, ProgressBar } from "react-bootstrap";
import { FaUsers, FaHandshake, FaLightbulb } from "react-icons/fa";
import teamData from "../data/teamData";

const AboutUs = () => {
  return (
    <>
      <CustomNavbar />

      {/* Hero Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #fcd5ce, #6A38C2)",
          color: "#fff",
          textAlign: "center",
          padding: "80px 20px",
        }}
      >
        <h1 style={{ fontWeight: "bold", fontSize: "3rem" }}>
          About <span style={{ color: "#FFE8D6" }}>SkillBarter</span>
        </h1>
        <p style={{ fontSize: "1.3rem", maxWidth: "700px", margin: "20px auto" }}>
          We are India's premier skill swapping platform, connecting passionate learners
          and professionals to exchange knowledge, grow together, and create opportunities.
        </p>
      </div>

      {/* Mission & Vision */}
      <Container className="my-5">
        <Row className="text-center">
          {[{
            icon: <FaUsers size={50} color="#6A38C2" />,
            title: "Our Mission",
            text: "To empower individuals by enabling seamless skill exchange and personal growth."
          }, {
            icon: <FaHandshake size={50} color="#6A38C2" />,
            title: "Our Vision",
            text: "Build a community where knowledge flows freely, skills flourish, and opportunities abound."
          }, {
            icon: <FaLightbulb size={50} color="#6A38C2" />,
            title: "Our Values",
            text: "Creativity, collaboration, and inclusivity drive everything we do."
          }].map((item, index) => (
            <Col md={4} className="mb-4" key={index}>
              <Card
                className="h-100 shadow-sm border-0 text-center p-4"
                style={{
                  transition: "transform 0.3s, box-shadow 0.3s",
                  cursor: "pointer",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
                }}
              >
                {item.icon}
                <Card.Body>
                  <Card.Title>{item.title}</Card.Title>
                  <Card.Text>{item.text}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Team Section */}
      <div
        style={{
          backgroundColor: "#f9f9f9",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontWeight: "bold", marginBottom: "40px" }}>Meet the Team</h2>
        <Row className="justify-content-center">
          {teamData.map((member, index) => (
            <Col md={3} sm={6} className="mb-4" key={index}>
              <Card
                className="shadow-sm border-0 h-100"
                style={{
                  transition: "transform 0.3s, box-shadow 0.3s",
                  cursor: "pointer",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
                }}
              >
                <Card.Img
                  variant="top"
                  src={member.photo}
                  style={{
                    width: "100%",
                    height: "250px",
                    objectFit: "contain",
                    backgroundColor: "#f0f0f0",
                  }}
                />
                <Card.Body>
                  <Card.Title>{member.name}</Card.Title>
                  <Card.Text>{member.role}</Card.Text>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    href={member.linkedin}
                    target="_blank"
                    style={{ transition: "all 0.3s" }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = "#6A38C2";
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#0d6efd";
                    }}
                  >
                    LinkedIn
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Fun Stats */}
      <Container className="my-5 text-center">
        <h2 style={{ fontWeight: "bold", marginBottom: "40px" }}>Our Impact</h2>
        <Row className="justify-content-center">
          {[{
            value: "500+",
            text: "Active Users",
            now: 70,
            variant: "info"
          }, {
            value: "1200+",
            text: "Skills Exchanged",
            now: 80,
            variant: "success"
          }, {
            value: "100+",
            text: "Successful Connections",
            now: 90,
            variant: "warning"
          }].map((stat, index) => (
            <Col md={4} className="mb-4" key={index}>
              <div
                style={{
                  transition: "transform 0.3s",
                  cursor: "pointer",
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >
                <h4>{stat.value}</h4>
                <p>{stat.text}</p>
                <ProgressBar now={stat.now} animated variant={stat.variant} />
              </div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Call to Action */}
      <div
        style={{
          background: "#6A38C2",
          color: "#fff",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontWeight: "bold" }}>Ready to swap your skills?</h2>
        <p style={{ fontSize: "1.2rem" }}>Join thousands of learners across India today!</p>
        <Button
          style={{
            backgroundColor: "#FFE8D6",
            color: "#6A38C2",
            border: "none",
            transition: "all 0.3s",
          }}
          href="/signup"
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = "#FFD3A5";
            e.currentTarget.style.color = "#4B0082";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = "#FFE8D6";
            e.currentTarget.style.color = "#6A38C2";
          }}
        >
          Get Started
        </Button>
      </div>
    </>
  );
};

export default AboutUs;
