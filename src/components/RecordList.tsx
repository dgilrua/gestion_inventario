import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getRecords, updateRecord, deleteRecord, Inventario } from '../api/records';
import '../styles/RecordList.css';

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
  }

  // Manejar cambios en la barra de búsqueda
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


  // Función para manejar la eliminación
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

  const handleEdit = async (record: Inventario) => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Acceso denegado', 'Por favor inicia sesión.', 'error');
      return;
    }
  
    const { value: formValues } = await Swal.fire({
      title: 'Editar Registro',
      width: '1200px', // Ancho del modal
      html: `
        <div class="grid grid-cols-2 gap-4">
          <!-- Nombre (ocupa dos columnas) -->
          <div class="col-span-2">
            <input id="swal-input-nombre" 
                   class="swal2-input border rounded p-2" 
                   placeholder="Nombre" 
                   value="${record.nombre}">
          </div>
    
          <!-- Observaciones (dos columnas) -->
          <div class="col-span-2">
            <textarea id="swal-input-observaciones" 
                      class="swal2-textarea border rounded p-2" 
                      placeholder="Observaciones">${record.observaciones || ''}</textarea>
          </div>
    
          <!-- Cantidad -->
          <div>
            <input id="swal-input-cantidad" 
                   class="swal2-input border rounded p-2" 
                   type="number" 
                   placeholder="Cantidad" 
                   value="${record.cantidad}">
          </div>
    
          <!-- Ubicación -->
          <div>
            <input id="swal-input-ubicacion" 
                   class="swal2-input border rounded p-2" 
                   placeholder="Ubicación" 
                   value="${record.ubicacion}">
          </div>
    
          <!-- Tipo (dos columnas) -->
          <div class="col-span-2">
            <select id="swal-input-tipo" 
                    class="swal2-select border rounded p-2">
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
    
          <!-- Serial (dos columnas) -->
          <div class="col-span-2">
            <input id="swal-input-serial" 
                   class="swal2-input border rounded p-2" 
                   placeholder="Serial" 
                   value="${record.serial}">
          </div>
    
          <!-- Estado y Fecha en dos columnas -->
          <div>
            <select id="swal-input-estado" 
                    class="swal2-select border rounded p-2">
              <option value="">Seleccione un estado</option>
              <option value="nuevo" ${record.estado === 'nuevo' ? 'selected' : ''}>Nuevo</option>
              <option value="actualizado" ${record.estado === 'actualizado' ? 'selected' : ''}>Actualizado</option>
              <option value="robado" ${record.estado === 'robado' ? 'selected' : ''}>Robado</option>
              <option value="guardado" ${record.estado === 'guardado' ? 'selected' : ''}>Guardado</option>
            </select>
          </div>
          <div>
            <input id="swal-input-fecha" 
                   class="swal2-input border rounded p-2" 
                   type="date" 
                   value="${record.fecha ? new Date(record.fecha).toISOString().split('T')[0] : ''}">
          </div>
    
          <!-- Imagen (dos columnas) -->
          <div class="col-span-2">
            ${record.imagen ? `<img src="${record.imagen}" alt="Imagen actual" class="w-24 mx-auto my-2">` : ''}
            <input id="swal-input-imagen" 
                   class="swal2-input border rounded p-2" 
                   type="file" 
                   accept="image/*">
          </div>
        </div>
      `,
      customClass: {
        popup: 'bg-white p-6 rounded-lg shadow-xl' // Clases Tailwind para el popup
      },
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const nombre = (document.getElementById('swal-input-nombre') as HTMLInputElement).value;
        const observaciones = (document.getElementById('swal-input-observaciones') as HTMLTextAreaElement).value;
        const cantidad = (document.getElementById('swal-input-cantidad') as HTMLInputElement).value;
        const ubicacion = (document.getElementById('swal-input-ubicacion') as HTMLInputElement).value;
        const tipo = (document.getElementById('swal-input-tipo') as HTMLSelectElement).value;
        const serial = (document.getElementById('swal-input-serial') as HTMLInputElement).value;
        const estado = (document.getElementById('swal-input-estado') as HTMLSelectElement).value;
        const fecha = (document.getElementById('swal-input-fecha') as HTMLInputElement).value;
    
        // Obtener la imagen seleccionada (si existe)
        const imagenInput = document.getElementById('swal-input-imagen') as HTMLInputElement;
        const imagenFile = imagenInput && imagenInput.files && imagenInput.files.length > 0
          ? imagenInput.files[0]
          : null;
    
        if (!nombre || !cantidad || !ubicacion || !tipo || !serial || !estado || !fecha) {
          Swal.showValidationMessage('Todos los campos obligatorios deben ser completados');
        }
    
        return {
          nombre,
          observaciones,
          cantidad: Number(cantidad),
          ubicacion,
          tipo,
          serial,
          estado,
          fecha,
          imagenFile, // Se incluye la imagen nueva, si se seleccionó
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
    <div style={{ marginTop: "100px" }} className='RecordList'>
      <h2>Inventario de Artículos</h2>
      <input
        type="text"
        placeholder="Buscar registros..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{
          padding: '8px',
          marginBottom: '10px',
          width: '100%',
          boxSizing: 'border-box'
        }}
      />
      <ul>
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => (
            <li key={record._id}>
              <strong>{record.nombre}</strong><br />
              {record.imagen && (
                <img
                  // Se utiliza la URL directamente, ya que record.imagen proviene de Cloudinary
                  src={record.imagen}
                  alt="Imagen"
                  style={{ width: '100px', height: 'auto', marginTop: '10px' }}
                />
              )}
              <strong>Cantidad:</strong> {record.cantidad}<br />
              <strong>Ubicación:</strong> {record.ubicacion}<br />
              <strong>Tipo:</strong> {record.tipo}<br />
              {record.observaciones && (
                <>
                  <strong>Observaciones:</strong> {record.observaciones}<br />
                </>
              )}
              <strong>Serial:</strong> {record.serial}<br />
              <strong>Estado:</strong> {record.estado}<br />
              <strong>Modificado por: {record.usuario}</strong><br />
              <strong>Fecha de modificacion: {handleDate(record.fecha)}</strong>
              <button onClick={() => handleEdit(record)}>Editar</button>{' '}
              <button onClick={() => handleDelete(record._id)}>Eliminar</button>
            </li>
          ))
        ) : (
          <p>No se encontraron registros.</p>
        )}
      </ul>
    </div>
  );
};

export default RecordList;
