import React, { useState } from "react";
import "./LoginScreen.css";
import axios from "axios";
import { API_BASE_URL } from "../config";

function LoginScreen({ onLogin, onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
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

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, formData);
      
      if (response.data.success) {
        localStorage.setItem('userToken', 'authenticated');
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        onLogin(response.data.user);
      } else {
        setError("Giriş başarısız. Bilgilerinizi kontrol edin.");
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
          <h1 className="login-title">Hoş Geldiniz</h1>
          <p className="login-subtitle">Devam etmek için giriş yapın</p>
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
              placeholder="Şifrenizi girin"
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
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <div className="login-footer">
          <p className="footer-text">
            Hesabınız yok mu? 
            <span className="footer-link" onClick={onSwitchToRegister}> Kayıt Ol</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen; 