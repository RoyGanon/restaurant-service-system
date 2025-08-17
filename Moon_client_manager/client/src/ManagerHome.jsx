import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ManagerHome() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // נטען את כל ההזמנות מהשרת
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3001/manager/orders');
        setOrders(response.data.orders);
      } catch (error) {
        console.error('Failed to load orders:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Manager Dashboard</h1>
      <ul>
        {orders.map((orderNum, index) => (
          <li key={index}>Order #{orderNum}</li>
        ))}
      </ul>
    </div>
  );
}

export default ManagerHome;
