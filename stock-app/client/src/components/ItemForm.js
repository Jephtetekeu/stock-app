import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ItemForm = ({ onItemAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    minStockThreshold: '',
    image: '',
    store: '',
    category: '',
  });
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);

  const { name, price, quantity, minStockThreshold, image, store, category } = formData;

  useEffect(() => {
    const fetchStoresAndCategories = async () => {
      try {
        const config = {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        };
        const storesRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/stores`, config);
        setStores(storesRes.data);

        const categoriesRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/categories`, config);
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error(err.response.data);
      }
    };
    fetchStoresAndCategories();
  }, []);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
      };
      const body = JSON.stringify(formData);
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/items`, body, config);
      console.log(res.data);
      onItemAdded();
      setFormData({
        name: '',
        price: '',
        quantity: '',
        minStockThreshold: '',
        image: '',
        store: '',
        category: '',
      });
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mb-4 p-3 border rounded bg-dark-card">
      <h2 className="mb-3 text-gold">Add New Item</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Item Name"
          name="name"
          value={name}
          onChange={onChange}
          required
        />
      </div>
      <div className="mb-3">
        <input
          type="number"
          className="form-control"
          placeholder="Price"
          name="price"
          value={price}
          onChange={onChange}
          required
        />
      </div>
      <div className="mb-3">
        <input
          type="number"
          className="form-control"
          placeholder="Quantity"
          name="quantity"
          value={quantity}
          onChange={onChange}
          required
        />
      </div>
      <div className="mb-3">
        <input
          type="number"
          className="form-control"
          placeholder="Min Stock Threshold"
          name="minStockThreshold"
          value={minStockThreshold}
          onChange={onChange}
          required
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Image URL (Optional)"
          name="image"
          value={image}
          onChange={onChange}
        />
      </div>
      <div className="mb-3">
        <select name="store" className="form-select" value={store} onChange={onChange} required>
          <option value="">Select Store</option>
          {stores.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <select name="category" className="form-select" value={category} onChange={onChange} required>
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn btn-gold">Add Item</button>
    </form>
  );
};

export default ItemForm;
