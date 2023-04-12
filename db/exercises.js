const { generateError } = require('../helpers');
const { getConnection } = require('./db');

// Función que crea un ejercicio
const createExercise = async (
  userId,
  name,
  description,
  category,
  img = ''
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
const getExerciseById = async (id) => {
  let connection;
  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
    SELECT E.*, IFNULL(L.countLikes,0) AS likes 
    FROM exercises E 
    LEFT JOIN 
  	  (SELECT COUNT(*) as countLikes,idExercise
	    FROM likes  GROUP BY idExercise )
    L ON L.idExercise = E.id 
    WHERE id = ?
    `,
      [id]
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
const getAllExercises = async (category = '') => {
  let connection;
  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
    SELECT E.*, IFNULL(L.countLikes,0) AS likes 
    FROM exercises E 
    LEFT JOIN 
  	  (SELECT COUNT(*) as countLikes,idExercise
	    FROM likes  GROUP BY idExercise )
    L ON L.idExercise = E.id 
    WHERE category LIKE ? ORDER BY createdAt
    `,
      [`${category}%`]
    );
    /*if (category.length > 0 && result.length === 0) {
      generateError('La categoria no existe', 404);
    }*/
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
        generateError('Nombre de ejercicio no disponible', 403);
      }

      await connection.query(
        `UPDATE exercises SET name = ? , category = ?, description = ? WHERE id = ?`,
        [name, category, description, exerciseId]
      );
    }
  } finally {
    if (connection) connection.release();
  }
};

// Función que borra un ejercicio
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
