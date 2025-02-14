import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecords, updateRecord } from '../api/records';

const EditRecord: React.FC = () => {
  const [nombre, setNombre] = useState<string>('');
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [cantidad, setCantidad] = useState<number>(0);
  const [ubicacion, setUbicacion] = useState<string>('');
  const [tipo, setTipo] = useState<string>('');
  const [observaciones, setObservaciones] = useState<string>('');
  const [serial, setSerial] = useState<string>('');
  const [estado, setEstado] = useState<string>('');

  const { id } = useParams();
  const navigate = useNavigate();

  // Cargar el registro para editar
  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          Swal.fire('Acceso denegado', 'Por favor inicia sesión.', 'error');
          return;
        }
        const data = await getRecords(token);
        const recordToEdit = data.find((record) => record._id === id);
        if (recordToEdit) {
          setNombre(recordToEdit.nombre);
          if (recordToEdit.imagen) {
            setPreviewImage(recordToEdit.imagen);
          }
          setCantidad(recordToEdit.cantidad);
          setUbicacion(recordToEdit.ubicacion);
          setTipo(recordToEdit.tipo);
          setObservaciones(recordToEdit.observaciones || '');
          setSerial(recordToEdit.serial);
          setEstado(recordToEdit.estado);
        } else {
          Swal.fire('Error', 'Registro no encontrado.', 'error');
        }
      } catch (error) {
        console.error('Error al cargar el registro:', error);
        Swal.fire('Error', 'Hubo un error al cargar el registro.', 'error');
      }
    };

    if (id) fetchRecord();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagenFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Acceso denegado', 'Por favor inicia sesión.', 'error');
      return;
    }
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
    try {
      await updateRecord(id!, formData, token);
      Swal.fire('Actualizado', 'El registro ha sido actualizado.', 'success');
      navigate('/records');
    } catch (error) {
      console.error('Error al actualizar el registro:', error);
      Swal.fire('Error', 'Hubo un error al actualizar el registro.', 'error');
    }
  };

  return (
    <div className="mt-12 max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Editar Registro</h2>
      <form onSubmit={handleSubmit}>
        {/* Nombre */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Imagen */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Imagen (opcional):</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange}
            className="w-full"
          />
          {previewImage && (
            <div className="mt-4">
              <p className="text-gray-700 dark:text-gray-300">Vista previa de la imagen:</p>
              <img src={previewImage} alt="Vista previa" className="w-48 mt-2 rounded shadow-md" />
            </div>
          )}
        </div>
        {/* Cantidad */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Cantidad:</label>
          <input 
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            required
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Ubicación */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Ubicación:</label>
          <input 
            type="text"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            required
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Tipo */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Tipo:</label>
          <select
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
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Observaciones (opcional):</label>
          <textarea 
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        {/* Serial */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Serial:</label>
          <input 
            type="text"
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
            required
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Estado */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Estado:</label>
          <select
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
          Actualizar
        </button>
      </form>
    </div>
  );
};

export default EditRecord;
