const express = require('express');
const { placeOrder, updateOrderStatus, submitReview, getAiReviewPrompts, getMyOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/my-orders', protect, getMyOrders);
router.post('/', protect, placeOrder);
router.put('/:id/status', protect, updateOrderStatus);
router.post('/:id/review', protect, submitReview);
router.get('/prompts', protect, getAiReviewPrompts);

module.exports = router;
