const express = require('express');
const { getNearbyRestaurants, createRestaurant, addMenuItem } = require('../controllers/restaurantController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/nearby', getNearbyRestaurants);
router.post('/', protect, createRestaurant);
router.post('/:id/menu', protect, addMenuItem);

module.exports = router;
