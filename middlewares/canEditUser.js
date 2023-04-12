function canEditUser(req, res, next) {
  const { id } = req.params;
  //para actualizar un usuario
  //tiene que tener permisos de admin o ser el propio usuario
  if (req.isAdmin == 1 || id == req.userId) {
    next();
  } else {
    res.status(403).send('No tiene permisos para realizar esta acción'); // el usuario no es un administrador, enviar un error 403
  }
}

module.exports = {
  canEditUser,
};
