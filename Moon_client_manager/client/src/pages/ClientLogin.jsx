import { useState } from 'react';
import axios from 'axios';

export default function ClientLogin({ onLoginSuccess }) {
  const [orderNumber, setOrderNumber] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!orderNumber.trim()) {
      setMessage('Please enter a table number');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.post('http://localhost:3001/auth/client-login', { orderNumber });
      if (response.data.success) {
        setMessage('Login successful!');
        onLoginSuccess(orderNumber.trim());
      } else {
        setMessage('Order number not found');
      }
    } catch (error) {
      setMessage('Login error');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className="p-4 bg-white shadow rounded-md w-full max-w-xl">
      <h2 className="text-xl font-semibold mb-4">Client Login</h2>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Enter table number"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={handleLogin}
          disabled={loading || !orderNumber.trim()}
          className={`px-4 py-2 rounded text-white font-semibold transition ${
            loading || !orderNumber.trim()
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Logging…' : 'Login'}
        </button>
      </div>
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </div>
  );
}
