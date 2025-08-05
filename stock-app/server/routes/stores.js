const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Store = require('../models/Store');

// @route   POST api/stores
// @desc    Create a store
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const newStore = new Store({
      user: req.user.id,
      name: req.body.name,
      address: req.body.address,
      currency: req.body.currency,
    });

    const store = await newStore.save();
    res.json(store);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/stores
// @desc    Get all user's stores
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const stores = await Store.find({ user: req.user.id }).sort({ date: -1 });
    res.json(stores);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/stores/:id
// @desc    Update a store
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let store = await Store.findById(req.params.id);

    if (!store) return res.status(404).json({ msg: 'Store not found' });

    // Make sure user owns store
    if (store.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    store = await Store.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(store);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/stores/:id
// @desc    Delete a store
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) return res.status(404).json({ msg: 'Store not found' });

    // Make sure user owns store
    if (store.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Store.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Store removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
