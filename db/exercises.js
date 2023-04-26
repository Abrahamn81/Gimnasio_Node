const { generateError } = require("../helpers");
const { getConnection } = require("./db");

// Función que crea un ejercicio
const createExercise = async (
  userId,
  name,
  description,
  category,
  img = ""
) => {
  let connection;
  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
    INSERT INTO exercises (idUser, name, description, category, img)
    VALUES(?,?,?,?,?)
    `,
      [userId, name, description, category, img]
    );

    return result.insertId;
  } finally {
    if (connection) connection.release();
  }
};
//Función que devuelve información de un ejercicio
const getExerciseById = async (id, userId) => {
  let connection;
  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
    SELECT E.*
    ,(SELECT COUNT(*) FROM likes
            WHERE idExercise = E.id ) AS likes
    ,(SELECT COUNT(*) FROM likes
            WHERE idExercise = E.id and idUser = ?) AS userLikes
    FROM exercises E 
    WHERE id = ?
    `,
      [userId, id]
    );
    if (result.length === 0) {
      generateError(`El ejercicio con id: ${id} no existe`, 404);
    }
    return result[0];
  } finally {
    if (connection) connection.release();
  }
};

//Función que lista todos los ejercicios
const getAllExercises = async (category = "", idUser) => {
  let connection;
  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
    SELECT E.*
    ,(SELECT COUNT(*) FROM likes
            WHERE idExercise = E.id ) AS likes
    ,(SELECT COUNT(*) FROM likes
            WHERE idExercise = E.id and idUser = ?) AS userLikes
    FROM exercises E 
    WHERE category LIKE ? ORDER BY createdAt
    `,
      [idUser, `${category}%`]
    );

    return result;
  } finally {
    if (connection) connection.release();
  }
};

// Función para modificar un ejercicio
const updateExercise = async (name, category, description, img, exerciseId) => {
  let connection;

  try {
    connection = await getConnection();

    // Si recibimos un nombre de ejercicio comprobamos si ya está ocupado.
    if (name) {
      const [exercises] = await connection.query(
        `
                SELECT id FROM exercises WHERE name = ? AND id !=?`,
        [name, exerciseId]
      );

      // Si el nombre ya está ocupado lanzamos un error.
      if (exercises.length > 0) {
        generateError("Nombre de ejercicio no disponible", 403);
      }

      //Comprobamos si es necesario actualizar la imagen
      if (img) {
        await connection.query(
          `UPDATE exercises SET name = ? , category = ?, description = ?, img = ? WHERE id = ?`,
          [name, category, description, img, exerciseId]
        );
      } else {
        //No se actualiza el campo imagen
        await connection.query(
          `UPDATE exercises SET name = ? , category = ?, description = ? WHERE id = ?`,
          [name, category, description, exerciseId]
        );
      }
    }
  } finally {
    if (connection) connection.release();
  }
};

//Función que borra un ejercicio
const deleteExerciseById = async (id) => {
  let connection;
  try {
    connection = await getConnection();

    await connection.query(
      `
    DELETE FROM exercises WHERE id = ?
    `,
      [id]
    );

    return;
  } finally {
    if (connection) connection.release();
  }
};
module.exports = {
  createExercise,
  getExerciseById,
  getAllExercises,
  deleteExerciseById,
  updateExercise,
};
