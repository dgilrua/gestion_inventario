import React, { useContext, useEffect, useState } from 'react';
import { Route, Routes, Navigate, Link } from 'react-router-dom';
import Inicio from './components/Inicio';
import CreateRecord from './components/CreateRecord';
import EditRecord from './components/EditRecord';
import RecordList from './components/RecordList';
import Login from './components/Login';
import Register from './components/Register';
import { AuthContext } from './api/AuthContext';

const PrivateRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
  const authContext = useContext(AuthContext);
  return authContext?.isAuthenticated ? element : <Navigate to="/login" />;
};

const App: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(false);

  // Revisar el tema guardado en localStorage al montar el componente
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    }
  }, []);

  // Actualizar el documento y localStorage cuando darkMode cambie
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // Si la autenticación aún está cargando
  if (authContext?.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-xl">Cargando...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <header className="bg-white dark:bg-gray-800 shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Aula STEAM
          </Link>
          <nav>
            <ul className="flex items-center space-x-6">
              {authContext?.isAuthenticated ? (
                <>
                  <li>
                    <Link to="/create" className="hover:text-blue-600 dark:hover:text-blue-400">
                      Registrar nuevo item
                    </Link>
                  </li>
                  <li>
                    <Link to="/records" className="hover:text-blue-600 dark:hover:text-blue-400">
                      Inventario
                    </Link>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span>Bienvenido, {authContext.user?.username}</span>
                    <button
                      onClick={authContext.logout}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition-colors duration-300"
                    >
                      Cerrar Sesión
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="hover:text-blue-600 dark:hover:text-blue-400">
                      Iniciar Sesión
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="hover:text-blue-600 dark:hover:text-blue-400">
                      Registrar
                    </Link>
                  </li>
                </>
              )}
              <li>
                <button
                  onClick={toggleDarkMode}
                  className="px-3 py-1 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded transition-colors duration-300"
                >
                  {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/create" element={<PrivateRoute element={<CreateRecord />} />} />
          <Route path="/edit/:id" element={<PrivateRoute element={<EditRecord />} />} />
          <Route path="/records" element={<PrivateRoute element={<RecordList />} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
