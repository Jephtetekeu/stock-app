import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderForm = ({ onOrderAdded }) => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState('');
  const [availableItems, setAvailableItems] = useState([]);
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const config = {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        };
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/stores`, config);
        setStores(res.data);
      } catch (err) {
        console.error(err.response.data);
      }
    };
    fetchStores();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      if (selectedStore) {
        try {
          const config = {
            headers: {
              'x-auth-token': localStorage.getItem('token'),
            },
          };
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/items?store=${selectedStore}`, config);
          setAvailableItems(res.data);
        } catch (err) {
          console.error(err.response.data);
        }
      } else {
        setAvailableItems([]);
      }
    };
    fetchItems();
  }, [selectedStore]);

  const handleAddItem = (item) => {
    const existingItem = orderItems.find((oi) => oi.item === item._id);
    if (existingItem) {
      setOrderItems(
        orderItems.map((oi) =>
          oi.item === item._id ? { ...oi, quantity: oi.quantity + 1 } : oi
        )
      );
    } else {
      setOrderItems([...orderItems, { item: item._id, quantity: 1, name: item.name }]);
    }
  };

  const handleQuantityChange = (id, newQuantity) => {
    setOrderItems(
      orderItems.map((oi) =>
        oi.item === id ? { ...oi, quantity: parseInt(newQuantity) } : oi
      )
    );
  };

  const handleRemoveItem = (id) => {
    setOrderItems(orderItems.filter((oi) => oi.item !== id));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
      };
      const body = JSON.stringify({ store: selectedStore, items: orderItems.map(oi => ({ item: oi.item, quantity: oi.quantity })) });
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/orders`, body, config);
      console.log(res.data);
      onOrderAdded();
      setSelectedStore('');
      setOrderItems([]);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <div className="mb-4 p-3 border rounded bg-dark-card">
      <h2 className="mb-3 text-gold">Create New Order</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label htmlFor="store-select" className="form-label">Select Store:</label>
          <select
            id="store-select"
            className="form-select"
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            required
          >
            <option value="">-- Select a Store --</option>
            {stores.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {selectedStore && (
          <div className="mb-3">
            <h3>Available Items for {stores.find(s => s._id === selectedStore)?.name}</h3>
            {availableItems.length === 0 ? (
              <p>No items available for this store.</p>
            ) : (
              <ul className="list-group">
                {availableItems.map((item) => (
                  <li key={item._id} className="list-group-item d-flex justify-content-between align-items-center">
                    {item.name} (Qty: {item.quantity})
                    <button type="button" onClick={() => handleAddItem(item)} className="btn btn-sm btn-success">Add to Order</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {orderItems.length > 0 && (
          <div className="mb-3">
            <h3>Items in Order:</h3>
            <ul className="list-group">
              {orderItems.map((oi) => (
                <li key={oi.item} className="list-group-item d-flex justify-content-between align-items-center">
                  {oi.name} - Quantity:
                  <input
                    type="number"
                    className="form-control w-auto d-inline-block mx-2"
                    min="1"
                    value={oi.quantity}
                    onChange={(e) => handleQuantityChange(oi.item, e.target.value)}
                  />
                  <button type="button" onClick={() => handleRemoveItem(oi.item)} className="btn btn-sm btn-warning">Remove</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button type="submit" className="btn btn-gold" disabled={!selectedStore || orderItems.length === 0}>
          Place Order
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
