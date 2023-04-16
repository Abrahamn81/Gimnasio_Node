const { getExerciseById } = require('../db/exercises');
const { insertLikeQuery } = require('../db/likes');
const { deleteLikeQuery } = require('../db/likes');

// Dar un Like
const newLikeController = async (req, res, next) => {
  try {
    const { idExercise } = req.params;

    // Comprobamos si el ejercicio existe.
    await getExerciseById(idExercise);

    // Insertamos el like.
    await insertLikeQuery(idExercise, req.userId);

    res.send({
      status: 'ok',
      message: 'Like agregado',
    });
  } catch (err) {
    next(err);
  }
};

//Borrar Like
const deleteLikeController = async (req, res, next) => {
  try {
    const { idExercise } = req.params;

    // Comprobamos si el ejercicio existe.
    await getExerciseById(idExercise);

    // Eliminamos el like.
    await deleteLikeQuery(idExercise, req.userId);

    res.send({
      status: 'ok',
      message: 'Like eliminado',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { newLikeController, deleteLikeController };
