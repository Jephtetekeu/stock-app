import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StoreList = ({ refresh }) => {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const config = {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        };
        const res = await axios.get('/api/stores', config);
        setStores(res.data);
      } catch (err) {
        console.error(err.response.data);
      }
    };
    fetchStores();
  }, [refresh]);

  const onDelete = async (id) => {
    try {
      const config = {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      };
      await axios.delete(`/api/stores/${id}`, config);
      setStores(stores.filter(store => store._id !== id));
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <div className="mb-4 p-3 border rounded bg-dark-card">
      <h2 className="mb-3 text-gold">Your Stores</h2>
      {stores.length === 0 ? (
        <p>No stores found. Add a new store above!</p>
      ) : (
        <ul className="list-group">
          {stores.map((store) => (
            <li key={store._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                {store.name} {store.address && `(${store.address})`} ({store.currency})
              </div>
              <button onClick={() => onDelete(store._id)} className="btn btn-danger btn-sm">Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StoreList;