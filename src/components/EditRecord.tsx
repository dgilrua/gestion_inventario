import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecords, updateRecord } from '../api/records'; // Importa las funciones necesarias

const EditRecord: React.FC = () => {
  const [nombre, setNombre] = useState<string>('');
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>(''); // Para mostrar la imagen actual o la nueva
  const [cantidad, setCantidad] = useState<number>(0);
  const [ubicacion, setUbicacion] = useState<string>('');
  const [tipo, setTipo] = useState<string>('');
  const [observaciones, setObservaciones] = useState<string>('');
  const [serial, setSerial] = useState<string>('');
  const [estado, setEstado] = useState<string>('');

  const { id } = useParams();
  const navigate = useNavigate();

  // Cargar el registro específico para editar
  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          Swal.fire('Acceso denegado', 'Por favor inicia sesión.', 'error');
          return;
        }
        // Hacer la solicitud para obtener el registro
        const data = await getRecords(token);
        const recordToEdit = data.find((record) => record._id === id);

        if (recordToEdit) {
          setNombre(recordToEdit.nombre);
          // La imagen viene como URL (de Cloudinary)
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

  // Cuando se selecciona una nueva imagen, actualizamos la vista previa y almacenamos el archivo
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

    // Usamos FormData para enviar la imagen (si se seleccionó) junto con el resto de los campos
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('cantidad', cantidad.toString());
    formData.append('ubicacion', ubicacion);
    formData.append('tipo', tipo);
    formData.append('observaciones', observaciones);
    formData.append('serial', serial);
    formData.append('estado', estado);
    // Solo agregamos el campo "imagen" si se ha seleccionado una nueva imagen
    if (imagenFile) {
      formData.append('imagen', imagenFile);
    }

    try {
      console.log('Enviando datos actualizados...');
      // updateRecord debe enviar la petición usando FormData sin forzar el header Content-Type
      await updateRecord(id!, formData, token);
      Swal.fire('Actualizado', 'El registro ha sido actualizado.', 'success');
      navigate('/records');
    } catch (error) {
      console.error('Error al actualizar el registro:', error);
      Swal.fire('Error', 'Hubo un error al actualizar el registro.', 'error');
    }
  };

  return (
    <div>
      <h2>Editar Registro</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Imagen (opcional):</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {previewImage && (
            <div>
              <p>Vista previa de la imagen:</p>
              <img
                src={previewImage}
                alt="Vista previa"
                style={{ width: '200px', marginTop: '10px' }}
              />
            </div>
          )}
        </div>
        <div>
          <label>Cantidad:</label>
          <input
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label>Ubicación:</label>
          <input
            type="text"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Tipo:</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            required
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
        <div>
          <label>Observaciones (opcional):</label>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label>Serial:</label>
          <input
            type="text"
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Estado:</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            required
          >
            <option value="">Seleccione un estado</option>
            <option value="nuevo">Nuevo</option>
            <option value="actualizado">Actualizado</option>
            <option value="robado">Robado</option>
            <option value="guardado">Guardado</option>
          </select>
        </div>
        <button type="submit">Actualizar</button>
      </form>
    </div>
  );
};

export default EditRecord;
