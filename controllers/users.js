// Importo la función de gestion de errores que hay en helpers.js
const { generateError } = require('../helpers');
// Importo la función que crea un usuario que hay en la carpeta db en el users.js
const {
  createUser,
  getUsers,
  getUserById,
  getUserByEmail,
  deleteUser,
} = require('../db/users');
// Importo la función que permite actualizar un usuario
const { updateUser } = require('../db/users');
// Importo bcrypt
const bcrypt = require('bcrypt');
// Importo jsonwebtoken
const jwt = require('jsonwebtoken');
// Importo Joi
const Joi = require('@hapi/joi');

//Función para crear nuevo usuario
const newUserController = async (req, res, next) => {
  try {
    const { name, email, password, admin } = req.body;
    // usamos Joi para validar los datos
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const validation = schema.validate({
      name: name,
      email: email,
      password: password,
    });
    if (validation.error) {
      generateError('Debes enviar un nombre, email y una password', 400);
    }

    const id = await createUser(name, email, password, admin);

    res.send({
      status: 'ok',
      message: `User created with id: ${id}`,
    });
  } catch (error) {
    next(error);
  }
};

//Función para obtener los datos de los usuarios
const getUsersController = async (req, res, next) => {
  try {
    const users = await getUsers();

    res.send({
      status: 'ok',
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// Función para loguearse
const loginController = async (req, res, next) => {
  try {
    //el login recibe el email y la password
    const { email, password } = req.body;
    //si no hay un email o una password lanzamos un error
    if (!email || !password) {
      generateError('Debes enviar un email y una password', 400);
    }
    //recojo los datos de la base de datos del usuario con ese email
    const user = await getUserByEmail(email);

    //compruebo que la constraseña coincide con la contraseña que hay en la base de datos
    const validPassword = await bcrypt.compare(password, user.password);
    //si no es válida lanzamos un error
    if (!validPassword) {
      generateError('La contraseña no coincide', 401);
    }
    //creo el payload del token (aquí guardo algo que identifique al usuario, la id por ejemplo)
    const payload = { id: user.id, isAdmin: user.admin };
    //firmo el token
    const token = jwt.sign(payload, process.env.SECRET, {
      expiresIn: '30d',
    });
    //envío el token
    res.send({
      status: 'ok',
      data: token,
    });
  } catch (error) {
    next(error);
  }
};

// Función que devuelve información del usuario logueado
const getMeController = async (req, res, next) => {
  try {
    const user = await getUserById(req.userId, false);

    res.send({
      status: 'ok',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Función que devuelve información de un usuario
const getUserByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id, false);

    res.send({
      status: 'ok',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
// Función para actualizar un usuario
const editUserController = async (req, res, next) => {
  console.log('updateUser');
  try {
    let { name, email } = req.body;
    const { id } = req.params;

    // Si falta el nombre y el email (las dos cosas) lanzamos un error.
    if (!name && !email) {
      generateError('Faltan campos', 400);
    }

    // Actualizamos el usuario.
    await updateUser(name, email, id);

    res.send({
      status: 'ok',
      message: 'Usuario actualizado',
    });
  } catch (err) {
    next(err);
  }
};

// Función para eliminar un usuario

const deleteUserController = async (req, res, next) => {
  try {
    const { id } = req.params;

    await getUserById(id);

    // Eliminamos al usuario.
    await deleteUser(id);

    res.send({
      status: 'ok',
      message: 'Usuario eliminado',
    });
  } catch (err) {
    next(err);
  }
};

// Exportamos las funciones
module.exports = {
  newUserController,
  getUsersController,
  getUserByIdController,
  loginController,
  getMeController,
  editUserController,
  deleteUserController,
};
