const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    maxlength: 100
  },
  imagen: {
    type: String, // Ahora almacena la URL de la imagen
    required: false 
  },
  cantidad: {
    type: Number,
    required: true
  },
  ubicacion: {
    type: String,
    required: true,
    maxlength: 100
  },
  tipo: {
    type: String,
    required: true
  },
  observaciones: {
    type: String,
    required: false 
  },
  serial: {
    type: String,
    required: true,
    maxlength: 50
  },
  estado: {
    type: String,
    required: true
  },
  usuario: {
    type: String,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now 
  }
});

module.exports = mongoose.model('Record', recordSchema);
