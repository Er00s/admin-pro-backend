/* 
    Hospitales
    ruta: '/api/hospitals'
*/
/* 
    Hospitales
    ruta: '/api/hospitals'
*/


const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

const { validarJWT } = require("../middlewares/validar-jwt");

const {
    getMedicos,
    postMedico,
    updateMedico,
    deleteMedico
} = require('../controllers/medicos-controller')

const router = Router();
//CONSULTAR MEDICO
router.get("/", getMedicos);

//CREAR MEDICO
router.post(
  "/",
  //arreglo de middlewares (funciones que se ejecutan antes de llegar a mi funcion)
  [
    validarJWT,
    check('nombre','el nombre del medico es necesario').not().isEmpty(),
    check('hospital','el id del hospital debe ser valido').isMongoId(),   
    validarCampos
    ],
  postMedico
);

// EDITAR MEDICO
router.put(
  "/:id",
  [  ],
  updateMedico
);

// BORRAR MEDICO
router.delete("/:id", [], deleteMedico);

module.exports = router;
