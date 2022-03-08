/* 
ruta: api/uploads
*/

const { Router } = require("express");
const router = Router();

const expressfileUpload = require('express-fileupload');

const { validarJWT } = require("../middlewares/validar-jwt");

const { 
    fileUpload, retornaImagen
} = require("../controllers/uploads-controller");

// aclaramos que se utiliza el express file Upload para utilizarlo en el controlador
router.use( expressfileUpload() );
//CONSULTAR USUARIOS
router.put("/:tipo/:id", validarJWT, fileUpload);

router.get("/:tipo/:foto", retornaImagen );



module.exports = router;
