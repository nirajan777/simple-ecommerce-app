const express = require('express');
const router = express.Router();

// Simple in-memory cart (in production, use sessions or database)
const carts = {};

// GET cart
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const cart = carts[userId] || { items: [], total: 0 };
  res.json(cart);
});

// ADD to cart
router.post('/:userId/add', (req, res) => {
  const { userId } = req.params;
  const { productId, productName, price, quantity } = req.body;

  if (!carts[userId]) {
    carts[userId] = { items: [], total: 0 };
  }

  const existingItem = carts[userId].items.find(item => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    carts[userId].items.push({
      productId,
      productName,
      price,
      quantity
    });
  }

  // Calculate total
  carts[userId].total = carts[userId].items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  res.json(carts[userId]);
});

// REMOVE from cart
router.post('/:userId/remove/:productId', (req, res) => {
  const { userId, productId } = req.params;

  if (!carts[userId]) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  carts[userId].items = carts[userId].items.filter(item => item.productId !== productId);

  // Calculate total
  carts[userId].total = carts[userId].items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  res.json(carts[userId]);
});

// UPDATE cart item quantity
router.put('/:userId/update/:productId', (req, res) => {
  const { userId, productId } = req.params;
  const { quantity } = req.body;

  if (!carts[userId]) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  const item = carts[userId].items.find(item => item.productId === productId);

  if (!item) {
    return res.status(404).json({ message: 'Item not found in cart' });
  }

  item.quantity = quantity;

  // Calculate total
  carts[userId].total = carts[userId].items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  res.json(carts[userId]);
});

// CLEAR cart
router.post('/:userId/clear', (req, res) => {
  const { userId } = req.params;
  carts[userId] = { items: [], total: 0 };
  res.json(carts[userId]);
});

module.exports = router;