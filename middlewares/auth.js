const jwt = require('jsonwebtoken');
const { generateError } = require('../helpers');

const authUser = (req, res, next) => {
  //desestructuramos la propiedad authorization de headers porque es lo que le vamos a pasar por postman
  const { authorization } = req.headers;

  //Comprobamos que el token sea correcto
  let token;
  try {
    token = jwt.verify(authorization, process.env.SECRET);
  } catch {
    throw generateError('Token incorrecto', 401);
  }
  console.log(token);

  try {
    //si no existe authorization lanzamos un error
    if (!authorization) {
      throw generateError('Falta la cabecera de Authorization', 401);
    }

    //Metemos la información del token en la request para usarla en el controlador
    req.auth = token;
    req.userId = token.id;
    req.isAdmin = token.isAdmin;
    //Saltamos al controlador
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authUser,
};
