import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getRecords, updateRecord, deleteRecord, Inventario } from '../api/records';

const RecordList: React.FC = () => {
  const [records, setRecords] = useState<Inventario[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredRecords, setFilteredRecords] = useState<Inventario[]>([]);

  // Función para cargar los registros desde la API
  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire('Acceso denegado', 'Por favor inicia sesión.', 'error');
        return;
      }
      const data = await getRecords(token);
      setRecords(data);
      setFilteredRecords(data);
    } catch (error) {
      console.error('Error al cargar los registros', error);
      Swal.fire('Error', 'Hubo un error al cargar los registros.', 'error');
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDate = (date: string) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString();
  };

  // Manejo de la búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = records.filter((record) =>
      record.nombre.toLowerCase().includes(term) ||
      record.ubicacion.toLowerCase().includes(term) ||
      record.tipo.toLowerCase().includes(term) ||
      (record.observaciones && record.observaciones.toLowerCase().includes(term)) ||
      record.serial.toLowerCase().includes(term) ||
      record.estado.toLowerCase().includes(term)
    );
    setFilteredRecords(filtered);
  };

  // Manejo de eliminación
  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Acceso denegado', 'Por favor inicia sesión.', 'error');
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esta acción!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteRecord(id, token);
          Swal.fire('Eliminado', 'El registro ha sido eliminado.', 'success');
          fetchRecords();
        } catch (error) {
          console.error('Error al eliminar el registro', error);
          Swal.fire('Error', 'Hubo un error al eliminar el registro.', 'error');
        }
      }
    });
  };

  // Manejo de edición a través de un modal con SweetAlert2
  const handleEdit = async (record: Inventario) => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Acceso denegado', 'Por favor inicia sesión.', 'error');
      return;
    }
  
    const { value: formValues } = await Swal.fire({
      width: '1200px',
      customClass: {
        popup: 'bg-gray-800 border border-gray-700 text-gray-100 shadow-xl', 
        title: 'text-white',
        htmlContainer: 'text-gray-200',
        confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500',
        cancelButton: 'bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-500'
      },
      background: '#1F2937', 
      html: `
        <div>
          <h2 class="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Editar Registro</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Nombre -->
            <div class="col-span-2">
              <input id="swal-input-nombre" 
                    class="w-full px-4 py-2 border text-gray-300 border-gray-300 rounded focus:ring-2 focus:ring-blue-500" 
                    placeholder="Nombre" 
                    value="${record.nombre}">
            </div>
            <!-- Observaciones -->
            <div class="col-span-2">
              <textarea id="swal-input-observaciones" 
                        class="w-full px-4 py-2 border text-gray-300 border-gray-300 rounded focus:ring-2 focus:ring-blue-500" 
                        placeholder="Observaciones">${record.observaciones || ''}</textarea>
            </div>
            <!-- Cantidad -->
            <div>
              <input id="swal-input-cantidad" 
                    class="w-full px-4 py-2 border text-gray-300 border-gray-300 rounded focus:ring-2 focus:ring-blue-500" 
                    type="number" 
                    placeholder="Cantidad" 
                    value="${record.cantidad}">
            </div>
            <!-- Ubicación -->
            <div>
              <input id="swal-input-ubicacion" 
                    class="w-full px-4 py-2 border text-gray-300 border-gray-300 rounded focus:ring-2 focus:ring-blue-500" 
                    placeholder="Ubicación" 
                    value="${record.ubicacion}">
            </div>
            <!-- Tipo -->
            <div>
              <select id="swal-input-tipo" 
                      class="w-full px-4 py-2 border border-gray-300 text-gray-300 rounded focus:ring-2 focus:ring-blue-500">
                <option value="">Seleccione un tipo</option>
                <option value="Papelería y materiales" ${record.tipo === 'Papelería y materiales' ? 'selected' : ''}>Papelería y materiales</option>
                <option value="Protección personal" ${record.tipo === 'Protección personal' ? 'selected' : ''}>Protección personal</option>
                <option value="Mantenimiento" ${record.tipo === 'Mantenimiento' ? 'selected' : ''}>Mantenimiento</option>
                <option value="Herramientas" ${record.tipo === 'Herramientas' ? 'selected' : ''}>Herramientas</option>
                <option value="Consumibles equipos" ${record.tipo === 'Consumibles equipos' ? 'selected' : ''}>Consumibles equipos</option>
                <option value="Componentes electrónicos" ${record.tipo === 'Componentes electrónicos' ? 'selected' : ''}>Componentes electrónicos</option>
                <option value="Souvenirs" ${record.tipo === 'Souvenirs' ? 'selected' : ''}>Souvenirs</option>
              </select>
            </div>
            <!-- Serial -->
            <div>
              <input id="swal-input-serial" 
                    class="w-full px-4 py-2 border border-gray-300 text-gray-300 rounded focus:ring-2 focus:ring-blue-500" 
                    placeholder="Serial" 
                    value="${record.serial}">
            </div>
            <!-- Estado -->
            <div>
              <select id="swal-input-estado" 
                      class="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500">
                <option value="">Seleccione un estado</option>
                <option value="nuevo" ${record.estado === 'nuevo' ? 'selected' : ''}>Nuevo</option>
                <option value="actualizado" ${record.estado === 'actualizado' ? 'selected' : ''}>Actualizado</option>
                <option value="robado" ${record.estado === 'robado' ? 'selected' : ''}>Robado</option>
                <option value="guardado" ${record.estado === 'guardado' ? 'selected' : ''}>Guardado</option>
              </select>
            </div>
            <!-- Fecha -->
            <div>
              <input id="swal-input-fecha" 
                    class="w-full px-4 py-2 border border-gray-300 text-gray-300 rounded focus:ring-2 focus:ring-blue-500" 
                    type="date" 
                    value="${record.fecha ? new Date(record.fecha).toISOString().split('T')[0] : ''}">
            </div>
            <!-- Imagen -->
            <div class="col-span-2">
              ${record.imagen ? `<img src="${record.imagen}" alt="Imagen actual" class="w-24 mx-auto my-2 rounded shadow-md ">` : ''}
              <input id="swal-input-imagen" 
                    class="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-300 " 
                    type="file" 
                    accept="image/*">
            </div>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        // Obtener valores y validarlos
        const nombre = (document.getElementById('swal-input-nombre') as HTMLInputElement).value;
        const observaciones = (document.getElementById('swal-input-observaciones') as HTMLTextAreaElement).value;
        const cantidad = (document.getElementById('swal-input-cantidad') as HTMLInputElement).value;
        const ubicacion = (document.getElementById('swal-input-ubicacion') as HTMLInputElement).value;
        const tipo = (document.getElementById('swal-input-tipo') as HTMLSelectElement).value;
        const serial = (document.getElementById('swal-input-serial') as HTMLInputElement).value;
        const estado = (document.getElementById('swal-input-estado') as HTMLSelectElement).value;
        const fecha = (document.getElementById('swal-input-fecha') as HTMLInputElement).value;
    
        if (!nombre || !cantidad || !ubicacion || !tipo || !serial || !estado || !fecha) {
          Swal.showValidationMessage('Todos los campos obligatorios deben ser completados');
        }
    
        const imagenInput = document.getElementById('swal-input-imagen') as HTMLInputElement;
        const imagenFile = imagenInput && imagenInput.files && imagenInput.files.length > 0
          ? imagenInput.files[0]
          : null;
    
        return {
          nombre,
          observaciones,
          cantidad: Number(cantidad),
          ubicacion,
          tipo,
          serial,
          estado,
          fecha,
          imagenFile,
        };
      },
    });
    
    if (formValues) {
      try {
        let dataToSend;
        if (formValues.imagenFile) {
          dataToSend = new FormData();
          dataToSend.append('nombre', formValues.nombre);
          dataToSend.append('observaciones', formValues.observaciones);
          dataToSend.append('cantidad', formValues.cantidad.toString());
          dataToSend.append('ubicacion', formValues.ubicacion);
          dataToSend.append('tipo', formValues.tipo);
          dataToSend.append('serial', formValues.serial);
          dataToSend.append('estado', formValues.estado);
          dataToSend.append('fecha', formValues.fecha);
          dataToSend.append('imagen', formValues.imagenFile);
        } else {
          dataToSend = {
            nombre: formValues.nombre,
            observaciones: formValues.observaciones,
            cantidad: formValues.cantidad,
            ubicacion: formValues.ubicacion,
            tipo: formValues.tipo,
            serial: formValues.serial,
            estado: formValues.estado,
            fecha: formValues.fecha,
          };
        }
        await updateRecord(record._id, dataToSend, token);
        Swal.fire('Actualizado', 'El registro ha sido actualizado.', 'success');
        fetchRecords();
      } catch (error) {
        console.error('Error al actualizar el registro', error);
        Swal.fire('Error', 'Hubo un error al actualizar el registro.', 'error');
      }
    }
  };

  return (
    <div className="mt-12 max-w-5xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Inventario de Artículos</h2>
      <input
        type="text"
        placeholder="Buscar registros..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full border border-gray-300 dark:border-gray-600 rounded px-4 py-2 mb-6 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => (
            <li key={record._id} className="p-6 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">{record.nombre}</h3>
              </div>
              {record.imagen && (
                <img
                  src={record.imagen}
                  alt="Imagen"
                  className="w-32 h-auto mb-4 rounded shadow-md"
                />
              )}
              <p className="text-gray-700 dark:text-gray-300"><strong>Cantidad:</strong> {record.cantidad}</p>
              <p className="text-gray-700 dark:text-gray-300"><strong>Ubicación:</strong> {record.ubicacion}</p>
              <p className="text-gray-700 dark:text-gray-300"><strong>Tipo:</strong> {record.tipo}</p>
              {record.observaciones && (
                <p className="text-gray-700 dark:text-gray-300"><strong>Observaciones:</strong> {record.observaciones}</p>
              )}
              <p className="text-gray-700 dark:text-gray-300"><strong>Serial:</strong> {record.serial}</p>
              <p className="text-gray-700 dark:text-gray-300"><strong>Estado:</strong> {record.estado}</p>
              <p className="text-gray-700 dark:text-gray-300"><strong>Modificado por:</strong> {record.usuario}</p>
              <p className="text-gray-700 dark:text-gray-300"><strong>Fecha:</strong> {handleDate(record.fecha)}</p>
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => handleEdit(record)}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(record._id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-700 dark:text-gray-300">No se encontraron registros.</p>
        )}
      </ul>
    </div>
  );
};

export default RecordList;
