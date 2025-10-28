import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import CustomNavbar from "../shared/Navbar";
import { Modal, Button, Alert, Spinner } from "react-bootstrap";
import MinionMotion from "../components/MinionMotion";
import FallingMinions from "../components/FallingMinions"; // 💛 new import

function Login() {
  const [email, setEmail] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState("danger");
  const [alertMessage, setAlertMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [resetModalError, setResetModalError] = useState("");
  const [otpModalError, setOtpModalError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFalling, setShowFalling] = useState(false); // 🎉 animation state
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!email) {
      errors.email = "Email is required.";
      isValid = false;
    }
    if (!password) {
      errors.password = "Password is required.";
      isValid = false;
    }
    setFieldErrors(errors);
    return isValid;
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter.");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter.");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number.");
    }
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character.");
    }
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/users/login/`, {
        email: email,
        password: password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setMessage("Login successful!");

        // 🎉 Show falling minions before navigating
        setShowFalling(true);

        // Delay navigation for 2 seconds
        setTimeout(() => navigate("/dashboard"), 2000);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errors = error.response.data;
        let errorMessages = "";
        for (const key in errors) {
          if (errors.hasOwnProperty(key)) {
            errorMessages += `${key}: ${errors[key]}\n`;
          }
        }
        setAlertMessage(errorMessages);
        setAlertVariant("danger");
        setShowAlert(true);
      } else {
        setAlertMessage("Error during login");
        setAlertVariant("danger");
        setShowAlert(true);
      }
      console.error(
        "Login error:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordResetRequest = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/users/password-reset/`, {
        email: resetEmail,
      });
      setAlertVariant("success");
      setAlertMessage(response.data.message);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 20000);
      setShowResetModal(false);
      setShowOtpModal(true);
    } catch (error) {
      if (error.response && error.response.data) {
        setResetModalError(error.response.data.error);
      } else {
        setResetModalError("Error during password reset request");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordResetConfirm = async () => {
    setLoading(true);
    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      setOtpModalError(passwordErrors.join(" "));
      setLoading(false);
      return;
    }
    if (!otp) {
      setOtpModalError("OTP is required.");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}/api/users/password-reset-confirm/`,
        {
          email: resetEmail,
          otp: otp,
          new_password: newPassword,
        }
      );
      setAlertVariant("success");
      setAlertMessage(response.data.message);
      setShowAlert(true);
      setShowOtpModal(false);
    } catch (error) {
      if (error.response && error.response.data) {
        setOtpModalError(error.response.data.error);
      } else {
        setOtpModalError("Error during password reset confirmation");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CustomNavbar className="fixed-top" />
      <div
  className="d-flex flex-column flex-md-row justify-content-center align-items-center"
  style={{
    minHeight: "calc(100vh - 150px)",
    paddingTop: "80px",
    paddingBottom: "50px",
    padding: "15px",
    background: "linear-gradient(120deg, #fdfbfb, #ebedee)",
  }}
>

        {/* Left side - Minions */}
        <div
  className="d-flex justify-content-center justify-content-md-end mb-4 mb-md-0"
  style={{ marginRight: "0" }}
>
  <MinionMotion isTyping={isTyping} />
</div>


        {/* Login Form */}
        <div
  className="card p-4 shadow-lg w-100"
  style={{
    maxWidth: "400px",
    borderRadius: "15px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    margin: "0 10px",
  }}
>

          <h2 className="mb-4 text-center">Login</h2>
          {showAlert && (
            <Alert
              variant={alertVariant}
              onClose={() => setShowAlert(false)}
              dismissible
            >
              {alertMessage}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-100 btn btn-primary"
              style={{
                backgroundColor: "#6a38c2",
                border: "none",
                borderRadius: "25px",
                padding: "10px 20px",
                transition: "background-color 0.3s ease, transform 0.3s ease",
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" /> Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>

            {message && <p className="mt-3 text-center">{message}</p>}

            <div className="mt-3 text-center">
              <span>Don't have an account? </span>
              <a href="/signup" className="text-primary" style={{ textDecoration: "none", fontWeight: "bold" }}>
                Signup
              </a>
            </div>

            <div className="mt-3 text-center">
              <a
                href="#"
                className="text-primary"
                style={{ textDecoration: "none", fontWeight: "bold" }}
                onClick={() => setShowResetModal(true)}
              >
                Forgot Password?
              </a>
            </div>
          </form>
        </div>
      </div>

      {/* 🎉 Falling Minions Animation */}
      {showFalling && <FallingMinions count={120} />}

      {/* Reset & OTP Modals (same as before) */}
      <Modal show={showResetModal} onHide={() => setShowResetModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Password Reset</Modal.Title></Modal.Header>
        <Modal.Body>
          {resetModalError && <Alert variant="danger">{resetModalError}</Alert>}
          <div className="form-group">
            <label htmlFor="resetEmail" className="form-label">Enter your email:</label>
            <input
              type="email"
              className="form-control"
              id="resetEmail"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResetModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handlePasswordResetRequest} disabled={loading}>
            {loading ? <Spinner as="span" animation="border" size="sm" /> : "Submit"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showOtpModal} onHide={() => setShowOtpModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Enter OTP</Modal.Title></Modal.Header>
        <Modal.Body>
          {otpModalError && <Alert variant="danger">{otpModalError}</Alert>}
          <div className="form-group mb-3">
            <label htmlFor="otp" className="form-label">OTP</label>
            <input
              type="text"
              className="form-control"
              id="otp"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="newPassword" className="form-label">New Password</label>
            <input
              type="password"
              className="form-control"
              id="newPassword"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOtpModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handlePasswordResetConfirm} disabled={loading}>
            {loading ? <Spinner as="span" animation="border" size="sm" /> : "Reset Password"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Login;
