const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

exports.getNearbyRestaurants = async (req, res) => {
  try {
    const { lng, lat, maxDistance = 5000, cuisine } = req.query; // maxDistance in meters

    if (!lng || !lat) {
      return res.status(400).json({ message: 'Longitude and Latitude are required' });
    }

    const query = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      },
      isActive: true
    };

    if (cuisine) {
      query.cuisine = { $in: [cuisine] };
    }

    const restaurants = await Restaurant.find(query).limit(20);
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createRestaurant = async (req, res) => {
  try {
    if (req.user.role !== 'restaurant_partner') {
      return res.status(403).json({ message: 'Only partners can create restaurants' });
    }
    
    const { name, description, cuisine, location, address } = req.body;
    
    const restaurant = await Restaurant.create({
      ownerId: req.user._id,
      name,
      description,
      cuisine,
      location,
      address
    });
    
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addMenuItem = async (req, res) => {
  try {
    if (req.user.role !== 'restaurant_partner') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant || restaurant.ownerId.toString() !== req.user._id.toString()) {
       return res.status(403).json({ message: 'Not your restaurant' });
    }

    const { name, description, price, imageUrl } = req.body;
    const menuItem = await MenuItem.create({
      restaurantId: req.params.id,
      name, description, price, imageUrl
    });
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
