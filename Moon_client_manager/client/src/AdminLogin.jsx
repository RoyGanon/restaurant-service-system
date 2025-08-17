import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminLogin({ onLoginSuccess, onLogout }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
  }, []);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setMsg('Please enter username and password');
      return;
    }
    try {
      setLoading(true);
      setMsg('');
      const { data } = await axios.post('http://localhost:3001/auth/admin-login', {
        username: username.trim(),
        password: password.trim(),
      });

      if (data.success && data.token) {
        localStorage.setItem('admin_token', data.token);
        axios.defaults.headers.common.Authorization = `Bearer ${data.token}`;
        setMsg('Login successful!');
        onLoginSuccess && onLoginSuccess();
      } else {
        setMsg(data.message || 'Invalid credentials');
      }
    } catch (e) {
      setMsg('Login error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    delete axios.defaults.headers.common.Authorization;
    localStorage.removeItem('admin_token');
    setMsg('Logged out');
    onLogout && onLogout();
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  const disabled = loading || !username.trim() || !password.trim();

  return (
    <div className="p-4 bg-white shadow rounded-md max-w-2xl w-full">
      <h2 className="text-xl font-semibold mb-4">Admin Login</h2>

      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={onKeyDown}
          className="border px-3 py-2 rounded w-full"
          autoFocus
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={onKeyDown}
          className="border px-3 py-2 rounded w-full"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleLogin}
          disabled={disabled}
          className={`px-4 py-2 rounded text-white font-semibold ${
            disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-900'
          }`}
        >
          {loading ? 'Logging in…' : 'Login'}
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded"
          type="button"
        >
          Logout
        </button>
      </div>

      {msg && <p className="mt-2 text-sm text-gray-700">{msg}</p>}
    </div>
  );
}
