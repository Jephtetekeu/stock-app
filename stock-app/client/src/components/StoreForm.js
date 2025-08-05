import React, { useState } from 'react';
import axios from 'axios';

const StoreForm = ({ onStoreAdded }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [currency, setCurrency] = useState('$'); // Default currency

  const currencies = ['$', '€', '£', '¥', 'FCFA']; // Example currencies

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'), // Get token from localStorage
        },
      };
      const body = JSON.stringify({ name, address, currency });
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/stores`, body, config);
      console.log(res.data);
      onStoreAdded(); // Callback to refresh store list
      setName('');
      setAddress('');
      setCurrency('$'); // Reset to default
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mb-4 p-3 border rounded bg-dark-card">
      <h2 className="mb-3 text-gold">Add New Store</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Store Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Address (Optional)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="currency" className="form-label">Currency:</label>
        <select id="currency" className="form-select" value={currency} onChange={(e) => setCurrency(e.target.value)}>
          {currencies.map((curr) => (
            <option key={curr} value={curr}>
              {curr}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn btn-gold">Add Store</button>
    </form>
  );
};

export default StoreForm;
