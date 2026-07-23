import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    location: '',
    email: ''
  });

  useEffect(() => {
    const stored = localStorage.getItem('foodhub_profile');
    if (stored) {
      setForm(JSON.parse(stored));
    }
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.firstName || !form.phone || !form.location) {
      alert('Please fill in First Name, Phone, and Delivery Location.');
      return;
    }
    localStorage.setItem('foodhub_profile', JSON.stringify(form));
    setSaved(true);
    setTimeout(() => {
      navigate('/');
    }, 1200);
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            {form.firstName ? form.firstName[0].toUpperCase() : '?'}
          </div>
          <div>
            <h1 className="profile-title">
              {form.firstName ? `Hey, ${form.firstName}! 👋` : 'My Profile'}
            </h1>
            <p className="profile-subtitle">Manage your details for faster checkout</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">👤</span> First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="e.g. Narendra"
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">👤</span> Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="e.g. Sharma"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">📞</span> Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="e.g. +91 98765 43210"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">✉️</span> Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="e.g. you@example.com"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">📍</span> Delivery Location / Address *
            </label>
            <textarea
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Flat 12, Shivaji Nagar, Pune - 411005"
              className="form-input form-textarea"
              rows={3}
              required
            />
            <p className="form-hint">This address will be used for all your orders</p>
          </div>

          <button type="submit" className={`btn ${saved ? 'btn-success' : 'btn-primary'} profile-save-btn`}>
            {saved ? '✅ Saved! Redirecting...' : 'Save Profile'}
          </button>
        </form>

        {/* Loyalty Card */}
        <div className="loyalty-card">
          <div className="loyalty-icon">🏆</div>
          <div>
            <h4>Loyalty Points</h4>
            <p className="loyalty-pts">0 pts</p>
            <p className="loyalty-hint">Earn points with every order & review!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
