const { getConnection } = require('./db');
const { generateError } = require('../helpers');

//Crear Likes
const insertLikeQuery = async (idExercise, idUser) => {
  let connection;
  try {
    connection = await getConnection();

    // Comprobamos si el usuario ya ha dado like al tweet.
    const [likes] = await connection.query(
      `SELECT id FROM likes WHERE idExercise = ? AND idUser = ?`,
      [idExercise, idUser]
    );
    // Si el usuario ya ha dado like el tweet lanzamos un error.
    if (likes.length > 0) {
      generateError('El usuario ya ha dado like a este ejercicio', 403);
    }
    await connection.query(
      `INSERT INTO likes (idExercise, idUser) VALUES (?, ?)`,
      [idExercise, idUser]
    );
  } finally {
    if (connection) connection.release();
  }
};

//Borrar Likes
const deleteLikeQuery = async (idExercise, idUser) => {
  let connection;

  try {
    connection = await getConnection();

    // Comprobamos que el usuario haya dado like al ejercicio.
    const [likes] = await connection.query(
      `
            SELECT id FROM likes WHERE idExercise = ? AND idUser = ?`,
      [idExercise, idUser]
    );

    // Si el usuario no ha dado like al ejercicio lanzamos un error.
    if (likes.length < 1) {
      generateError('Like no encontrado', 404);
    }

    await connection.query(
      `
            DELETE FROM likes WHERE idExercise = ? AND idUser = ? `,
      [idExercise, idUser]
    );
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { insertLikeQuery, deleteLikeQuery };
