import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import Logo from "../assets/logo.png";
import ImageSlideshow from "../components/ImageSlideshow";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { login as apiLogin, setStoredUser } from "../../services/authService.js";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await apiLogin(email, password);
      if (!result.success) {
        setError(result.error);
        setLoading(false);
        return;
      }
      if (result.user) setStoredUser(result.user);
      setLoading(false);
      navigate("/dashboard");
    } catch (err) {
      setError("Network error. Is the backend running on port 8000?");
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      {loading && (
        <div className="page-spinner-overlay" aria-hidden="false" aria-busy="true">
          <div className="page-spinner" />
          <span className="page-spinner-text">Logging in…</span>
        </div>
      )}
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
          <h2>Welcome Back</h2>

          {error && <p className="auth-error">{error}</p>}

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in…" : "Login"}
          </button>

          <p className="auth-footer">
            Don’t have an account? <Link to="/">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
