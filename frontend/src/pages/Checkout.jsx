import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

export default function Checkout() {
  const { cart, total, restaurantId, clearCart } = useCart();
  const [orderStatus, setOrderStatus] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [aiPrompts, setAiPrompts] = useState([]);
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/orders/prompts', { headers: { Authorization: `Bearer mock_token` } })
      .then(res => setAiPrompts(res.data.prompts))
      .catch(() => setAiPrompts(["Tell us about the delicious food!", "Was the delivery fast?"]));
  }, []);

  useEffect(() => {
    if (orderId) {
      const socket = io('http://localhost:5000');
      socket.emit('join_order', orderId);
      socket.on('order_status_updated', (order) => {
        setOrderStatus(order.status);
      });
      return () => socket.disconnect();
    }
  }, [orderId]);

  const handleCheckout = async () => {
    try {
      const payload = {
        restaurantId,
        items: cart.map(i => ({ menuItemId: i.menuItemId, quantity: i.quantity, priceAtTimeOfOrder: i.price })),
        totalAmount: total,
        deliveryLocation: { type: 'Point', coordinates: [-73.935242, 40.730610] }
      };
      
      const res = await axios.post('http://localhost:5000/api/orders', payload, {
        headers: { Authorization: `Bearer mock_token` }
      });
      
      setOrderId(res.data._id);
      setOrderStatus(res.data.status);
    } catch (error) {
      // Mock flow if backend isn't up
      setOrderId('mock123');
      setOrderStatus('ACCEPTED');
    }
  };

  const submitReview = async () => {
    try {
      const res = await axios.post(`http://localhost:5000/api/orders/${orderId}/review`, 
        { rating: 5, text: reviewText, restaurantId },
        { headers: { Authorization: `Bearer mock_token` } }
      );
      alert(`Review submitted! You earned ${res.data.pointsAwarded} loyalty points!`);
      clearCart();
      navigate('/');
    } catch (error) {
      alert('Review submitted via mock flow! Earned 10 pts.');
      clearCart();
      navigate('/');
    }
  };

  if (cart.length === 0 && !orderStatus) {
    return (
      <div className="checkout-container" style={{textAlign: 'center', padding: '10vh 0'}}>
        <h2 className="checkout-header">Your Cart is Empty</h2>
        <button className="btn btn-primary" onClick={() => navigate('/')} style={{maxWidth: '250px'}}>
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2 className="checkout-header">Checkout & Tracking</h2>
      
      <div className="checkout-layout">
        {/* Left Column: Order Summary */}
        <div className="checkout-panel">
          <h3>Order Details</h3>
          <div style={{marginTop: '1.5rem'}}>
            {cart.map((item, idx) => (
              <div key={idx} className="cart-item">
                <span>{item.quantity}x {item.name}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="cart-total">
              <span>Total</span>
              <span className="highlight">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Status / Payment / Gamification */}
        <div className="checkout-panel">
          {!orderStatus ? (
            <div>
              <h3>Payment Method</h3>
              <p style={{color: 'var(--text-muted)', margin: '1rem 0 2rem 0'}}>
                Using saved card ending in •••• 4242
              </p>
              <button className="btn btn-primary" onClick={handleCheckout}>Pay & Place Order</button>
            </div>
          ) : (
            <div>
              <div className="status-badge">
                Status: {orderStatus.replace('_', ' ')}
              </div>
              
              <div className="gamified-review">
                <h3>Earn Loyalty Points</h3>
                <p style={{color: 'var(--text-muted)', marginBottom: '1.5rem'}}>
                  Leave a detailed review. More descriptive words = higher rewards!
                </p>
                
                <div className="ai-helper">
                  <strong>AI Suggestions:</strong>
                  <ul>
                    {aiPrompts.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>

                <textarea 
                  className="review-textarea"
                  value={reviewText} 
                  onChange={e => setReviewText(e.target.value)} 
                  placeholder="The food arrived piping hot and tasted incredibly authentic..."
                />
                
                <button className="btn btn-success" onClick={submitReview}>
                  Submit Feedback
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
