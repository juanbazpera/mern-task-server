const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Read header token
  const token = req.header('x-auth-token');

  // if has not token
  if (!token) {
    return res.status(401).json({ msg: 'No hay token, Permiso no valido' });
  }
  // token validate
  try {
    const encryption = jwt.verify(token, process.env.SECRET);
    req.user = encryption.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token no válido' });
  }
};
