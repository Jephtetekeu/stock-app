import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DashboardSummary = () => {
  const [summaryData, setSummaryData] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const config = {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        };
        const res = await axios.get('/api/dashboard', config);
        setSummaryData(res.data);
      } catch (err) {
        console.error(err.response.data);
      }
    };
    fetchSummary();
  }, []);

  if (!summaryData) {
    return <div>Loading Dashboard Summary...</div>;
  }

  return (
    <div className="mb-4 p-3 border rounded bg-dark-card">
      <h2 className="mb-3 text-gold">Global Dashboard Summary</h2>
      <p>Total Stores: <span className="badge bg-primary">{summaryData.totalStores}</span></p>

      <h3 className="mt-4 text-gold">Global Order Status:</h3>
      <ul className="list-group mb-3">
        {Object.entries(summaryData.globalOrderCounts).map(([status, count]) => (
          <li key={status} className="list-group-item d-flex justify-content-between align-items-center">
            {status}:
            <span className="badge bg-secondary rounded-pill">{count}</span>
          </li>
        ))}
      </ul>

      <h3 className="mt-4 text-gold">Global Low Stock Items:</h3>
      {summaryData.globalLowStockItems.length === 0 ? (
        <p className="text-success">No items currently at low stock globally.</p>
      ) : (
        <ul className="list-group mb-3">
          {summaryData.globalLowStockItems.map((item) => (
            <li key={item._id} className="list-group-item list-group-item-warning">
              {item.name} (Store: {item.storeName}) - Qty: {item.quantity}, Min: {item.minStockThreshold}
            </li>
          ))}
        </ul>
      )}

      <h3 className="mt-4 text-gold">Store-wise Summaries:</h3>
      {summaryData.storeSummaries.length === 0 ? (
        <p>No store summaries available. Add some stores!</p>
      ) : (
        summaryData.storeSummaries.map((store) => (
          <div key={store._id} className="card mb-3 bg-dark-card">
            <div className="card-header">
              <h4 className="text-gold">{store.name} ({store.currency})</h4>
            </div>
            <div className="card-body">
              <p>Total Items: <span className="badge bg-info">{store.totalItems}</span></p>
              <p>Total Stock Value: <span className="badge bg-success">{store.currency}{store.totalStockValue.toFixed(2)}</span></p>
              <h5 className="mt-3 text-gold">Order Status for {store.name}:</h5>
              <ul className="list-group list-group-flush mb-3">
                {Object.entries(store.orderCounts).map(([status, count]) => (
                  <li key={status} className="list-group-item d-flex justify-content-between align-items-center">
                    {status}:
                    <span className="badge bg-secondary rounded-pill">{count}</span>
                  </li>
                ))}
              </ul>
              <h5 className="mt-3 text-gold">Low Stock Items in {store.name}:</h5>
              {store.lowStockItems.length === 0 ? (
                <p className="text-success">No low stock items in this store.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {store.lowStockItems.map((item) => (
                    <li key={item._id} className="list-group-item list-group-item-warning">
                      {item.name} - Qty: {item.quantity}, Min: {item.minStockThreshold}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DashboardSummary;
