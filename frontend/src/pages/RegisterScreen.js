import React, { useState } from "react";
import "./LoginScreen.css";
import axios from "axios";
import { API_BASE_URL } from "../config";

function RegisterScreen({ onRegister, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        username: formData.username,
        password: formData.password
      });
      
      if (response.data.success) {
        localStorage.setItem('userToken', 'authenticated');
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        onRegister(response.data.user);
      } else {
        setError("Kayıt başarısız. Lütfen tekrar deneyin.");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen-bg">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">
            <div className="login-logo-circle"></div>
          </div>
          <h1 className="login-title">Kayıt Ol</h1>
          <p className="login-subtitle">Yeni hesap oluşturun</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Kullanıcı Adı</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="login-input"
              placeholder="Kullanıcı adınızı girin"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Şifre</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="login-input"
              placeholder="Şifrenizi girin (en az 6 karakter)"
              required
              minLength={6}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Şifre Tekrar</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="login-input"
              placeholder="Şifrenizi tekrar girin"
              required
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className={`login-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? "Kayıt Olunuyor..." : "Kayıt Ol"}
          </button>
        </form>

        <div className="login-footer">
          <p className="footer-text">
            Zaten hesabınız var mı? 
            <span className="footer-link" onClick={onSwitchToLogin}> Giriş Yap</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterScreen; 