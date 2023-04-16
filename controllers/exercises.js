const {
  createExercise,
  getAllExercises,
  getExerciseById,
  updateExercise,
  deleteExerciseById,
  //getExerciseByCategory,
} = require('../db/exercises');
const { generateError } = require('../helpers');

const { saveImg } = require('../helpers');

// Crear un nuevo ejercicio
const newExerciseController = async (req, res, next) => {
  try {
    const { name, description, category } = req.body;
    //si no introducimos un nombre y descripción nos devuelve un error
    if (!name || !description || !category) {
      generateError(
        'Debes introducir un nombre, una descripción y una categoria',
        400
      );
    }
    //variable donde almacenaremos el nombre de la imagen (si existe)
    let img;
    //comprobamos si existe una imagen. de ser así la guardamos en la carpeta "uploads"
    if (req.files?.img) {
      img = await saveImg(req.files.img, 500);
    }

    const id = await createExercise(
      req.userId,
      name,
      description,
      category,
      img
    );
    res.send({
      status: 'ok',
      data: id,
      message: `Ejercicio con id: ${id} creado correctamente`,
    });
  } catch (error) {
    next(error);
  }
};

// Lista todos los ejercicios y permite filtrar por categorias
const getExercisesController = async (req, res, next) => {
  try {
    const { category } = req.query;

    const exercises = await getAllExercises(category, req.userId);
    res.send({
      status: 'ok',
      data: exercises,
    });
  } catch (error) {
    next(error);
  }
};

// Obtener información de un ejercicio
const getSingleExerciseController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exercise = await getExerciseById(id, req.userId);
    res.send({
      status: 'ok',
      data: exercise,
    });
  } catch (error) {
    next(error);
  }
};

// Modificar un ejercicio
const editExerciseController = async (req, res, next) => {
  try {
    let { name, description, category } = req.body;
    const { id } = req.params;
    console.log('id', id);
    // Si falta el nombre, la categoria o la descripción lanzamos un error.
    if (!name && !category && !description) {
      generateError('Faltan campos', 400);
    }
    let img;
    if (req.files?.img) {
      img = await saveImg(req.files.img, 500);
    }
    // Actualizamos el ejercicio.
    await updateExercise(name, category, description, img, id);

    res.send({
      status: 'ok',
      message: 'Ejercicio actualizado',
    });
  } catch (err) {
    next(err);
  }
};

// Borrar un ejercicio
const deleteExerciseController = async (req, res, next) => {
  try {
    const { id } = req.params;

    //conseguir la información del tweet que quiero borrar
    await getExerciseById(id);

    //borrar el ejercicio
    await deleteExerciseById(id);

    res.send({
      status: 'ok',
      message: `Ejercicio con id: ${id} ha sido borrado`,
    });
  } catch (error) {
    next(error);
  }
};

// Exportamos las funciones
module.exports = {
  getExercisesController,
  newExerciseController,
  getSingleExerciseController,
  editExerciseController,
  deleteExerciseController,
};
