/* 
ruta: api/todo/:busqueda
*/

const { Router } = require("express");
const router = Router();


const {
  getTodo,
  getDocumentosColeccion
} = require("../controllers/busquedas-controller");
const { validarJWT } = require("../middlewares/validar-jwt");

//CONSULTAR USUARIOS
router.get("/:busqueda", validarJWT, getTodo);

router.get("/coleccion/:tabla/:busqueda", validarJWT, getDocumentosColeccion);



module.exports = router;
