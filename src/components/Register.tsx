import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/register', { username, password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Error al registrar usuario', error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message || 'Error al registrar usuario. Intenta con otro nombre de usuario.');
      } else {
        setError('Error desconocido al registrar usuario');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg mt-12 transition-colors duration-300">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Registrar</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">Usuario registrado con éxito. Redirigiendo...</p>}
      <form onSubmit={handleSubmit}>
        {/* Usuario */}
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
            Usuario:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          />
        </div>
        {/* Contraseña */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
            Contraseña:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
        >
          Registrar
        </button>
      </form>
    </div>
  );
};

export default Register;
