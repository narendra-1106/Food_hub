import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_RESTAURANTS } from '../mockData';
import { getRestaurants } from '../api';

const categories = ['All', 'Burgers', 'Pizza', 'Indian', 'Biryani', 'Fast Food'];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const profile = JSON.parse(localStorage.getItem('foodhub_profile') || '{}');

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const data = await getRestaurants();
        setRestaurants(data.length ? data : MOCK_RESTAURANTS);
      } catch (error) {
        console.error('Failed to fetch from API, using mock data', error);
        setRestaurants(MOCK_RESTAURANTS);
      } finally {
        setLoading(false);
      }
    }
    fetchRestaurants();
  }, []);

  const filtered = restaurants.filter(r => {
    const matchCat = activeCategory === 'All' || r.cuisine.includes(activeCategory);
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.cuisine.some(c => c.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '5rem' }}>Loading restaurants...</div>;
  }

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-content">
          <h1>
            {profile.firstName
              ? `Hey ${profile.firstName}! 🍔`
              : 'Discover Premium Dining.'
            }
            <br />
            {profile.firstName ? 'What are you craving today?' : 'Delivered.'}
          </h1>
          <p>
            {profile.location
              ? `📍 Delivering to: ${profile.location}`
              : 'Experience the finest culinary creations from top-rated restaurants, right at your doorstep.'
            }
          </p>
          {!profile.firstName && (
            <button
              className="btn btn-primary"
              style={{ width: 'auto', padding: '1rem 2rem', fontSize: '1.1rem' }}
              onClick={() => navigate('/profile')}
            >
              👤 Setup Profile to Order
            </button>
          )}
          {profile.firstName && (
            <button
              className="btn btn-primary"
              style={{ width: 'auto', padding: '1rem 2rem', fontSize: '1.1rem' }}
              onClick={() => document.getElementById('restaurants').scrollIntoView({ behavior: 'smooth' })}
            >
              🍽️ Explore Restaurants
            </button>
          )}
        </div>
      </section>

      {/* Profile Prompt Banner */}
      {!profile.firstName && (
        <div className="profile-prompt-banner">
          <span>👋 Complete your profile for a personalized experience</span>
          <button className="btn btn-primary" style={{ width: 'auto', padding: '0.5rem 1.5rem' }} onClick={() => navigate('/profile')}>
            Setup Profile
          </button>
        </div>
      )}

      {/* Search Bar */}
      <section className="search-section">
        <input
          type="text"
          placeholder="🔍 Search restaurants or cuisines..."
          className="home-search"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </section>

      {/* Categories */}
      <section className="categories-section">
        <h2 className="categories-header">What are you craving?</h2>
        <div className="categories-scroll">
          {categories.map(cat => (
            <div
              key={cat}
              className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === 'All' && '🍽️ '}
              {cat === 'Burgers' && '🍔 '}
              {cat === 'Pizza' && '🍕 '}
              {cat === 'Indian' && '🍛 '}
              {cat === 'Biryani' && '🍚 '}
              {cat === 'Fast Food' && '⚡ '}
              {cat}
            </div>
          ))}
        </div>
      </section>

      {/* Restaurant Grid */}
      <section className="restaurant-grid-section" id="restaurants">
        <h2 className="categories-header">
          {activeCategory === 'All' ? '🔥 Featured Near You' : `${activeCategory} Restaurants`}
        </h2>
        <div className="grid">
          {filtered.map((rest) => (
            <div
              key={rest._id}
              className="restaurant-card"
              onClick={() => navigate(`/restaurant/${rest._id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-img-wrap">
                <img src={rest.imageUrl} alt={rest.name} className="card-img" />
                <span className="delivery-badge">🕐 {rest.deliveryTime}</span>
              </div>
              <div className="card-content">
                <div className="card-header">
                  <h3>{rest.name}</h3>
                  <div className="rating">
                    <span>★</span> {rest.averageRating}
                  </div>
                </div>
                <p className="card-cuisine">{rest.cuisine.join(' • ')}</p>
                <p className="card-address">📍 {rest.address}</p>
                <div className="card-meta-row">
                  <span className="card-meta-item">Min ₹{rest.minOrder}</span>
                  <span className="card-meta-item">{rest.totalReviews} reviews</span>
                </div>
                <div className="card-actions">
                  <button
                    className="btn btn-primary"
                    onClick={e => { e.stopPropagation(); navigate(`/restaurant/${rest._id}`); }}
                  >
                    View Menu →
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '3rem' }}>🔍</p>
              <p style={{ marginTop: '1rem' }}>No restaurants found for "{search || activeCategory}"</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
