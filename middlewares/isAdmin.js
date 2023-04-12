/**
 * ################
 * ## Is Admin ##
 * ################
 */

function isAdmin(req, res, next) {
  if (req.isAdmin == 1) {
    next(); // el usuario es un administrador, continuar con la siguiente función de middleware
  } else {
    res.status(403).send('No tiene permisos para realizar esta acción'); // el usuario no es un administrador, enviar un error 403
  }
}

module.exports = {
  isAdmin,
};
