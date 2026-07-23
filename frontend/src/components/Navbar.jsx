import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const profile = JSON.parse(localStorage.getItem('foodhub_profile') || '{}');

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
              {profile.firstName
                ? <span className="nav-avatar">{profile.firstName[0].toUpperCase()}</span>
                : '👤 Profile'
              }
            </Link>
          </li>
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
