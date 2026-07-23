import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { MOCK_RESTAURANTS, MOCK_MENU } from '../mockData';
import { getRestaurantById } from '../api';

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart, totalItems } = useCart();
  const [addedId, setAddedId] = useState(null);
  
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const data = await getRestaurantById(id);
        setRestaurant(data.restaurant);
        setMenuItems(data.menuItems);
      } catch (error) {
        console.error('Failed to fetch from API, using mock data', error);
        const mockRest = MOCK_RESTAURANTS.find(r => r._id === id);
        setRestaurant(mockRest);
        setMenuItems(MOCK_MENU[id] || []);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [id]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '8rem 2rem' }}>Loading...</div>;
  }

  if (!restaurant) {
    return (
      <div style={{ textAlign: 'center', padding: '8rem 2rem' }}>
        <h2>Restaurant not found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/')} style={{ maxWidth: 200, marginTop: '2rem' }}>
          ← Back to Home
        </button>
      </div>
    );
  }

  const handleAdd = (item) => {
    addToCart(item, restaurant._id, restaurant.name);
    setAddedId(item._id);
    setTimeout(() => setAddedId(null), 1000);
  };

  const getItemQty = (itemId) => {
    const found = cart.find(c => c.menuItemId === itemId);
    return found ? found.quantity : 0;
  };

  return (
    <div className="restaurant-detail-page">
      {/* Hero Banner */}
      <div className="restaurant-hero" style={{ backgroundImage: `url(${restaurant.imageUrl})` }}>
        <div className="restaurant-hero-overlay">
          <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
          <div className="restaurant-hero-info">
            <h1>{restaurant.name}</h1>
            <p className="rest-description">{restaurant.description}</p>
            <div className="rest-meta">
              <span className="meta-pill">⭐ {restaurant.averageRating} ({restaurant.totalReviews} reviews)</span>
              <span className="meta-pill">🕐 {restaurant.deliveryTime}</span>
              <span className="meta-pill">📍 {restaurant.address}</span>
              <span className="meta-pill">Min ₹{restaurant.minOrder}</span>
            </div>
            <div className="rest-cuisines">
              {restaurant.cuisine.map(c => (
                <span key={c} className="cuisine-tag">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="menu-section">
        <div className="menu-header-row">
          <h2 className="menu-title">🍽️ Our Menu</h2>
          {totalItems > 0 && (
            <button className="btn btn-primary view-cart-btn" onClick={() => navigate('/checkout')}>
              🛒 View Cart ({totalItems} items)
            </button>
          )}
        </div>

        <div className="menu-grid">
          {menuItems.map(item => {
            const qty = getItemQty(item._id);
            const isJustAdded = addedId === item._id;

            return (
              <div key={item._id} className="menu-item-card">
                {item.tag && <span className="menu-tag">{item.tag}</span>}
                <div className="menu-item-img-wrap">
                  <img src={item.imageUrl} alt={item.name} className="menu-item-img" />
                </div>
                <div className="menu-item-body">
                  <h3 className="menu-item-name">{item.name}</h3>
                  <p className="menu-item-desc">{item.description}</p>
                  <div className="menu-item-footer">
                    <span className="menu-item-price">₹{item.price}</span>
                    {qty === 0 ? (
                      <button
                        className={`btn add-btn ${isJustAdded ? 'btn-success' : 'btn-primary'}`}
                        onClick={() => handleAdd(item)}
                      >
                        {isJustAdded ? '✓ Added' : '+ Add'}
                      </button>
                    ) : (
                      <div className="qty-control">
                        <button onClick={() => handleAdd(item)} className="qty-btn qty-plus">+</button>
                        <span className="qty-count">{qty}</span>
                        <span className="qty-label">in cart</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Cart Bar */}
      {totalItems > 0 && (
        <div className="floating-cart-bar">
          <span>{totalItems} item{totalItems > 1 ? 's' : ''} added</span>
          <button className="btn btn-primary" onClick={() => navigate('/checkout')}>
            View Cart & Checkout →
          </button>
        </div>
      )}
    </div>
  );
}
