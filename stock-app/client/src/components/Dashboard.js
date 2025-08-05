import React, { useState } from 'react';
import StoreForm from './StoreForm';
import StoreList from './StoreList';
import CategoryForm from './CategoryForm';
import CategoryList from './CategoryList';
import ItemForm from './ItemForm';
import ItemList from './ItemList';
import OrderForm from './OrderForm';
import OrderList from './OrderList';
import DashboardSummary from './DashboardSummary';

const Dashboard = ({ onLogout }) => {
  const [refreshStores, setRefreshStores] = useState(false);
  const [refreshCategories, setRefreshCategories] = useState(false);
  const [refreshItems, setRefreshItems] = useState(false);
  const [refreshOrders, setRefreshOrders] = useState(false);

  const handleStoreAdded = () => {
    setRefreshStores(!refreshStores);
  };

  const handleCategoryAdded = () => {
    setRefreshCategories(!refreshCategories);
  };

  const handleItemAdded = () => {
    setRefreshItems(!refreshItems);
  };

  const handleOrderAdded = () => {
    setRefreshOrders(!refreshOrders);
    setRefreshItems(!refreshItems); // Refresh items as well, in case quantities change
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <img src="/logo.png" alt="Logo" className="logo" />
        <h1 className="text-gold">Dashboard</h1>
        <button onClick={onLogout} className="btn btn-danger">Logout</button>
      </div>
      <hr />
      <DashboardSummary />
      <hr />
      <div className="row">
        <div className="col-md-6">
          <StoreForm onStoreAdded={handleStoreAdded} />
        </div>
        <div className="col-md-6">
          <StoreList refresh={refreshStores} />
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-6">
          <CategoryForm onCategoryAdded={handleCategoryAdded} />
        </div>
        <div className="col-md-6">
          <CategoryList refresh={refreshCategories} />
        </div>
      </div>
      <hr />
      <ItemForm onItemAdded={handleItemAdded} />
      <ItemList refresh={refreshItems} />
      <hr />
      <OrderForm onOrderAdded={handleOrderAdded} />
      <OrderList refresh={refreshOrders} />
    </div>
  );
};

export default Dashboard;
