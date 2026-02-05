import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import Logo from "../assets/logo.png";
import ImageSlideshow from "../components/ImageSlideshow";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { register as apiRegister } from "../../services/authService.js";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await apiRegister({
        username,
        email,
        phone,
        password,
        password2,
      });
      if (!result.success) {
        setError(result.error);
        return;
      }
      navigate("/login");
    } catch (err) {
      setError("Network error. Is the backend running on port 8000?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-left">
       <ImageSlideshow>
  <div className="slideshow-content">
    <img src={Logo} alt="Logo" className="logo" />
    <h1>Get Started with Us</h1>
    <p>Secured Banking Services</p>
    <div className="social-icons">
      <FaFacebookF />
      <FaInstagram />
      <FaWhatsapp />
    </div>
  </div>
</ImageSlideshow>

      </div>

      <div className="login-right">
        <form className="auth-card" onSubmit={handleSubmit}>
          <h2>Create Account</h2>

          {error && <p className="auth-error">{error}</p>}

          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Phone Number</label>
          <input
            type="tel"
            placeholder="e.g. 024xxxxxxx"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
          />

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Creating account…" : "Register"}
          </button>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
