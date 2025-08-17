import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

export default function AdminHome({ onLogout }) {
  const [events, setEvents] = useState([]);
  const [newOrder, setNewOrder] = useState('');
  const [removeOrder, setRemoveOrder] = useState('');

  
  const api = useMemo(() => {
    const instance = axios.create({ baseURL: 'http://localhost:3001/auth' });
    instance.interceptors.request.use((config) => {
      const token = localStorage.getItem('admin_token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    return instance;
  }, []);

  // pull events every 2 sec
  useEffect(() => {
    let stop = false;

    const fetchEvents = async () => {
      try {
        const { data } = await api.get('/events');
        if (!stop) setEvents(data.events || []);
      } catch (err) {
        if (err.response?.status === 401 && onLogout) {
          onLogout(); 
        } else {
          console.error('Error fetching events:', err);
        }
      }
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 2000);
    return () => {
      stop = true;
      clearInterval(interval);
    };
  }, [api, onLogout]);

  const renderEventLabel = (type) => {
    switch (type) {
      case 'waiter': return '📞 Call Waiter';
      case 'music-loud': return '🔊 Music Too Loud';
      case 'too-hot': return '🔥 Too Hot';
      case 'too-cold': return '❄️ Too Cold';
      case 'pack-to-go': return '📦 Pack to Go';
      case 'bill': return '💳 Request Bill';
      default: return type;
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await api.delete(`/events/${id}`);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error('Error deleting event:', err);
      if (err.response?.status === 401 && onLogout) onLogout();
    }
  };

  const handleAddOrder = async () => {
    const orderNumber = newOrder.trim();
    if (!orderNumber) return;
    try {
      const { data } = await api.post('/add-order', { orderNumber });
      if (data.success) {
        alert('✅ Table added successfully');
        setNewOrder('');
      } else {
        alert('❌ ' + (data.message || 'Failed to add table'));
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401 && onLogout) onLogout();
      else alert('🚨 Error adding table');
    }
  };

  const handleRemoveOrder = async () => {
    const orderNumber = removeOrder.trim();
    if (!orderNumber) return;
    try {
      const { data } = await api.post('/remove-order', { orderNumber });
      if (data.success) {
        alert('🗑️ Table removed successfully');
        setRemoveOrder('');
      } else {
        alert('❌ ' + (data.message || 'Failed to remove table'));
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401 && onLogout) onLogout();
      else alert('🚨 Error removing table');
    }
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('admin_token');
    if (onLogout) onLogout();
  };

  return (
    <div className="p-6">
      {/*  logout*/}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogoutClick}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
        >
          🔓 Logout
        </button>
      </div>

      {/* event list*/}
      <ul className="space-y-2 mb-6">
        {events.map((e) => (
          <li key={e.id} className="flex items-center justify-between bg-white rounded-md shadow px-4 py-2">
            <span className="text-sm md:text-base">
              {renderEventLabel(e.type)} — from table #{e.orderNumber}
              {e.createdAt && (
                <span className="text-xs text-gray-500 ml-2">
                  {new Date(e.createdAt).toLocaleTimeString()}
                </span>
              )}
            </span>
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded text-sm"
              onClick={() => handleDeleteEvent(e.id)}
            >
              ✅ Done
            </button>
          </li>
        ))}
        {events.length === 0 && <li className="text-gray-500 text-sm">No pending events.</li>}
      </ul>

      <hr className="my-6" />

      {/* add table*/}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Add Table</h3>
        <input
          type="text"
          placeholder="Table number"
          value={newOrder}
          onChange={(e) => setNewOrder(e.target.value)}
          className="border rounded px-3 py-2 mr-2"
        />
        <button
          onClick={handleAddOrder}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          ➕ Add
        </button>
      </div>

      {/* delete table */}
      <div>
        <h3 className="font-semibold mb-2">Remove Table</h3>
        <input
          type="text"
          placeholder="Table number"
          value={removeOrder}
          onChange={(e) => setRemoveOrder(e.target.value)}
          className="border rounded px-3 py-2 mr-2"
        />
        <button
          onClick={handleRemoveOrder}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
        >
          ❌ Remove
        </button>
      </div>
    </div>
  );
}
