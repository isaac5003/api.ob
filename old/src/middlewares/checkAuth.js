const jwt = require("jsonwebtoken");
const { access_key, addLog } = require("../tools");
module.exports = async function (req, res, next) {
  const token = req.headers.authorization;

  // check if token is not provided
  if (token == null) {
    return res.status(401).json({
      message: "Debes iniciar sesión para poder realizar esta acción.",
    });
  }

  try {
    req.user = jwt.verify(token.replace("Bearer ", ""), access_key);
    next();
  } catch (error) {
    // when toke not valid is provided
    const { uid } = jwt.decode(token.replace("Bearer ", ""), access_key);
    const user = await req.conn
      .getRepository("User")
      .createQueryBuilder("u")
      .where("u.id = :id", { id: uid })
      .getOne();
    addLog(
      req.conn,
      req.moduleName,
      `${user.names} ${user.lastnames}`,
      user.id,
      error.message
    );
    return res.status(401).json({ message: "Sesión no válida." });
  }
};
