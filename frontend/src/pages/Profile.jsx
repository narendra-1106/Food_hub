import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [locating, setLocating] = useState(false);
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

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data && data.display_name) {
            setForm(prev => ({ ...prev, location: data.display_name }));
          } else {
            setForm(prev => ({ ...prev, location: `GPS Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
          }
        } catch {
          setForm(prev => ({ ...prev, location: `GPS Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        alert('Location access permission was denied or unavailable. Please enter address manually.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
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
              {form.firstName ? `Hey, ${form.firstName}! 👋` : 'Complete Your Profile'}
            </h1>
            <p className="profile-subtitle">Set your delivery address & contact details to continue</p>
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
                placeholder="e.g. Jagtap"
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>
                <span className="label-icon">📍</span> Delivery Location / Address *
              </label>
              <button
                type="button"
                onClick={detectLocation}
                disabled={locating}
                className="btn"
                style={{
                  width: 'auto',
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.82rem',
                  background: 'rgba(139, 92, 246, 0.2)',
                  border: '1px solid var(--accent-primary)',
                  color: 'var(--text-main)',
                  borderRadius: '999px',
                  cursor: locating ? 'wait' : 'pointer'
                }}
              >
                {locating ? '🔄 Locating...' : '🎯 Auto-Detect My Location'}
              </button>
            </div>
            <textarea
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Flat 12, Shivaji Nagar, Pune - 411005 (or click Auto-Detect above)"
              className="form-input form-textarea"
              rows={3}
              required
            />
            <p className="form-hint">Click Auto-Detect or enter address manually for fast food delivery</p>
          </div>

          <button type="submit" className={`btn ${saved ? 'btn-success' : 'btn-primary'} profile-save-btn`}>
            {saved ? '✅ Saved! Redirecting...' : 'Save & Continue →'}
          </button>
        </form>

        {/* Loyalty Card */}
        <div className="loyalty-card">
          <div className="loyalty-icon">🏆</div>
          <div>
            <h4>Loyalty Points</h4>
            <p className="loyalty-pts">100 pts</p>
            <p className="loyalty-hint">Earn points with every order & review!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
