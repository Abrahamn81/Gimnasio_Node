const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');
const { v4: uuid } = require('uuid');

// Función que genera un error
const generateError = (message, status) => {
  const error = new Error(message);
  error.httpStatus = status;
  throw error;
};

// Intenta acceder a una ruta que le pasemos y si hay un problema crea esa ruta
const createPathIfNotExists = async (path) => {
  try {
    await fs.access(path);
  } catch {
    await fs.mkdir(path);
  }
};

/**
 * ################
 * ## Save Image ##
 * ################
 */

const saveImg = async (img, resizePx) => {
  // Creamos la ruta absoluta al directorio donde vamos a subir las imágenes.
  const uploadsPath = path.join(__dirname, 'uploads');

  try {
    // Intentamos acceder al directorio de subida de archivos mediante el método
    // "access". Este método genera un error si no es posible acceder arl archivo
    // o directorio.
    await fs.access(uploadsPath);
  } catch {
    // Si "access" lanza un error entramos en el catch y creamos el directorio.
    await fs.mkdir(uploadsPath);
  }

  // Convertimos la imagen en un objeto de tipo Sharp.
  const sharpImg = sharp(img.data);

  // Redimensionamos el avatar a un ancho de 100px.
  sharpImg.resize(resizePx);

  // Generamos un nombre único para la imagen.
  const imgName = `${uuid()}.jpg`;

  // Generamos la ruta absoluta a la imagen que queremos guardar.
  const imgPath = path.join(uploadsPath, imgName);

  // Guardamos la imagen en el directorio de subida de imágenes.
  await sharpImg.toFile(imgPath);

  // Retornamos el nombre de la imagen.
  return imgName;
};

/**
 * ##################
 * ## Delete Image ##
 * ##################
 */

const deleteImg = async (imgName) => {
  try {
    // Creamos la ruta absoluta a la imagen que queremos eliminar.
    const imgPath = path.join(__dirname, 'uploads', imgName);

    try {
      // Intentamos acceder a la imagen utilizando el método "access" de fs. Este
      // método genera un error si no es posible acceder al archivo.
      await fs.access(imgPath);
    } catch (error) {
      // Si "access" genera un error entramos en el "catch". Finalizamos la función
      // dado que la imagen no existe, no tiene sentido borrarla.
      return;
    }

    // Si llegamos hasta aquí quiere decir que la imagen existe. La eliminamos.
    await fs.unlink(imgPath);
  } catch {
    generateError('Error al eliminar la imagen del servidor');
  }
};

// Exporto las funciones
module.exports = {
  generateError,
  createPathIfNotExists,
  saveImg,
  deleteImg,
};
