import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const profile = JSON.parse(localStorage.getItem('foodhub_profile') || '{}');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo-link">
          <h2 className="logo">🍔 FoodHub</h2>
        </Link>
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search restaurants, cuisines..."
            className="search-bar"
            onFocus={() => navigate('/')}
            readOnly
          />
        </div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li>
            <Link to="/profile" className="nav-profile-link">
              {user 
                ? <span className="nav-avatar" title={user.name}>{user.name[0].toUpperCase()}</span>
                : (profile.firstName ? <span className="nav-avatar" title={profile.firstName}>{profile.firstName[0].toUpperCase()}</span> : '👤 Profile')
              }
            </Link>
          </li>
          {!user && (
            <li><Link to="/login" style={{ color: 'var(--text-muted)' }}>Login</Link></li>
          )}
          {user && (
            <li><button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem', fontFamily: 'inherit' }}>Logout</button></li>
          )}
          <li>
            <Link to="/checkout" className="cart-icon">
              🛒
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
