import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

// Placeholder images for a premium feel
const placeholders = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop"
];

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/restaurants/nearby?lng=-73.935242&lat=40.730610')
      .then(res => setRestaurants(res.data))
      .catch(err => console.error(err));
  }, []);

  const categories = ['All', 'Sushi', 'Italian', 'Burgers', 'Vegan', 'Indian', 'Mexican'];

  return (
    <div>
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-content">
          <h1>Discover Premium Dining. <br/> Delivered.</h1>
          <p>Experience the finest culinary creations from the city's top-rated restaurants, right at your doorstep.</p>
          <button className="btn btn-primary" style={{width: 'auto', padding: '1rem 2rem', fontSize: '1.1rem'}}>
            Explore Restaurants
          </button>
        </div>
      </section>
      
      <section className="categories-section">
        <h2 className="categories-header">What are you craving?</h2>
        <div className="categories-scroll">
          {categories.map(cat => (
            <div 
              key={cat} 
              className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </div>
          ))}
        </div>
      </section>

      <section className="restaurant-grid-section">
        <h2 className="categories-header">Featured Near You</h2>
        <div className="grid">
          {restaurants.map((rest, idx) => (
            <div key={rest._id} className="restaurant-card">
              <img src={placeholders[idx % placeholders.length]} alt={rest.name} className="card-img" />
              <div className="card-content">
                <div className="card-header">
                  <h3>{rest.name}</h3>
                  <div className="rating">
                    <span>★</span> {rest.averageRating.toFixed(1)}
                  </div>
                </div>
                <p className="card-cuisine">{rest.cuisine.join(', ')}</p>
                <div className="card-actions">
                  <button 
                    onClick={() => addToCart({_id: `item_${rest._id}`, name: 'Chef Special', price: 24.99}, rest._id)} 
                    className="btn btn-primary"
                  >
                    Add Chef's Special - $24.99
                  </button>
                </div>
              </div>
            </div>
          ))}
          {restaurants.length === 0 && (
            <div className="restaurant-card">
              <img src={placeholders[0]} className="card-img" />
              <div className="card-content">
                <div className="card-header">
                  <h3>No Backend Data</h3>
                </div>
                <p className="card-cuisine">Mock Data</p>
                <button onClick={() => addToCart({_id: '1', name: 'Mock Special', price: 10.99}, 'rest1')} className="btn btn-primary">
                  Mock Add
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
