import React from 'react';
import axios from 'axios';

function ClientHome({ orderNumber, onLogout }) {
  const sendRequest = async (type) => {
    try {
      const response = await axios.post(`http://localhost:3001/auth/report-event`, {
        orderNumber,
        type
      });

      if (response.data.success) {
        alert(`✅ ${type} request sent for order ${orderNumber}`);
      } else {
        alert(`❌ Failed to send ${type} request`);
      }
    } catch (err) {
      console.error(err);
      alert(`🚨 Server error sending ${type} request`);
    }
  };

  const requestButtons = [
    { type: 'waiter', label: 'Call Waiter', emoji: '📞' },
    { type: 'music-loud', label: 'Music Too Loud', emoji: '🔊' },
    { type: 'too-hot', label: 'Too Hot', emoji: '🔥' },
    { type: 'too-cold', label: 'Too Cold', emoji: '❄️' },
    { type: 'pack-to-go', label: 'Pack to Go', emoji: '📦' },
    { type: 'bill', label: 'Request Bill', emoji: '💳' },
  ];

  return (
    <div className="text-center flex flex-col items-center justify-center">
      {/* כותרת ממורכזת */}
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Welcome, table {orderNumber}!
      </h2>

      {/* כפתורי בקשות */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 justify-items-center mb-10">
        {requestButtons.map((btn) => (
          <button
            key={btn.type}
            onClick={() => sendRequest(btn.type)}
            className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition"
          >
            <span className="mr-2 text-lg">{btn.emoji}</span>
            {btn.label}
          </button>
        ))}
      </div>

      {/* כפתור התנתקות */}
      <button
        onClick={onLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md shadow text-sm"
      >
        🔓 Logout
      </button>
    </div>
  );
}

export default ClientHome;
