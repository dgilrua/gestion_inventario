import axios from 'axios';
const API_URL = 'http://localhost:4000/api/records';

export interface Inventario {
  _id: string; // MongoDB genera esto automáticamente
  nombre: string;
  imagen?: string; // Base64 string (se manejará como bytes en backend)
  cantidad: number;
  ubicacion: string;
  tipo: string;
  observaciones?: string;
  serial: string;
  estado: string;
  usuario: string; // Formato YYYY-MM-DD
  fecha: string
}

// Función para obtener los registros
export const getRecords = async (token: string): Promise<Inventario[]> => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`, // Enviar el token en los headers
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener los registros:', error);
    throw error;
  }
};

// Función para eliminar un registro
export const deleteRecord = async (id: string, token: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Enviar el token en los headers
      },
    });
  } catch (error) {
    console.error('Error al eliminar el registro:', error);
    throw error;
  }
};

// Función para actualizar un registro
export const updateRecord = async (id: string, updatedRecord: Partial<Inventario>, token: string): Promise<Inventario> => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedRecord, {
      headers: {
        Authorization: `Bearer ${token}`, // Enviar el token en los headers
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el registro:', error);
    throw error;
  }
};

// Función para crear un registro (POST)
export const createRecord = async (newRecord: Inventario, token: string): Promise<Inventario> => {
  try {
    const response = await axios.post(API_URL, newRecord, {
      headers: {
        Authorization: `Bearer ${token}`, // Enviar el token en los headers
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear el registro:', error);
    throw error;
  }
};

