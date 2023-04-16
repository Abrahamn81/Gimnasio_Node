// Importo la función de gestion de errores que hay en helpers.js
const { generateError } = require('../helpers');
// Importamos la conexión a la base de datos
const { getConnection } = require('./db');
// Importamos la dependencia para encriptar la contraseña
const bcrypt = require('bcrypt');

// Devuelve la información pública de un usuario por su email
const getUserByEmail = async (email) => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
    SELECT * FROM users WHERE email = ?
    `,
      [email]
    );
    //si no existe ningún usuario con ese id generamos un error
    if (result.length === 0) {
      generateError('No hay ningún usuario con ese email', 404);
    }
    //devolvemos la posición 0 del array que me da como resultado la consulta anterior
    return result[0];
  } finally {
    if (connection) connection.release();
  }
};

// Devuelve la información pública de un usuario por su id
const getUserById = async (id) => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
    SELECT id, email, name, admin, createdAt, modifiedAt FROM users WHERE id = ?
    `,
      [id]
    );
    //si no existe ningún usuario con ese id generamos un error
    if (result.length === 0) {
      generateError('No hay ningún usuario con esa id', 404);
    }
    //devolvemos la posición 0 del array que me da como resultado la consulta anterior
    return result[0];
  } finally {
    if (connection) connection.release();
  }
};
// Devuelve la información pública de los usuarios
const getUsers = async () => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
    SELECT id, email, name, admin, createdAt, modifiedAt FROM users 
    `
    );

    //devolvemos la posición 0 del array que me da como resultado la consulta anterior
    return result;
  } finally {
    if (connection) connection.release();
  }
};

//Crea un usuario en la base de datos y devuelve su id
const createUser = async (name, email, password, admin) => {
  //creamos una variable vacía para la conexión
  let connection;

  try {
    connection = await getConnection();
    //comprobar que no exista otro usuario con ese email
    //al hacer destructuring cogemos el primer valor del array que nos devuelve connection
    const [user] = await connection.query(
      `
    SELECT id FROM users WHERE email = ?
    `,
      [email]
    );
    //si la longitud del array de usuario es mayor que cero es que ya hay alguien con ese email y entonces lanzamos el error
    if (user.length > 0) {
      generateError(
        'Ya existe un usuario en la base de datos con ese email',
        409
      );
    }
    //encriptar la password
    //para ello importamos arriba la dependencia bcrypt
    //guardamos en una variable el encriptado que hace. Lo encripta 8 veces, bastante seguro.
    const passwordHash = await bcrypt.hash(password, 8);

    //crear el usuario
    const [newUser] = await connection.query(
      `
    INSERT INTO users (name, email, password, admin) VALUES(?, ?, ?, ?)
    `,
      [name, email, passwordHash, admin]
    );
    //devolver la id

    return newUser.insertId;
  } finally {
    //si la conexion fue creada se carga la conexion
    if (connection) connection.release();
  }
};

// Función para actualizar el usuario
const updateUser = async (name, email, userId) => {
  let connection;

  try {
    connection = await getConnection();

    // Si recibimos un nombre de usuario comprobamos si ya está ocupado.
    if (name) {
      const [users] = await connection.query(
        `SELECT id FROM users WHERE name = ? AND id != ?`,
        [name, userId]
      );

      // Si el nombre ya está ocupado lanzamos un error.
      if (users.length > 0) {
        generateError('Nombre de usuario no disponible', 403);
      }

      await connection.query(`UPDATE users SET name = ? WHERE id = ?`, [
        name,
        userId,
      ]);
    }

    // Si recibimos un email comprobamos si ya está ocupado.
    if (email) {
      const [users] = await connection.query(
        `SELECT id FROM users WHERE email = ? AND id != ?`,
        [email, userId]
      );

      // Si ya existe un usuario con ese email lanzamos un error.
      if (users.length > 0) {
        generateError('Ya existe un usuario con ese email', 403);
      }
      await connection.query(`UPDATE users SET email = ? WHERE id = ?`, [
        email,
        userId,
      ]);
    }
  } finally {
    if (connection) connection.release();
  }
};

// Función para eliminar un usuario
const deleteUser = async (userId) => {
  let connection;

  try {
    connection = await getConnection();

    // Eliminamos los posibles likes del usuario.
    //await connection.query(`DELETE FROM likes WHERE idUser = ?`, [userId]);

    // Eliminamos los posibles ejercicios del usuario.
    //await connection.query(`DELETE FROM exercises WHERE idUser = ?`, [userId]);

    // Ahora que nos hemos asegurado que no hay likes ni ejercicios eliminamos al usuario.
    await connection.query(`DELETE FROM users WHERE id = ?`, [userId]);
  } finally {
    if (connection) connection.release();
  }
};
// Exportamos las funciones
module.exports = {
  createUser,
  getUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
};
