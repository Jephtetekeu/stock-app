import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderList = ({ refresh }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const config = {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        };
        const res = await axios.get('/api/orders', config);
        setOrders(res.data);
      } catch (err) {
        console.error(err.response.data);
      }
    };
    fetchOrders();
  }, [refresh]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
      };
      await axios.put(`/api/orders/${orderId}`, { status: newStatus }, config);
      // Refresh the list to show updated status and potentially updated item quantities
      const res = await axios.get('/api/orders', config);
      setOrders(res.data);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  const onDelete = async (id) => {
    try {
      const config = {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      };
      await axios.delete(`/api/orders/${id}`, config);
      setOrders(orders.filter(order => order._id !== id));
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <div className="mb-4 p-3 border rounded bg-dark-card">
      <h2 className="mb-3 text-gold">Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul className="list-group">
          {orders.map((order) => (
            <li key={order._id} className="list-group-item mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>Order ID:</strong> {order._id}
                <button onClick={() => onDelete(order._id)} className="btn btn-sm btn-danger">Delete Order</button>
              </div>
              <p><strong>Store:</strong> {order.store.name}</p>
              <div className="mb-2">
                <strong>Status:</strong>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="form-select d-inline-block w-auto ms-2"
                >
                  <option value="En attente">En attente</option>
                  <option value="En cours">En cours</option>
                  <option value="Livrée">Livrée</option>
                  <option value="Annulée">Annulée</option>
                </select>
              </div>
              <strong>Items:</strong>
              <ul className="list-group list-group-flush">
                {order.items.map((orderItem) => (
                  <li key={orderItem.item._id} className="list-group-item">
                    {orderItem.item.name} (Qty: {orderItem.quantity})
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderList;
