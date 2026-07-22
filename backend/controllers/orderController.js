const Order = require('../models/Order');
const Review = require('../models/Review');
const User = require('../models/User');

exports.placeOrder = async (req, res) => {
  try {
    const { restaurantId, items, totalAmount, deliveryLocation } = req.body;
    
    // Simulate Payment Gateway
    const paymentSuccess = true; 
    if (!paymentSuccess) {
      return res.status(400).json({ message: 'Payment failed' });
    }

    const order = await Order.create({
      consumerId: req.user._id,
      restaurantId,
      items,
      totalAmount,
      deliveryLocation
    });

    // Notify restaurant via WebSocket
    req.io.to(`restaurant_${restaurantId}`).emit('new_order', order);

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Broadcast to the order's specific room
    req.io.to(`order_${id}`).emit('order_status_updated', order);

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, text } = req.body;

    // Gamification Algorithm
    const wordCount = text.split(' ').length;
    let points = 0;
    
    if (wordCount > 10) points += 5;
    if (wordCount > 30) points += 10;
    
    const keywords = ['delicious', 'fast', 'fresh', 'hot', 'authentic', 'spicy'];
    keywords.forEach(kw => {
      if (text.toLowerCase().includes(kw)) points += 2;
    });

    const review = await Review.create({
      userId: req.user._id,
      restaurantId: req.body.restaurantId,
      orderId: id,
      rating,
      text,
      gamifiedPointsAwarded: points
    });

    // Award loyalty points to user
    await User.findByIdAndUpdate(req.user._id, { $inc: { loyaltyPoints: points } });
    
    res.status(201).json({ review, pointsAwarded: points });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAiReviewPrompts = async (req, res) => {
  // Mock AI keyword suggestion based on history
  const suggestions = [
    "How was the temperature of the food?",
    "Did you enjoy the blend of spices?",
    "Was the delivery prompt?",
    "Keywords to use: delicious, fast, fresh, authentic."
  ];
  res.json({ prompts: suggestions });
};
