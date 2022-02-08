/* 
    Ruta: /api/usuarios
 */

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

const {
  getUsuarios,
  postUsuario,
  updateUsuario,
  deleteUsuario,
} = require("../controllers/usuarios-controller");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();
//CONSULTAR USUARIOS
router.get("/", validarJWT, getUsuarios);

//CREAR USUARIO
router.post(
  "/",
  //arreglo de middlewares (funciones que se ejecutan antes de llegar a mi funcion)
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    validarCampos,
  ],
  postUsuario
);

// EDITAR USUARIO
router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check("role", "El role es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  updateUsuario
);

// BORRAR USUARIO
router.delete("/:id", [validarJWT], deleteUsuario);

module.exports = router;
