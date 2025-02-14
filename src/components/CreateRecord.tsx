import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateRecord: React.FC = () => {
  const [nombre, setNombre] = useState<string>('');
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [cantidad, setCantidad] = useState<number>(0);
  const [ubicacion, setUbicacion] = useState<string>('');
  const [tipo, setTipo] = useState<string>('');  
  const [observaciones, setObservaciones] = useState<string>('');
  const [serial, setSerial] = useState<string>('');
  const [estado, setEstado] = useState<string>('');  

  const navigate = useNavigate(); 

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagenFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!nombre || !cantidad || !ubicacion || !tipo || !serial || !estado) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('cantidad', cantidad.toString());
      formData.append('ubicacion', ubicacion);
      formData.append('tipo', tipo);
      formData.append('observaciones', observaciones);
      formData.append('serial', serial);
      formData.append('estado', estado);
      if (imagenFile) {
        formData.append('imagen', imagenFile);
      }

      const token = localStorage.getItem('token');
      if (!token) {
        alert('No estás autenticado, por favor inicia sesión.');
        return;
      }

      const response = await axios.post('http://localhost:4000/api/records', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        alert('Registro creado exitosamente!');
        navigate('/records');
      }
    } catch (error) {
      console.error('Error al crear el registro', error);
      alert('Hubo un error al crear el registro');
    }
  };

  return (
    <div className="mt-12 max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Crear Registro</h2>
      <form onSubmit={handleSubmit}>
        {/* Nombre */}
        <div className="mb-4">
          <label htmlFor="nombre" className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Imagen */}
        <div className="mb-4">
          <label htmlFor="imagen" className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
            Imagen (opcional)
          </label>
          <input
            type="file"
            id="imagen"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
        </div>

        {/* Cantidad */}
        <div className="mb-4">
          <label htmlFor="cantidad" className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
            Cantidad
          </label>
          <input
            type="number"
            id="cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            required
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Ubicación */}
        <div className="mb-4">
          <label htmlFor="ubicacion" className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
            Ubicación
          </label>
          <input
            type="text"
            id="ubicacion"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            required
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tipo */}
        <div className="mb-4">
          <label htmlFor="tipo" className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
            Tipo
          </label>
          <select
            id="tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            required
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccione un tipo</option>
            <option value="Papelería y materiales">Papelería y materiales</option>
            <option value="Protección personal">Protección personal</option>
            <option value="Mantenimiento">Mantenimiento</option>
            <option value="Herramientas">Herramientas</option>
            <option value="Consumibles equipos">Consumibles equipos</option>
            <option value="Componentes electrónicos">Componentes electrónicos</option>
            <option value="Souvenirs">Souvenirs</option>
          </select>
        </div>

        {/* Observaciones */}
        <div className="mb-4">
          <label htmlFor="observaciones" className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
            Observaciones (opcional)
          </label>
          <textarea
            id="observaciones"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        {/* Serial */}
        <div className="mb-4">
          <label htmlFor="serial" className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
            Serial
          </label>
          <input
            type="text"
            id="serial"
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
            required
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Estado */}
        <div className="mb-4">
          <label htmlFor="estado" className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
            Estado
          </label>
          <select
            id="estado"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            required
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccione un estado</option>
            <option value="nuevo">Nuevo</option>
            <option value="actualizado">Actualizado</option>
            <option value="robado">Robado</option>
            <option value="guardado">Guardado</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-300">
          Crear
        </button>
      </form>
    </div>
  );
};

export default CreateRecord;
