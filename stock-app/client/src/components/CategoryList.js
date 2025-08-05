import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CategoryList = ({ refresh }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const config = {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        };
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/categories`, config);
        setCategories(res.data);
      } catch (err) {
        console.error(err.response.data);
      }
    };
    fetchCategories();
  }, [refresh]);

  const onDelete = async (id) => {
    try {
      const config = {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      };
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/categories/${id}`, config);
      setCategories(categories.filter(category => category._id !== id));
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <div className="mb-4 p-3 border rounded bg-dark-card">
      <h2 className="mb-3 text-gold">Your Categories</h2>
      {categories.length === 0 ? (
        <p>No categories found. Add a new category above!</p>
      ) : (
        <ul className="list-group">
          {categories.map((category) => (
            <li key={category._id} className="list-group-item d-flex justify-content-between align-items-center">
              {category.name}
              <button onClick={() => onDelete(category._id)} className="btn btn-danger btn-sm">Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryList;
