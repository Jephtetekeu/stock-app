import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StockEvolutionGraph from './StockEvolutionGraph';

const ItemList = ({ refresh }) => {
  const [items, setItems] = useState([]);
  const [showGraphId, setShowGraphId] = useState(null);
  const [quantityInputs, setQuantityInputs] = useState({}); // State for quantity input fields

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const config = {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        };
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/items`, config);
        setItems(res.data);
        // Initialize quantity inputs with current item quantities
        const initialQuantityInputs = {};
        res.data.forEach(item => {
          initialQuantityInputs[item._id] = item.quantity;
        });
        setQuantityInputs(initialQuantityInputs);
      } catch (err) {
        console.error(err.response.data);
      }
    };
    fetchItems();
  }, [refresh]);

  const onDelete = async (id) => {
    try {
      const config = {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      };
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/items/${id}`, config);
      setItems(items.filter(item => item._id !== id));
    } catch (err) {
      console.error(err.response.data);
    }
  };

  const toggleGraph = (itemId) => {
    setShowGraphId(showGraphId === itemId ? null : itemId);
  };

  const handleQuantityInputChange = (itemId, value) => {
    setQuantityInputs({
      ...quantityInputs,
      [itemId]: value,
    });
  };

  const updateItemQuantity = async (itemId, newQuantity) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
      };
      const body = JSON.stringify({ quantity: newQuantity });
      await axios.put(`/api/items/${itemId}`, body, config);
      // Update the item in the local state to reflect the change
      setItems(items.map(item =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      ));
      // Refresh the graph if it's open for this item
      if (showGraphId === itemId) {
        setShowGraphId(null); // Hide and then show to force refresh
        setTimeout(() => setShowGraphId(itemId), 0);
      }
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <div className="mb-4 p-3 border rounded bg-dark-card">
      <h2 className="mb-3 text-gold">Your Items</h2>
      {items.length === 0 ? (
        <p>No items found. Add a new item above!</p>
      ) : (
        <ul className="list-group">
          {items.map((item) => (
            <li
              key={item._id}
              className={`list-group-item ${item.quantity <= item.minStockThreshold ? 'list-group-item-danger' : ''}`}
            >
              <div>
                <strong>{item.name}</strong> (Store: {item.store.name}, Category: {item.category.name}) - Price: {item.store.currency}{item.price}, Quantity: {item.quantity}, Min Stock: {item.minStockThreshold}
                {item.quantity <= item.minStockThreshold && (
                  <span className="badge bg-danger ms-2">LOW STOCK!</span>
                )}
              </div>
              <div className="mt-2">
                <input
                  type="number"
                  className="form-control d-inline-block w-auto me-2"
                  value={quantityInputs[item._id] || ''}
                  onChange={(e) => handleQuantityInputChange(item._id, parseInt(e.target.value) || 0)}
                  min="0"
                />
                <button onClick={() => updateItemQuantity(item._id, quantityInputs[item._id])} className="btn btn-sm btn-info me-2">Update Quantity</button>
                <button onClick={() => onDelete(item._id)} className="btn btn-sm btn-danger me-2">Delete</button>
                <button onClick={() => toggleGraph(item._id)} className="btn btn-sm btn-secondary">
                  {showGraphId === item._id ? 'Hide Graph' : 'Show Graph'}
                </button>
              </div>
              {showGraphId === item._id && <StockEvolutionGraph itemId={item._id} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ItemList;
