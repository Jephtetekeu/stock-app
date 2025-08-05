const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Store = require('../models/Store');
const Item = require('../models/Item');
const Order = require('../models/Order');

// @route   GET api/dashboard
// @desc    Get dashboard summary data
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all stores for the user
    const stores = await Store.find({ user: userId });

    const dashboardData = {
      totalStores: stores.length,
      storeSummaries: [],
      globalLowStockItems: [],
      globalOrderCounts: {
        'En attente': 0,
        'En cours': 0,
        'Livrée': 0,
        'Annulée': 0,
      },
    };

    for (const store of stores) {
      const storeSummary = {
        _id: store._id,
        name: store.name,
        currency: store.currency,
        totalItems: 0,
        totalStockValue: 0,
        lowStockItems: [],
        orderCounts: {
          'En attente': 0,
          'En cours': 0,
          'Livrée': 0,
          'Annulée': 0,
        },
      };

      // Get items for the current store
      const items = await Item.find({ store: store._id });
      storeSummary.totalItems = items.length;

      for (const item of items) {
        storeSummary.totalStockValue += item.price * item.quantity;
        if (item.quantity <= item.minStockThreshold) {
          storeSummary.lowStockItems.push({
            _id: item._id,
            name: item.name,
            quantity: item.quantity,
            minStockThreshold: item.minStockThreshold,
          });
          dashboardData.globalLowStockItems.push({
            _id: item._id,
            name: item.name,
            storeName: store.name,
            quantity: item.quantity,
            minStockThreshold: item.minStockThreshold,
          });
        }
      }

      // Get orders for the current store
      const orders = await Order.find({ store: store._id });
      for (const order of orders) {
        storeSummary.orderCounts[order.status]++;
        dashboardData.globalOrderCounts[order.status]++;
      }

      dashboardData.storeSummaries.push(storeSummary);
    }

    res.json(dashboardData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
