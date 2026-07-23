const express = require('express');
const { getAllRestaurants, getNearbyRestaurants, getRestaurantById, createRestaurant, addMenuItem } = require('../controllers/restaurantController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllRestaurants);
router.get('/nearby', getNearbyRestaurants);
router.get('/:id', getRestaurantById);
router.post('/', protect, createRestaurant);
router.post('/:id/menu', protect, addMenuItem);

module.exports = router;
