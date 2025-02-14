import React from 'react';
import { Link } from 'react-router-dom';

const Inicio: React.FC = () => {
  // Estado para el modo oscuro/claro

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="max-w-4xl mx-auto p-6">
        <main className="flex flex-col items-center justify-center text-center mt-12">
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
            Gestión de Inventarios
          </h1>
          <p className="text-xl mb-6">
            Administra y organiza de forma innovadora los recursos del aula.
          </p>
          {/* Tarjetas informativas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-blue-500 mb-2">
                Control de Materiales
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Lleva un registro preciso de cada recurso y optimiza tu inventario.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-green-500 mb-2">
                Acceso Seguro
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Seguridad y privacidad garantizadas para un uso exclusivo y confiable.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-red-500 mb-2">
                Historial de Cambios
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Consulta y gestiona el historial de cada modificación en tiempo real.
              </p>
            </div>
          </div>

          {/* Botón para acceder al inventario */}
          <div className="mt-8">
            <Link
              to="/records"
              className="px-8 py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-full shadow-md transition-colors duration-300"
            >
              Ver Inventario
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Inicio;
