# 📦 Gestor de Inventario - Aula STEAM

Este es un sistema de gestión de inventario para el aula STEAM de una universidad. Permite realizar operaciones CRUD sobre los artículos del inventario, manejar imágenes con **Cloudinary**, y cuenta con una interfaz moderna construida con **React 19** y **Tailwind CSS**.

## 🚀 Características

✔️ **Operaciones CRUD completas** (Crear, Leer, Actualizar, Eliminar)  
✔️ **Autenticación con token JWT**  
✔️ **Gestión de imágenes en Cloudinary**  
✔️ **Búsqueda en tiempo real**  
✔️ **Interfaz moderna con Tailwind CSS**  
✔️ **Modales interactivos con SweetAlert2**

## 🛠️ Tecnologías utilizadas

### **Frontend**
- React 19
- TypeScript
- Tailwind CSS
- SweetAlert2
- Axios

### **Backend**
- Node.js
- Express
- MongoDB
- Cloudinary (para imágenes)
- JWT para autenticación

---

## ⚙️ Instalación y Configuración

### 🔹 Clonar el repositorio

~~~bash
git clone https://github.com/dgilrua/gestion_inventario
cd tu-repo
~~~

### 🔹 Configuración del Backend

1️⃣ **Instalar dependencias**  
~~~bash
cd backend
npm install
~~~

2️⃣ **Configurar variables de entorno**  
Crea un archivo `.env` en la carpeta `backend` con el siguiente contenido:

~~~env
PORT=5000
MONGO_URI=tu_conexion_mongo
JWT_SECRET=tu_secreto_jwt
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
~~~

3️⃣ **Ejecutar el servidor**  
~~~bash
npm run dev
~~~

### 🔹 Configuración del Frontend

1️⃣ **Instalar dependencias**  
~~~bash
cd frontend
npm install
~~~

2️⃣ **Configurar variables de entorno**  
Crea un archivo `.env` en la carpeta `frontend` con:

~~~env
VITE_API_URL=http://localhost:5000/api
VITE_CLOUDINARY_URL=https://api.cloudinary.com/v1_1/tu_cloud_name/image/upload
~~~

3️⃣ **Ejecutar la aplicación**  
~~~bash
npm run dev
~~~

---

## 📚 Estructura del Proyecto

~~~plaintext
gestor-inventario/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── inventarioController.js
│   ├── models/
│   │   └── Inventario.js
│   ├── routes/
│   │   └── inventarioRoutes.js
│   ├── server.js
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── RecordList.tsx
│   │   ├── api/
│   │   │   └── records.ts
│   │   ├── pages/
│   │   │   └── Home.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
├── README.md
├── package.json
└── .gitignore
~~~

---

## 🔥 Uso de la Aplicación

### **1️⃣ Iniciar sesión**
- Se requiere autenticación mediante token JWT.

### **2️⃣ Agregar un nuevo registro**
- Completa el formulario con el nombre, cantidad, ubicación, etc.
- Puedes subir una imagen que se almacenará en **Cloudinary**.

### **3️⃣ Buscar un registro**
- Utiliza la barra de búsqueda para filtrar por nombre, ubicación, tipo, etc.

### **4️⃣ Editar un registro**
- Se abre un modal donde puedes actualizar la información.

### **5️⃣ Eliminar un registro**
- Se confirma la eliminación mediante un mensaje de SweetAlert2.

---

## 📸 Gestión de Imágenes con Cloudinary

La carga y visualización de imágenes en Cloudinary está integrada en el backend y frontend.

### **Ejemplo de carga de imagen en el frontend**

~~~tsx
const handleImageUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'tu_upload_preset');

  const response = await fetch(VITE_CLOUDINARY_URL, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  return data.secure_url;
};
~~~

### **Ejemplo de almacenamiento en el backend**

~~~js
const uploadImage = async (req, res) => {
  const { secure_url } = await cloudinary.uploader.upload(req.file.path);
  res.json({ url: secure_url });
};
~~~

---

## 👥 Autores

- David - _Desarrollador_

---

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**. ¡Siéntete libre de usarlo y mejorarlo! 🎉
