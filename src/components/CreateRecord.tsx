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

  const navigate = useNavigate(); // Para redirigir después de crear el registro

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
      console.log({ nombre, cantidad, imagenFile, ubicacion, tipo, observaciones, serial, estado}); // Verifica los valores antes de enviar
      // Obtener el token del localStorage

      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('cantidad', cantidad.toString());
      formData.append('ubicacion', ubicacion);
      formData.append('tipo', tipo);
      formData.append('observaciones', observaciones);
      formData.append('serial', serial);
      formData.append('estado', estado);
      // Si se seleccionó imagen, agregarla al FormData
      if (imagenFile) {
        formData.append('imagen', imagenFile);
      }

      const token = localStorage.getItem('token');
      if (!token) {
        alert('No estás autenticado, por favor inicia sesión.');
        return;
      }

      // Agregar el token al encabezado Authorization
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
    <div style={{ marginTop: '50px' }}>
    <h2>Crear Registro</h2>
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="nombre">Nombre</label>
        <input
          type="text"
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="imagen">Imagen (opcional)</label>
        <input
          type="file"
          id="imagen"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>

      <div>
        <label htmlFor="cantidad">Cantidad</label>
        <input
          type="number"
          id="cantidad"
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
          required
        />
      </div>

      <div>
        <label htmlFor="ubicacion">Ubicación</label>
        <input
          type="text"
          id="ubicacion"
          value={ubicacion}
          onChange={(e) => setUbicacion(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="tipo">Tipo</label>
        <select
          id="tipo"
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
        <label htmlFor="observaciones">Observaciones (opcional)</label>
        <textarea
          id="observaciones"
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
        ></textarea>
      </div>

      <div>
        <label htmlFor="serial">Serial</label>
        <input
          type="text"
          id="serial"
          value={serial}
          onChange={(e) => setSerial(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="estado">Estado</label>
        <select
          id="estado"
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

      <button type="submit">Crear</button>
    </form>
  </div>
  );
};

export default CreateRecord;
