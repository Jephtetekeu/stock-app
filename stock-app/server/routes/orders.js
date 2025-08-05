const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Item = require('../models/Item');

// @route   POST api/orders
// @desc    Create an order
// @access  Private
router.post('/', auth, async (req, res) => {
  const { store, items } = req.body;

  try {
    const newOrder = new Order({
      user: req.user.id,
      store,
      items,
    });

    const order = await newOrder.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/orders
// @desc    Get all user's orders (filtered by store if provided)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const query = { user: req.user.id };
    if (req.query.store) {
      query.store = req.query.store;
    }
    const orders = await Order.find(query)
      .populate('store', ['name'])
      .populate('items.item', ['name', 'price'])
      .sort({ orderDate: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/orders/:id
// @desc    Update an order status and item quantities if delivered
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { status } = req.body;

  try {
    let order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ msg: 'Order not found' });

    // Make sure user owns order
    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const oldStatus = order.status;
    order.status = status;

    // If status changes to 'Livrée' and was not 'Livrée' before, update item quantities
    if (status === 'Livrée' && oldStatus !== 'Livrée') {
      for (const orderItem of order.items) {
        const item = await Item.findById(orderItem.item);
        if (item) {
          item.quantity -= orderItem.quantity;
          item.stockHistory.push({ quantity: item.quantity, date: Date.now() }); // Record stock change
          await item.save();
        }
      }
    }

    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/orders/:id
// @desc    Delete an order
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ msg: 'Order not found' });

    // Make sure user owns order
    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Order removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;