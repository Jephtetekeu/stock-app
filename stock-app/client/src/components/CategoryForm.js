import React, { useState } from 'react';
import axios from 'axios';

const CategoryForm = ({ onCategoryAdded }) => {
  const [name, setName] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
      };
      const body = JSON.stringify({ name });
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/categories`, body, config);
      console.log(res.data);
      onCategoryAdded();
      setName('');
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mb-4 p-3 border rounded bg-dark-card">
      <h2 className="mb-3 text-gold">Add New Category</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-gold">Add Category</button>
    </form>
  );
};

export default CategoryForm;
