/* 
    Hospitales
    ruta: '/api/hospitals'
*/


const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

const { validarJWT } = require("../middlewares/validar-jwt");

const {
    getHospitales,
    postHospital,
    updateHospital,
    deleteHospital
} = require('../controllers/hospitales-controller')

const router = Router();
//CONSULTAR HOSPITALES
router.get("/", getHospitales);

//CREAR HOSPITAL
router.post(
  "/",
  //arreglo de middlewares (funciones que se ejecutan antes de llegar a mi funcion)
  [ validarJWT,
  check('nombre','el nombre del hospital es necesario').not().isEmpty(),
  validarCampos 
  ],
  postHospital
);

// EDITAR HOSPITAL
router.put("/:id",
  [ 
    validarJWT,
    check('nombre','el nombre del hospital es necesario').not().isEmpty(),
    validarCampos 
  ],
  updateHospital
);

// BORRAR HOSPITAL
router.delete("/:id", [
  validarJWT,
], 
deleteHospital);

module.exports = router;
