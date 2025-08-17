import { useEffect, useState } from 'react';
import ClientHome from './ClientHome';
import AdminLogin from './AdminLogin';
import AdminHome from './AdminHome';
import ClientLogin from './pages/ClientLogin';
import './index.css'; // Tailwind

function App() {
  const [clientOrderNumber, setClientOrderNumber] = useState('');
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [mode, setMode] = useState('client'); // 'client' or 'admin'

  // automatic login if there is coockie
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) setAdminLoggedIn(true);
  }, []);

  const renderContent = () => {
    if (mode === 'client') {
      return clientOrderNumber ? (
        <ClientHome orderNumber={clientOrderNumber} onLogout={() => setClientOrderNumber('')} />
      ) : (
        <ClientLogin onLoginSuccess={(orderNum) => setClientOrderNumber(orderNum)} />
      );
    }

    if (mode === 'admin') {
      return adminLoggedIn ? (
        <AdminHome
          onLogout={() => {
            localStorage.removeItem('admin_token');
            setAdminLoggedIn(false);
          }}
        />
      ) : (
        <AdminLogin
          onLoginSuccess={() => setAdminLoggedIn(true)}
          onLogout={() => {
            localStorage.removeItem('admin_token');
            setAdminLoggedIn(false);
          }}
        />
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        🍽️ Welcome To Moon Restaurant
      </h1>

      <div className="mb-8 space-x-4">
        <button
          onClick={() => setMode('client')}
          disabled={mode === 'client'}
          className={`px-6 py-2 rounded-md text-white font-semibold transition ${
            mode === 'client' ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Client Mode
        </button>
        <button
          onClick={() => setMode('admin')}
          disabled={mode === 'admin'}
          className={`px-6 py-2 rounded-md text-white font-semibold transition ${
            mode === 'admin' ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-900'
          }`}
        >
          Admin Mode
        </button>
      </div>

      <div className="w-full max-w-3xl">{renderContent()}</div>
    </div>
  );
}

export default App;
