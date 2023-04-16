require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const cors = require('cors');

// Importamos las funciones de usuario mediante destructuring
const {
  newUserController,
  getUsersController,
  loginController,
  editUserController,
  getMeController,
  deleteUserController,
  getUserByIdController,
} = require('./controllers/users');

// Importamos las funciones de ejercicios mediante destructuring
const {
  getExercisesController,
  newExerciseController,
  getSingleExerciseController,
  editExerciseController,
  deleteExerciseController,
} = require('./controllers/exercises');

// Importamos las funciones de likes mediante destructuring
const {
  newLikeController,
  deleteLikeController,
} = require('./controllers/likes');

// Importamos las funciones de autentificación de usuario y de admin
const { authUser } = require('./middlewares/auth');
const { isAdmin } = require('./middlewares/isAdmin');
const { canEditUser } = require('./middlewares/canEditUser');
const { getUserById } = require('./db/users');

//
const app = express();
//Para que express procese el body de las peticiones(que al enviar un objeto con en el postman la api pueda procesar esa información que está en un .json)
app.use(express.json());
//Middlewar que permite deserializar un body en formato "form-data" creando la propiedad "body" y "files" en el objeto "request"
app.use(fileupload());
//
app.use(cors());
//
app.use(morgan('dev'));
//Middlewar que permite el acceso a los archivos de /uploads
app.use('/uploads', express.static('./uploads'));

//Rutas de usuario
app.post('/user', newUserController);
app.get('/user', authUser, getMeController);
app.get('/users/:id', authUser, getUserByIdController);
app.get('/users', authUser, isAdmin, getUsersController);
app.post('/login', loginController);
app.put('/users/:id', authUser, canEditUser, editUserController);
app.delete('/users/:id', authUser, isAdmin, deleteUserController);

//Rutas de ejercicios
app.post('/exercises', authUser, isAdmin, newExerciseController);
app.get('/exercises', authUser, getExercisesController);
app.get('/exercises/:id', authUser, getSingleExerciseController);
app.put('/exercises/:id', authUser, isAdmin, editExerciseController);
app.delete('/exercises/:id', authUser, isAdmin, deleteExerciseController);

//Rutas de likes
app.post('/exercises/:idExercise/likes', authUser, newLikeController);
app.delete('/exercises/:idExercise/likes', authUser, deleteLikeController);

//Middleware de 404 (no se ha encontrado la ruta)
app.use((req, res) => {
  res.status(404).send({
    status: 'error',
    message: 'Not found',
  });
});

//Middleware de gestión de errores
// añadimos al error la propiedad httpStatus. Es para asociar un error a un código de error.
// Si no hay un código de error que ponga el error 500
app.use((error, req, res, next) => {
  console.error(error);

  res.status(error.httpStatus || 500).send({
    status: 'error',
    message: error.message,
  });
});

const { PORT } = process.env;
//Lanzamos el servidor
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost: ${PORT} 😎`);
});
