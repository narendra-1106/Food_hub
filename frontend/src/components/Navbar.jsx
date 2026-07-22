import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo-link">
          <h2 className="logo">FoodHub Elite</h2>
        </Link>
        <div className="search-bar-container">
          <input type="text" placeholder="Search for restaurants, cuisines..." className="search-bar" />
        </div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/orders">Orders</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li>
            <Link to="/checkout" className="cart-icon">
              🛒 <span className="cart-badge">{totalItems}</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
