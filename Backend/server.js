const express = require('express');
const mongoose = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Record = require('./models/Record');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const app = express();
app.use(express.json());

const jwtSecret = process.env.JWT_SECRET;


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 50 * 1024 * 1024 } });

const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const uploadFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
    stream.end(buffer);
  });
};

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Acceso denegado' });

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token inválido' });
  }
};

// Ruta de registro de usuario
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'El usuario ya existe' });

    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'Usuario registrado' });
  } catch (error) {
    console.error('Error en el registro de usuario:', error);
    res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
  }
});

// Ruta de login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Credenciales inválidas' });

    const token = jwt.sign({ userId: user._id, username: user.username }, jwtSecret, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Ruta para obtener datos del usuario autenticado
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Rutas de registros protegidas con autenticación

// Obtener registros
app.get('/api/records', authenticateToken, async (req, res) => {
  try {
    const records = await Record.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los registros' });
  }
});

// Crear un nuevo registro
app.post('/api/records', authenticateToken, upload.single('imagen'), async (req, res) => {
  const { 
    nombre, 
    cantidad, 
    ubicacion, 
    tipo, 
    observaciones, 
    serial, 
    estado, 
  } = req.body;

  const usuario = req.user.username;
  const fecha = new Date();

  try {
    let imagenUrl; 
    if (req.file) {
      const uploadResult = await uploadFromBuffer(req.file.buffer);
      imagenUrl = uploadResult.secure_url;
    }

    const newRecord = new Record({
      nombre,
      imagen: imagenUrl, 
      cantidad,
      ubicacion,
      tipo,
      observaciones,
      serial,
      estado,
      usuario,
      fecha
    });

    const savedRecord = await newRecord.save();
    res.status(201).json(savedRecord);
  } catch (err) {
    console.error('Error al crear el registro:', err);
    res.status(500).json({ error: 'Error al crear el registro' });
  }
});

// Actualizar un registro existente
app.put('/api/records/:id', authenticateToken, upload.single('imagen'), async (req, res) => {
  const { id } = req.params;
  const { 
    nombre, 
    cantidad, 
    ubicacion, 
    tipo, 
    observaciones, 
    serial, 
    estado, 
  } = req.body;

  const usuario = req.user.username;
  const fecha = new Date();
  try {
    let imagenUrl;

    if (req.file) {
      const uploadResult = await uploadFromBuffer(req.file.buffer);
      imagenUrl = uploadResult.secure_url;
    }

    const updatedData = {
      nombre,
      cantidad,
      ubicacion,
      tipo,
      observaciones,
      serial,
      estado,
      fecha,
      usuario
    };

    if (imagenUrl) {
      updatedData.imagen = imagenUrl;
    }

    const updatedRecord = await Record.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );
    if (!updatedRecord) return res.status(404).json({ message: 'Registro no encontrado' });
    res.json(updatedRecord);
  } catch (err) {
    console.error('Error al actualizar el registro:', err);
    res.status(500).json({ message: 'Error al actualizar el registro' });
  }
});

// Eliminar un registro existente
app.delete('/api/records/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRecord = await Record.findByIdAndDelete(id);
    if (!deletedRecord) return res.status(404).json({ message: 'Registro no encontrado' });
    res.json({ message: 'Registro eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el registro' });
  }
});

// Iniciar el servidor
app.listen(4000, () => {
  console.log('Server running on port 4000');
});
