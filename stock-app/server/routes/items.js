const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Item = require('../models/Item');

// @route   POST api/items
// @desc    Create an item
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const newItem = new Item({
      user: req.user.id,
      store: req.body.store,
      category: req.body.category,
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
      minStockThreshold: req.body.minStockThreshold,
      image: req.body.image,
      stockHistory: [{ quantity: req.body.quantity, date: Date.now() }], // Initial stock history
    });

    const item = await newItem.save();
    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/items
// @desc    Get all user's items (filtered by store if provided)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const query = { user: req.user.id };
    if (req.query.store) {
      query.store = req.query.store;
    }
    const items = await Item.find(query)
      .populate('store', ['name', 'currency'])
      .populate('category', ['name'])
      .sort({ date: -1 });
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/items/:id
// @desc    Update an item
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ msg: 'Item not found' });

    // Make sure user owns item
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Update item fields
    item.name = req.body.name || item.name;
    item.price = req.body.price || item.price;
    item.minStockThreshold = req.body.minStockThreshold || item.minStockThreshold;
    item.image = req.body.image || item.image;
    item.store = req.body.store || item.store;
    item.category = req.body.category || item.category;

    // If quantity changes, record in stock history
    if (req.body.quantity !== undefined && req.body.quantity !== item.quantity) {
      item.quantity = req.body.quantity;
      item.stockHistory.push({ quantity: item.quantity, date: Date.now() });
    }

    await item.save();

    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/items/:id
// @desc    Delete an item
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ msg: 'Item not found' });

    // Make sure user owns item
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Item removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/items/:id/history
// @desc    Get stock history for a specific item
// @access  Private
router.get('/:id/history', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ msg: 'Item not found' });

    // Make sure user owns item
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(item.stockHistory);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;