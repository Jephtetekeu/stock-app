const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Category = require('../models/Category');

// @route   POST api/categories
// @desc    Create a category
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const newCategory = new Category({
      user: req.user.id,
      name: req.body.name,
    });

    const category = await newCategory.save();
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/categories
// @desc    Get all user's categories
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user.id }).sort({ date: -1 });
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/categories/:id
// @desc    Update a category
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let category = await Category.findById(req.params.id);

    if (!category) return res.status(404).json({ msg: 'Category not found' });

    // Make sure user owns category
    if (category.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    category = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/categories/:id
// @desc    Delete a category
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) return res.status(404).json({ msg: 'Category not found' });

    // Make sure user owns category
    if (category.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Category removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
