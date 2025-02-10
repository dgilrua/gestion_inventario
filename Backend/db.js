const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://dgilrua:vOanWbqQ4xUik44M@gestioninventario.fgdkc.mongodb.net/?retryWrites=true&w=majority&appName=GestionInventario').then(() => console.log('Conexión exitosa a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

module.exports = mongoose;

