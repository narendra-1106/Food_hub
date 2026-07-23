import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../api';

export default function Checkout() {
  const { cart, total, restaurantId, restaurantName, removeFromCart, updateQuantity, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();

  const profile = JSON.parse(localStorage.getItem('foodhub_profile') || '{}');
  const DELIVERY_FEE = 49;
  const grandTotal = total + DELIVERY_FEE;

  const handleConfirmOrder = async () => {
    const token = localStorage.getItem('foodhub_token');
    if (!token) {
      alert('Please login first to place an order.');
      navigate('/login');
      return;
    }

    if (!profile.firstName || !profile.location) {
      alert('Please complete your profile first! We need your name and delivery address.');
      navigate('/profile');
      return;
    }

    try {
      const orderItems = cart.map(item => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        priceAtTimeOfOrder: item.price
      }));
      
      const apiOrder = await placeOrder({
        restaurantId,
        items: orderItems,
        totalAmount: total,
        deliveryAddress: profile.location
      });

      const details = {
        orderId: apiOrder._id,
        restaurant: restaurantName,
        items: [...cart],
        subtotal: total,
        deliveryFee: DELIVERY_FEE,
        grandTotal,
        deliveryAddress: profile.location,
        customerName: `${profile.firstName} ${profile.lastName || ''}`.trim(),
        phone: profile.phone,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        estimatedDelivery: '30-40 min'
      };

      const saveToOrderHistory = (orderData) => {
        const existing = JSON.parse(localStorage.getItem('foodhub_orders') || '[]');
        localStorage.setItem('foodhub_orders', JSON.stringify([orderData, ...existing]));
      };

      setOrderDetails(details);
      saveToOrderHistory(details);
      setOrderPlaced(true);
      clearCart();
    } catch (err) {
      console.error(err);
      alert('Failed to place order. Using local fallback for demonstration.');
      
      const details = {
        orderId: 'ORD' + Math.floor(Math.random() * 900000 + 100000),
        restaurant: restaurantName,
        items: [...cart],
        subtotal: total,
        deliveryFee: DELIVERY_FEE,
        grandTotal,
        deliveryAddress: profile.location,
        customerName: `${profile.firstName} ${profile.lastName || ''}`.trim(),
        phone: profile.phone,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        estimatedDelivery: '30-40 min'
      };

      setOrderDetails(details);
      setOrderPlaced(true);
      clearCart();
    }
  };

  // ── ORDER SUCCESS SCREEN ──────────────────────────────────
  if (orderPlaced && orderDetails) {
    return (
      <div className="checkout-container">
        <div className="order-success-card">
          <div className="success-animation">🎉</div>
          <h2 className="success-title">Order Confirmed!</h2>
          <p className="success-subtitle">Your food is being prepared with love ❤️</p>

          <div className="order-summary-box">
            <div className="order-id-row">
              <span>Order ID</span>
              <strong>#{orderDetails.orderId}</strong>
            </div>
            <div className="order-id-row">
              <span>Restaurant</span>
              <strong>{orderDetails.restaurant}</strong>
            </div>
            <div className="order-id-row">
              <span>Delivery To</span>
              <strong>{orderDetails.deliveryAddress}</strong>
            </div>
            <div className="order-id-row">
              <span>Customer</span>
              <strong>{orderDetails.customerName}</strong>
            </div>
            <div className="order-id-row">
              <span>Phone</span>
              <strong>{orderDetails.phone}</strong>
            </div>
            <div className="order-id-row">
              <span>Estimated Delivery</span>
              <strong>⏱ {orderDetails.estimatedDelivery}</strong>
            </div>
          </div>

          <div className="order-items-list">
            <h4>Items Ordered</h4>
            {orderDetails.items.map((item, idx) => (
              <div key={idx} className="success-item">
                <span>{item.quantity}× {item.name}</span>
                <span>₹{(item.price * item.quantity).toFixed(0)}</span>
              </div>
            ))}
            <div className="success-item muted">
              <span>Delivery Fee</span>
              <span>₹{orderDetails.deliveryFee}</span>
            </div>
            <div className="success-item grand-total">
              <span>Total Paid</span>
              <span>₹{orderDetails.grandTotal.toFixed(0)}</span>
            </div>
          </div>

          <div className="tracking-bar">
            <div className="track-step active">📦 Confirmed</div>
            <div className="track-line active"></div>
            <div className="track-step">👨‍🍳 Preparing</div>
            <div className="track-line"></div>
            <div className="track-step">🛵 On the way</div>
            <div className="track-line"></div>
            <div className="track-step">✅ Delivered</div>
          </div>

          <button className="btn btn-primary" style={{ marginTop: '2rem' }} onClick={() => navigate('/')}>
            🏠 Back to Home
          </button>
        </div>
      </div>
    );
  }

  // ── EMPTY CART ──────────────────────────────────────────
  if (cart.length === 0) {
    return (
      <div className="checkout-container" style={{ textAlign: 'center', padding: '10vh 0' }}>
        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🛒</div>
        <h2 className="checkout-header">Your Cart is Empty</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Add some delicious items from a restaurant!
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/')} style={{ maxWidth: '250px' }}>
          Browse Restaurants
        </button>
      </div>
    );
  }

  // ── CART & CHECKOUT ──────────────────────────────────────
  return (
    <div className="checkout-container">
      <h2 className="checkout-header">🛒 Your Order</h2>

      <div className="checkout-layout">
        {/* LEFT: Cart Items */}
        <div className="checkout-panel">
          <h3 style={{ marginBottom: '1.5rem' }}>
            Items from <span style={{ color: 'var(--accent-primary)' }}>{restaurantName}</span>
          </h3>

          {cart.map((item) => (
            <div key={item.menuItemId} className="cart-item">
              <div className="cart-item-info">
                <span className="cart-item-name">{item.name}</span>
                <span className="cart-item-unit">₹{item.price} each</span>
              </div>
              <div className="cart-item-controls">
                <button className="qty-ctrl-btn" onClick={() => updateQuantity(item.menuItemId, -1)}>−</button>
                <span className="qty-ctrl-count">{item.quantity}</span>
                <button className="qty-ctrl-btn" onClick={() => updateQuantity(item.menuItemId, 1)}>+</button>
                <span className="cart-item-subtotal">₹{(item.price * item.quantity).toFixed(0)}</span>
                <button className="remove-btn" onClick={() => removeFromCart(item.menuItemId)} title="Remove">✕</button>
              </div>
            </div>
          ))}

          {/* Totals */}
          <div className="totals-section">
            <div className="total-row">
              <span>Subtotal</span>
              <span>₹{total.toFixed(0)}</span>
            </div>
            <div className="total-row">
              <span>Delivery Fee</span>
              <span>₹{DELIVERY_FEE}</span>
            </div>
            <div className="total-row grand">
              <span>Grand Total</span>
              <span className="highlight">₹{grandTotal.toFixed(0)}</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Delivery Details + Payment */}
        <div className="checkout-panel">
          <h3 style={{ marginBottom: '1.5rem' }}>📍 Delivery Details</h3>

          {profile.firstName ? (
            <div className="delivery-info-box">
              <div className="delivery-row">
                <span className="delivery-label">👤 Name</span>
                <span>{profile.firstName} {profile.lastName || ''}</span>
              </div>
              <div className="delivery-row">
                <span className="delivery-label">📞 Phone</span>
                <span>{profile.phone || <em style={{ color: 'var(--text-muted)' }}>Not set</em>}</span>
              </div>
              <div className="delivery-row">
                <span className="delivery-label">📍 Address</span>
                <span>{profile.location}</span>
              </div>
              <button
                className="btn"
                style={{ marginTop: '1rem', background: 'transparent', border: '1px solid var(--border-glass)', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '0.5rem 1rem', width: 'auto' }}
                onClick={() => navigate('/profile')}
              >
                ✏️ Edit Profile
              </button>
            </div>
          ) : (
            <div className="delivery-info-box no-profile">
              <p>⚠️ Please set up your profile to add a delivery address.</p>
              <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/profile')}>
                Setup Profile →
              </button>
            </div>
          )}

          <div className="payment-section">
            <h3 style={{ margin: '1.5rem 0 1rem 0' }}>💳 Payment</h3>
            <div className="payment-option selected">
              <span>💵 Cash on Delivery</span>
              <span className="checkmark">✓</span>
            </div>
          </div>

          <button
            className="btn btn-primary confirm-btn"
            onClick={handleConfirmOrder}
            disabled={!profile.firstName}
          >
            {profile.firstName ? `Confirm Order · ₹${grandTotal.toFixed(0)}` : 'Setup Profile First'}
          </button>

          {!profile.firstName && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem', textAlign: 'center' }}>
              ↑ Add your delivery address to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
