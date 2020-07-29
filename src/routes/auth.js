const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { checkRequired, addLog, access_key, refresh_key } = require("../tools");
const { checkAuth } = require("../middlewares");
const expiresIn = "30m";

router.use((req, res, next) => {
  req.moduleName = "Authentication";
  next();
});

router.post("/login", async (req, res) => {
  // Check required fields
  const check = checkRequired(req.body, [
    { name: "email", type: "email" },
    "password",
  ]);
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  // Get values
  const { email, password } = req.body;
  const user = await req.conn
    .getRepository("User")
    .createQueryBuilder("u")
    .leftJoinAndSelect("u.profile", "p")
    .where("u.email = :email", { email })
    .getOne();

  // If no user exists or wrong password
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res
      .status(400)
      .json({ message: "Usuario y/o contraseña no valida." });
  }

  // If user is inactive
  if (!user.isActive) {
    return res
      .status(400)
      .json({ message: "Usuario inactivo, contacta con tu administrador." });
  }

  // If user has no profile
  if (!user.profile) {
    return res.status(400).json({
      message:
        "El usuario no tiene un perfil asignado, contacta con tu administrador.",
    });
  }

  // Get first access to get company adn branch id
  const access = await req.conn
    .getRepository("Access")
    .createQueryBuilder("a")
    .leftJoinAndSelect("a.company", "c")
    .leftJoinAndSelect("a.branch", "b")
    .where("a.profile = :profile", { profile: user.profile.id })
    .getOne();

  if (!access) {
    return res.status(401).json({
      message:
        "El usuario no esta asignado a ninguna empresa, contacta con tu administrador.",
    });
  }

  // Generates token
  const token_data = {
    uid: user.id,
    pid: user.profile.id,
    cid: access.company.id,
    bid: access.branch.id,
  };
  const access_token = jwt.sign(token_data, access_key, { expiresIn });
  const refresh_token = jwt.sign(token_data, refresh_key);

  try {
    await req.conn
      .createQueryBuilder()
      .insert()
      .into("Token")
      .values({ token: refresh_token, active: access_token })
      .execute();
    // Adds log
    await addLog(
      req.conn,
      req.moduleName,
      `${user.names} ${user.lastnames}`,
      user.id,
      "El usuario ha iniciado sesion correctamente."
    );

    // return token
    return res.json({ access_token, refresh_token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al proveer token de refrescamiento." });
  }
});

router.post("/refresh", async (req, res) => {
  // Check required fields
  const check = checkRequired(req.body, ["refresh_token"]);
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  // Get the refresh token
  const { refresh_token } = req.body;

  // Check if refresh token is valid
  const token = await req.conn
    .getRepository("Token")
    .createQueryBuilder("t")
    .where("t.token = :token", { token: refresh_token })
    .getOne();

  if (!token) {
    return res
      .status(400)
      .json({ message: "Solicitud de nuevo token incorrecta" });
  }

  try {
    const { uid, pid, cid, bid } = jwt.verify(
      refresh_token.replace("Bearer ", ""),
      refresh_key
    );
    const access_token = jwt.sign({ uid, pid, cid, bid }, access_key, {
      expiresIn,
    });

    await req.conn
      .createQueryBuilder()
      .update("Token")
      .set({ active: access_token })
      .where("token = :token", { token: refresh_token })
      .execute();

    // return token
    return res.json({ access_token });
  } catch (error) {
    return res.status(401).json({ message: "Sesión no válida." });
  }
});

router.delete("/logout", checkAuth, async (req, res) => {
  // Deletes register in Token table
  await req.conn
    .createQueryBuilder()
    .delete()
    .from("Token")
    .where("active = :active", {
      active: req.headers.authorization.replace("Bearer ", ""),
    })
    .execute();

  // get the user
  const user = await req.conn
    .getRepository("User")
    .createQueryBuilder("u")
    .where("u.id = :id", { id: req.user.uid })
    .getOne();

  // adds log
  await addLog(
    req.conn,
    req.moduleName,
    `${user.names} ${user.lastnames}`,
    user.id,
    "El usuario ha cerrado sesion correctamente."
  );

  return res.json({ message: "Se ha cerrado la sesion correctamente." });
});

router.get("/user", checkAuth, async (req, res) => {
  const { uid, cid, bid } = req.user;
  const user = await req.conn
    .getRepository("User")
    .createQueryBuilder("u")
    .select([
      "u.names",
      "u.lastnames",
      "u.email",
      "u.changePassword",
      "u.unique",
      "u.avatarURL",
      "p.id",
      "p.name",
      "a.permissions",
      "m.id",
      "m.name",
      "c.id",
      "c.name",
      "b.id",
      "b.name",
    ])
    .leftJoin("u.profile", "p")
    .leftJoin("p.access", "a")
    .leftJoin("a.module", "m")
    .leftJoin("a.company", "c")
    .leftJoin("a.branch", "b")
    .where({ id: uid })
    .getOne();

  const access = [];
  for (const acc of user.profile.access) {
    const foundCompany = access.find((a) => a.id == acc.company.id);
    if (!foundCompany) {
      access.push({
        ...acc.company,
        branches: [{ ...acc.branch, modules: [acc.module] }],
      });
    } else {
      const foundBranch = foundCompany.branches.find(
        (b) => b.id == acc.branch.id
      );
      if (!foundBranch) {
        foundCompany.branches.push({ ...acc.branch, modules: [acc.module] });
      } else {
        foundBranch.modules.push(acc.module);
      }
    }
  }
  user.profile.access = access;
  user.workspace = {
    company: await req.conn
      .getRepository("Company")
      .createQueryBuilder("c")
      .select(["c.id", "c.name"])
      .where({ id: cid })
      .getOne(),
    branch: await req.conn
      .getRepository("Branch")
      .createQueryBuilder("b")
      .select(["b.id", "b.name"])
      .where({ id: bid })
      .getOne(),
  };

  return res.json({ user });
});

router.put("/password", checkAuth, async (req, res) => {
  // Check required fields
  const check = checkRequired(req.body, ["currentPassword", "newPassword"]);
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  const { currentPassword, newPassword } = req.body;
  const user = await req.conn
    .getRepository("User")
    .createQueryBuilder("u")
    .where({ id: req.user.uid })
    .getOne();

  if (!bcrypt.compareSync(currentPassword, user.password)) {
    return res.status(400).json({ message: "Contraseña actual incorrecta." });
  }

  try {
    await req.conn
      .createQueryBuilder()
      .update("User")
      .set({
        password: bcrypt.hashSync(newPassword, 10),
        changePassword: false,
      })
      .where("id = :id", { id: req.user.uid })
      .execute();

    // adds log
    await addLog(
      req.conn,
      req.moduleName,
      `${user.names} ${user.lastnames}`,
      user.id,
      "El usuario ha cambiado su contraseña."
    );

    return res.json({
      message: "Contraseña actualizada correctamente.",
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Error al actualizar la contraseña, contacta con tu administrador.",
    });
  }
});

router.put("/update-workspace", checkAuth, async (req, res) => {
  // Check required fields
  const check = checkRequired(req.body, ["cid", "bid"]);
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }
  // Get fields
  const { cid, bid } = req.body;
  // Get company
  const company = await req.conn
    .getRepository("Company")
    .createQueryBuilder("c")
    .leftJoinAndSelect("c.branches", "b")
    .where({ id: cid })
    .getOne();

  // Get branch
  const branch = await req.conn
    .getRepository("Branch")
    .createQueryBuilder("b")
    .where({ id: bid })
    .getOne();

  if (!company || !branch) {
    return res.status(400).json({
      message:
        "No existe este espacio de trabajo, contacta con tu administrador.",
    });
  }

  // Check if branch belongs to company
  if (!company.branches.find((b) => b.id == branch.id)) {
    return res
      .status(400)
      .json({ message: "Incorrecta combinación del espacio de trabajo." });
  }

  try {
    // Generates new token
    const token_data = {
      uid: req.user.uid,
      pid: req.user.pid,
      cid,
      bid,
    };
    const access_token = jwt.sign(token_data, access_key, { expiresIn });

    await req.conn
      .createQueryBuilder()
      .update("Token")
      .set({ active: access_token })
      .where("active = :active", {
        active: req.headers.authorization.replace("Bearer ", ""),
      })
      .execute();

    return res.json({ access_token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al cambiar de espacio de trabajo." });
  }
});

module.exports = router;
